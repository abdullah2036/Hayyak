'use client';
import { useEffect } from 'react';
import Loading from '@/screens/Loading';
import { report } from '@/ui/ClientWatch';

export default function Page({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => report('error', '', `${error?.message || 'page error'}${error?.digest ? ` #${error.digest}` : ''}`), [error]);
  return <Loading stuck reset={reset} />;
}
