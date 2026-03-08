import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Shërbimi Online'
};

// Backwards-compatible route. The Q&A service now lives at /qa.
export default async function OnlineServicePage() {
  redirect('/qa');
}
