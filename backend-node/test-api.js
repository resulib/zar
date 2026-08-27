/* Backend uçdan-uca test — server.inject ilə, real port açmadan */
process.env.DB_PATH = '/tmp/zarafat-test-' + Date.now() + '.db';
process.env.PUBLIC_URL = 'https://zarafat.az';
process.env.ADMIN_TOKEN = 'test-admin';
const app = require('./server');

let pass = 0, fail = 0;
function check(name, cond, extra) {
  if (cond) { pass++; console.log('  ✓', name); }
  else { fail++; console.log('  ✗', name, extra !== undefined ? JSON.stringify(extra) : ''); }
}

(async () => {
  await app.ready();

  /* --- 1. health + anonim istifadəçi --- */
  let r = await app.inject({ method: 'GET', url: '/api/health' });
  check('health 200', r.statusCode === 200 && r.json().ok);
  const cookie = (r.headers['set-cookie'] || '').toString().split(';')[0];
  check('anonim cookie verilir', /^zrf_uid=[a-f0-9]{32}$/.test(cookie), cookie);
  const H = { cookie };

  r = await app.inject({ method: 'GET', url: '/api/me', headers: H });
  check('başlanğıc balans 0', r.json().credits === 0, r.json());

  /* --- 2. sənəd yaratma --- */
  const payload = {
    templateId: 'weekend-pass', title: 'Həftəsonu Çölə Çıxma Etibarnaməsi',
    to: 'Günel Şəkərova', from: 'Elvin Məmmədov',
    powers: 'Bir bənd\nİkinci bənd', penalty: 'Cəza mətni', preamble: 'Preambula mətni'
  };
  r = await app.inject({ method: 'POST', url: '/api/documents', headers: H, payload });
  const doc = r.json();
  check('sənəd yaradıldı', r.statusCode === 200 && /^ZRF-\d{4}-\d{4}$/.test(doc.regNo), doc);
  check('qaralama statusu (paid=false)', doc.paid === false);
  check('verifyUrl düzgündür', doc.verifyUrl === 'https://zarafat.az/r/' + doc.regNo, doc.verifyUrl);
  check('Azərbaycan hərfləri qorunur', doc.to === 'Günel Şəkərova', doc.to);

  r = await app.inject({ method: 'POST', url: '/api/documents', headers: H, payload: { title: 'X' } });
  check('boş sahələr 400 qaytarır', r.statusCode === 400, r.json());

  /* --- 3. balanssız publish rədd edilir --- */
  r = await app.inject({ method: 'POST', url: `/api/documents/${doc.regNo}/publish`, headers: H });
  check('balans yoxdursa 402', r.statusCode === 402, r.json());

  r = await app.inject({ method: 'GET', url: `/api/registry/${doc.regNo}` });
  check('qaralama reyestrdə görünmür', r.statusCode === 404);

  /* --- 4. ödəniş simulyasiyası --- */
  r = await app.inject({ method: 'POST', url: '/api/payments/simulate', headers: H, payload: { packId: 'p3' } });
  check('simulyasiya 3 kredit verir', r.statusCode === 200 && r.json().credits === 3, r.json());

  r = await app.inject({ method: 'POST', url: '/api/payments/simulate', headers: H, payload: { packId: 'yoxdur' } });
  check('naməlum paket 400', r.statusCode === 400);

  /* --- 5. publish + reyestr --- */
  r = await app.inject({ method: 'POST', url: `/api/documents/${doc.regNo}/publish`, headers: H });
  check('publish uğurlu', r.statusCode === 200 && r.json().paid === true, r.json());

  r = await app.inject({ method: 'GET', url: '/api/me', headers: H });
  check('kredit 1 azaldı (3→2)', r.json().credits === 2, r.json());

  r = await app.inject({ method: 'POST', url: `/api/documents/${doc.regNo}/publish`, headers: H });
  check('təkrar publish kredit yemir', r.statusCode === 200);
  r = await app.inject({ method: 'GET', url: '/api/me', headers: H });
  check('balans hələ 2', r.json().credits === 2, r.json());

  r = await app.inject({ method: 'GET', url: `/api/registry/${doc.regNo}` });
  check('reyestrdə tapılır', r.statusCode === 200 && r.json().regNo === doc.regNo, r.json());
  check('reyestr cavabında paid=true', r.json().paid === true);

  r = await app.inject({ method: 'GET', url: '/api/registry/ZRF-2026-0000' });
  check('olmayan nömrə 404', r.statusCode === 404);
  r = await app.inject({ method: 'GET', url: '/api/registry/SALAM' });
  check('yanlış format 400', r.statusCode === 400);

  /* --- 6. başqa istifadəçi publish edə bilmir --- */
  const other = await app.inject({ method: 'GET', url: '/api/health' });
  const H2 = { cookie: (other.headers['set-cookie'] || '').toString().split(';')[0] };
  const d2 = (await app.inject({ method: 'POST', url: '/api/documents', headers: H2, payload })).json();
  r = await app.inject({ method: 'POST', url: `/api/documents/${d2.regNo}/publish`, headers: H });
  check('yad sənədi publish etmək olmur (403)', r.statusCode === 403, r.json());

  /* --- 7. şikayət / silmə --- */
  r = await app.inject({ method: 'POST', url: '/api/reports', headers: H2, payload: { regNo: doc.regNo, reason: 'Təhqiredici məzmun' } });
  check('yad sənəd üçün şikayət növbəyə düşür', r.json().queued === true, r.json());

  r = await app.inject({ method: 'GET', url: '/api/admin/reports', headers: { 'x-admin-token': 'test-admin' } });
  check('admin şikayətləri görür', r.statusCode === 200 && r.json().length === 1, r.json());
  r = await app.inject({ method: 'GET', url: '/api/admin/reports' });
  check('tokensiz admin 401', r.statusCode === 401);

  r = await app.inject({ method: 'POST', url: '/api/reports', headers: H, payload: { regNo: doc.regNo, reason: 'Öz sənədim' } });
  check('sahibi öz sənədini silir', r.json().deleted === true, r.json());
  r = await app.inject({ method: 'GET', url: `/api/registry/${doc.regNo}` });
  check('silinən sənəd reyestrdən çıxır', r.statusCode === 404);

  /* --- 8. mənim sənədlərim --- */
  r = await app.inject({ method: 'GET', url: '/api/me/documents', headers: H2 });
  check('sənəd siyahısı yalnız öz sənədini göstərir', r.json().length === 1 && r.json()[0].regNo === d2.regNo, r.json());

  /* --- 9. moderasiya süzgəci --- */
  process.env.BANNED_WORDS = 'qadagansoz, ikincisoz';
  r = await app.inject({ method: 'POST', url: '/api/documents', headers: H,
    payload: Object.assign({}, payload, { penalty: 'Burada QadaganSoz var' }) });
  check('qadağan sözlü sənəd 422 alır', r.statusCode === 422, r.json());
  r = await app.inject({ method: 'POST', url: '/api/documents', headers: H, payload });
  check('təmiz mətn keçir', r.statusCode === 200);
  process.env.BANNED_WORDS = '';

  /* --- 10. /r/ marşrutu SPA qaytarır --- */
  r = await app.inject({ method: 'GET', url: '/r/' + d2.regNo });
  check('/r/:regNo index.html qaytarır', r.statusCode === 200 && r.body.includes('<!DOCTYPE html>'), r.statusCode);

  console.log(`\n${pass} keçdi, ${fail} uğursuz`);
  await app.close();
  process.exit(fail ? 1 : 0);
})();
