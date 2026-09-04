/* İdarə panelinin iş qovluğu redaktoru — uçdan-uca, real brauzerdə.
 *
 * Axın: giriş → yeni iş → sənəd → şəkil yüklə → nişan yapışdır → önizləmə →
 * kod → şübhəli → sonluq → yoxlayıcı → dərc → oyunçu kimi oxu.
 *
 * `php artisan serve --port=8099` lazımdır.
 * Sənəd nömrələri rəqəm görünüşlü açarlardır — burada həmişə SƏTİR kimi
 * saxlanılır, çünki PHP tərəfdə massiv açarı olsaydılar int-ə çevrilərdi. */
const { chromium } = require('playwright');

const BASE = process.env.BASE || 'http://127.0.0.1:8099';
const EPOST = process.env.ADMIN_EMAIL || 'admin@zarafat.az';
const SIFRE = process.env.ADMIN_PASSWORD || 'admin12345';

let pass = 0, fail = 0;
function check(ad, sert, izah) {
  if (sert) { pass++; console.log('  \x1b[32m✓\x1b[0m ' + ad); }
  else { fail++; console.log('  \x1b[31m✗\x1b[0m ' + ad + (izah === undefined ? '' : ' → ' + JSON.stringify(izah))); }
}
function bas(t) { console.log('\n' + t); }

/* Sınaq işlərini götürür. Dərc olunmuş iş birbaşa silinmir — əvvəlcə
   arxivlənir; bu, məhsulun öz qaydasıdır və test onu yan keçmir. */
/* Önizləmənin içi — İFRAME-in öz sənədindədir.

   Vərəq qəsdən ayrı sənədə yazılır: `dossier.css` oyunun qlobal üslub
   faylıdır (`*`, `body`, `:root`) və panelin sənədinə yüklənsəydi bütün
   idarə səhifəsini ələ keçirərdi. §5-dəki üslub yoxlamaları məhz bunu
   qoruyur. */
async function varaq(p) {
  return await p.frameLocator('#qvOnizleme').locator('body').innerHTML();
}

async function temizle(p, BASE) {
  await p.goto(BASE + '/admin/qovluqlar');

  for (let n = 0; n < 20; n++) {
    const setr = p.locator('tr', { hasText: 'Sınaq işi' }).first();
    if (await setr.count() === 0) return true;

    const sil = setr.locator('button:has-text("Sil")');

    if (await sil.count() > 0) {
      await sil.click();
    } else {
      await setr.locator('button:has-text("Arxivlə")').click();
    }

    await p.waitForLoadState('networkidle');
  }

  return (await p.locator('tr', { hasText: 'Sınaq işi' }).count()) === 0;
}

/* 1×1 qırmızı PNG — GD-nin oxuya biləcəyi ən kiçik həqiqi şəkil. */
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const p = await ctx.newPage();

  /* BRAUZER DİALOQU AÇILMAMALIDIR. Şəkil yükləməsi əvvəl üç `prompt()`
     işlədirdi; onlar səhifəni bloklayır, şəkli göstərmir və növün nə demək
     olduğunu izah etmir. İndi səhifədaxili forma var, ona görə burada cavab
     verilmir — sayılır. */
  let dialoqSayi = 0;
  p.on('dialog', d => { dialoqSayi++; d.dismiss(); });

  bas('1. Giriş');
  await p.goto(BASE + '/admin/giris');
  await p.fill('input[name="email"]', EPOST);
  await p.fill('input[name="password"]', SIFRE);
  await p.click('button[type="submit"]');
  await p.waitForLoadState('networkidle');
  check('admin panelinə giriş', !p.url().includes('/giris'), p.url());

  await p.goto(BASE + '/admin/qovluqlar');
  check('iş qovluqları siyahısı açılır', (await p.locator('table.tbl tbody tr').count()) >= 3);
  check('naviqasiyada keçid var', await p.locator('.side a[href$="/admin/qovluqlar"]').count() > 0);

  bas('2. Yeni iş');
  const SLUG = '2099-0001';

  check('sınaq işi qalmadı', await temizle(p, BASE));

  await p.goto(BASE + '/admin/qovluqlar/yeni');
  await p.fill('input[name="title"]', 'Sınaq işi');
  await p.fill('input[name="slug"]', SLUG);
  await p.fill('textarea[name="intro"]', 'Sınaq üçün qurulmuş iş.');
  await p.selectOption('select[name="status"]', 'draft');
  /* Qiymət SIFIR: oyunçu tərəfini kreditsiz qonaq sessiyası ilə yoxlayırıq. */
  await p.fill('input[name="price_credits"]', '0');
  await p.click('.qv-panel.on button[type="submit"]');
  await p.waitForLoadState('networkidle');
  check('iş yaradıldı', p.url().includes('/admin/qovluqlar/'), p.url());

  const isUrl = p.url();
  const isId = isUrl.split('/').pop();

  bas('3. Yoxlayıcı paneli');
  check('yoxlama paneli göstərilir', await p.locator('.qv-rapor').count() > 0);
  const xetalar = await p.locator('.qv-xeta').allTextContents();
  check('sənədsiz iş xəta verir', xetalar.some(x => x.includes('sənəd')), xetalar);
  check('şübhəlisiz iş xəta verir', xetalar.some(x => x.includes('şübhəli')), xetalar);

  bas('4. Tablar');
  await p.click('.qv-tab[data-tab="subheliler"]');
  check('şübhəlilər tabı açılır', await p.locator('.qv-panel[data-panel="subheliler"].on').count() === 1);
  await p.click('.qv-tab[data-tab="hekaye"]');
  check('hekayə tabı açılır', await p.locator('.qv-panel[data-panel="hekaye"].on').count() === 1);
  await p.click('.qv-tab[data-tab="cavab"]');
  check('cavab tabı açılır', await p.locator('.qv-panel[data-panel="cavab"].on').count() === 1);
  /* Hansı mexanikanın aktiv olduğu AÇIQ yazılır — panelin ən çox
     çaşdıran yeri məhz iki mexanikanın yan-yana durması idi. */
  check('aktiv mexanika bildirilir',
    (await p.locator('.qv-panel[data-panel="cavab"] .qv-rejim').innerText()).includes('üç suallıq'));
  check('şübhəlisiz sonluq bölməsi boşdur', (await p.locator('.qv-panel[data-panel="cavab"]').innerText()).includes('şübhəli əlavə edin'));

  bas('4b. Hazır işin bütün məlumatı adminde görünür');
  /* Seed ilə gələn üç iş idarə panelində ŞÜBHƏLİSİZ və SUALSIZ görünürdü:
     şübhəlilər `dossiers.suspects` JSON sütununda idi, suallar üçün isə
     redaktor yox idi — yəni hazır işin qatilini panelden görmək mümkün
     deyildi. Bu bölmə həmin boşluğun bağlı qaldığını yoxlayır. */
  const hazir = await ctx.newPage();
  await hazir.goto(BASE + '/admin/qovluqlar');
  await hazir.locator('tr', { hasText: 'Sədəf' }).first().locator('a').first().click();
  await hazir.waitForLoadState('networkidle');

  await hazir.click('.qv-tab[data-tab="subheliler"]');
  check('hazır işin şübhəliləri görünür',
    await hazir.locator('.qv-panel[data-panel="subheliler"] input[name="name"]').count() >= 4);
  check('qatil işarələnib',
    await hazir.locator('.qv-panel[data-panel="subheliler"] input[name="is_culprit"]:checked').count() === 1);
  check('qatilin adı yuxarıda yazılır',
    (await hazir.locator('.qv-panel[data-panel="subheliler"] .qv-rejim').innerText()).includes('qatili'));

  await hazir.click('.qv-tab[data-tab="hekaye"]');
  const hek = hazir.locator('.qv-panel[data-panel="hekaye"]');
  check('meta sətirləri görünür', (await hek.locator('textarea[name="meta"]').inputValue()).includes('|'));
  check('xronologiya görünür', (await hek.locator('textarea[name="chronology"]').inputValue()).split('\n').length >= 10);
  check('alibi oxu görünür', (await hek.locator('textarea[name="axis"]').inputValue()).trim().split('\n').length === 3);
  check('həll görünür', (await hek.locator('textarea[name="solution"]').inputValue()).length > 200);

  await hazir.click('.qv-tab[data-tab="cavab"]');
  const cav = hazir.locator('.qv-panel[data-panel="cavab"]');
  check('üç sual görünür', await cav.locator('select[name="correct"]').count() === 3);
  check('düzgün cavab seçilmiş gəlir',
    (await cav.locator('select[name="correct"]').first().inputValue()) !== '');
  const qatilSecim = await cav.locator('select[name="correct"] option:checked').first().innerText();
  check('birinci sualın düzgün cavabı qatildir', qatilSecim.includes('Səbinə'), qatilSecim);

  /* Hekayə saxlanıla bilir və məlumat itmir. */
  const evvel = await hek.locator('textarea[name="chronology"]').inputValue();
  await hazir.click('.qv-tab[data-tab="hekaye"]');
  await hek.locator('button[type="submit"]').click();
  await hazir.waitForLoadState('networkidle');
  await hazir.click('.qv-tab[data-tab="hekaye"]');
  check('hekayə saxlananda dəyişmir',
    (await hazir.locator('textarea[name="chronology"]').inputValue()).trim() === evvel.trim());

  /* Tel formatı da pozulmamalıdır — oyun tərəfi bu JSON-u oxuyur. */
  const oyun = await ctx.newPage();
  await oyun.goto(BASE + '/is/2026-0847');
  check('təqdimat səhifəsi hələ də açılır', (await oyun.title()).length > 0);
  await oyun.close();
  await hazir.close();

  bas('5. Sənəd redaktoru və canlı önizləmə');
  await p.goto(BASE + '/admin/qovluqlar/' + isId + '/sened');
  await p.fill('input[name="name"]', 'İfadə protokolu');
  await p.fill('input[name="page"]', '1');
  await p.fill('input[name="kind"]', 'Protokol');
  await p.fill('input[name="meta_line"]', 'Protokol № 1 · 12.04.2026');
  await p.selectOption('select[name="blank_nov"]', 'protokol');
  const ilkMetn = 'Şahid **qapı açıq idi** dedi.\n\nMüstəntiq: {{mustentiq}}. Qiymət 100$ idi.';
  await p.fill('#qvBody', ilkMetn);
  await p.waitForTimeout(1200);

  const onizleme = await varaq(p);
  check('önizləmə render olunur', onizleme.includes('p-body'), onizleme.slice(0, 120));
  check('önizləmə qalın markupu açır', onizleme.includes('<b>qapı açıq idi</b>'));
  check('önizləmə blank çəkir', onizleme.includes('p-blank-protokol'));
  check('önizləmədə fiktivlik zolağı var', onizleme.includes('data-fq="1"'));
  check('önizləmədə dollar itmir', onizleme.includes('100$'));
  check('önizləmə meta sətrini göstərir', onizleme.includes('p-meta'));

  /* ÜSLUB TƏCRİDİ. Oyunun qlobal üslubu bir dəfə panelin sənədinə
     yüklənmişdi və bütün idarə səhifəsini qara fona salmışdı: formalar
     daralmış, etiketlər kəsilmiş, naviqasiya dağılmışdı. iframe onu kəsir. */
  const fon = await p.evaluate(() => getComputedStyle(document.body).backgroundColor);
  check('panelin fonu oyunun fonu deyil', !['rgb(14, 16, 15)', 'rgb(25, 28, 26)'].includes(fon), fon);
  check('oyunun üslubu panelə yüklənmir',
    await p.locator('link[href*="dossier.css"]').count() === 0);
  check('vərəq iframe-in içindədir', await p.locator('iframe#qvOnizleme').count() === 1);
  check('vərəq panelin sənədinə sızmır', await p.locator('#qvRedaktor .paper').count() === 0);
  const solEn = await p.locator('.qv-sol').evaluate(e => e.getBoundingClientRect().width);
  check('sol sütun oxunaqlı endədir', solEn > 300, solEn);

  /* ÜFÜQİ DAŞMA. `dossier.css`-də `body{display:flex}` var və oyunda vərəqi
     telefon çərçivəsində ortalayır. iframe-də çərçivə olmadığı üçün sarğı
     flex elementinə çevrilir, `max-content` enə açılır və mikromətn haşiyəsi
     (bir sətir, `white-space:nowrap`) vərəqi 1600 piksel enə dartır — mətn
     hər iki kənardan kəsilir. İnyeksiya olunan üslub həmin flex-i ləğv edir. */
  const olcu = await p.frameLocator('#qvOnizleme').locator('body').evaluate(bd => {
    const pa = bd.querySelector('.paper');
    return { client: bd.clientWidth, scroll: bd.scrollWidth,
             paper: pa ? Math.round(pa.getBoundingClientRect().width) : 0 };
  });
  check('önizləmə üfüqi daşmır', olcu.scroll <= olcu.client + 1, olcu);
  check('vərəq iframe-in eninə sığır', olcu.paper > 0 && olcu.paper <= olcu.client, olcu);

  /* ÜSLUB HƏQİQƏTƏN YÜKLƏNİR. `asset()` linki `APP_URL`-dən qurur; o,
     `localhost:8000` yazılıbsa və idarəçi `127.0.0.1`-də işləyirsə, iframe
     üslubu başqa mənbədən istəyir və vərəq qapqara görünür. Yollar ona görə
     kök-nisbidir; rəngi ölçmək bunu sübut edən yeganə yoldur. */
  const kagiz = await p.frameLocator('#qvOnizleme').locator('.paper')
    .evaluate(e => getComputedStyle(e).backgroundColor);
  check('vərəqin fonu açıqdır (üslub yükləndi)', kagiz === 'rgb(247, 248, 251)', kagiz);
  check('üslub yolları kök-nisbidir',
    (await p.locator('#qvOnizleme').getAttribute('data-uslub')).startsWith('/assets/'));

  /* Sənəd redaktoru panelin 1180px-lik enindən çıxır, yoxsa iki sütun
     bir-birini sıxır. */
  const sagEn = await p.locator('#qvOnizleme').evaluate(e => e.getBoundingClientRect().width);
  check('önizləmə sütunu kifayət qədər genişdir', sagEn >= 480, sagEn);
  check('səhifə üfüqi daşmır',
    await p.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1));

  /* ALƏT PANELİ. İşarələri əl ilə yazmaq idarəçidən sintaksis əzbərləməyi
     tələb edirdi; düymə seçilmiş sözü bürüyür, seçim yoxdursa nümunə qoyub
     onu seçili saxlayır. */
  check('alət paneli var', await p.locator('.qv-alet .qv-a').count() >= 8);

  await p.fill('#qvBody', 'salam dünya');
  await p.locator('#qvBody').evaluate(t => t.setSelectionRange(6, 11));
  await p.locator('.qv-a[data-bur="**"]').click();
  check('düymə seçilmiş sözü bürüyür', (await p.inputValue('#qvBody')) === 'salam **dünya**');

  await p.fill('#qvBody', '');
  await p.locator('#qvBody').evaluate(t => t.setSelectionRange(0, 0));
  await p.locator('.qv-a[data-bur="[[|]]"]').click();
  check('seçimsiz düymə nümunə qoyur', (await p.inputValue('#qvBody')).startsWith('[['));
  check('nümunə seçili qalır',
    await p.locator('#qvBody').evaluate(t => t.selectionEnd > t.selectionStart));

  /* İngiliscə açarlar idarəçiyə göstərilmir. */
  const blankAd = await p.locator('select[name="blank_nov"] option:checked').innerText();
  check('blank növü öz adı ilə yazılır', blankAd.includes('Protokol'), blankAd);
  const kilidAd = await p.locator('select[name="lock_kind"] option:checked').innerText();
  check('kilid növü öz adı ilə yazılır', kilidAd.includes('Rəqəm'), kilidAd);

  await p.fill('#qvBody', ilkMetn);
  await p.click('#senedForm button[type="submit"]');
  await p.waitForLoadState('networkidle');
  check('sənəd yadda saxlanıldı', p.url().includes('/sened/'), p.url());
  const senedUrl = p.url();

  bas('6. Şəkil yükləməsi');
  /* `prompt()` brauzer dialoqudur və avtomatlaşdırmada bloklayır — cavabları
     qabaqcadan veririk. Dinləyici BİR DƏFƏ qurulur və növbədən oxuyur: iki ayrı
     dinləyici eyni dialoqu iki dəfə qəbul etməyə çalışar və Playwright imtina edər. */
  await p.setInputFiles('#qvFayl', { name: 'Kamera 01.png', mimeType: 'image/png', buffer: PNG });
  await p.waitForTimeout(700);

  check('yükləmə forması açılır', !(await p.locator('#qvYukleForm').isHidden()));
  check('açar fayl adından təklif olunur', (await p.inputValue('#qvYfSlug')) === 'kamera-01');
  check('şəklin önizləməsi göstərilir',
    ((await p.locator('#qvYfOn').getAttribute('src')) || '').startsWith('data:image'));
  check('görkəm öz adı ilə seçilir',
    (await p.locator('.qv-nov-k', { hasText: 'Kamera kadrı' }).count()) === 1);

  await p.fill('#qvYfSlug', 'kamera-01');
  await p.fill('#qvYfIzah', '00:47, giriş qapısı');
  await p.locator('.qv-nov-k', { hasText: 'Kamera kadrı' }).click();
  await p.click('#qvYfOk');
  await p.waitForTimeout(1800);

  check('forma yüklədikdən sonra bağlanır', await p.locator('#qvYukleForm').isHidden());

  check('şəkil kitabxanaya düşdü', await p.locator('.qv-sekil').count() >= 1);
  const metn = await p.inputValue('#qvBody');
  check('nişan mətnə yapışdırıldı', metn.includes('{{ sekil:kamera-01 }}'), metn);

  await p.waitForTimeout(1200);
  const onizleme2 = await varaq(p);
  check('önizləmədə şəkil görünür', onizleme2.includes('p-sekil-kamera'), onizleme2.slice(0, 200));
  check('şəkil linki marşrutdur', /\/is\/2099-0001\/sekil\/\d+\/orta/.test(onizleme2));

  /* Çatışmayan nişan: oyunçuda boş, adminde qırmızı. */
  await p.fill('#qvBody', metn + '\n\n{{ sekil:olmayan-acar }}');
  await p.waitForTimeout(1200);
  check('çatışmayan nişan adminde görünür', (await varaq(p)).includes('p-xeta'));

  await p.fill('#qvBody', metn);
  await p.click('#senedForm button[type="submit"]');
  await p.waitForLoadState('networkidle');

  bas('6b. Maddi sübutlar');
  /* Bölmə TAM ÖZ işimiz üzərində gedir: seed qovluqlarına toxunsaydıq, hər
     çalışma onların kitabxanasına bir şəkil əlavə edərdi və slug `-2`, `-3`
     ilə böyüyərdi. */
  /* Bölmə 5 mətn yazmışdı, yəni sənəd MƏTN rejimindədir. Blok rejimini
     ayrıca yoxlayırıq, ona görə mətn müvəqqəti boşaldılır. */
  await p.fill('#qvBody', '');
  await p.click('#senedForm button[type="submit"]');
  await p.waitForLoadState('networkidle');

  check('sübut bloku olmayan sənəddə siyahı yoxdur', await p.locator('.qv-sub').count() === 0);
  check('blok əlavə etmə seçimi var', await p.locator('input[name="kart_blok"]').count() === 1);

  await p.check('input[name="kart_blok"]');
  await p.click('#senedForm button[type="submit"]');
  await p.waitForLoadState('networkidle');

  check('sübut siyahısı yaradıldı', await p.locator('.qv-sub').count() === 1);
  check('yeni siyahı boş sətirlə açılır', await p.locator('.qv-sub-yeni').count() === 1);

  /* Boş sətrə ad yazmaq sübutu yaradır — ayrıca «əlavə et» düyməsi yoxdur. */
  await p.locator('.qv-sub-yeni input[name$="[ad]"]').fill('Mərmər xatirə lövhəsi');
  await p.locator('.qv-sub-yeni textarea').fill('Ölçü 24×16×3 sm. Bir küncündə qan izi.');
  await p.click('#senedForm button[type="submit"]');
  await p.waitForLoadState('networkidle');
  check('sübut yaradıldı', await p.locator('.qv-sub').count() === 2);

  await p.waitForTimeout(1800);
  const kadr = p.frameLocator('#qvOnizleme');
  check('vərəqdə sübut göründü', (await kadr.locator('.ev-t').innerText()).includes('Mərmər'));
  /* ŞƏKİL YERİ HƏMİŞƏ VAR — foto olmasa da. Real protokolda əşyanın fotosu
     üçün yer əvvəlcədən ayrılır; sonradan açılsaydı, şəkil gələndə vərəqin
     quruluşu dəyişərdi. */
  check('fotosuz sübutda çərçivə qalır', await kadr.locator('.ev-foto').count() === 1);
  check('boş çərçivə yazısı var', await kadr.locator('.ev-foto-bos').count() === 1);

  /* Sətirdən birbaşa yükləmə: şəkil kitabxanaya düşür VƏ həmin sübuta bağlanır. */
  await p.locator('.qv-sub').first().locator('input[type="file"]')
    .setInputFiles({ name: 'Mermer lovhe.png', mimeType: 'image/png', buffer: PNG });
  await p.waitForTimeout(700);
  /* Sətirdən açılanda görkəm «Foto» gəlir: maddi sübutun şəkli adətən odur. */
  check('sətirdən yükləmədə görkəm «Foto» seçilir',
    (await p.locator('input[name="qvYfNov"]:checked').inputValue()) === 'photo');
  await p.fill('#qvYfSlug', 'merm-lovhe');
  await p.fill('#qvYfIzah', 'Mərmər lövhə, 24×16×3 sm');
  await p.click('#qvYfOk');
  await p.waitForTimeout(2200);

  check('yüklənən şəkil sübuta bağlandı',
    (await p.locator('.qv-sub').first().locator('.qv-sub-sek').inputValue()) === 'merm-lovhe');
  check('sətrin önizləməsi doldu', await p.locator('.qv-sub').first().locator('.qv-sub-on img').count() === 1);
  check('açar boş sətrin siyahısına da düşdü',
    await p.locator('.qv-sub-yeni .qv-sub-sek option[value="merm-lovhe"]').count() === 1);

  await p.waitForTimeout(1600);
  check('vərəqdə şəkil dərhal göründü', await kadr.locator('.ev-foto img').count() === 1);
  check('boş çərçivə qalmadı', await kadr.locator('.ev-foto-bos').count() === 0);

  /* Foto sənədə YAPIŞDIRILMIŞ çap kimi görünür: iki lent yuxarı künclərdə,
     möhür isə aşağı sağda — yarısı fotoda, yarısı vərəqdə. Möhürün orada
     oturması təsadüfi deyil: real qovluqda o, fotonun sənədə aid olduğunu
     təsdiq edir və fotonu dəyişdirmək möhürü də pozmadan mümkün olmasın. */
  check('foto lentlə vurulub', await kadr.locator('.ev-skoc').count() === 2);
  check('fotoda möhür var', await kadr.locator('.ev-foto-m').count() === 1);
  /* QIRMIZI: vərəqin masthead möhürü mordur (`--stamp`), maddi sübut möhürü
     isə əşyanın üstünə vurulur və rəngi ilə ondan ayrılmalıdır. */
  check('möhür qırmızıdır',
    (await kadr.locator('.ev-foto-m').evaluate(e => getComputedStyle(e).color)) === 'rgb(138, 42, 42)',
    await kadr.locator('.ev-foto-m').evaluate(e => getComputedStyle(e).color));
  const mohur = await kadr.locator('.ev-foto-m').boundingBox();
  const cap = await kadr.locator('.ev-foto-k').boundingBox();
  check('möhür fotonun sərhədində oturur',
    mohur.y < cap.y + cap.height && mohur.y + mohur.height > cap.y + cap.height,
    { mohur: Math.round(mohur.y), cap: Math.round(cap.y + cap.height) });
  check('fotosuz sətirdə lent və möhür yoxdur',
    await kadr.locator('.ev-foto:not(.ev-foto-var) .ev-skoc').count() === 0);

  await p.click('#senedForm button[type="submit"]');
  await p.waitForLoadState('networkidle');
  check('şəkil yadda saxlanıldı',
    (await p.locator('.qv-sub').first().locator('.qv-sub-sek').inputValue()) === 'merm-lovhe');

  /* Adı boşaldılmış sətir silinir. */
  await p.locator('.qv-sub').first().locator('input[name$="[ad]"]').fill('');
  await p.click('#senedForm button[type="submit"]');
  await p.waitForLoadState('networkidle');
  check('adsız sətir silindi', await p.locator('.qv-sub').count() === 1);

  /* Sübut bloku mətn rejimində nişanla da çağırılır. */
  await p.locator('.qv-sub-yeni input[name$="[ad]"]').fill('Kod kilidli metal qutu');
  /* Mətn rejiminə keçəndə blok NİŞANSIZ görünmür — redaktor bunu deməlidir,
     yoxsa sübut siyahısı səssizcə itər. */
  await p.fill('#qvBody', 'Baxış zamanı aşağıdakılar götürülmüşdür.');
  await p.click('#senedForm button[type="submit"]');
  await p.waitForLoadState('networkidle');
  check('nişansız mətn rejimi xəbərdarlıq verir', await p.locator('.qv-nisan-yap').count() === 1);

  await p.click('.qv-nisan-yap');
  check('düymə nişanı mətnə yapışdırır',
    (await p.inputValue('#qvBody')).includes('{{ blok:subutlar }}'));

  await p.click('#senedForm button[type="submit"]');
  await p.waitForLoadState('networkidle');
  check('nişan yazılandan sonra xəbərdarlıq itir', await p.locator('.qv-nisan-yap').count() === 0);
  await p.waitForTimeout(1800);
  check('mətn rejimində nişan blokun yerini açır',
    (await kadr.locator('.ev-t').innerText()).includes('metal qutu'));
  check('nişan xəta vermir', await kadr.locator('.p-xeta').count() === 0);

  /* Sənədin mətni bölmə 5-dəki hala QAYTARILIR: 11 və 12-ci bölmələr
     qaralama məntiqini məhz həmin mətn üzərində yoxlayır. Sübut siyahısı
     nişanı ilə birlikdə qalır — yəni mətn və bloklar bir vərəqdə yan-yana
     işlədiyi də sınanmış olur. */
  await p.fill('#qvBody', ilkMetn + '\n\n{{ blok:subutlar }}');
  await p.click('#senedForm button[type="submit"]');
  await p.waitForLoadState('networkidle');
  await p.waitForTimeout(1600);
  check('mətn və sübutlar bir vərəqdə yaşayır',
    (await varaq(p)).includes('<b>qapı açıq idi</b>') && await kadr.locator('.ev-t').count() === 1);

  bas('7. İkinci sənəd və sıralama');
  await p.goto(BASE + '/admin/qovluqlar/' + isId + '/sened');
  await p.fill('input[name="name"]', 'Ekspertiza rəyi');
  await p.fill('input[name="page"]', '2');
  await p.fill('#qvBody', 'Nəticə: sayğac 69 və 18 rəqəmlərini göstərir.');
  await p.click('#senedForm button[type="submit"]');
  await p.waitForLoadState('networkidle');

  await p.goto(isUrl);
  await p.click('.qv-tab[data-tab="senedler"]');
  check('iki sənəd siyahıdadır', await p.locator('#qvSenedler .qv-row').count() === 2);

  bas('8. Kod');
  await p.fill('#kodYeni ~ * input[form="kodYeni"][name="code"], input[form="kodYeni"][name="code"]', '6918');
  await p.fill('input[form="kodYeni"][name="label"]', 'Birinci kod');
  const senedIdler = await p.locator('#qvSenedler .qv-row').evaluateAll(els => els.map(e => e.getAttribute('data-id')));
  await p.selectOption('select[form="kodYeni"]', [senedIdler[1]]);
  await p.click('button[form="kodYeni"]');
  await p.waitForLoadState('networkidle');
  check('kod əlavə olundu', (await p.locator('input[name="code"]').first().inputValue()) === '6918');

  bas('9. Şübhəli və sonluq');
  await p.click('.qv-tab[data-tab="subheliler"]');
  await p.fill('.qv-panel[data-panel="subheliler"] form:last-of-type input[name="name"]', 'Aygün Məmmədova');
  await p.fill('.qv-panel[data-panel="subheliler"] form:last-of-type input[name="role"]', 'Qonşu, mənzil 34');
  await p.click('.qv-panel[data-panel="subheliler"] form:last-of-type button[type="submit"]');
  await p.waitForLoadState('networkidle');

  await p.click('.qv-tab[data-tab="subheliler"]');
  await p.fill('.qv-panel[data-panel="subheliler"] form:last-of-type input[name="name"]', 'Rəşad Quliyev');
  await p.click('.qv-panel[data-panel="subheliler"] form:last-of-type button[type="submit"]');
  await p.waitForLoadState('networkidle');

  await p.click('.qv-tab[data-tab="subheliler"]');
  const kartlar = p.locator('.qv-panel[data-panel="subheliler"] .qv-kart');
  check('iki şübhəli var', await kartlar.count() >= 2);
  await kartlar.first().locator('input[name="is_culprit"]').check();
  await kartlar.first().locator('button:has-text("Saxla")').click();
  await p.waitForLoadState('networkidle');

  await p.click('.qv-tab[data-tab="cavab"]');
  const sonluqlar = p.locator('.qv-panel[data-panel="cavab"] .qv-kart').filter({ hasText: 'Hökm mətni' });
  check('hər şübhəli üçün sonluq forması var', await sonluqlar.count() === 2);

  await sonluqlar.nth(0).locator('textarea[name="verdict_text"]').fill('Doğru qərar. İttiham irəli sürülür.');
  await sonluqlar.nth(0).locator('textarea[name="reveal_text"]').fill('Hər şey belə oldu.\n\nSon.');
  await sonluqlar.nth(0).locator('input[name="is_true_ending"]').check();
  await sonluqlar.nth(0).locator('button[type="submit"]').click();
  await p.waitForLoadState('networkidle');

  await p.click('.qv-tab[data-tab="cavab"]');
  const s2 = p.locator('.qv-panel[data-panel="cavab"] .qv-kart').filter({ hasText: 'Hökm mətni' }).nth(1);
  await s2.locator('textarea[name="verdict_text"]').fill('Yanlış qərar. Sübutlar uyğun gəlmir.');
  await s2.locator('input[name="sting_line"]').fill('Amma o gecə kimsə pəncərəni içəridən bağlamışdı.');
  await s2.locator('button[type="submit"]').click();
  await p.waitForLoadState('networkidle');

  bas('10. Yoxlayıcı təmizdir və iş dərc olunur');
  const xeta2 = await p.locator('.qv-xeta').allTextContents();
  check('xəta qalmadı', xeta2.length === 0, xeta2);

  await p.click('.qv-tab[data-tab="umumi"]');
  await p.selectOption('select[name="status"]', 'published');
  await p.click('.qv-panel[data-panel="umumi"] button[type="submit"]');
  await p.waitForLoadState('networkidle');
  check('iş dərc olundu', (await p.locator('select[name="status"]').inputValue()) === 'published');

  bas('11. Qaralama məntiqi');
  await p.goto(senedUrl);
  await p.fill('#qvBody', 'YENİ MƏTN — hələ dərc olunmayıb.');
  await p.click('#senedForm button[type="submit"]');
  await p.waitForLoadState('networkidle');
  check('qaralama xəbərdarlığı çıxır', await p.locator('.qv-qeyd').count() > 0);

  await p.goto(isUrl);
  await p.click('.qv-tab[data-tab="senedler"]');
  /* Seçici SİYAHI ilə məhdudlaşır: tabın izah sətrində nişanların nümunəsi
     də var və o, sayğaca düşməməlidir. */
  check('siyahıda sarı qaralama nişanı var', await p.locator('#qvSenedler .qv-qaralama').count() === 1);
  const qeydler = await p.locator('.qv-qeyd').allTextContents();
  check('yoxlayıcı qaralamanı qeyd edir', qeydler.some(q => q.includes('qaralama')), qeydler);

  bas('12. Oyunçu köhnə mətni görür');
  const oyunCtx = await browser.newContext({ viewport: { width: 412, height: 900 } });
  const o = await oyunCtx.newPage();
  await o.goto(BASE + '/is/' + SLUG + '/qovluq');
  await o.fill('#who', 'Sınaqçı');
  await o.click('#openBtn');
  await o.waitForSelector('#s-index.on');

  await o.locator('.docrow').first().click();
  await o.waitForSelector('#s-doc.on');
  await o.waitForFunction(() => !document.querySelector('#s-doc').textContent.includes('Açılır'));
  const govde = await o.locator('#s-doc').innerText();
  check('oyunçu köhnə mətni görür', govde.includes('qapı açıq idi'), govde.slice(0, 140));
  check('oyunçu qaralamanı görmür', !govde.includes('YENİ MƏTN'));

  bas('13. Qaralamanı dərc et');
  await p.click('form[action$="/derc"] button, button[type="submit"]:has-text("Bütün dəyişiklikləri dərc et")');
  await p.waitForLoadState('networkidle');
  check('qaralama nişanı yox oldu', await p.locator('#qvSenedler .qv-qaralama').count() === 0);

  const o2 = await oyunCtx.newPage();
  await o2.goto(BASE + '/is/' + SLUG + '/qovluq');
  await o2.waitForSelector('#s-index.on');
  await o2.locator('.docrow').first().click();
  await o2.waitForSelector('#s-doc.on');
  await o2.waitForFunction(() => !document.querySelector('#s-doc').textContent.includes('Açılır'));
  check('dərcdən sonra yeni mətn görünür', (await o2.locator('#s-doc').innerText()).includes('YENİ MƏTN'));

  bas('14. Sonluq rejimi');
  await o2.click('.tab[data-go="index"]', { force: true });
  await o2.waitForSelector('#s-index.on');
  await o2.locator('.docrow').nth(1).click();
  await o2.waitForSelector('#s-doc.on');
  await o2.waitForFunction(() => !document.querySelector('#s-doc').textContent.includes('Açılır'));
  await o2.click('.tab[data-go="answer"]', { force: true });
  await o2.waitForSelector('#s-answer.on');

  check('yekun ekranı sonluq rejimindədir', await o2.locator('#s-answer.sonluq').count() === 1);
  check('üç suallıq forma gizlidir', !(await o2.locator('#submit').isVisible()));
  check('şübhəli düymələri göstərilir', await o2.locator('.end-s').count() === 2);

  await o2.locator('.end-s').nth(1).click();
  await o2.waitForSelector('#s-result.on');
  const netice = await o2.locator('#res').innerText();
  check('yanlış sonluq hökmü çıxır', netice.includes('Sübutlar uyğun gəlmir'), netice.slice(0, 120));
  check('yanlış sonluqda açılış verilmir', !netice.includes('Hər şey belə oldu'));
  check('yanlış sonluqda sertifikat yoxdur', await o2.locator('#cert').count() === 0);
  check('sancı sətri hələ gizlidir', !(await o2.locator('#sting').isVisible()));

  await o2.waitForTimeout(3400);
  check('sancı sətri üç saniyədən sonra çıxır', await o2.locator('#sting').isVisible());
  check('sancı mətni düzgündür', (await o2.locator('#sting').innerText()).includes('pəncərəni içəridən'));

  bas('15. Yenidən oyna və doğru sonluq');
  await o2.click('#yeniden');
  await o2.waitForSelector('#s-answer.on');
  check('şübhəli seçimi yenidən açılır', await o2.locator('.end-s').count() === 2);

  await o2.locator('.end-s').nth(0).click();
  await o2.waitForSelector('#s-result.on');
  const netice2 = await o2.locator('#res').innerText();
  check('doğru sonluq hökmü çıxır', netice2.includes('İttiham irəli sürülür'));
  check('doğru sonluqda açılış verilir', netice2.includes('Hər şey belə oldu'));
  check('doğru sonluqda sertifikat var', await o2.locator('#cert').count() === 1);
  check('sertifikatda fiktivlik qeydi var', netice2.includes('FİKTİV OYUN SƏNƏDİ'));
  check('sertifikatda qatilin adı yoxdur', !netice2.includes('Aygün Məmmədova') || !(await o2.locator('#cert').innerText()).includes('Aygün'));

  bas('16. Sirr sızmır');
  const html = await o2.content();
  check('kod HTML-də yoxdur', !html.includes('6918'));
  check('qatil bayrağı HTML-də yoxdur', !html.includes('is_culprit'));

  const kilidsiz = await ctx.newPage();
  const cavab = await kilidsiz.goto(BASE + '/is/' + SLUG + '/qovluq');
  check('oyun səhifəsi noindex-dir', (cavab.headers()['x-robots-tag'] || '').includes('noindex'));

  bas('17. Dublikat');
  await p.goto(BASE + '/admin/qovluqlar');
  const evvelSay = await p.locator('table.tbl tbody tr').count();
  await p.locator('tr', { hasText: 'Sınaq işi' }).first().locator('button:has-text("Dublikat")').click();
  await p.waitForLoadState('networkidle');
  check('nüsxə yaradıldı', (await p.locator('input[name="title"]').inputValue()).includes('(nüsxə)'));
  check('nüsxə qaralamadır', (await p.locator('select[name="status"]').inputValue()) === 'draft');
  await p.click('.qv-tab[data-tab="senedler"]');
  check('nüsxədə sənədlər var', await p.locator('#qvSenedler .qv-row').count() === 2);

  bas('18. Təmizlik');
  check('sınaq işləri təmizləndi', await temizle(p, BASE));
  check('heç bir brauzer dialoqu açılmadı', dialoqSayi === 0, dialoqSayi);

  await browser.close();
  console.log('\n' + pass + ' keçdi, ' + fail + ' uğursuz');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
