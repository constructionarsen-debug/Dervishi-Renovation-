import { prisma } from '@/lib/prisma';
import SettingsForm from '@/components/SettingsForm';

export default async function SettingsPage() {
  const s = await prisma.siteSettings.findFirst();
  return (
    <main className="container-pad">
      <h1 className="text-3xl font-extrabold">Settings</h1>
      <div className="mt-8 max-w-xl card p-8">
        <SettingsForm initialQaPriceCents={s?.qaPriceCents ?? 1500} currency={s?.currency ?? 'EUR'} />
      </div>
    </main>
  );
}
