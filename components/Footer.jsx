import Link from "next/link";
import { Instagram, Music2 } from "lucide-react";

export default function Footer() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE || "+355696081051";
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com";
  const tiktokUrl = process.env.NEXT_PUBLIC_TIKTOK_URL || "https://tiktok.com";

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
                {contactEmail ? (
                  <a
                    href={`mailto:${contactEmail}`}
                    className="hover:text-gray transition-colors dark:text-white"
                  >
                    {contactEmail}
                  </a>
                ) : (
                  <span className="text-gray-500 dark:text-white">Email: së shpejti</span>
                )}
              </li>

              <li>
                <a
                  href={`tel:${contactPhone}`}
                  className="hover:text-gray transition-colors dark:text-white"
                >
                  {contactPhone}
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
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 border border-gray-300 transition-all hover:bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#FCAF45] hover:text-white hover:scale-105 dark:text-white dark:hover:text-white"
                >
                  <Instagram size={18} />
                </a>

                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 border border-gray-300 transition-all hover:bg-black hover:text-white hover:scale-105 dark:text-white dark:hover:text-white"
                >
                  <Music2 size={18} />
                </a>
              </div>
            </div>

            <div>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link
                    href="/contact"
                    className="dark:hover:text-white transition-colors dark:text-white"
                  >
                    Kontakt
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="dark:hover:text-white transition-colors dark:text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="dark:hover:text-white transition-colors dark:text-white"
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
              className="font-medium text-gray-400 hover:text-gray-700  transition-colors"
            >
              Website developed by DuaDev AL
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
