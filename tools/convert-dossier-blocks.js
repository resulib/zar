/* BİRDƏFƏLİK çevirici: sabit «növ» şablonlarından blok siyahısına.
   node tools/convert-dossier-blocks.js

   Sənəd artıq şablon deyil, blokların ardıcıllığıdır. Bu skript hər köhnə
   növü onun həqiqətən nədən ibarət olduğuna görə açır — məsələn `protokol`
   həmişə «blank + başlıq + sahələr + mətn + imza + qeyd» idi, sadəcə bunu
   heç kim yaza bilmirdi, çünki sıra şablonda bağlı qalmışdı.

   Çevrildikdən sonra bu fayl repoda tarixi qeyd kimi qalır: növbəti qovluq
   birbaşa bloklarla yazılacaq. */
const fs = require('fs'), path = require('path');

const SEED = path.join(__dirname, '..', 'backend-php', 'database', 'seeders', 'dossier');

/* Köhnə şablonların həqiqi tərkibi — `views/dossier/senedler/*.blade.php`
   fayllarından bir-bir oxunub. */
const SIRA = {
  qerar:    ['blank', 'basliq', 'metn', 'imza', 'qeyd'],
  protokol: ['blank', 'basliq', 'sahe', 'metn', 'imza', 'qeyd'],
  ekspert:  ['blank', 'basliq', 'sahe', 'metn', 'imza', 'qeyd'],
  sxem:     ['blank', 'basliq', 'sxem', 'qeyd'],
  subutlar: ['blank', 'basliq', 'kart', 'qeyd'],
  cedvel:   ['blank', 'basliq', 'cedvel', 'metn', 'imza', 'qeyd'],
  zengler:  ['blank', 'basliq', 'zeng', 'qeyd'],
  yazisma:  ['blank', 'basliq', 'yazisma', 'qeyd'],
  kilid:    ['blank', 'basliq', 'kart', 'qeyd'],
};

function blok(ad, c) {
  switch (ad) {
    case 'blank':
      return { tip: 'blank' };

    case 'basliq':
      if (!c.title) return null;
      return c.subtitle ? { tip: 'basliq', ad: c.title, alt: c.subtitle }
                        : { tip: 'basliq', ad: c.title };

    case 'sahe':
      return c.fields ? { tip: 'sahe', setirler: c.fields } : null;

    case 'metn':
      return c.body ? { tip: 'metn', abzaslar: c.body } : null;

    /* Qeyd qutusu ayrıca blok növü deyil — çərçivəli mətn blokudur. */
    case 'qeyd':
      return c.note ? { tip: 'metn', cerceve: true, abzaslar: [c.note] } : null;

    case 'imza':
      if (!c.sign) return null;
      return { tip: 'imza', vezife: c.sign.post || '', ad: c.sign.who || '', tarix: c.sign.date || '' };

    case 'cedvel': {
      const t = c.table || {};
      const b = { tip: 'cedvel', basliqlar: t.head || [], setirler: t.rows || [] };
      if (t.hi) b.vurgu = t.hi;
      if (t.foot) b.yekun = t.foot;
      return b;
    }

    case 'kart':
      if (!c.items) return null;
      return { tip: 'kart', kartlar: c.items.map(i => {
        const k = { ad: i.t, metn: i.d };
        if (i.pen) k.elyazma = true;
        return k;
      }) };

    case 'zeng':
      if (!c.calls) return null;
      /* Köhnə `line` «Çıxan — «Ad»» şəklində birləşik idi; blok onu ikiyə ayırır. */
      return { tip: 'zeng', zengler: c.calls.map(z => {
        const m = /^(Çıxan|Gələn|Mesaj)\s+—\s+(.*)$/.exec(z.line || '');
        const o = {
          saat: z.t || '',
          yon: m && m[1] === 'Çıxan' ? 'cixan' : 'gelen',
          abunec: m ? m[2] : (z.line || ''),
          muddet: z.sub || '',
        };
        if (z.hi) o.vurgu = true;
        return o;
      }) };

    case 'yazisma': {
      const ch = c.chat || {};
      const b = { tip: 'yazisma', sohbet: ch.name || '' };
      if (ch.seen) b.gorulme = ch.seen;
      b.gunler = (ch.days || []).map(d => ({
        tarix: d.label || '',
        mesajlar: (d.messages || []).map(m => {
          const o = { nov: m.kind === 'silinmis' ? 'silinmis' : (m.kind === 'sistem' ? 'sistem' : 'metn') };
          if (o.nov !== 'sistem') o.yon = m.yon === 'cixan' ? 'cixan' : 'gelen';
          if (o.nov !== 'silinmis') o.metn = m.text || '';
          if (m.time) o.saat = m.time;
          return o;
        }),
      }));
      if (c.cap) b.izah = c.cap;
      return b;
    }

    case 'sxem':
      return c.svg ? { tip: 'sxem', svg: c.svg } : null;

    default:
      return null;
  }
}

let sened = 0, qovluq = 0;

for (const f of fs.readdirSync(SEED).filter(x => x.endsWith('.json')).sort()) {
  const p = path.join(SEED, f);
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  let deyisdi = false;

  for (const doc of d.documents) {
    if (!doc.type || (doc.content && doc.content.bloklar)) continue;

    const c = doc.content || {};
    const sira = SIRA[doc.type];

    if (!sira) { console.error('  naməlum növ:', doc.type); continue; }

    const bloklar = sira.map(a => blok(a, c)).filter(Boolean);
    const yeni = { bloklar };

    /* Kilid növ olmaqdan XASSƏYƏ çevrilir: istənilən sənəd kilidli ola bilər. */
    if (doc.locked) {
      doc.kilid = { nov: 'reqem', kod: doc.code, ipucu: doc.hint };
      if (c.lockTitle) doc.kilid.basliq = c.lockTitle;
      if (c.lockSub) doc.kilid.alt = c.lockSub;
      delete doc.code;
      delete doc.hint;
    }

    doc.content = yeni;
    delete doc.type;
    sened++;
    deyisdi = true;
  }

  if (deyisdi) {
    fs.writeFileSync(p, JSON.stringify(d, null, 2) + '\n');
    qovluq++;
    console.log('  ' + f + ' — ' + d.documents.length + ' sənəd çevrildi');
  }
}

console.log('\n' + qovluq + ' qovluq · ' + sened + ' sənəd bloklara keçdi');
