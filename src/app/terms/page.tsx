import type { Metadata } from 'next';
import { Terms } from '@/screens/Legal';
import { publicPricing } from '@/server/services/pricing';

export const metadata: Metadata = { title: 'الشروط والأحكام' };
export default async function Page() {
  const p = await publicPricing().catch(() => null);
  return <Terms free={p?.free} />;
}
