'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Loading from './Loading';

const wait = () => <Loading />;
const S = {
  Dashboard: dynamic(() => import('./Dashboard'), { ssr: false, loading: wait }),
  Invitations: dynamic(() => import('./Invitations'), { ssr: false, loading: wait }),
  InviteDetail: dynamic(() => import('./InviteDetail'), { ssr: false, loading: wait }),
  Guests: dynamic(() => import('./Guests'), { ssr: false, loading: wait }),
  Create: dynamic(() => import('./Create'), { ssr: false, loading: wait }),
  Attendance: dynamic(() => import('./Attendance'), { ssr: false, loading: wait }),
  Certificate: dynamic(() => import('./Certificate'), { ssr: false, loading: wait }),
  GuestJourney: dynamic(() => import('./GuestJourney'), { ssr: false, loading: wait }),
  Report: dynamic(() => import('./Report'), { ssr: false, loading: wait }),
  Requests: dynamic(() => import('./Requests'), { ssr: false, loading: wait }),
  Designs: dynamic(() => import('./Designs'), { ssr: false, loading: wait }),
  Settings: dynamic(() => import('./Settings'), { ssr: false, loading: wait }),
  Account: dynamic(() => import('./Account'), { ssr: false, loading: wait }),
  Subscribe: dynamic(() => import('./Subscribe'), { ssr: false, loading: wait }),
  Admin: dynamic(() => import('./Admin'), { ssr: false, loading: wait }),
  AdminLogin: dynamic(() => import('./AdminLogin'), { ssr: false, loading: wait }),
};
const G = {
  GuestPage: dynamic(() => import('./GuestPage'), { ssr: false, loading: wait }),
  PublicInvite: dynamic(() => import('./GuestPage').then((m) => m.PublicInvite), { ssr: false, loading: wait }),
  InvitePreview: dynamic(() => import('./GuestPage').then((m) => m.InvitePreview), { ssr: false, loading: wait }),
  CertPage: dynamic(() => import('./GuestPage').then((m) => m.CertPage), { ssr: false, loading: wait }),
  QrPage: dynamic(() => import('./GuestPage').then((m) => m.QrPage), { ssr: false, loading: wait }),
};

/** Draws one workspace or Studio screen with its data. */
export function Show({ name, ...props }) {
  const router = useRouter();
  const C = S[name];
  return <C {...props} router={router} />;
}

/** Draws one guest-facing page. */
export function ShowGuest({ name, ...props }) {
  const C = G[name];
  return <C {...props} />;
}
