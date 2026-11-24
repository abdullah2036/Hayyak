// All dates are shown in Riyadh time with western digits, in Arabic.
export const TZ = 'Asia/Riyadh';
const LOC = 'ar-SA-u-ca-gregory-nu-latn';

type D = Date | string | number | null | undefined;
const toDate = (d: D) => (d instanceof Date ? d : d === null || d === undefined || d === '' ? null : new Date(d));
const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(LOC, { timeZone: TZ, ...o });
const strip = (s: string) => s.replace(/[‏‎؜]/g, '').replace(/،/g, '').replace(/\s+/g, ' ').trim();

export function dayMonth(d: D) {
  const v = toDate(d);
  return v ? strip(fmt({ day: 'numeric', month: 'long' }).format(v)) : '';
}
export function weekdayDate(d: D) {
  const v = toDate(d);
  return v ? strip(fmt({ weekday: 'long', day: 'numeric', month: 'long' }).format(v)) : '';
}
export function fullDate(d: D) {
  const v = toDate(d);
  return v ? strip(fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(v)) : '';
}
export function longDate(d: D) {
  const v = toDate(d);
  return v ? strip(fmt({ day: 'numeric', month: 'long', year: 'numeric' }).format(v)) : '';
}
export function monthName(d: D) {
  const v = toDate(d);
  return v ? strip(fmt({ month: 'long' }).format(v)) : '';
}
export function dayNum(d: D) {
  const v = toDate(d);
  return v ? strip(fmt({ day: 'numeric' }).format(v)) : '';
}
export function time(d: D, long = false) {
  const v = toDate(d);
  if (!v) return '';
  const p = partsOf(v);
  const h12 = p.h % 12 || 12;
  return `${h12}:${String(p.mi).padStart(2, '0')} ${p.h < 12 ? (long ? 'صباحًا' : 'ص') : long ? 'مساءً' : 'م'}`;
}

/** Calendar parts of a moment, in Riyadh. */
export function partsOf(d: D) {
  const v = toDate(d) || new Date();
  const p: Record<string, number> = {};
  for (const x of new Intl.DateTimeFormat('en-US', { timeZone: TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).formatToParts(v)) {
    if (x.type !== 'literal') p[x.type] = Number(x.value);
  }
  return { y: p.year!, mo: p.month!, d: p.day!, h: p.hour!, mi: p.minute! };
}
export function inputDate(d: D) {
  const v = toDate(d);
  if (!v) return '';
  const p = partsOf(v);
  return `${p.y}-${String(p.mo).padStart(2, '0')}-${String(p.d).padStart(2, '0')}`;
}
export function inputTime(d: D) {
  const v = toDate(d);
  if (!v) return '';
  const p = partsOf(v);
  return `${String(p.h).padStart(2, '0')}:${String(p.mi).padStart(2, '0')}`;
}
/** Builds a moment from the date and time fields, read as Riyadh time (UTC+3, no daylight saving). */
export function fromInputs(date: string, clock: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const t = /^\d{2}:\d{2}$/.test(clock) ? clock : '00:00';
  const v = new Date(`${date}T${t}:00+03:00`);
  return Number.isNaN(v.getTime()) ? null : v;
}

export function relative(d: D, now = new Date()) {
  const v = toDate(d);
  if (!v) return '';
  const s = Math.round((now.getTime() - v.getTime()) / 1000);
  if (s < 60) return 'الحين';
  if (s < 3600) return `قبل ${plural(Math.floor(s / 60), 'دقيقة', 'دقيقتين', 'دقايق')}`;
  const a = inputDate(v);
  if (a === inputDate(now)) return 'اليوم';
  if (a === inputDate(new Date(now.getTime() - 864e5))) return 'أمس';
  const days = Math.floor(s / 86400);
  if (days < 30) return `قبل ${plural(Math.max(2, days), 'يوم', 'يومين', 'أيام')}`;
  return dayMonth(v);
}
export function until(d: D, now = new Date()) {
  const v = toDate(d);
  if (!v) return '';
  const days = Math.round((Date.parse(inputDate(v)) - Date.parse(inputDate(now))) / 864e5);
  if (days < 0) return 'انتهت';
  if (days === 0) return 'اليوم';
  if (days === 1) return 'بكرة';
  return `بعد ${plural(days, 'يوم', 'يومين', 'أيام')}`;
}
export function plural(n: number, one: string, two: string, few: string) {
  if (n === 1) return one;
  if (n === 2) return two;
  return n >= 3 && n <= 10 ? `${n} ${few}` : `${n} ${one}`;
}
export function durationText(min: number) {
  if (min === 60) return 'ساعة';
  if (min === 90) return 'ساعة ونص';
  if (min === 120) return 'ساعتان';
  if (min % 60 === 0) return `${min / 60} ساعات`;
  return `${Math.floor(min / 60)} ساعات ونص`;
}
/** Saudi university terms: first term Aug-Dec, second term Jan-Jul, with the Hijri academic year. */
export function term(d: D) {
  const p = partsOf(d);
  return p.mo >= 8 ? { key: `${p.y}-1`, label: `الفصل الأول ${p.y - 578}` } : { key: `${p.y}-0`, label: `الفصل الثاني ${p.y - 579}` };
}
