"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { signOut } from "next-auth/react";

export default function Nav({ session }) {
  const [open, setOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hide on scroll down / show on scroll up
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

  // Close mobile menu when resizing desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile menu when clicking a link
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
        <div
          className="
            relative flex items-center justify-between
            px-6 py-4
            rounded-full
            bg-white/20 dark:bg-zinc-900/50
            backdrop-blur-2xl
            border border-white/30 dark:border-white/10
            shadow-[0_10px_40px_rgba(0,0,0,0.15)]
            dark:shadow-[0_10px_40px_rgba(0,0,0,0.6)]
          "
        >
          {/* Logo */}
          <Link href="/" className="text-lg font-extrabold tracking-tight">
            Dervishi{" "}
            <span className="text-zinc-500 dark:text-zinc-400">
              Renovation
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/">Kreu</Link>
            <Link href="/qa">Shërbimi Online</Link>
            <Link href="/ebooks">e-Book</Link>
            <Link href="/projects">Projektet</Link>
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <div className="hidden md:flex items-center gap-3">
              {session?.user ? (
                <>
                  <Link
                    href="/library"
                    className="px-4 py-2 rounded-xl bg-white/40 dark:bg-zinc-800/40 border border-white/20 dark:border-white/10 hover:scale-105 transition"
                  >
                    Biblioteka
                  </Link>

                  {session.user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-700 text-white shadow-lg hover:scale-105 transition"
                    >
                      Admin
                    </Link>
                  )}

                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 rounded-xl bg-white/40 dark:bg-zinc-800/40 border border-white/20 dark:border-white/10 hover:scale-105 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-700 text-white shadow-lg hover:scale-105 transition"
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
              fixed top-0 left-0 w-full h-full rounded-full bg-black/30 dark:bg-black/50 md:hidden
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
              <Link href="/" className="block px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={handleLinkClick}>Kreu</Link>
              <Link href="/qa" className="block px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={handleLinkClick}>Shërbimi Online</Link>
              <Link href="/ebooks" className="block px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={handleLinkClick}>e-Book</Link>
              <Link href="/projects" className="block px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={handleLinkClick}>Projektet</Link>

              <div className="border-t border-white/20 dark:border-white/10 pt-4 space-y-3">
                {session?.user ? (
                  <>
                    <Link href="/library" className="block px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={handleLinkClick}>Biblioteka</Link>
                    {session.user.role === "ADMIN" && (
                      <Link href="/admin" className="block px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={handleLinkClick}>Admin</Link>
                    )}
                    <button onClick={() => {signOut(); handleLinkClick();}} className="block w-full text-left px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
                      Logout
                    </button>
                  </>
                ) : (
                  <Link href="/login" className="block px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={handleLinkClick}>Login</Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}