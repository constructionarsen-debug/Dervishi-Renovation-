import Image from 'next/image';

export const metadata = { title: 'Rreth Nesh | Dervishi Renovation' };

export default function AboutPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-6">
        <h1 className="text-3xl font-extrabold">Rreth Nesh</h1>
        <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          Dervishi Renovation është një kompani e specializuar në rinovime dhe rikonstruksione profesionale, e themeluar në vitin 2019.
          Me eksperiencë pune në Shqipëri dhe në Mbretërinë e Bashkuar (UK), ne aplikojmë në çdo projekt standardin britanik të organizimit,
          korrektësisë dhe cilësisë së realizimit.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          Misioni ynë është i qartë: të ofrojmë në Shqipëri të njëjtin nivel profesionalizmi dhe cilësie që klientët presin në tregun europian.
          Ne nuk ofrojmë thjesht punime — ne ndërtojmë besim, qëndrueshmëri dhe perfeksion në detaje.
        </p>

        <div className="mt-6 rounded-2xl border border-black/5 bg-gray-50 p-5 text-sm text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
          Për pyetje dhe konsultë: përdorni Shërbimin Online ose na kontaktoni direkt.
        </div>
      </div>

      <div className="lg:col-span-6">
        <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-soft dark:border-white/10 dark:bg-gray-900">
          <div className="relative h-[520px] w-full">
            <Image
              src="https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=2000&q=80"
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
