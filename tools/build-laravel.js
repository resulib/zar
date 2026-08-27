/* Frontend fayllarını Laravel layihəsinə köçürür və spa.blade.php yaradır. */
const fs = require('fs'), path = require('path');

const FE   = path.join(__dirname, '..', 'frontend');
const APP  = path.join(__dirname, '..', 'backend-php');
const OUT  = path.join(APP, 'public', 'assets');
const VIEW = path.join(APP, 'resources', 'views', 'spa.blade.php');

const ASSETS = ['site.css', 'panel.css', 'fonts.css', 'qr.js', 'templates.js', 'doc.js', 'app.js'];

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'fonts'), { recursive: true });

for (const f of ASSETS) fs.copyFileSync(path.join(FE, f), path.join(OUT, f));
for (const f of fs.readdirSync(path.join(FE, 'fonts'))) {
  fs.copyFileSync(path.join(FE, 'fonts', f), path.join(OUT, 'fonts', f));
}

/* Panel şablonları üçün ayrıca favicon faylı */
fs.writeFileSync(path.join(OUT, 'favicon.svg'),
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#0e2340"/>
  <circle cx="32" cy="32" r="21" fill="none" stroke="#c9d3e6" stroke-width="2"/>
  <text x="32" y="39" text-anchor="middle" font-family="Georgia,serif" font-size="19" font-weight="bold" fill="#fff">Z</text>
</svg>
`);

/* ---- spa.blade.php ---- */
let html = fs.readFileSync(path.join(FE, 'index.html'), 'utf8');

/* Blade-in xüsusi simvolları HTML-də olmamalıdır, yoxsa səhv şərh olunar */
const hazards = [];
if (/@[a-zA-Z]/.test(html)) hazards.push('"@direktiv" oxşarı ardıcıllıq');
if (html.includes('{{')) hazards.push('"{{" ardıcıllığı');
if (html.includes('{!!')) hazards.push('"{!!" ardıcıllığı');
if (hazards.length) {
  console.error('XƏTA: index.html Blade tərəfindən səhv oxuna bilər →', hazards.join(', '));
  process.exit(1);
}

/* Asset yolları Laravel-in asset() köməkçisinə bağlanır */
html = html.replace(/(href|src)="\/([a-z0-9._-]+\.(?:css|js))"/g,
  (_, attr, file) => `${attr}="{{ asset('assets/${file}') }}"`);

/* CSRF meta teqi — app.js POST sorğularında bu tokeni göndərir */
html = html.replace('</head>', `<meta name="csrf-token" content="{{ csrf_token() }}">\n</head>`);

fs.writeFileSync(VIEW, html);

console.log('Assetlər:', OUT);
console.log('Görünüş :', VIEW, `(${(fs.statSync(VIEW).size / 1024).toFixed(1)} KB)`);
