import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function requireAuth(from = "/") {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect(`/login?from=${encodeURIComponent(from)}`);
  return session;
}
