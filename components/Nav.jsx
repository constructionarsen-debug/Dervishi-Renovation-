import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Nav() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-4 z-50 px-4">
      <div className="mx-auto max-w-7xl">
        <div
          className="
            flex items-center justify-between
            px-6 py-4
            rounded-2xl
            bg-white/30 dark:bg-zinc-900/40
            backdrop-blur-xl
            border border-white/30 dark:border-white/10
            shadow-[0_8px_30px_rgba(0,0,0,0.12)]
            dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]
            transition-all duration-300
          "
        >
          {/* Logo */}
          <Link
            href="/"
            className="font-extrabold tracking-tight text-lg drop-shadow-sm"
          >
            Dervishi{" "}
            <span className="text-zinc-500 dark:text-zinc-400">
              Renovation
            </span>
          </Link>

          {/* Center Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <Link
              className="hover:opacity-80 hover:scale-105 transition"
              href="/"
            >
              Kreu
            </Link>
            <Link
              className="hover:opacity-80 hover:scale-105 transition"
              href="/qa"
            >
              Shërbimi Online
            </Link>
            <Link
              className="hover:opacity-80 hover:scale-105 transition"
              href="/ebooks"
            >
              e-Book
            </Link>
            <Link
              className="hover:opacity-80 hover:scale-105 transition"
              href="/projects"
            >
              Projektet
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {session?.user ? (
              <>
                <Link
                  href="/library"
                  className="
                    px-4 py-2 rounded-xl
                    bg-white/40 dark:bg-zinc-800/40
                    backdrop-blur-md
                    border border-white/30 dark:border-white/10
                    hover:scale-105 transition
                  "
                >
                  Biblioteka
                </Link>

                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="
                      px-4 py-2 rounded-xl
                      bg-gradient-to-r from-zinc-900 to-zinc-700
                      text-white
                      shadow-lg
                      hover:scale-105 transition
                    "
                  >
                    Admin
                  </Link>
                )}

                <form action="/api/auth/signout" method="post">
                  <button
                    type="submit"
                    className="
                      px-4 py-2 rounded-xl
                      bg-white/40 dark:bg-zinc-800/40
                      backdrop-blur-md
                      border border-white/30 dark:border-white/10
                      hover:scale-105 transition
                    "
                  >
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="
                    px-4 py-2 rounded-xl
                    bg-gradient-to-r from-zinc-900 to-zinc-700
                    text-white
                    shadow-lg
                    hover:scale-105 transition
                  "
                >
                  Login
                </Link>

                {/* <Link
                  href="/register"
                  className="
                    px-4 py-2 rounded-xl
                    bg-gradient-to-r from-zinc-900 to-zinc-700
                    text-white
                    shadow-lg
                    hover:scale-105 transition
                  "
                >
                  Krijo llogari
                </Link> */}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
