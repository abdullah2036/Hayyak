import type { Metadata } from 'next';
import { Privacy } from '@/screens/Legal';

export const metadata: Metadata = { title: 'سياسة الخصوصية' };
export default function Page() {
  return <Privacy />;
}
