import type { Metadata } from 'next';
import { Terms } from '@/screens/Legal';

export const metadata: Metadata = { title: 'الشروط والأحكام' };
export default function Page() {
  return <Terms />;
}
