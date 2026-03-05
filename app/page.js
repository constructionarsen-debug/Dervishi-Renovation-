import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

// Homepage lists latest projects/testimonials from DB.
// Force dynamic rendering so Vercel/Next doesn't cache at build time.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function Stat({ value, label }) {
  return (
    <div>
      <div className="text-lg font-extrabold text-gray-900 dark:text-white">
        {value}
      </div>
      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
        {label}
      </div>
    </div>
  );
}

export default async function HomePage() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
    take: 3,
  });
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const approvedReviews = await prisma.review.findMany({
    where: { approved: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });

  const whyCards = [
    ...approvedReviews.map((r) => ({
      id: r.id,
      name: `${r.firstName} ${r.lastName}`,
      role: 'Klient',
      quote: r.content,
      rating: r.rating || 5,
      _type: 'review',
    })),
    ...testimonials.map((t) => ({
      id: t.id,
      name: t.name,
      role: t.role || 'Klient',
      quote: t.quote,
      rating: t.rating || 5,
      _type: 'testimonial',
    })),
  ].slice(0, 3);

  const Stars = ({ n }) => (
    <div className="mt-2 text-amber-500" aria-label={`${n} out of 5 stars`}>
      {'★★★★★'.slice(0, n)}{'☆☆☆☆☆'.slice(0, 5 - n)}
    </div>
  );

  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-soft dark:border-white/10 dark:bg-gray-900">
        <div className="relative w-full">
          {/* Hero image */}
          <div className="relative h-[520px] w-full sm:h-[580px]">
            <Image
              src="/hero.jpg"
              alt="Interior renovation"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover"
              style={{ clipPath: "inset(0 0 0 0 round 2rem 2rem 0 2rem)" }}
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"
              style={{ clipPath: "inset(0 0 0 0 round 2rem 2rem 0 2rem)" }}
            />

            {/* Hero text */}
            <div className="absolute inset-0 flex flex-col justify-center md:justify-end p-6 sm:p-10 md:p-12 md:max-w-[60%]">
              <h1 className="max-w-xs text-3xl font-extrabold tracking-tight text-white sm:max-w-xl sm:text-4xl md:text-5xl">
                Dervishi Renovation - Cilesi qe flet vetë
              </h1>
              <p className="mt-3 max-w-xs text-xs leading-relaxed text-white/85 sm:max-w-lg sm:text-sm md:text-base">
                Transformojmë hapësirat tuaja me profesionalizëm, përkushtim dhe
                cilësi të garantuar. Sjellim në Shqipëri eksperiencën dhe
                standardin e punës së Mbretërisë së Bashkuar.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/projects"
                  className="rounded-full bg-white px-4 py-2.5 text-xs font-bold text-gray-900 shadow-sm transition hover:bg-white/90 sm:px-5 sm:py-3 sm:text-sm"
                >
                  Shiko Projektet
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur transition hover:bg-white/20 sm:px-5 sm:py-3 sm:text-sm"
                >
                  Kërko Ofertë
                </Link>
              </div>
            </div>
          </div>

          {/* Stats card */}
          <div className="stats-card-inner-corners absolute bottom-0 right-0 w-[200px] rounded-tl-2xl rounded-br-[2rem] bg-white p-3 sm:w-60 sm:rounded-tl-3xl sm:p-4 md:w-72 md:p-5">
            <div className="text-xs font-extrabold text-gray-900 sm:text-sm">
              Kush Jemi?
            </div>
            <p className="mt-1 text-[10px] leading-relaxed text-gray-500 sm:text-xs">
              Kompani e specializuar në rinovime dhe rikonstruksione
              profesionale. Standarde UK në çdo projekt.
            </p>
            <div className="mt-3 grid grid-cols-3 divide-x divide-gray-100">
              <div className="pr-2 text-center sm:pr-4">
                <div className="text-base font-extrabold text-gray-900  sm:text-lg md:text-xl">
                  2019
                </div>
                <div className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-gray-400 sm:text-[10px]">
                  Themeluar
                </div>
              </div>
              <div className="px-2 text-center sm:px-4">
                <div className="text-base font-extrabold text-gray-900 sm:text-lg md:text-xl">
                  50+
                </div>
                <div className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-gray-400 sm:text-[10px]">
                  Projekte
                </div>
              </div>
              <div className="pl-2 text-center sm:pl-4">
                <div className="text-base font-extrabold text-gray-900 sm:text-lg md:text-xl">
                  100+
                </div>
                <div className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-gray-400 sm:text-[10px]">
                  Klientë
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT + SERVICES */}
      <section className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-gray-900">
            <div className="text-xs font-extrabold tracking-wider text-amber-700 dark:text-amber-400">
              RRETH NESH
            </div>
            <h2 className="mt-2 text-2xl font-extrabold text-gray-900 dark:text-white">
              Standard britanik, në Shqipëri
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              Dervishi Renovation është një kompani e specializuar në rinovime
              dhe rikonstruksione profesionale, e themeluar në vitin 2019. Me
              eksperiencë pune në Shqipëri dhe në Mbretërinë e Bashkuar (UK), ne
              aplikojmë në çdo projekt standardin britanik të organizimit,
              korrektësisë dhe cilësisë së realizimit.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              Ne nuk ofrojmë thjesht punime — ne ndërtojmë besim, qëndrueshmëri
              dhe perfeksion në detaje.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-200">
                Shqipëri & UK
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-200">
                Afate të respektuara
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-white/10 dark:text-gray-200">
                Cilësi premium
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-gray-900">
            <div className="text-xs font-extrabold tracking-wider text-amber-700 dark:text-amber-400">
              SHËRBIMET TONA
            </div>
            <h2 className="mt-2 text-2xl font-extrabold text-gray-900 dark:text-white">
              Zgjidhje të plota për rinovime
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                "Mirembajtje",
                "Rikonstruksione",
                "Rinovime",
                "Banjo",
                "Kuzhina",
                "Hidraulike",
                "Elektrike",
                "Mure gipsi",
                "Boje",
                "Pllaka",
                "Kopshtari dhe peizazhim",
              ].map((s) => (
                <div
                  key={s}
                  className="flex items-start gap-3 rounded-2xl border border-black/5 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5"
                >
                  <div className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-600 text-white text-lg font-bold leading-none">
                    ✓
                  </div>
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {s}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-black/5 bg-amber-50 p-4 text-sm text-amber-900 dark:border-white/10 dark:bg-amber-500/10 dark:text-amber-200">
              Çdo projekt realizohet me planifikim të saktë, materiale cilësore
              dhe kontroll të rreptë të standardit të punës.
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-extrabold tracking-wider text-amber-700 dark:text-amber-400">
              PROJEKTET
            </div>
            <h2 className="mt-2 text-3xl font-extrabold">Projektet e fundit</h2>
          </div>
          <Link
            href="/projects"
            className="rounded-full border border-black/10 bg-white w-[50%] md:w-fit px-4 py-2 text-sm text-center font-semibold text-gray-900 shadow-sm hover:bg-gray-50 dark:border-white/10 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
          >
            Shiko të gjitha
          </Link>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="group overflow-hidden rounded-[1.6rem] border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft dark:border-white/10 dark:bg-gray-900"
            >
              <div className="relative h-52 w-full">
                <Image
                  src={
                    p.coverImage ||
                    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80"
                  }
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-5">
                <div className="text-sm font-extrabold text-gray-900 dark:text-white">
                  {p.title}
                </div>
                <div className="mt-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {p.location || "Shqipëri"}
                </div>
                {p.description ? (
                  <p className="mt-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                    {p.description}
                  </p>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="rounded-[2rem] border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-gray-900">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="text-xs font-extrabold tracking-wider text-amber-700 dark:text-amber-400">
              PSE DERVISHI RENOVATION?
            </div>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">
              Besim, cilësi, korrektësi
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              ✔ Eksperiencë ndërkombëtare (Shqipëri & UK) <br />
              ✔ Standarde pune sipas modelit britanik <br />
              ✔ Transparencë dhe korrektësi në çdo fazë <br />
              ✔ Respektim i afateve <br />✔ Fokus maksimal në cilësi dhe detaje
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-3">
              {whyCards.map((t) => (
                <div
                  key={t.id}
                  className="rounded-2xl border border-black/5 bg-gray-50 p-5 dark:border-white/10 dark:bg-white/5"
                >
                  <div className="text-sm font-extrabold text-gray-900 dark:text-white">
                    {t.name}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {t.role || "Klient"}
                  </div>
                  <Stars n={Math.min(5, Math.max(1, t.rating || 5))} />
                  <p className="mt-3 text-sm text-gray-700 dark:text-gray-200">
                    “{t.quote}”
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/review"
                className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-bold text-gray-900 shadow-sm transition hover:bg-gray-50 dark:border-white/10 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-900"
              >
                Lër një Review
              </Link>

              <Link
                href="/qa"
                className="rounded-full bg-amber-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-amber-700"
              >
                Bli Anëtarësimin
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick CTA */}
      <section className="relative overflow-hidden rounded-[2rem] border border-black/10 shadow-sm dark:border-white/10">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/cta-bg.png" // vendose ne public/
            alt="Renovim Interior"
            fill
            priority={false}
            sizes="100vw"
            className="object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 dark:bg-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-8">
          <h3 className="text-2xl font-extrabold text-white">
            Gati për të transformuar hapësirën tuaj?
          </h3>

          <p className="mt-3 max-w-2xl text-sm text-white/80">
            Na kontaktoni sot dhe merrni një konsultë profesionale për projektin
            tuaj.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/qa"
              className="rounded-full bg-amber-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-amber-700"
            >
              Bli Anëtarësimin
            </Link>

            <Link
              href="/contact"
              className="rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20"
            >
              Kërko Ofertë
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
