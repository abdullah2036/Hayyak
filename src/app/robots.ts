import type { MetadataRoute } from 'next';
import { staging } from '@/lib/hosts';

export const dynamic = 'force-dynamic';
export default function robots(): MetadataRoute.Robots {
  // The Studio is not listed on purpose: this file is public.
  if (staging()) return { rules: { userAgent: '*', disallow: '/' } };
  return { rules: { userAgent: '*', allow: ['/$', '/privacy', '/terms', '/signup'], disallow: ['/app', '/api', '/i/', '/a/', '/c/', '/r/'] } };
}
