"use client";

import { useMemo, useState } from "react";

function normalizePhone(v) {
  return String(v || "").trim().replace(/[\s\-().]/g, "");
}

function isValidPhoneClient(v) {
  const p = normalizePhone(v);
  if (!p) return false;
  if (p.startsWith("+355")) {
    const rest = p.slice(4);
    if (!/^\d+$/.test(rest)) return false;
    return rest.length === 9 || rest.length === 10;
  }
  if (/^0\d{9}$/.test(p)) return true;
  if (/^\+\d{8,15}$/.test(p)) return true; // EU/intl E.164
  return false;
}

function isValidEmailClient(v) {
  const e = String(v || "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(e);
}

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState(""); // honeypot

  const phoneOk = useMemo(() => (phone ? isValidPhoneClient(phone) : false), [phone]);
  const emailOk = useMemo(() => (email ? isValidEmailClient(email) : false), [email]);

  const canSubmit = name.trim() && emailOk && phoneOk && message.trim();

  return (
    <section className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-gray-900">
      <h2 className="text-xl font-extrabold">Kërko shërbim renovimi</h2>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        Na shkruani pak detaje (tipi i punimeve, madhësia, vendndodhja, afati). Do t’ju kontaktojmë sa më shpejt.
      </p>

      <form action="/api/contact" method="post" className="mt-6 space-y-4">
        {/* honeypot */}
        <input
          type="text"
          name="company"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold">Emër dhe Mbiemër *</span>
            <input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="p.sh. Filan Fisteku"
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 dark:border-white/10 dark:bg-gray-950"
              required
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold">Email *</span>
            <input
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="p.sh. email@domain.com"
              className={
                "w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition dark:bg-gray-950 " +
                (email && !emailOk
                  ? "border-rose-300 focus:border-rose-400 dark:border-rose-900/60"
                  : "border-black/10 focus:border-amber-500 dark:border-white/10")
              }
              type="email"
              required
            />
            {email && !emailOk ? (
              <div className="text-xs text-rose-600 dark:text-rose-300">Email-i nuk është i vlefshëm.</div>
            ) : null}
          </label>

          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-semibold">Numër telefoni (AL / EU) *</span>
            <input
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="p.sh. +355 69 123 4567 ose +39 333 123 4567"
              className={
                "w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition dark:bg-gray-950 " +
                (phone && !phoneOk
                  ? "border-rose-300 focus:border-rose-400 dark:border-rose-900/60"
                  : "border-black/10 focus:border-amber-500 dark:border-white/10")
              }
              inputMode="tel"
              required
            />
            {phone && !phoneOk ? (
              <div className="text-xs text-rose-600 dark:text-rose-300">
                Përdorni formatin +355… (Shqipëri) ose +… (EU/ndërkombëtar).
              </div>
            ) : null}
          </label>
        </div>

        <label className="space-y-2">
          <span className="text-sm font-semibold">Mesazhi *</span>
          <textarea
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Shkruani shkurt çfarë punimesh kërkoni, vendndodhjen dhe afatin."
            className="min-h-[140px] w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 dark:border-white/10 dark:bg-gray-950"
            required
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-full bg-amber-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Dërgo kërkesën
          </button>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            Duke dërguar formularin, pranoni që t’ju kontaktojmë për këtë kërkesë.
          </div>
        </div>
      </form>
    </section>
  );
}
