'use client';
import Loading from '@/screens/Loading';

export default function Page({ reset }: { reset: () => void }) {
  return <Loading stuck reset={reset} />;
}
