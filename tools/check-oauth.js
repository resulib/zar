/* Giriş yolları — uçdan-uca: Google OAuth, adi qeydiyyat, qonaq rejimi.

   Test GOOGLE-A ÇIXMIR: bu fayl özü lokal saxta Google token serveri
   qaldırır və backend-in ona baxdığını gözləyir. Serveri belə başladın:

     cd backend-php
     GOOGLE_CLIENT_ID=test-123.apps.googleusercontent.com \
     GOOGLE_CLIENT_SECRET=test-sirr \
     GOOGLE_TOKEN_URL=http://127.0.0.1:8094/token \
     php artisan serve --port=8093

   sonra:  npm run test:oauth

   RAZILIQ SƏHİFƏSİ TAXLİD EDİLMİR və buna ehtiyac yoxdur: Google-a gedən
   yeganə şey `state` və `code_challenge`-dir, ikisi də bizim ünvanımızda
   görünür. Test `Location` başlığından `state`-i götürüb cavab ucunu
   birbaşa çağırır — brauzerin Google-dan qayıtması ilə eyni şey.

   Yoxlanan əsas iddialar:
     · qonaq AVTOMATİK qeydə alınır və adı olur;
     · Google ilə giriş qonaq sətrini YERİNDƏ hesaba çevirir — kredit, XP,
       oxunmuş vərəqlər itmir;
     · eyni Google hesabı ikinci cihazdan girəndə YENİ hesab açılmır;
     · parolla açılmış hesab eyni e-poçtlu Google ilə BAĞLANIR, ikiləşmir;
     · `state` birdəfəlikdir, yad `state` girişi açmır;
     · təsdiqlənməmiş e-poçt rədd edilir;
     · `?davam=` heç bir halda saytdan kənara yönəltmir. */
'use strict';
const http = require('http');
const path = require('path');
const { execFileSync } = require('child_process');

const B    = (process.argv[2] || 'http://127.0.0.1:8093').replace(/\/$/, '');
const FAKE = Number(process.env.FAKE_PORT || 8094);
const DB   = path.join(__dirname, '..', 'backend-php', 'database', 'database.sqlite');

let pass = 0, fail = 0;
const check = (n, c, x) => c ? (pass++, console.log('  \x1b[32m✓\x1b[0m ' + n))
                             : (fail++, console.log('  \x1b[31m✗\x1b[0m ' + n + (x === undefined ? '' : ' → ' + JSON.stringify(x).slice(0, 240))));
const bas = t => console.log('\n' + t);

/* ---------- saxta Google ---------- */

const b64u = o => Buffer.from(JSON.stringify(o)).toString('base64')
  .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

/* İmza yoxlanılmır — `Google::kimlik()` bunu açıq izah edir: token birbaşa
   TLS ilə token ucundan alınır, ona görə mənbənin həqiqiliyini nəqliyyat
   qatı təsdiqləyir (OIDC Core §3.1.3.7). Saxta imza məhz bunu sənədləşdirir. */
const jwt = iddia => b64u({ alg: 'RS256' }) + '.' + b64u(iddia) + '.imza-yoxlanilmir';

const AUD = 'test-123.apps.googleusercontent.com';
const esas = (over) => Object.assign({
  iss: 'https://accounts.google.com', aud: AUD, exp: Math.floor(Date.now() / 1000) + 3600,
  sub: 'G-BIRINCI', email: 'birinci@test.az', email_verified: true, name: 'Rəşad Testov',
}, over);

const CAVABLAR = {
  'KOD-BIRINCI':  { kod: 200, iddia: esas() },
  'KOD-IKINCI':   { kod: 200, iddia: esas({ sub: 'G-IKINCI', email: 'ikinci@test.az', name: 'Aygün Testova' }) },
  /* Parolla açılmış hesabla EYNİ e-poçt — bağlanmalıdır, ikiləşməməlidir. */
  'KOD-PAROLLU':  { kod: 200, iddia: esas({ sub: 'G-PAROLLU', email: 'parollu@test.az', name: 'Parollu Adam' }) },
  'KOD-TESDIQSIZ':{ kod: 200, iddia: esas({ sub: 'G-PIS', email: 'oğurluq@test.az', email_verified: false }) },
  'KOD-YADAUD':   { kod: 200, iddia: esas({ sub: 'G-PIS2', aud: '999.apps.googleusercontent.com' }) },
  'KOD-XETA':     { kod: 400 },
};

let sonSorgu = null;

const saxta = http.createServer((req, res) => {
  let govde = '';
  req.on('data', d => { govde += d; });
  req.on('end', () => {
    const form = Object.fromEntries(new URLSearchParams(govde));
    sonSorgu = form;
    const c = CAVABLAR[form.code];
    res.setHeader('Content-Type', 'application/json');

    if (!c) { res.writeHead(400); res.end(JSON.stringify({ error_description: 'naməlum kod' })); return; }
    if (c.kod !== 200) { res.writeHead(400); res.end(JSON.stringify({ error_description: 'invalid_grant' })); return; }

    res.writeHead(200);
    res.end(JSON.stringify({ access_token: 'at', token_type: 'Bearer', id_token: jwt(c.iddia) }));
  });
});

/* ---------- kiçik brauzer: cookie qabı + CSRF ---------- */

function qab() {
  const jar = new Map();
  const bas = () => [...jar].map(([k, v]) => k + '=' + v).join('; ');

  return {
    bas,
    async get(yol) {
      const r = await fetch(B + yol, { headers: { cookie: bas() }, redirect: 'manual' });
      this.yaz(r);
      return { status: r.status, yer: r.headers.get('location') || '', body: await r.text() };
    },
    async post(yol, data) {
      const g = await this.get(yol.token ? yol.token : '/is/hesab');
      const token = (g.body.match(/name="_token" value="([^"]+)"/) || [])[1] || '';
      const r = await fetch(B + (yol.yol || yol), {
        method: 'POST',
        headers: { cookie: bas(), 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(Object.assign({ _token: token }, data)),
        redirect: 'manual',
      });
      this.yaz(r);
      return { status: r.status, yer: r.headers.get('location') || '', body: await r.text() };
    },
    yaz(r) {
      for (const c of (r.headers.getSetCookie ? r.headers.getSetCookie() : [])) {
        const [kv] = c.split(';');
        const i = kv.indexOf('=');
        jar.set(kv.slice(0, i).trim(), kv.slice(i + 1));
      }
    },
  };
}

const sql = q => execFileSync('sqlite3', [DB, q], { encoding: 'utf8' }).trim();
const say = () => Number(sql('SELECT COUNT(*) FROM users'));

/** `/giris/google` → `Location`-dan `state`-i çıxarır. */
async function baslat(br, davam) {
  const r = await br.get('/giris/google?davam=' + davam);
  const u = new URL(r.yer);
  return { r, state: u.searchParams.get('state'), url: u };
}

/* ---------- gedişat ---------- */

(async () => {
  await new Promise(r => saxta.listen(FAKE, r));

  try {
    /* --- 1. Avtomatik qonaq qeydiyyatı --- */
    bas('1. Avtomatik qonaq qeydiyyatı');
    const evvel = say();
    const br = qab();
    const s1 = await br.get('/is/hesab');
    check('hesab səhifəsi açılır', s1.status === 200, s1.status);
    check('qonaq sətri avtomatik yarandı', say() === evvel + 1, say() + ' / ' + evvel);

    const ad = sql("SELECT name FROM users ORDER BY id DESC LIMIT 1");
    check('qonağa avtomatik ad verildi', /^Qonaq-\d{4,}$/.test(ad), ad);
    check('ad səhifədə görünür', s1.body.includes(ad), ad);
    check('avtomatik ad işarələnib', sql('SELECT auto_name FROM users ORDER BY id DESC LIMIT 1') === '1');
    check('qonaq e-poçtsuzdur', sql('SELECT ifnull(email,"—") FROM users ORDER BY id DESC LIMIT 1') === '—');
    check('«qonaq kimi davam et» seçimi görünür', s1.body.includes('Qonaq kimi davam et'));
    check('Google düyməsi görünür', s1.body.includes('pr-btn-google'));

    /* --- 2. Razılıq ünvanı --- */
    bas('2. Razılıq ünvanı');
    const g1 = await baslat(br, 'is');
    check('Google-a yönləndirilir', g1.url.host === 'accounts.google.com', g1.url.host);
    check('PKCE metodu S256-dır', g1.url.searchParams.get('code_challenge_method') === 'S256');
    check('state verilir', (g1.state || '').length >= 16, g1.state);
    /* Doğrulayıcının ÖZÜ ünvanda olmamalıdır — yalnız barmaq izi. */
    check('doğrulayıcı ünvanda yoxdur', !g1.url.searchParams.has('code_verifier'));
    check('cavab ünvanı bizim saytdadır',
      (g1.url.searchParams.get('redirect_uri') || '').startsWith(B), g1.url.searchParams.get('redirect_uri'));

    /* --- 3. Qonaq sətri YERİNDƏ hesaba çevrilir --- */
    bas('3. Google ilə ilk giriş');
    const oncekiSay = say();
    const c1 = await br.get('/giris/google/cavab?code=KOD-BIRINCI&state=' + g1.state);
    check('giriş 302 verir', c1.status === 302, c1.status);
    check('profilə qayıdır', c1.yer.includes('/is/mustentiq'), c1.yer);
    check('YENİ sətir açılmadı — qonaq yerində çevrildi', say() === oncekiSay, say() + ' / ' + oncekiSay);
    check('doğrulayıcı token sorğusunda göndərildi', (sonSorgu.code_verifier || '').length >= 43, sonSorgu.code_verifier);
    check('client_secret token sorğusundadır', !!sonSorgu.client_secret);

    const setir = sql("SELECT email||'|'||name||'|'||ifnull(google_id,'—')||'|'||auth_provider||'|'||auto_name FROM users WHERE email='birinci@test.az'");
    check('e-poçt yazıldı', setir.startsWith('birinci@test.az|'), setir);
    check('Google adı avtomatik adı əvəz etdi', setir.includes('|Rəşad Testov|'), setir);
    check('google_id saxlanıldı', setir.includes('|G-BIRINCI|'), setir);
    check('provayder «google» yazıldı', setir.includes('|google|'), setir);
    check('avtomatik ad nişanı silindi', setir.endsWith('|0'), setir);

    const prof = await br.get('/is/mustentiq');
    check('profil açılır', prof.status === 200, prof.status);
    /* Profil səhifəsi adı çap etmir (vəsiqə şöbə seçildikdən sonra verilir),
       ona görə giriş faktı hesab ekranının özündən yoxlanılır: hesablı
       ziyarətçi ora buraxılmır, profilə yönləndirilir. */
    check('hesab ekranı artıq açılmır — giriş edilib',
      (await br.get('/is/hesab')).status === 302);

    /* --- 4. `state` birdəfəlikdir --- */
    bas('4. state birdəfəlikdir');
    const tekrar = await br.get('/giris/google/cavab?code=KOD-BIRINCI&state=' + g1.state);
    check('eyni state ikinci dəfə işləmir', tekrar.status === 302 && !tekrar.yer.includes('accounts.google'), tekrar.yer);

    const br2 = qab();
    await br2.get('/is/hesab');
    const g2 = await baslat(br2, 'is');
    const yad = await br2.get('/giris/google/cavab?code=KOD-BIRINCI&state=YALAN-ACAR');
    check('yad state qəbul edilmir', yad.status === 302, yad.status);
    check('yad state-dən sonra profil qonaqdır',
      (await br2.get('/is/hesab')).status === 200);

    /* --- 5. İkinci cihaz: eyni Google → EYNİ hesab --- */
    bas('5. İkinci cihazdan eyni hesab');
    const oncekiSay2 = say();
    const g3 = await baslat(br2, 'is');
    const c3 = await br2.get('/giris/google/cavab?code=KOD-BIRINCI&state=' + g3.state);
    check('giriş baş tutur', c3.status === 302 && c3.yer.includes('/is/mustentiq'), c3.yer);
    check('yeni hesab AÇILMADI', Number(sql("SELECT COUNT(*) FROM users WHERE google_id='G-BIRINCI'")) === 1);
    /* Qonaq sətri hesaba birləşdi və silindi — sayğac artmır, azalır. */
    check('qonaq sətri birləşdirildi', say() <= oncekiSay2, say() + ' / ' + oncekiSay2);

    /* --- 6. Parolla açılmış hesab Google-a bağlanır --- */
    bas('6. Parollu hesabın bağlanması');
    const br3 = qab();
    await br3.get('/is/hesab');
    const qeyd = await br3.post('/is/qeydiyyat', {
      name: 'Parollu Adam', email: 'parollu@test.az',
      password: 'parol-12345', password_confirmation: 'parol-12345',
    });
    check('parolla qeydiyyat işləyir', qeyd.status === 302, qeyd.status);
    const id0 = sql("SELECT id FROM users WHERE email='parollu@test.az'");
    check('hesab yarandı', id0 !== '', id0);

    const br4 = qab();
    await br4.get('/is/hesab');
    const g4 = await baslat(br4, 'is');
    const c4 = await br4.get('/giris/google/cavab?code=KOD-PAROLLU&state=' + g4.state);
    check('eyni e-poçtlu Google girişi baş tutur', c4.status === 302 && c4.yer.includes('/is/mustentiq'), c4.yer);
    check('hesab İKİLƏŞMƏDİ', Number(sql("SELECT COUNT(*) FROM users WHERE email='parollu@test.az'")) === 1);
    check('eyni sətrə bağlandı', sql("SELECT id FROM users WHERE email='parollu@test.az'") === id0);
    check('google_id əlavə olundu', sql("SELECT google_id FROM users WHERE email='parollu@test.az'") === 'G-PAROLLU');
    /* Ad İNSANIN yazdığı kimi qalmalıdır — Google-un adı onu üstələməməlidir. */
    check('insanın yazdığı ad qorundu', sql("SELECT name FROM users WHERE email='parollu@test.az'") === 'Parollu Adam');
    check('parol silinmədi', sql("SELECT length(ifnull(password,'')) > 0 FROM users WHERE email='parollu@test.az'") === '1');

    /* --- 7. Rədd edilməli hallar --- */
    bas('7. Rədd edilməli hallar');
    for (const [ad2, kod] of [['təsdiqlənməmiş e-poçt', 'KOD-TESDIQSIZ'],
                              ['başqa tətbiqin tokeni', 'KOD-YADAUD'],
                              ['Google-un 400 cavabı',  'KOD-XETA']]) {
      const b = qab();
      await b.get('/is/hesab');
      const gg = await baslat(b, 'is');
      const cc = await b.get('/giris/google/cavab?code=' + kod + '&state=' + gg.state);
      const hesabVar = Number(sql("SELECT COUNT(*) FROM users WHERE google_id IN ('G-PIS','G-PIS2')"));
      check(ad2 + ' rədd edilir', cc.status === 302 && hesabVar === 0, cc.yer + ' / ' + hesabVar);
    }

    /* --- 8. Açıq yönləndirmə yoxdur --- */
    bas('8. Açıq yönləndirmə yoxdur');
    for (const pis of ['https://evil.example/', '//evil.example', 'http://evil', '/admin', 'account.index']) {
      const b = qab();
      await b.get('/is/hesab');
      const r = await b.get('/giris/google?davam=' + encodeURIComponent(pis));
      const u = new URL(r.yer);
      const geri = u.searchParams.get('redirect_uri') || '';
      check('«' + pis + '» kənara yönəltmir',
        u.host === 'accounts.google.com' && geri.startsWith(B), r.yer.slice(0, 90));
    }

    /* --- 9. Qonaq marşrutu --- */
    bas('9. «Qonaq kimi davam et»');
    const b5 = qab();
    await b5.get('/is/hesab');
    const q = await b5.post('/qonaq', { davam: 'is' });
    check('qonaq marşrutu 302 verir', q.status === 302, q.status);
    check('profilə yönəldir', q.yer.includes('/is/mustentiq'), q.yer);
    const q2 = await b5.get('/is/mustentiq');
    check('qonaq profili açılır', q2.status === 200, q2.status);

    /* Kabinet tərəfi eyni marşrutdan istifadə edir — bölmələr ayrıdır,
       autentifikasiya məntiqi ortaqdır. */
    const b6 = qab();
    const kab = await b6.get('/kabinet/hesab');
    check('kabinetdə Google düyməsi var', kab.body.includes('btn-google'));
    check('kabinetdə qonaq seçimi var', kab.body.includes('Qonaq kimi davam et'));
    const g6 = await baslat(b6, 'kabinet');
    const c6 = await b6.get('/giris/google/cavab?code=KOD-IKINCI&state=' + g6.state);
    check('kabinetə qayıdır', c6.status === 302 && c6.yer.includes('/kabinet'), c6.yer);

  } finally {
    saxta.close();
  }

  console.log('\n' + pass + ' keçdi, ' + fail + ' uğursuz');
  process.exit(fail > 0 ? 1 : 0);
})().catch(e => { console.error(e); saxta.close(); process.exit(1); });
