import Image from 'next/image';

export const metadata = {
  title: "Rreth Nesh",
  description:
    "Dervishi Renovation ofron renovim të plotë dhe interiere moderne në Tiranë dhe Shqipëri. Fokus në cilësi, planifikim, transparencë dhe garanci pune.",
  keywords: [
    "rreth dervishi renovation",
    "kompani renovimi tirane",
    "kontraktor renovimi",
    "interier tirane",
    "punime ndertimi shqiperi",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    type: "website",
    locale: "sq_AL",
    url: "/about",
    title: "Rreth Nesh - Dervishi Renovation",
    description:
      "Mësoni për ekipin, qasjen dhe standardet e punës së Dervishi Renovation - cilësi, transparencë dhe garanci.",
    images: [{ url: "/og-image-v2.png", width: 1200, height: 630, alt: "Rreth Dervishi Renovation" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rreth Nesh | Dervishi Renovation",
    description:
      "Renovim i plotë dhe interiere moderne në Tiranë dhe Shqipëri - cilësi, transparencë dhe garanci.",
    images: ["/og-image-v2.png"],
  },
};

export default function AboutPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-12 mt-10">
      <div className="lg:col-span-6">
        <h1 className="text-3xl font-extrabold">Rreth Nesh</h1>

        <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          Në <strong>Dervishi Renovation</strong>, ne besojmë se çdo hapësirë ka potencialin të
          transformohet në diçka funksionale, estetike dhe të qëndrueshme në kohë.
          Me përkushtim, profesionalizëm dhe vëmendje ndaj detajeve, ne ofrojmë
          zgjidhje të plota për çdo projekt ndërtimi apo rinovimi.
        </p>

        <h2 className="mt-6 font-semibold text-gray-900 dark:text-white">
          Shërbimet tona përfshijnë:
        </h2>

        <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <li>● Mirëmbajtje të përgjithshme për ambiente banimi dhe biznese</li>
          <li>● Rikonstruksione të plota strukturore</li>
          <li>● Rinovime moderne dhe funksionale</li>
          <li>● Realizim dhe transformim banjosh</li>
          <li>● Projektim dhe instalim kuzhinash</li>
          <li>● Punime hidraulike profesionale</li>
          <li>● Instalime dhe sisteme elektrike të sigurta</li>
          <li>● Ndërtim muresh gipsi dhe ndarje ambientesh</li>
          <li>● Lyerje dhe rifreskim me bojë cilësore</li>
          <li>● Shtrim profesional pllakash</li>
          <li>● Kopshtari dhe peizazhim për ambiente të jashtme estetike dhe të organizuara</li>
        </ul>

        <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          Çdo projekt realizohet me standard të lartë cilësie, materiale të
          përzgjedhura dhe respektim të afateve të dakorduara. Ne punojmë
          ngushtë me klientët tanë për të kuptuar nevojat, stilin dhe buxhetin
          e tyre, duke ofruar zgjidhje të personalizuara për çdo hapësirë.
        </p>

        <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          Qëllimi ynë është i thjeshtë: të krijojmë ambiente që jo vetëm duken
          bukur, por që funksionojnë në mënyrë perfekte për jetën dhe
          aktivitetin tuaj të përditshëm.
        </p>

        <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          Nëse kërkoni besueshmëri, cilësi dhe përkushtim real në çdo detaj,
          <strong> Dervishi Renovation </strong> është partneri i duhur për
          transformimin e hapësirës suaj.
        </p>

        <div className="mt-6 rounded-2xl border border-black/5 bg-gray-50 p-5 text-sm text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
          Për pyetje dhe konsultë: përdorni Shërbimin Online ose na kontaktoni direkt.
        </div>
      </div>

      <div className="lg:col-span-6">
        <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-soft dark:border-white/10 dark:bg-gray-900">
          <div className="relative h-[750px] w-full">
            <Image
              src="/about-new.jpeg"
              alt="Team"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}