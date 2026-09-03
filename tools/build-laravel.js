/* Frontend fayllarını Laravel layihəsinə köçürür və spa.blade.php yaradır. */
const fs = require('fs'), path = require('path'), crypto = require('crypto');

const FE   = path.join(__dirname, '..', 'frontend');
const APP  = path.join(__dirname, '..', 'backend-php');
const OUT  = path.join(APP, 'public', 'assets');
const VIEW = path.join(APP, 'resources', 'views', 'spa.blade.php');
const VIEW_VIEWER = path.join(APP, 'resources', 'views', 'viewer.blade.php');
const VIEW_DEVET  = path.join(APP, 'resources', 'views', 'devet.blade.php');
const VIEW_DEVET_V = path.join(APP, 'resources', 'views', 'devet-view.blade.php');

const ASSETS = ['site.css', 'panel.css', 'fonts.css', 'qr.js', 'templates.js', 'templates-xatire.js',
                 'replies.js', 'sosial.js', 'doc.js', 'export.js', 'app.js',
                 'viewer.css', 'viewer.js',
                 /* Dəvətnamə bölməsi — ayrı səhifə, ayrı stil, ayrı şrift dəsti.
                    export.js ortaqdır (kətandan PDF), qalanı bu bölməyə məxsusdur. */
                 'devet.css', 'devet-fonts.css', 'devet-designs.js', 'invite.js', 'devet-app.js',
                 'devet-view.css', 'devet-view.js', 'devet-panel.css', 'devet-board.js', 'zip.js',
                 /* İş qovluğu bölməsi — ayrı səhifə, ayrı stil, ayrı şrift dəsti.
                    export.js burada da ortaqdır (kətandan PNG/JPEG), qalanı bu
                    bölməyə məxsusdur. Qabıq əl ilə yazılmış Blade olduğu üçün
                    emitView() çağırışı yoxdur. */
                 'dossier.css', 'dossier-fonts.css', 'dossier-cert.js', 'dossier.js', 'dossier-site.js'];

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'fonts'), { recursive: true });

for (const f of ASSETS) fs.copyFileSync(path.join(FE, f), path.join(OUT, f));
for (const f of fs.readdirSync(path.join(FE, 'fonts'))) {
  fs.copyFileSync(path.join(FE, 'fonts', f), path.join(OUT, 'fonts', f));
}

/* İş qovluqlarının önizləmə şəkilləri `npm run render:dossier-og` ilə build
   vaxtı hazırlanır və git-ə düşür — deploy-da alət lazım deyil. */
const OG_DIR = path.join(FE, 'dossier-og');
if (fs.existsSync(OG_DIR)) {
  const dst = path.join(OUT, 'dossier-og');
  fs.mkdirSync(dst, { recursive: true });
  for (const f of fs.readdirSync(OG_DIR)) fs.copyFileSync(path.join(OG_DIR, f), path.join(dst, f));
}

/* Panel şablonları üçün ayrıca favicon faylı */
fs.writeFileSync(path.join(OUT, 'favicon.svg'),
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#0e2340"/>
  <circle cx="32" cy="32" r="21" fill="none" stroke="#c9d3e6" stroke-width="2"/>
  <text x="32" y="39" text-anchor="middle" font-family="Georgia,serif" font-size="19" font-weight="bold" fill="#fff">Z</text>
</svg>
`);

/* ---- Blade görünüşləri ---- */

/* Blade-in xüsusi simvolları HTML-də olmamalıdır, yoxsa səhv şərh olunar.
   `@` yoxlaması bütün fayla aiddir: bir dənə inline `@media print` belə
   build-i dayandırır — ona görə CSS ayrıca fayllarda qalmalıdır. */
function bladeSafe(html, name) {
  const hazards = [];
  if (/@[a-zA-Z]/.test(html)) hazards.push('"@direktiv" oxşarı ardıcıllıq');
  if (html.includes('{{')) hazards.push('"{{" ardıcıllığı');
  if (html.includes('{!!')) hazards.push('"{!!" ardıcıllığı');
  if (hazards.length) {
    console.error(`XƏTA: ${name} Blade tərəfindən səhv oxuna bilər →`, hazards.join(', '));
    process.exit(1);
  }
}

/* Asset yolları Laravel-in asset() köməkçisinə bağlanır və məzmun damğası alır.
   Damğa olmasa brauzer köhnə app.js/doc.js-i keşdən götürür və dəyişikliklər
   görünmür — `php artisan serve` statik fayllara keş başlığı göndərmir. */
function stamp(file) {
  const p = path.join(OUT, file);
  return crypto.createHash('sha1').update(fs.readFileSync(p)).digest('hex').slice(0, 8);
}

/* `</head>` əvəzləməsi FUNKSİYA ilə olmalıdır: OG bloku `$regNo` daşıyır və
   sətir variantında `$&`, `$'` xüsusi simvol kimi işlənərdi. */
function emitView(srcFile, outPath, extraHead) {
  let html = fs.readFileSync(path.join(FE, srcFile), 'utf8');
  bladeSafe(html, srcFile);
  html = html.replace(/(href|src)="\/([a-z0-9._-]+\.(?:css|js))"/g,
    (_, attr, file) => `${attr}="{{ asset('assets/${file}') }}?v=${stamp(file)}"`);
  html = html.replace('</head>', () => extraHead + '\n</head>');
  fs.writeFileSync(outPath, html);
  console.log('Görünüş :', outPath, `(${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
}

/* CSRF meta teqi — app.js və viewer.js POST sorğularında bu tokeni göndərir */
const CSRF = `<meta name="csrf-token" content="{{ csrf_token() }}">`;

/* Baxış səhifəsinin sosial önizləməsi. YALNIZ qeydiyyat nömrəsi işlədilir —
   kontroller sənədi sorğulamır, deməli naməlum nömrə yazan kənar adama
   məzmun sızmır və alıcının adı heç vaxt meta teqinə düşmür.
   `og:image` yoxdur: sənəd yalnız brauzerdə render olunur. */
const OG = [
  `<meta property="og:type" content="website">`,
  `<meta property="og:site_name" content="Zarafat Notariat Palatası">`,
  `<meta property="og:title" content="Zarafat Notariat Palatası — {{ $regNo }}">`,
  `<meta property="og:description" content="Qeyri-rəsmi, əyləncə məqsədli sənəd. Hüquqi qüvvəyə malik deyil.">`,
  `<meta property="og:url" content="{{ url()->current() }}">`,
  `<meta name="twitter:card" content="summary">`
].join('\n');

/* Qonağın gördüyü səhifənin sosial önizləməsi.
   Səhifə faylında <title> QƏSDƏN yoxdur — başlıq burada, serverdən gəlir.

   `og:image` var (dərc anında brauzerin göndərdiyi 1200×630 JPEG), amma
   ÜNVAN VƏ TELEFON nə şəkildə, nə də təsvirdə yoxdur: link önizləməsi
   hər söhbətdə görünür, məkan və nömrə isə yalnız dəvəti açan qonağa
   aiddir. Eyni qayda Invite::ogMeta() və invite.js drawOg()-də saxlanılır. */
const OG_DEVET = [
  `<title>{{ $og['title'] }}</title>`,
  `<meta name="description" content="{{ $og['description'] }}">`,
  `<meta property="og:type" content="website">`,
  `<meta property="og:title" content="{{ $og['title'] }}">`,
  `<meta property="og:description" content="{{ $og['description'] }}">`,
  `<meta property="og:url" content="{{ url()->current() }}">`,
  `@if($og['image'] !== '')`,
  `<meta property="og:image" content="{{ $og['image'] }}">`,
  `<meta property="og:image:width" content="1200">`,
  `<meta property="og:image:height" content="630">`,
  `<meta name="twitter:card" content="summary_large_image">`,
  `@else`,
  `<meta name="twitter:card" content="summary">`,
  `@endif`
].join('\n');

console.log('Assetlər:', OUT);
emitView('index.html', VIEW, CSRF);
emitView('viewer.html', VIEW_VIEWER, CSRF + '\n' + OG);
emitView('devet.html', VIEW_DEVET, CSRF);
emitView('devet-view.html', VIEW_DEVET_V, CSRF + '\n' + OG_DEVET);
