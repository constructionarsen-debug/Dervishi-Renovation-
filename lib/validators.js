// Basic server-side validators.

export function isValidEmail(email) {
  const e = String(email || '').trim().toLowerCase();
  if (!e) return false;
  // Reasonable RFC-5322-ish practical regex (not perfect, but solid).
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(e);
}

export function normalizePhone(input) {
  const raw = String(input || '').trim();
  if (!raw) return '';

  // Keep leading +, strip spaces/dashes/parentheses.
  const cleaned = raw.replace(/[\s\-().]/g, '');
  return cleaned;
}

export function isValidPhone(input) {
  const phone = normalizePhone(input);
  if (!phone) return true; // optional in most forms

  // Albania:
  // - "0" + 9 digits  => 10 digits total (e.g. 069xxxxxxx)
  // - +355 + 9 digits  => E.164 (e.g. +35569xxxxxxx)
  // - user requested: +355 + 10 digits also accepted (sometimes includes leading 0)
  if (phone.startsWith('+355')) {
    const rest = phone.slice(4);
    if (!/^\d+$/.test(rest)) return false;
    return rest.length === 9 || rest.length === 10;
  }
  if (/^0\d{9}$/.test(phone)) return true;

  // Generic E.164 (8..15 digits after +)
  if (/^\+\d{8,15}$/.test(phone)) return true;

  // Some users may type just digits without prefix; reject unless Albanian 10-digit.
  if (/^\d+$/.test(phone)) {
    return phone.length === 10;
  }
  return false;
}
