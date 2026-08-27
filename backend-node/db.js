/* SQLite qatı — sxem, miqrasiya və sorğular */
const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data', 'zarafat.db');
require('fs').mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY,
  credits     INTEGER NOT NULL DEFAULT 0,
  created_at  INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS documents (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  reg_no       TEXT NOT NULL UNIQUE,
  owner_id     TEXT NOT NULL,
  template_id  TEXT,
  title        TEXT NOT NULL,
  to_name      TEXT NOT NULL,
  from_name    TEXT NOT NULL,
  powers       TEXT,
  penalty      TEXT,
  preamble     TEXT,
  date_label   TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'draft',   -- draft | published | removed
  created_at   INTEGER NOT NULL,
  published_at INTEGER,
  views        INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_docs_owner  ON documents(owner_id);
CREATE INDEX IF NOT EXISTS idx_docs_status ON documents(status);

CREATE TABLE IF NOT EXISTS payments (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id     TEXT NOT NULL UNIQUE,
  user_id      TEXT NOT NULL,
  provider     TEXT NOT NULL,
  pack_id      TEXT NOT NULL,
  amount       REAL NOT NULL,
  currency     TEXT NOT NULL DEFAULT 'AZN',
  credits      INTEGER NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending', -- pending | paid | failed | refunded
  provider_ref TEXT,
  raw          TEXT,
  created_at   INTEGER NOT NULL,
  paid_at      INTEGER
);

CREATE TABLE IF NOT EXISTS reports (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  reg_no      TEXT NOT NULL,
  reporter_id TEXT,
  reason      TEXT,
  note        TEXT,
  status      TEXT NOT NULL DEFAULT 'open',     -- open | resolved | rejected
  created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_reports_reg ON reports(reg_no);
`);

/* köhnə bazalar üçün sadə miqrasiya */
(function migrate() {
  var have = db.prepare("PRAGMA table_info(documents)").all().map(function (c) { return c.name; });
  [['layout', "TEXT NOT NULL DEFAULT 'notarial'"],
   ['palette', "TEXT NOT NULL DEFAULT 'gold'"],
   ['labels', 'TEXT']].forEach(function (c) {
    if (have.indexOf(c[0]) < 0) db.exec('ALTER TABLE documents ADD COLUMN ' + c[0] + ' ' + c[1]);
  });
})();

/* ---------------- istifadəçi ---------------- */
const qUser = db.prepare('SELECT * FROM users WHERE id = ?');
const qUserIns = db.prepare('INSERT INTO users (id, credits, created_at) VALUES (?, 0, ?)');

function ensureUser(id) {
  let u = qUser.get(id);
  if (!u) { qUserIns.run(id, Date.now()); u = qUser.get(id); }
  return u;
}
function addCredits(userId, n) {
  db.prepare('UPDATE users SET credits = credits + ? WHERE id = ?').run(n, userId);
  return qUser.get(userId).credits;
}
const spendCredit = db.transaction(function (userId) {
  const r = db.prepare('UPDATE users SET credits = credits - 1 WHERE id = ? AND credits >= 1').run(userId);
  if (r.changes !== 1) throw new Error('no_credits');
});

/* ---------------- qeydiyyat nömrəsi ---------------- */
function newRegNo() {
  const year = new Date().getFullYear();
  for (let i = 0; i < 40; i++) {
    const n = 1000 + crypto.randomInt(9000);
    const reg = `ZRF-${year}-${n}`;
    if (!db.prepare('SELECT 1 FROM documents WHERE reg_no = ?').get(reg)) return reg;
  }
  throw new Error('reg_no_exhausted');
}

/* ---------------- sənədlər ---------------- */
function createDocument(ownerId, p) {
  const regNo = newRegNo();
  const now = Date.now();
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  const dateLabel = `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;

  db.prepare(`INSERT INTO documents
    (reg_no, owner_id, template_id, title, to_name, from_name, powers, penalty, preamble,
     date_label, layout, palette, labels, status, created_at)
    VALUES (@reg_no, @owner_id, @template_id, @title, @to_name, @from_name, @powers, @penalty, @preamble,
     @date_label, @layout, @palette, @labels, 'draft', @created_at)`)
    .run({
      reg_no: regNo, owner_id: ownerId, template_id: p.templateId || null,
      title: p.title, to_name: p.to, from_name: p.from,
      powers: p.powers || '', penalty: p.penalty || '', preamble: p.preamble || '',
      date_label: dateLabel, layout: p.layout, palette: p.palette,
      labels: p.labels ? JSON.stringify(p.labels) : null,
      created_at: now
    });

  return getByRegNo(regNo);
}

function getByRegNo(regNo) { return db.prepare('SELECT * FROM documents WHERE reg_no = ?').get(regNo); }
function getPublished(regNo) {
  return db.prepare("SELECT * FROM documents WHERE reg_no = ? AND status = 'published'").get(regNo);
}
function bumpViews(regNo) { db.prepare('UPDATE documents SET views = views + 1 WHERE reg_no = ?').run(regNo); }

const publishDocument = db.transaction(function (userId, regNo) {
  const doc = getByRegNo(regNo);
  if (!doc) throw new Error('not_found');
  if (doc.owner_id !== userId) throw new Error('forbidden');
  if (doc.status === 'removed') throw new Error('removed');
  if (doc.status === 'published') return doc;
  spendCredit(userId);
  db.prepare("UPDATE documents SET status = 'published', published_at = ? WHERE reg_no = ?").run(Date.now(), regNo);
  return getByRegNo(regNo);
});

function listByOwner(ownerId) {
  return db.prepare("SELECT * FROM documents WHERE owner_id = ? AND status != 'removed' ORDER BY created_at DESC LIMIT 60").all(ownerId);
}
function removeDocument(regNo) {
  db.prepare("UPDATE documents SET status = 'removed' WHERE reg_no = ?").run(regNo);
}

/* ---------------- ödənişlər ---------------- */
function createPayment(p) {
  db.prepare(`INSERT INTO payments (order_id, user_id, provider, pack_id, amount, credits, status, created_at)
              VALUES (@order_id, @user_id, @provider, @pack_id, @amount, @credits, 'pending', @created_at)`)
    .run({ ...p, created_at: Date.now() });
  return db.prepare('SELECT * FROM payments WHERE order_id = ?').get(p.order_id);
}
function getPayment(orderId) { return db.prepare('SELECT * FROM payments WHERE order_id = ?').get(orderId); }

/* İdempotent: eyni sifariş iki dəfə "paid" olsa da kredit bir dəfə yazılır */
const markPaid = db.transaction(function (orderId, providerRef, raw) {
  const r = db.prepare("UPDATE payments SET status='paid', provider_ref=?, raw=?, paid_at=? WHERE order_id=? AND status='pending'")
    .run(providerRef || null, raw ? JSON.stringify(raw) : null, Date.now(), orderId);
  if (r.changes !== 1) return null;                       // artıq işlənib
  const pay = getPayment(orderId);
  addCredits(pay.user_id, pay.credits);
  return pay;
});
function markFailed(orderId, raw) {
  db.prepare("UPDATE payments SET status='failed', raw=? WHERE order_id=? AND status='pending'")
    .run(raw ? JSON.stringify(raw) : null, orderId);
}

/* ---------------- şikayətlər ---------------- */
function addReport(regNo, reporterId, reason, note) {
  db.prepare('INSERT INTO reports (reg_no, reporter_id, reason, note, created_at) VALUES (?,?,?,?,?)')
    .run(regNo, reporterId, reason || null, note || null, Date.now());
}
function openReports() {
  return db.prepare("SELECT * FROM reports WHERE status='open' ORDER BY created_at DESC LIMIT 200").all();
}

module.exports = {
  db, ensureUser, addCredits, spendCredit,
  createDocument, getByRegNo, getPublished, bumpViews, publishDocument, listByOwner, removeDocument,
  createPayment, getPayment, markPaid, markFailed,
  addReport, openReports, newRegNo
};
