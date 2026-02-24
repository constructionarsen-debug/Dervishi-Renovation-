import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-black/10 bg-white/60 py-10 dark:border-white/10 dark:bg-gray-950/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-3">
        <div>
          <div className="text-lg font-extrabold text-gray-900 dark:text-white">Dervishi Renovation</div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Transformojmë hapësirat tuaja me profesionalizëm, përkushtim dhe cilësi të garantuar.
          </p>
        </div>

        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">Kontakt</div>
          <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li>Email: info@dervishirenovation.al</li>
            <li>Tel: +355 XX XXX XXX</li>
            <li>Adresë: Tiranë, Shqipëri</li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">Linke</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="/privacy">Privacy Policy</Link></li>
            <li><Link className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="/terms">Terms &amp; Conditions</Link></li>
            <li><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
            <li><a className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" href="https://wa.me/355000000000" target="_blank" rel="noreferrer">WhatsApp</a></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-4 text-xs text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Dervishi Renovation. Të gjitha të drejtat e rezervuara.
      </div>
    </footer>
  );
}
