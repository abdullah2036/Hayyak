import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: ['/$', '/privacy', '/terms', '/signup'], disallow: ['/app', '/studio', '/api', '/i/', '/a/', '/c/', '/r/'] } };
}
