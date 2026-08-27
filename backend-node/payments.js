/* ==================================================================
   Provider-aqnostik ödəniş qatı.
   Hər provider eyni interfeysi verir:
     createOrder({orderId, amount, currency, description, urls}) -> {redirectUrl, providerRef}
     parseCallback(body, headers) -> {orderId, status:'paid'|'failed', providerRef, raw}
   Yeni provider əlavə etmək üçün yalnız bu faylda bir sinif yazmaq kifayətdir.
   ================================================================== */
const crypto = require('crypto');

/* ---------- Paketlər (tək mənbə: həm frontend, həm backend) ---------- */
const PACKS = {
  p1:  { id: 'p1',  credits: 1,  amount: 1, label: '1 sənəd' },
  p3:  { id: 'p3',  credits: 3,  amount: 2, label: '3 sənəd' },
  p10: { id: 'p10', credits: 10, amount: 5, label: '10 sənəd' }
};

/* ---------- 1. Simulyasiya (MVP / test) ---------- */
class SimulationProvider {
  constructor() { this.name = 'simulation'; }
  async createOrder({ orderId, urls }) {
    // Real yönləndirmə yoxdur: dərhal uğurlu sayılır.
    return { redirectUrl: `${urls.success}?order=${encodeURIComponent(orderId)}`, providerRef: 'SIM-' + orderId, autoPaid: true };
  }
  async parseCallback(body) {
    return { orderId: body.order_id, status: body.status === 'success' ? 'paid' : 'failed', providerRef: body.provider_ref || null, raw: body };
  }
}

/* ---------- 2. Epoint.az ----------
   Epoint sxemi:
     data      = base64(JSON.stringify(payload))
     signature = base64( sha1_raw( private_key + data + private_key ) )
   Callback-də eyni qayda ilə imza yoxlanılır.
   QEYD: sahə adlarını və endpoint-i öz Epoint müqavilənizin sənədi ilə
   müqayisə edin — versiyalar arasında fərq ola bilər.
------------------------------------------------------------------- */
class EpointProvider {
  constructor(cfg) {
    this.name = 'epoint';
    this.publicKey = cfg.publicKey;
    this.privateKey = cfg.privateKey;
    this.endpoint = cfg.endpoint || 'https://epoint.az/api/1/request';
  }
  _sign(payload) {
    const data = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64');
    const sha1 = crypto.createHash('sha1').update(this.privateKey + data + this.privateKey, 'utf8').digest();
    return { data, signature: sha1.toString('base64') };
  }
  verifySignature(data, signature) {
    const expected = crypto.createHash('sha1')
      .update(this.privateKey + data + this.privateKey, 'utf8').digest().toString('base64');
    const a = Buffer.from(expected), b = Buffer.from(String(signature || ''));
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  }
  async createOrder({ orderId, amount, currency, description, urls }) {
    const payload = {
      public_key: this.publicKey,
      amount: Number(amount).toFixed(2),
      currency: currency || 'AZN',
      language: 'az',
      order_id: orderId,
      description: description,
      success_redirect_url: urls.success,
      error_redirect_url: urls.error
    };
    const { data, signature } = this._sign(payload);
    const res = await fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ data, signature })
    });
    const json = await res.json();
    if (json.status !== 'success' || !json.redirect_url) {
      throw new Error('epoint_create_failed: ' + JSON.stringify(json));
    }
    return { redirectUrl: json.redirect_url, providerRef: json.transaction || null };
  }
  async parseCallback(body) {
    const { data, signature } = body || {};
    if (!data || !this.verifySignature(data, signature)) throw new Error('bad_signature');
    const decoded = JSON.parse(Buffer.from(data, 'base64').toString('utf8'));
    return {
      orderId: decoded.order_id,
      status: decoded.status === 'success' ? 'paid' : 'failed',
      providerRef: decoded.transaction || null,
      raw: decoded
    };
  }
}

/* ---------- seçim ---------- */
function makeProvider() {
  const name = (process.env.PAYMENT_PROVIDER || 'simulation').toLowerCase();
  if (name === 'epoint') {
    if (!process.env.EPOINT_PUBLIC_KEY || !process.env.EPOINT_PRIVATE_KEY)
      throw new Error('EPOINT_PUBLIC_KEY / EPOINT_PRIVATE_KEY təyin edilməyib');
    return new EpointProvider({
      publicKey: process.env.EPOINT_PUBLIC_KEY,
      privateKey: process.env.EPOINT_PRIVATE_KEY,
      endpoint: process.env.EPOINT_ENDPOINT
    });
  }
  return new SimulationProvider();
}

module.exports = { PACKS, makeProvider, SimulationProvider, EpointProvider };
