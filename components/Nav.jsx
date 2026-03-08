"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Nav() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLinkClick = () => setOpen(false);

  return (
    <header
      className={`
        fixed top-4 left-0 right-0 z-50 px-4
        transition-transform duration-300 ease-in-out
        ${showNav ? "translate-y-0" : "-translate-y-[120%]"}
      `}
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative flex items-center px-4 lg:px-6 py-4 rounded-full bg-white/20 dark:bg-zinc-900/50 backdrop-blur-2xl border border-white/30 dark:border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/navlogo.png"
              width={130}
              height={130}
              alt="dervishi renovation logo"
              className="h-auto w-[110px] sm:w-[120px] lg:w-[130px]"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="absolute left-1/2 hidden md:flex -translate-x-1/2 items-center gap-5 lg:gap-7 text-sm font-medium whitespace-nowrap max-w-[48%] xl:max-w-none overflow-hidden">
            <Link href="/about" className="hover:opacity-70 transition">
              Rreth Nesh
            </Link>
            <Link href="/qa" className="hover:opacity-70 transition">
              Shërbimi Online
            </Link>
            <Link href="/ebooks" className="hover:opacity-70 transition">
              e-Book
            </Link>
            <Link href="/projects" className="hover:opacity-70 transition">
              Projektet
            </Link>
            <Link href="/contact" className="hover:opacity-70 transition">
              Kontakt
            </Link>
          </nav>

          {/* RIGHT SIDE */}
          <div className="ml-auto flex items-center gap-2 lg:gap-3">
            <ThemeToggle />

            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              {status === "authenticated" && session?.user ? (
                <>
                  <Link
                    href="/profile"
                    className="p-2 rounded-xl bg-white/40 dark:bg-zinc-800/40 border border-white/20 dark:border-white/10 hover:scale-105 transition shrink-0"
                  >
                    <User size={18} />
                  </Link>

                  {!isAdmin && (
                    <Link
                      href="/library"
                      className="px-3 lg:px-4 py-2 rounded-xl bg-white/40 dark:bg-zinc-800/40 border border-white/20 dark:border-white/10 hover:scale-105 transition text-sm shrink-0"
                    >
                      Biblioteka
                    </Link>
                  )}

                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="px-3 lg:px-4 py-2 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-700 text-white shadow-lg hover:scale-105 transition text-sm shrink-0"
                    >
                      Admin
                    </Link>
                  )}

                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="px-3 lg:px-4 py-2 rounded-xl bg-white/40 dark:bg-zinc-800/40 border border-white/20 dark:border-white/10 hover:scale-105 transition text-sm shrink-0"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-700 text-white shadow-lg hover:scale-105 transition shrink-0"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-xl bg-white/30 dark:bg-zinc-800/40 border border-white/20 dark:border-white/10"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Dropdown */}
          <div
            className={`
              fixed top-0 left-0 w-full h-full bg-black/30 dark:bg-black/50 md:hidden
              transition-opacity duration-300
              ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
            `}
            onClick={handleLinkClick}
          >
            <div
              className={`
                absolute top-16 left-4 right-4 rounded-3xl
                bg-white/95 dark:bg-zinc-900/95
                backdrop-blur-2xl
                border border-white/20 dark:border-white/10
                shadow-2xl p-6
                space-y-4
                transition-transform duration-300
                ${open ? "translate-y-0" : "-translate-y-10"}
              `}
              onClick={(e) => e.stopPropagation()}
            >
              <Link
                href="/"
                className="block px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                onClick={handleLinkClick}
              >
                Kreu
              </Link>
              <Link
                href="/about"
                className="block px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                onClick={handleLinkClick}
              >
                Rreth Nesh
              </Link>
              <Link
                href="/qa"
                className="block px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                onClick={handleLinkClick}
              >
                Shërbimi Online
              </Link>
              <Link
                href="/ebooks"
                className="block px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                onClick={handleLinkClick}
              >
                e-Book
              </Link>
              <Link
                href="/projects"
                className="block px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                onClick={handleLinkClick}
              >
                Projektet
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                onClick={handleLinkClick}
              >
                Kontakt
              </Link>

              <div className="border-t border-white/20 dark:border-white/10 pt-4 space-y-3">
                {status === "authenticated" && session?.user ? (
                  <>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      onClick={handleLinkClick}
                    >
                      Profili
                    </Link>

                    {!isAdmin && (
                      <Link
                        href="/library"
                        className="block px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        onClick={handleLinkClick}
                      >
                        Biblioteka
                      </Link>
                    )}

                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        onClick={handleLinkClick}
                      >
                        Admin
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        signOut({ callbackUrl: "/" });
                        handleLinkClick();
                      }}
                      className="block w-full text-left px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="block px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    onClick={handleLinkClick}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}