// Paysera Checkout integration (spec-based).
// Docs:
// - Callback validation: https://developers.paysera.com/en/checkout/integrations/integration-callback

import crypto from 'crypto';

export function isPayseraConfigured() {
  return Boolean(process.env.PAYSERA_PROJECT_ID && process.env.PAYSERA_SIGN_PASSWORD);
}

/**
 * Build Paysera redirect URL.
 *
 * NOTE:
 * Paysera expects `amount` in cents of the chosen currency.
 * This starter keeps amounts in Lek in DB for simplicity.
 * Control currency & conversion with ENV (PAYSERA_CURRENCY).
 */
export function buildPayseraPaymentUrl({ orderId, amountLek, customerEmail, returnUrl, cancelUrl, callbackUrl }) {
  if (!isPayseraConfigured()) {
    const q = new URLSearchParams({ orderId, amountLek: String(amountLek), customerEmail });
    return `https://www.paysera.com/?${q.toString()}`;
  }

  const baseUrl = process.env.PAYSERA_BASE_URL || 'https://www.paysera.com/pay/';
  const projectid = String(process.env.PAYSERA_PROJECT_ID);
  const password = String(process.env.PAYSERA_SIGN_PASSWORD);

  const currency = (process.env.PAYSERA_CURRENCY || 'EUR').toUpperCase();
  const cents = Math.max(0, Math.round(Number(amountLek) * 100));

  const params = {
    projectid,
    orderid: String(orderId),
    accepturl: String(returnUrl || ''),
    cancelurl: String(cancelUrl || ''),
    callbackurl: String(callbackUrl || ''),
    version: process.env.PAYSERA_VERSION || '1.6',
    lang: (process.env.PAYSERA_LANG || 'ENG').toUpperCase(),
    amount: String(cents),
    currency,
    p_email: String(customerEmail || ''),
    paytext: process.env.PAYSERA_PAYTEXT || 'Dervishi Renovation',
    test: process.env.PAYSERA_TEST === '1' ? '1' : undefined
  };

  const data = encodePayseraData(params);
  const sign = md5(data + password);

  const url = new URL(baseUrl);
  url.searchParams.set('data', data);
  url.searchParams.set('sign', sign);
  return url.toString();
}

export function encodePayseraData(params) {
  const clean = {};
  for (const [k, v] of Object.entries(params || {})) {
    if (v !== undefined && v !== null && String(v).length > 0) clean[k] = String(v);
  }

  // URL encode (spaces -> '+')
  const q = new URLSearchParams(clean).toString();

  // Base64
  const b64 = Buffer.from(q, 'utf8').toString('base64');

  // URL-safe base64 (Paysera style)
  return b64.replace(/\+/g, '-').replace(/\//g, '_');
}

export function decodePayseraData(data) {
  const raw = String(data || '').replace(/-/g, '+').replace(/_/g, '/');
  const decoded = Buffer.from(raw, 'base64').toString('utf8');
  const out = {};
  const sp = new URLSearchParams(decoded);
  for (const [k, v] of sp.entries()) out[k] = v;
  return out;
}

export function md5(str) {
  return crypto.createHash('md5').update(String(str), 'utf8').digest('hex');
}
