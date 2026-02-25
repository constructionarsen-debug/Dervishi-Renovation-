import Link from "next/link";
import { Instagram, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-white dark:bg-[rgba(0,0,0,0.08)] text-black">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* 3 Columns */}
        <div className="grid gap-12 md:grid-cols-3">
          {/* Column 1 — Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-black tracking-tight dark:text-white">
              Dervishi Renovation
            </h3>

            <p className="text-sm leading-relaxed text-gray-400 dark:text-white max-w-sm">
              Transformojmë hapësirat tuaja me profesionalizëm, përkushtim dhe
              cilësi të garantuar.
            </p>
          </div>

          {/* Column 2 — Contact */}
          <div className="space-y-5">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-black dark:text-white">
              Kontakt
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:info@dervishirenovation.al"
                  className="hover:text-gray transition-colors dark:text-white"
                >
                  info@dervishirenovation.al
                </a>
              </li>

              <li>
                <a
                  href="tel:+355696081051"
                  className="hover:text-gray transition-colors dark:text-white"
                >
                  +355 69 608 1051
                </a>
              </li>

              <li className="text-gray-500 dark:text-white">
                Tiranë, Shqipëri
              </li>
            </ul>
          </div>

          {/* Column 3 — Social + Legal */}
          <div className="space-y-6">
            <div>
              <div className="mt-4 flex items-center gap-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 border border-white/10 transition-all hover:bg-white hover:text-black hover:scale-105 dark:text-white dark:hover:text-black"
                >
                  <Instagram size={18} />
                </a>

                <a
                  href="https://wa.me/355696081051"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 border border-white/10 transition-all hover:bg-green-500 hover:text-white hover:scale-105 dark:text-white dark:hover:text-white"
                >
                  <MessageCircle size={18} />
                </a>
              </div>
            </div>

            <div>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors dark:text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors dark:text-white"
                  >
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-gray-500 md:flex-row">
          <div>
            © {new Date().getFullYear()} Dervishi Renovation. All rights
            reserved.
          </div>

          <div>
            <a
              href="https://duadev.al"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-gray-400 hover:text-white transition-colors"
            >
              Website developed by DuaDev AL
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
