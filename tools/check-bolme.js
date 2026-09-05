/* Bölmələr — bağlı məhsulun ünvanları HƏQİQƏTƏN yoxdur.

   Server lazımdır:  cd backend-php && php artisan serve --port=8099
   sonra:            npm run test:bolme

   Test parametrləri İDARƏ PANELİNDƏN dəyişir, bazadan yox: keşin
   unudulması da yolun bir hissəsidir və məhz o unudulsa, dəyişiklik
   heç vaxt işə düşməzdi.

   Yoxlanan əsas iddialar:
     · bağlı bölmə 404 verir, 403 yox — «icazə yoxdur» ünvanın mövcudluğunu
       bildirərdi;
     · bağlanma API-yə də şamil olunur, yoxsa köhnə paketlə məhsuldan
       istifadə etmək mümkün qalardı;
     · ADMİN bağlı bölməni yenə görür, yoxsa açmadan öncə yoxlamaq olmazdı;
     · kök ünvan HEÇ VAXT 404 vermir — bir parametr bütün saytı bağlaya bilməz;
     · kredit alınması bağlı bölmədən ASILI DEYİL (`/is/balans`).

   Test sonda vəziyyəti HƏMİŞƏ bərpa edir — uğursuz olsa da. */
'use strict';
const fs   = require('fs');
const path = require('path');

const B     = (process.argv[2] || 'http://127.0.0.1:8099').replace(/\/$/, '');
const EMAIL = process.argv[3] || 'admin@zarafat.az';
const PASS  = process.argv[4] || 'admin12345';

let pass = 0, fail = 0;
const check = (n, c, x) => c ? (pass++, console.log('  \x1b[32m✓\x1b[0m ' + n))
                             : (fail++, console.log('  \x1b[31m✗\x1b[0m ' + n + (x === undefined ? '' : ' → ' + JSON.stringify(x).slice(0, 200))));
const bas = t => console.log('\n' + t);

function qab() {
  const jar = new Map();
  const cookie = () => [...jar].map(([k, v]) => k + '=' + v).join('; ');
  const yaz = r => {
    for (const c of (r.headers.getSetCookie ? r.headers.getSetCookie() : [])) {
      const kv = c.split(';')[0], i = kv.indexOf('=');
      jar.set(kv.slice(0, i).trim(), kv.slice(i + 1));
    }
  };

  return {
    async get(yol) {
      const r = await fetch(B + yol, { headers: { cookie: cookie() }, redirect: 'manual' });
      yaz(r);
      return { status: r.status, yer: r.headers.get('location') || '',
               bagli: r.headers.get('x-bolme-bagli') || '', body: await r.text() };
    },
    async post(yol, data, tokenYolu) {
      const g = await this.get(tokenYolu || yol);
      const token = (g.body.match(/name="_token" value="([^"]+)"/) || [])[1] || '';
      const r = await fetch(B + yol, {
        method: 'POST',
        headers: { cookie: cookie(), 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(Object.assign({ _token: token }, data)),
        redirect: 'manual',
      });
      yaz(r);
      return { status: r.status, yer: r.headers.get('location') || '', body: await r.text() };
    },
  };
}

/** İdarə panelindən bölmə açarlarını yazır — keş də bu yolla unudulur. */
async function qur(admin, aciq, ana) {
  const data = { bolme_ana: ana };
  for (const [k, v] of Object.entries(aciq)) if (v) data['bolme_' + k] = '1';

  const r = await admin.post('/admin/parametrler/bolmeler', data, '/admin/parametrler');
  if (r.status !== 302) throw new Error('parametr yazılmadı: ' + r.status);
}

/** Saytın HAZIRKI vəziyyəti — test onu sonda geri qaytarır. */
async function oxu(admin) {
  const h = JSON.parse((await admin.get('/api/health')).body);
  const p = await admin.get('/admin/parametrler');
  const m = p.body.match(/name="bolme_ana" value="(\w+)"[^>]*checked/);

  /* SAXLANILIB, YOXSA İLKİN DƏYƏR? İkisi eyni görünə bilər, amma fərqlidir:
     saxlanmamış vəziyyət `APP_ENV` ilə birlikdə dəyişir, saxlanmış isə
     dondurulub. Test saxlanmamış vəziyyəti sonda YAZMAMALIDIR — yoxsa
     yerli sınaq həmin bazanı istehsalatda bölmələr açıq qaldıracaq
     vəziyyətə salardı. */
  const yazilib = /settings\.sections\.reset|Seçimi sil/.test(p.body);

  return { aciq: h.bolmeler || {}, ana: (m || [])[1] || 'zarafat', yazilib };
}

/* Bağlı bölmənin ünvanları — səhifələr və API. */
const ZARAFAT = ['/kabinet', '/kabinet/hesab', '/r/ZRF-2026-0001', '/api/catalog', '/api/me/documents'];
const DEVET   = ['/devetname', '/devetnamelerim', '/api/devet/paketler'];
const IS      = ['/is', '/is/reyting', '/is/balans', '/is/hesab'];
/* Bölmədən ASILI OLMAYANLAR: kredit hər iki məhsulda işlənir, şikayət isə
   hüquqi qalxanın hissəsidir. */
const ORTAQ   = ['/api/health', '/api/packs', '/giris/google'];

(async () => {
  const admin = qab();
  const login = await admin.post('/admin/giris', { email: EMAIL, password: PASS });
  if (login.status !== 302) { console.error('admin girişi alınmadı: ' + login.status); process.exit(1); }

  /* VƏZİYYƏT ƏVVƏLCƏ OXUNUR. Əvvəllər sonda «hamısı açıq» yazılırdı —
     istehsalat vəziyyəti «yalnız iş qovluğu» olandan sonra bu, testin
     saytı açıq qoyması demək olardı. Test heç nəyi qərara almır, tapdığını
     qaytarır. */
  const evvelki = await oxu(admin);

  try {
    /* --- 0. İstehsalat ilkin dəyəri --- */
    bas('0. İstehsalat ilkin dəyəri');
    const cfg = fs.readFileSync(path.join(__dirname, '..', 'backend-php', 'config', 'bolmeler.php'), 'utf8');
    /* Hazır olmayan məhsulun canlı qalması «kimsə parametri yazmağı unudarsa»
       halına buraxılmamalıdır — `simulationAllowed()` ilə eyni arqument. */
    check('zarafat istehsalatda öz-özünə bağlıdır',
      /'zarafat'\s*=>\s*env\('BOLME_ZARAFAT',\s*env\('APP_ENV'\)\s*!==\s*'production'\)/.test(cfg));
    check('dəvətnamə istehsalatda öz-özünə bağlıdır',
      /'devet'\s*=>\s*env\('BOLME_DEVET',\s*env\('APP_ENV'\)\s*!==\s*'production'\)/.test(cfg));
    check('iş qovluğu heç vaxt öz-özünə bağlanmır',
      /'is'\s*=>\s*env\('BOLME_IS',\s*true\)/.test(cfg));
    check('istehsalatda ana səhifə iş qovluğudur',
      /'ana'\s*=>\s*env\('BOLME_ANA',\s*env\('APP_ENV'\)\s*===\s*'production'\s*\?\s*'is'\s*:\s*'zarafat'\)/.test(cfg));

    /* --- 1. Hamısı açıq --- */
    bas('1. Hamısı açıq');
    await qur(admin, { is: true, zarafat: true, devet: true }, 'zarafat');
    const q = qab();
    for (const y of [...ZARAFAT, ...DEVET, ...IS, ...ORTAQ]) {
      const r = await q.get(y);
      check(y + ' açıqdır', r.status !== 404, r.status);
    }
    check('kök SPA-nı göstərir', (await q.get('/')).status === 200);

    /* --- 2. Yalnız iş qovluğu --- */
    bas('2. Yalnız iş qovluğu canlıdır');
    await qur(admin, { is: true, zarafat: false, devet: false }, 'is');
    const z = qab();

    for (const y of [...ZARAFAT, ...DEVET]) {
      const r = await z.get(y);
      /* 404, 403 DEYİL: «icazə yoxdur» cavabının özü ünvanın mövcudluğunu
         bildirər və bağlı məhsulu elan edərdi. */
      check(y + ' → 404', r.status === 404, r.status);
    }
    for (const y of IS) {
      const r = await z.get(y);
      check(y + ' işləyir', r.status === 200, r.status);
    }
    for (const y of ORTAQ) {
      const r = await z.get(y);
      check(y + ' ortaqdır — bağlanmır', r.status !== 404, r.status);
    }

    /* Kök: 404 YOX, yönləndirmə. 301 olsaydı brauzer onu qeyri-müəyyən
       müddətə saxlayar və bölmə açılandan sonra da köhnə hədəfə düşərdi. */
    const kok = await z.get('/');
    check('kök 404 vermir', kok.status !== 404, kok.status);
    check('kök iş qovluğuna yönləndirir', kok.status === 302 && kok.yer.endsWith('/is'), kok.yer);
    check('yönləndirmə 302-dir (301 deyil)', kok.status === 302, kok.status);

    /* API bağlanması — köhnə SPA paketi ilə bağlı məhsuldan istifadə
       edilə bilməməlidir. */
    const kat = await z.get('/api/catalog');
    check('kataloq API-si bağlıdır', kat.status === 404, kat.status);
    const isApi = await z.get('/api/is/2026-0847/sened/1');
    check('iş qovluğu API-si açıq qalır', isApi.status !== 404, isApi.status);

    /* Kredit alınması bağlı bölmədən asılı deyil — onsuz ödənişli
       qovluqlar satıla bilməzdi. */
    const bal = await z.get('/is/balans');
    check('balans ekranı işləyir', bal.status === 200, bal.status);
    check('balans ekranı paketləri göstərir', /pr-paket/.test(bal.body));
    check('balans ekranı kabinetə link vermir', ! /\/kabinet/.test(bal.body));
    check('balans ekranı indekslənmir',
      /noindex/.test((await fetch(B + '/is/balans')).headers.get('x-robots-tag') || ''));

    /* Sağlamlıq cavabı vəziyyəti bildirir ki, SPA altlıqdakı keçidi gizlətsin. */
    const h = JSON.parse((await z.get('/api/health')).body);
    check('health bölmələri bildirir', h.bolmeler && h.bolmeler.devet === false, h.bolmeler);

    /* --- 3. Admin bağlı bölməni görür --- */
    bas('3. Admin bağlı bölməni yoxlaya bilir');
    const a1 = await admin.get('/devetname');
    check('admin üçün açıqdır', a1.status === 200, a1.status);
    check('bağlı olduğu başlıqda bildirilir', a1.bagli === 'devet', a1.bagli);
    const a2 = await admin.get('/api/catalog');
    check('admin API-ni də görür', a2.status === 200, a2.status);

    /* --- 4. Bağlı seçim saytı bağlamır --- */
    bas('4. Səhv seçim saytı bağlamır');
    /* Ana səhifə «zarafat» seçilib, amma o bağlıdır — kök yenə də açıq
       bölməyə düşməlidir. */
    await qur(admin, { is: true, zarafat: false, devet: false }, 'zarafat');
    const k2 = await qab().get('/');
    check('bağlı ana seçimi açıq bölməyə keçir',
      k2.status === 302 && k2.yer.endsWith('/is'), k2.status + ' ' + k2.yer);

    /* --- 5. Hamısı bağlı --- */
    bas('5. Hamısı bağlı');
    await qur(admin, { is: false, zarafat: false, devet: false }, 'is');
    const k3 = await qab().get('/');
    /* 503, 404 deyil: ünvan var, məzmun müvəqqəti yoxdur. 404 axtarış
       sistemi üçün «silinib» deməkdir. */
    check('kök 503 verir', k3.status === 503, k3.status);
    check('texniki fasilə mətni görünür', /Texniki fasilə/.test(k3.body));
    check('fasilə səhifəsi indekslənmir', /noindex/.test(k3.body));

    /* --- 6. Seçimin silinməsi --- */
    bas('6. Seçimin silinməsi');
    await qur(admin, { is: true, zarafat: false, devet: false }, 'is');
    const onceki = await oxu(admin);
    check('seçim saxlanılıb kimi görünür', onceki.yazilib === true);
    await admin.post('/admin/parametrler/bolmeler/sifirla', {}, '/admin/parametrler');
    const sonra = await oxu(admin);
    check('silindikdən sonra saxlanmamış görünür', sonra.yazilib === false);
    /* Yerli mühitdə ilkin dəyər «hamısı açıq»dır — yəni silmək həqiqətən
       vəziyyəti dəyişdi, sadəcə sətirləri silmədi. */
    check('vəziyyət ilkin dəyərə qayıtdı',
      sonra.aciq.zarafat === true && sonra.aciq.devet === true, sonra.aciq);

  } finally {
    /* VƏZİYYƏT HƏMİŞƏ BƏRPA OLUNUR — və məhz TAPILDIĞI kimi, «hamısı açıq»
       kimi yox: sayt bağlı vəziyyətdə idarə olunursa, test onu açıq
       qoymamalıdır. */
    try {
      if (evvelki.yazilib) {
        await qur(admin, evvelki.aciq, evvelki.ana);
        console.log('\n(vəziyyət bərpa olundu: '
          + JSON.stringify(evvelki.aciq) + ', ana səhifə ' + evvelki.ana + ')');
      } else {
        /* Əvvəl heç nə saxlanmamışdı — sətir yazmaq vəziyyəti DONDURARDI. */
        await admin.post('/admin/parametrler/bolmeler/sifirla', {}, '/admin/parametrler');
        console.log('\n(seçim silindi — vəziyyət yenidən mühitin ilkin dəyərindən gəlir)');
      }
    } catch (e) {
      console.error('DİQQƏT: vəziyyət bərpa olunmadı — /admin/parametrler-i yoxlayın', e.message);
    }
  }

  console.log('\n' + pass + ' keçdi, ' + fail + ' uğursuz');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
