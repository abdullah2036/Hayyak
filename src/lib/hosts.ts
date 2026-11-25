/**
 * The Studio lives at its own address (STUDIO_URL), for example https://desk.example.com.
 *  - on the public address every Studio page and API answers 404, like any address that does not exist
 *  - on the Studio address nothing else is served
 *  - in production without STUDIO_URL the Studio is closed
 * In development both share one address.
 */
const origin = (v: string | undefined) => {
  try {
    return v ? new URL(v).origin : '';
  } catch {
    return '';
  }
};
export const appOrigin = () => origin(process.env.APP_URL) || 'http://localhost:3000';
export const studioOrigin = () => origin(process.env.STUDIO_URL) || (process.env.NODE_ENV === 'production' ? '' : appOrigin());

export type Area = 'app' | 'studio' | 'both';
export function areaOf(host: string | null): Area {
  const s = studioOrigin();
  if (!s) return 'app';
  if (s === appOrigin()) return 'both';
  return (host || '').toLowerCase() === new URL(s).host ? 'studio' : 'app';
}
export const staging = () => process.env.APP_ENV === 'staging';
