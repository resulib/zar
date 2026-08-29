/* Şablon mətninin üslub qaydaları.
   `tools/check-copy.js` bunları bütün kataloqa tətbiq edir; ayrıca fayldadır ki,
   əsas kataloq (`check-templates.js`) və cavab kataloqu (`check-replies.js`) üçün
   qaydalar bir yerdə saxlanılsın və ikiyə ayrılıb bir-birindən sürüşməsin.

   Qaydaların hamısı brief-in «QA — pis mətnləri tap» bölməsindən gəlir:
   emoji, danışıq dili, AI-yə bənzəyən təkrarlanan girişlər, əlaqəsiz sənəd növü,
   həddindən artıq qısa/uzun mətn. */

/* Emoji + digər piktoqrafik işarələr. Sənədin özünə düşən sahələrdə qadağandır;
   `share` istisnadır — o, sosial paylaşımın mətnidir, SVG-yə düşmür. */
const EMOJI_RE = /[←-⇿⌀-⏿■-➿⬀-⯿️\u{1F000}-\u{1FAFF}]/u;

/* Danışıq dili və internet-meme izləri. */
const SLANG = ['haha', 'hehe', 'lol', 'wtf', 'omg', ':)', ':(', '))', 'xaxa'];

/* Sənəd növü ↔ dizayn. `doc.js` növ sözünü DİZAYNA görə yazır (`Q Ə R A R`,
   `SERTİFİKAT`, `TELEQRAM` …), şablona görə yox — ona görə başlığın sonundakı
   söz şablonun öz dizaynı ilə uyğunlaşmalıdır. Hər kateqoriya 12 dizaynı düz
   bir dəfə işlətdiyinə görə bu, avtomatik olaraq 12 fərqli sənəd növü verir.

   Yalnız `zarafat` tonuna tətbiq olunur: xatirə sənədləri bürokratik növ
   lüğətinə deyil, öz səmimi adlarına («Etirafnamə», «Təbriknamə») bağlıdır. */
const DOC_TYPE = {
  notarial:   ['etibarnamə', 'etibarnaməsi', 'akt', 'aktı', 'vəkalətnamə', 'vəkalətnaməsi',
               'səlahiyyətnamə', 'səlahiyyətnaməsi'],
  blank:      ['ərizə', 'ərizəsi', 'bildiriş', 'bildirişi', 'müraciət', 'müraciəti',
               'bəyannamə', 'bəyannaməsi'],
  diplom:     ['diplom', 'diplomu', 'fərman', 'fərmanı', 'nişan', 'nişanı'],
  sertifikat: ['sertifikat', 'sertifikatı', 'şəhadətnamə', 'şəhadətnaməsi', 'sənəd', 'sənədi'],
  lisenziya:  ['lisenziya', 'lisenziyası', 'icazə', 'icazəsi', 'vəsiqə', 'vəsiqəsi'],
  arayis:     ['arayış', 'arayışı', 'məlumat', 'məlumatı'],
  qerar:      ['qərar', 'qərarı', 'qətnamə', 'qətnaməsi', 'bəraət', 'bəraəti', 'hökm', 'hökmü'],
  muqavile:   ['müqavilə', 'müqaviləsi', 'saziş', 'sazişi', 'protokol', 'protokolu',
               'öhdəlik', 'öhdəliyi'],
  teleqram:   ['teleqram', 'teleqramı', 'xəbərdarlıq', 'xəbərdarlığı', 'bildiriş', 'bildirişi'],
  vesiqe:     ['vəsiqə', 'vəsiqəsi', 'kart', 'kartı', 'şəhadətnamə', 'şəhadətnaməsi'],
  viza:       ['viza', 'vizası', 'icazə', 'icazəsi'],
  ekspertiza: ['rəy', 'rəyi', 'nəticə', 'nəticəsi', 'akt', 'aktı', 'protokol', 'protokolu']
};

/* Vizual hədəf aralıqları. Serverin sükutla kəsdiyi hədlərdən (700/600/300)
   xeyli dardır: `lisenziya` və `vesiqe` preamble-ı cəmi 3 sətir göstərir. */
const BAND = {
  title:       [55, 92],   /* aşağı hədd «rəsmi sənəd» hissi üçün, yuxarı — `diplom`/story sığması */
  preamble:    [180, 330],
  penalty:     [80, 230],
  powerLine:   88,         /* `diplom` və `lisenziya` hər bəndi TƏK sətirdə çəkir */
  orgPerCat:   3,          /* bir kateqoriyada ən çoxu üç uydurma qurum — «qurum ailəsi» */
  /* `viral` mövzu kateqoriyası deyil, vitrindir: hər şablonu ayrı bir viral
     ssenaridir (viza · süfrə hesabı · «görüldü» · oyun ekspertizası · toy sualları),
     ona görə hamısını bir qurum ailəsinə yığmaq mətnə ziyandır.
     Cavab kateqoriyalarında isə qurum niyyətin deyil, CAVAB VERİLƏN sənədin
     mövzusunun ailəsindəndir — `replyCats` hansı kateqoriyanı göstərirsə, qurum
     da odur. Oyun sənədinə cavabı oyun komissiyası verməlidir, «rədd komissiyası» yox. */
  orgFree:     ['viral', 'c-redd', 'c-etiraz', 'c-tekrar', 'c-legv', 'c-qebul', 'c-xatire'],
  openerRepeat: 2          /* eyni giriş formulu kateqoriyada ən çoxu iki dəfə */
};

/* Variant siyahılarının hədləri — `App\Support\TemplateSchema` güzgüsü. */
const OPT = {
  titleMax: 12, titleLen: 110,
  powersMax: 20, powersLen: 90,      /* TemplateSchema::MAX_POWER_LINE */
  penaltyMax: 10, penaltyLen: 300,
  pick: 4                            /* TemplateSchema::MAX_PICK */
};

/* Azərbaycan reqistri: `'İ'.toLowerCase()` iki kod nöqtəsi verir (i + U+0307),
   `'I'.toLowerCase()` isə `i` — hər ikisi səhvdir. Ona görə əvəzləmə
   toLowerCase()-DƏN ƏVVƏL aparılır, qalan birləşən nöqtə isə təmizlənir. */
const lower = s => String(s || '').replace(/İ/g, 'i').replace(/I/g, 'ı')
  .toLowerCase().replace(/\u0307/g, '');

/* Başlığın son sözü — «haqqında Qərar» → «qərar». */
function tailWord(title) {
  const w = String(title || '').trim().split(/\s+/);
  return lower(w[w.length - 1] || '').replace(/[«»"'.,;:!?()]/g, '');
}

/* Preamble-ın ilk beş sözü — eyni girişin təkrarını tutmaq üçün barmaq izi.
   Yer tutucular (`{to}` · `{{key}}`) silinir, onlardan qalan durğu işarələri də
   təmizlənir — əks halda «Mən, {to}, …» girişində barmaq izi boş vergüllərdən
   ibarət olur və mətnin özünü əks etdirmir. */
function opener(preamble) {
  return lower(preamble)
    .replace(/\{+[\w]*\}+/g, ' ')
    .replace(/[«»",;:.()]/g, ' ')
    .trim().split(/\s+/).filter(Boolean).slice(0, 5).join(' ');
}

/* ---------------- §9 üslub ---------------- */
function styleErrors(list) {
  const err = [];
  const byCat = {};

  list.forEach(t => {
    const id = t.id;
    const body = [t.title, t.preamble, t.powers, t.penalty].join('\n');

    if (EMOJI_RE.test(body)) err.push(id + ': sənəd mətnində emoji var');
    SLANG.forEach(s => {
      if (lower(body).indexOf(s) >= 0) err.push(id + ': danışıq dili — «' + s + '»');
    });

    if (t.tone === 'zarafat') {
      const ok = DOC_TYPE[t.layout] || [];
      if (ok.indexOf(tailWord(t.title)) < 0)
        err.push(id + ': başlıq «' + tailWord(t.title) + '» ilə bitir, ' + t.layout +
                 ' dizaynı üçün gözlənilən: ' + ok.slice(0, 3).join(' / '));
    }

    const tl = t.title.length;
    if (tl < BAND.title[0] || tl > BAND.title[1]) err.push(id + ': başlıq ' + tl + ' (hədəf ' + BAND.title.join('–') + ')');
    const pl = t.preamble.length;
    if (pl < BAND.preamble[0] || pl > BAND.preamble[1]) err.push(id + ': preamble ' + pl + ' (hədəf ' + BAND.preamble.join('–') + ')');
    const ql = t.penalty.length;
    if (ql < BAND.penalty[0] || ql > BAND.penalty[1]) err.push(id + ': cəza bəndi ' + ql + ' (hədəf ' + BAND.penalty.join('–') + ')');
    t.powers.split('\n').forEach((l, i) => {
      if (l.length > BAND.powerLine) err.push(id + ': ' + (i + 1) + '-ci bənd ' + l.length + ' simvol (≤' + BAND.powerLine + ')');
    });

    (byCat[t.cat] = byCat[t.cat] || []).push(t);
  });

  Object.keys(byCat).forEach(cat => {
    const items = byCat[cat];

    const orgs = {};
    items.forEach(t => { orgs[t.signOrg] = (orgs[t.signOrg] || 0) + 1; });
    const n = Object.keys(orgs).length;
    if (BAND.orgFree.indexOf(cat) < 0 && n > BAND.orgPerCat)
      err.push(cat + ': ' + n + ' fərqli qurum (ailə ən çoxu ' + BAND.orgPerCat + ' olmalıdır)');

    const ops = {};
    items.forEach(t => { const o = opener(t.preamble); (ops[o] = ops[o] || []).push(t.id); });
    Object.keys(ops).forEach(o => {
      if (ops[o].length > BAND.openerRepeat)
        err.push(cat + ': «' + o + '…» girişi ' + ops[o].length + ' dəfə — ' + ops[o].join(', '));
    });
  });

  const titles = {};
  list.forEach(t => { (titles[lower(t.title)] = titles[lower(t.title)] || []).push(t.id); });
  Object.keys(titles).forEach(k => {
    if (titles[k].length > 1) err.push('eyni başlıq: ' + titles[k].join(' = '));
  });

  return err;
}

/* ---------------- §10 variant siyahıları ---------------- */
function optionErrors(list) {
  const err = [];

  list.forEach(t => {
    const has = t.titleOptions || t.powersOptions || t.penaltyOptions;
    if (!has) return;

    if (t.fields)
      err.push(t.id + ': `fields` ilə variant siyahısı bir arada ola bilməz (templateSave() rədd edir)');

    const arr = (v, name, maxN, maxLen) => {
      if (v === undefined || v === null) return null;
      if (!Array.isArray(v) || !v.length) { err.push(t.id + ': ' + name + ' boş və ya massiv deyil'); return null; }
      if (v.length > maxN) err.push(t.id + ': ' + name + ' ' + v.length + ' variant (≤' + maxN + ')');
      v.forEach((o, i) => {
        if (typeof o !== 'string' || !o.trim()) err.push(t.id + ': ' + name + '[' + i + '] boşdur');
        else if (o.length > maxLen) err.push(t.id + ': ' + name + '[' + i + '] ' + o.length + ' simvol (≤' + maxLen + ')');
      });
      if (new Set(v).size !== v.length) err.push(t.id + ': ' + name + ' təkrarlanan variant daşıyır');
      return v;
    };

    arr(t.titleOptions, 'titleOptions', OPT.titleMax, OPT.titleLen);
    const po = arr(t.powersOptions, 'powersOptions', OPT.powersMax, OPT.powersLen);
    arr(t.penaltyOptions, 'penaltyOptions', OPT.penaltyMax, OPT.penaltyLen);

    if (po) {
      const ceil = Math.min(OPT.pick, po.length);
      const lo = t.powersMin, hi = t.powersMax;
      if (!(lo >= 1 && lo <= hi && hi <= ceil))
        err.push(t.id + ': powersMin/powersMax ' + lo + '/' + hi + ' — 1 ≤ min ≤ max ≤ ' + ceil + ' olmalıdır');
      /* Defolt seçim `powersMax` qədərdir (app.js renderPicks) — hər dizaynda
         görünən bənd sayı 4-dür, ona görə maksimum 4-dən aşağı düşməməlidir. */
      if (hi < OPT.pick && po.length >= OPT.pick)
        err.push(t.id + ': powersMax ' + hi + ' — variant kifayətdirsə ' + OPT.pick + ' olmalıdır');
      po.forEach((o, i) => {
        if (o.length > BAND.powerLine)
          err.push(t.id + ': powersOptions[' + i + '] ' + o.length + ' simvol — tək sətirlik dizaynlar üçün ≤' + BAND.powerLine);
      });
    }

    /* Defolt sənəd şablonun öz mətni olmalıdır: `renderPicks()` başlıq və cəza
       üçün siyahının BİRİNCİ variantını, bəndlər üçün isə ilk `powersMax` ədədini
       seçir. Uyğun gəlməsə, şablonu açan istifadəçi kataloqda gördüyündən fərqli
       sənəd görərdi. */
    if (t.titleOptions && t.titleOptions[0] !== t.title)
      err.push(t.id + ': titleOptions[0] şablonun öz başlığı olmalıdır');
    if (t.penaltyOptions && t.penaltyOptions[0] !== t.penalty)
      err.push(t.id + ': penaltyOptions[0] şablonun öz cəza bəndi olmalıdır');
    if (po && po.slice(0, t.powersMax || 4).join('\n') !== t.powers)
      err.push(t.id + ': ilk ' + (t.powersMax || 4) + ' powersOptions şablonun öz bəndləri olmalıdır');

    /* Off-list dəyər gəldikdə server şablonun ÖZ mətninə qayıdır
       (`Sanitizer::pickText`) — ona görə şablonun `title`/`powers`/`penalty`
       sahələri variant siyahısı ilə birlikdə də dolu qalmalıdır. */
    ['title', 'powers', 'penalty'].forEach(k => {
      if (!t[k] || !String(t[k]).trim()) err.push(t.id + ': variant siyahısı var, amma öz «' + k + '» mətni boşdur');
    });
  });

  return err;
}

module.exports = { EMOJI_RE, SLANG, DOC_TYPE, BAND, OPT, styleErrors, optionErrors, tailWord, opener };
