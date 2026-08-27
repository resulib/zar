/* ==================================================================
   Zarafat Notariat Palatası — Fastify + SQLite backend
   ================================================================== */
const path = require('path');
const crypto = require('crypto');
const Fastify = require('fastify');
const DB = require('./db');
const { PACKS, makeProvider } = require('./payments');

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
const PUBLIC_URL = (process.env.PUBLIC_URL || `http://localhost:${PORT}`).replace(/\/$/, '');
const FRONTEND_DIR = process.env.FRONTEND_DIR || path.join(__dirname, '..', 'frontend');

const provider = makeProvider();
const app = Fastify({ logger: { level: process.env.LOG_LEVEL || 'info' } });

/* ---------------- pluginlər ---------------- */
app.register(require('@fastify/cookie'), { secret: process.env.COOKIE_SECRET || crypto.randomBytes(24).toString('hex') });
app.register(require('@fastify/rate-limit'), { max: 240, timeWindow: '1 minute' });
app.register(require('@fastify/static'), { root: FRONTEND_DIR, prefix: '/' });

/* ---------------- anonim istifadəçi (cookie) ---------------- */
app.addHook('onRequest', async (req, reply) => {
  let uid = req.cookies && req.cookies.zrf_uid;
  if (!uid || !/^[a-f0-9]{32}$/.test(uid)) {
    uid = crypto.randomBytes(16).toString('hex');
    reply.setCookie('zrf_uid', uid, {
      path: '/', httpOnly: true, sameSite: 'lax',
      secure: PUBLIC_URL.startsWith('https'), maxAge: 60 * 60 * 24 * 365
    });
  }
  req.uid = uid;
  DB.ensureUser(uid);
});

/* ---------------- yardımçılar ---------------- */
const REG_RE = /^ZRF-\d{4}-\d{4}$/;
const clean = (s, max) => String(s == null ? '' : s).replace(/\s+/g, ' ').trim().slice(0, max);
const cleanMulti = (s, max) => String(s == null ? '' : s).replace(/[ \t]+/g, ' ').split('\n')
  .map(l => l.trim()).filter(Boolean).slice(0, 8).join('\n').slice(0, max);

/* Sadə moderasiya süzgəci — istehsalatda genişləndirin. */
let _bannedRaw = null, _banned = [];
function bannedWords() {
  if (process.env.BANNED_WORDS !== _bannedRaw) {          // env dəyişəndə yenilənir
    _bannedRaw = process.env.BANNED_WORDS;
    _banned = String(_bannedRaw || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  }
  return _banned;
}
function flagged(text) {
  const t = String(text || '').toLowerCase();
  return bannedWords().some(w => t.includes(w));
}

const LAYOUTS  = ['notarial', 'blank', 'diplom', 'sertifikat', 'lisenziya',
                  'arayis', 'qerar', 'muqavile', 'teleqram', 'vesiqe'];
const PALETTES = ['gold', 'steel', 'burgundy', 'forest', 'ink'];

function serialize(doc, { includeOwner = false } = {}) {
  let labels = {};
  try { labels = doc.labels ? JSON.parse(doc.labels) : {}; } catch (e) { labels = {}; }
  return {
    regNo: doc.reg_no,
    templateId: doc.template_id,
    layout: doc.layout || 'notarial',
    palette: doc.palette || 'gold',
    toLabel: labels.toLabel || null,
    fromLabel: labels.fromLabel || null,
    powersLabel: labels.powersLabel || null,
    penaltyLabel: labels.penaltyLabel || null,
    title: doc.title,
    to: doc.to_name,
    from: doc.from_name,
    powers: doc.powers,
    penalty: doc.penalty,
    preamble: doc.preamble,
    date: doc.date_label,
    paid: doc.status === 'published',
    verifyUrl: `${PUBLIC_URL}/r/${doc.reg_no}`,
    createdAt: doc.created_at,
    publishedAt: doc.published_at,
    ...(includeOwner ? { views: doc.views } : {})
  };
}

/* ================================================================
   API
   ================================================================ */
app.get('/api/health', async () => ({ ok: true, provider: provider.name, time: Date.now() }));

app.get('/api/me', async (req) => {
  const u = DB.ensureUser(req.uid);
  return { userId: u.id, credits: u.credits };
});

app.get('/api/me/documents', async (req) =>
  DB.listByOwner(req.uid).map(d => serialize(d, { includeOwner: true })));

app.get('/api/packs', async () => Object.values(PACKS));

/* ---- sənəd yaratma ---- */
app.post('/api/documents', {
  config: { rateLimit: { max: 20, timeWindow: '1 minute' } }
}, async (req, reply) => {
  const b = req.body || {};
  const labels = {};
  ['toLabel', 'fromLabel', 'powersLabel', 'penaltyLabel'].forEach(k => {
    const v = clean(b[k], 40);
    if (v) labels[k] = v;
  });
  const doc = {
    templateId: clean(b.templateId, 40),
    layout: LAYOUTS.includes(b.layout) ? b.layout : 'notarial',
    palette: PALETTES.includes(b.palette) ? b.palette : 'gold',
    labels: Object.keys(labels).length ? labels : null,
    title: clean(b.title, 70),
    to: clean(b.to, 42),
    from: clean(b.from, 42),
    powers: cleanMulti(b.powers, 600),
    penalty: clean(b.penalty, 300),
    preamble: clean(b.preamble, 700)
  };
  if (!doc.title || !doc.to || !doc.from) {
    return reply.code(400).send({ error: 'missing_fields', message: 'Ad, kimə və kimdən sahələri boş ola bilməz.' });
  }
  const all = [doc.title, doc.to, doc.from, doc.powers, doc.penalty].join(' ');
  if (flagged(all)) {
    return reply.code(422).send({ error: 'moderation', message: 'Mətndə qadağan olunmuş ifadə var.' });
  }
  const created = DB.createDocument(req.uid, doc);
  req.log.info({ regNo: created.reg_no }, 'sənəd yaradıldı');
  return serialize(created, { includeOwner: true });
});

/* ---- reyestrə yazma (1 kredit) ---- */
app.post('/api/documents/:regNo/publish', async (req, reply) => {
  const regNo = String(req.params.regNo || '').toUpperCase();
  if (!REG_RE.test(regNo)) return reply.code(400).send({ error: 'bad_reg_no' });
  try {
    const doc = DB.publishDocument(req.uid, regNo);
    return serialize(doc, { includeOwner: true });
  } catch (e) {
    const map = { no_credits: [402, 'Balans kifayət etmir.'], not_found: [404, 'Sənəd tapılmadı.'],
                  forbidden: [403, 'Bu sənəd sizə aid deyil.'], removed: [410, 'Sənəd silinib.'] };
    const [code, message] = map[e.message] || [500, 'Xəta baş verdi.'];
    return reply.code(code).send({ error: e.message, message });
  }
});

/* ---- reyestr axtarışı ---- */
app.get('/api/registry/:regNo', async (req, reply) => {
  const regNo = String(req.params.regNo || '').toUpperCase();
  if (!REG_RE.test(regNo)) return reply.code(400).send({ error: 'bad_reg_no' });
  const doc = DB.getPublished(regNo);
  if (!doc) return reply.code(404).send({ error: 'not_found' });
  DB.bumpViews(regNo);
  return serialize(doc);
});

/* ---- ödəniş: simulyasiya (MVP) ---- */
app.post('/api/payments/simulate', async (req, reply) => {
  if (process.env.ALLOW_SIMULATED_PAYMENTS === 'false') {
    return reply.code(403).send({ error: 'disabled', message: 'Simulyasiya söndürülüb.' });
  }
  const pack = PACKS[String((req.body || {}).packId)];
  if (!pack) return reply.code(400).send({ error: 'bad_pack' });
  const orderId = 'SIM-' + crypto.randomBytes(8).toString('hex');
  DB.createPayment({ order_id: orderId, user_id: req.uid, provider: 'simulation',
                     pack_id: pack.id, amount: pack.amount, credits: pack.credits });
  DB.markPaid(orderId, 'SIM', { simulated: true });
  const u = DB.ensureUser(req.uid);
  return { ok: true, simulated: true, orderId, credits: u.credits };
});

/* ---- ödəniş: real provider (Epoint və s.) ---- */
app.post('/api/payments/checkout', async (req, reply) => {
  const pack = PACKS[String((req.body || {}).packId)];
  if (!pack) return reply.code(400).send({ error: 'bad_pack' });
  const orderId = 'ZRF' + Date.now().toString(36).toUpperCase() + crypto.randomBytes(3).toString('hex').toUpperCase();
  DB.createPayment({ order_id: orderId, user_id: req.uid, provider: provider.name,
                     pack_id: pack.id, amount: pack.amount, credits: pack.credits });
  try {
    const r = await provider.createOrder({
      orderId, amount: pack.amount, currency: 'AZN',
      description: `Zarafat.az — ${pack.label}`,
      urls: {
        success: `${PUBLIC_URL}/?payment=success`,
        error: `${PUBLIC_URL}/?payment=error`,
        callback: `${PUBLIC_URL}/api/payments/callback`
      }
    });
    if (r.autoPaid) DB.markPaid(orderId, r.providerRef, { autoPaid: true });
    return { orderId, redirectUrl: r.redirectUrl, autoPaid: !!r.autoPaid };
  } catch (e) {
    DB.markFailed(orderId, { error: String(e.message) });
    req.log.error(e, 'ödəniş yaradıla bilmədi');
    return reply.code(502).send({ error: 'provider_error' });
  }
});

/* ---- provider callback (webhook) ---- */
app.post('/api/payments/callback', {
  config: { rateLimit: { max: 120, timeWindow: '1 minute' } }
}, async (req, reply) => {
  try {
    const r = await provider.parseCallback(req.body, req.headers);
    if (!r.orderId) return reply.code(400).send({ error: 'no_order' });
    if (r.status === 'paid') {
      const pay = DB.markPaid(r.orderId, r.providerRef, r.raw);
      req.log.info({ orderId: r.orderId, applied: !!pay }, 'ödəniş təsdiqləndi');
    } else {
      DB.markFailed(r.orderId, r.raw);
    }
    return { ok: true };
  } catch (e) {
    req.log.warn({ err: e.message }, 'callback rədd edildi');
    return reply.code(400).send({ error: 'bad_callback' });
  }
});

/* ---- şikayət / silmə ---- */
app.post('/api/reports', {
  config: { rateLimit: { max: 15, timeWindow: '1 minute' } }
}, async (req, reply) => {
  const b = req.body || {};
  const regNo = String(b.regNo || '').toUpperCase();
  if (!REG_RE.test(regNo)) return reply.code(400).send({ error: 'bad_reg_no' });
  const doc = DB.getByRegNo(regNo);
  if (!doc) return reply.code(404).send({ error: 'not_found' });

  // sahibi öz sənədini dərhal silə bilər
  if (doc.owner_id === req.uid) {
    DB.removeDocument(regNo);
    return { deleted: true };
  }
  DB.addReport(regNo, req.uid, clean(b.reason, 80), clean(b.note, 400));
  return { queued: true };
});

/* ---- sadə moderasiya paneli (token ilə) ---- */
app.get('/api/admin/reports', async (req, reply) => {
  const token = req.headers['x-admin-token'];
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) return reply.code(401).send({ error: 'unauthorized' });
  return DB.openReports();
});
app.post('/api/admin/documents/:regNo/remove', async (req, reply) => {
  const token = req.headers['x-admin-token'];
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) return reply.code(401).send({ error: 'unauthorized' });
  const regNo = String(req.params.regNo || '').toUpperCase();
  if (!REG_RE.test(regNo)) return reply.code(400).send({ error: 'bad_reg_no' });
  DB.removeDocument(regNo);
  return { removed: true };
});

/* ---- /r/ZRF-.... → SPA (QR kod bura düşür) ---- */
app.get('/r/:regNo', (req, reply) => reply.sendFile('index.html'));

/* ================================================================ */
if (require.main === module) {
  app.listen({ port: PORT, host: HOST })
    .then(() => app.log.info(`Zarafat backend hazırdır → ${PUBLIC_URL} (ödəniş: ${provider.name})`))
    .catch(err => { app.log.error(err); process.exit(1); });
}

module.exports = app;
