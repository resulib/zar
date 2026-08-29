/* Tək fayllıq build: frontend/* → dist/zarafat-mvp.html */
const fs = require('fs'), path = require('path');
const FE = p => path.join(__dirname, 'frontend', p);
const F  = p => fs.readFileSync(FE(p), 'utf8');

let html = F('index.html');

/* şriftləri data URI kimi fonts.css-ə hopdur */
let fontsCss = F('fonts.css').replace(/url\(fonts\/([^)]+)\)/g, (_, f) => {
  const b64 = fs.readFileSync(FE(path.join('fonts', f))).toString('base64');
  return `url(data:font/woff2;base64,${b64})`;
});

/* DİQQƏT: əvəzləmə funksiya ilə olmalıdır — $$, $&, $' ardıcıllıqları
   sətir variantında xüsusi simvol kimi işlənir. */
html = html.replace(/<link rel="stylesheet" href="\/fonts\.css">/, () => '<style>\n' + fontsCss + '\n</style>');
html = html.replace(/<link rel="stylesheet" href="\/site\.css">/,  () => '<style>\n' + F('site.css') + '\n</style>');

['qr.js', 'templates.js', 'templates-xatire.js', 'replies.js', 'doc.js', 'export.js', 'app.js'].forEach(f => {
  html = html.replace(new RegExp('<script src="/' + f.replace('.', '\\.') + '"></script>'),
    () => '<script>\n' + F(f) + '\n</script>');
});

fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
const out = path.join(__dirname, 'dist', 'zarafat-mvp.html');
fs.writeFileSync(out, html);
console.log('Yazıldı:', out, (fs.statSync(out).size / 1024).toFixed(1) + ' KB');
