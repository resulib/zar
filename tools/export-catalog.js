/* Statik kataloqu (templates.js + templates-xatire.js) seeder üçün JSON-a çevirir.
   Baza əsas mənbədir; bu fayl yalnız ilkin doldurma («toxum») üçündür.

   İşlətmək:  node tools/export-catalog.js
   Nəticə:    backend-php/database/seeders/catalog.json */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT_DIR = path.join(__dirname, '..');

const sandbox = { window: {} };
vm.createContext(sandbox);
for (const f of ['templates.js', 'templates-xatire.js', 'replies.js'])
  vm.runInContext(fs.readFileSync(path.join(ROOT_DIR, 'frontend', f), 'utf8'), sandbox);

/* Cavab kataloqu ayrıca qlobal dəyişənlərdədir, amma BAZADA eyni iki cədvəldə
   yaşayır: fərq yalnız `categories.is_reply` və `templates.reply_kind`
   sütunlarındadır. Ona görə toxum faylında da eyni massivlərə qoşulur. */
const CATS = sandbox.window.CATEGORIES.concat(sandbox.window.REPLY_CATEGORIES || []);
const TPLS = sandbox.window.TEMPLATES.concat(sandbox.window.REPLIES || []);

/* Şablona xas qeydiyyat prefiksi — RegistryPrefix::MAP güzgüsü. */
const REG_PREFIX = {
  'cole-cixma-vizasi': 'CCV', 'hesab-davasi-qalibi': 'HDQ', 'gorduldu-arayisi': 'GRL',
  'bot-kimi-oynayir': 'BOT', 'immunitet-vesiqesi': 'QSM'
};

const out = {
  categories: CATS.map((c, i) => ({
    slug: c.id, tone: c.tone, name: c.name, icon: c.icon || null,
    blurb: c.blurb || '', sort: (i + 1) * 10, is_reply: !!c.isReply
  })),
  templates: TPLS.map((t, i) => ({
    slug: t.id, category: t.cat, tone: t.tone,
    layout: t.layout, palette: t.palette,
    title: t.title, tag: t.tag,
    preamble: t.preamble, powers: t.powers, penalty: t.penalty,
    to_label: t.toLabel || null, from_label: t.fromLabel || null,
    powers_label: t.powersLabel || null, penalty_label: t.penaltyLabel || null,
    reg_prefix: t.regPrefix || REG_PREFIX[t.id] || null,
    reply_kind: t.replyKind || null, reply_cats: t.replyCats || null,
    sign_title: t.signTitle || null, sign_org: t.signOrg || null, share: t.share || null,
    fields: t.fields || null, notes: t.notes || null, cancel_reasons: t.cancelReasons || null,
    /* İstifadəçi seçimləri — statik kataloqda hələ yoxdur, açarlar admin
       ixracının geri qayıtması üçün saxlanılır. */
    title_options: t.titleOptions || null, powers_options: t.powersOptions || null,
    powers_min: t.powersMin || 1, powers_max: t.powersMax || 4,
    penalty_options: t.penaltyOptions || null,
    sort: (i + 1) * 10
  }))
};

const dest = path.join(ROOT_DIR, 'backend-php', 'database', 'seeders', 'catalog.json');
fs.writeFileSync(dest, JSON.stringify(out, null, 2) + '\n');
console.log('Yazıldı: ' + dest);
const nrc = out.categories.filter(c => c.is_reply).length;
const nrt = out.templates.filter(t => t.reply_kind).length;
console.log(out.categories.length + ' kateqoriya · ' + out.templates.length + ' şablon');
console.log('  bunlardan cavab: ' + nrc + ' kateqoriya · ' + nrt + ' şablon');
