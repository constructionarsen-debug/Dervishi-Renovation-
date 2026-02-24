import { prisma } from '@/lib/prisma';

export const QA_WINDOW_DAYS = 30;

export function computeActiveUntil(fromDate) {
  const d = new Date(fromDate);
  d.setDate(d.getDate() + QA_WINDOW_DAYS);
  return d;
}

export async function getUserQaAccess(userId) {
  if (!userId) return { active: false, activeUntil: null, lastPaidOrder: null };

  const lastPaidOrder = await prisma.order.findFirst({
    where: { userId, type: 'QA', paymentStatus: 'PAID' },
    orderBy: { createdAt: 'desc' }
  });

  if (!lastPaidOrder) return { active: false, activeUntil: null, lastPaidOrder: null };

  const activeUntil = computeActiveUntil(lastPaidOrder.createdAt);
  const active = Date.now() < activeUntil.getTime();
  return { active, activeUntil, lastPaidOrder };
}
