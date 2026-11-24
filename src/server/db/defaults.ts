import { services } from './schema';

/** Customisation services shown to customers. The Studio can change prices and availability later. */
export const DEFAULT_SERVICES = [
  { key: 'colors', name: 'ألوان خاصة لنمط', description: 'نمط بألوان هويتكم', duration: '1–2 يوم عمل', price: 49, sort: 1 },
  { key: 'seal', name: 'ختم خاص', description: 'بنص ولون تختارونه', duration: '2–3 أيام عمل', price: 79, sort: 2 },
  { key: 'loading', name: 'شاشة تحميل بشعاركم', description: 'تفتح الدعوة بشعاركم', duration: '3–5 أيام عمل', price: 99, sort: 3 },
  { key: 'bundle', name: 'الثلاثة مع بعض', description: 'ألوان وختم وشاشة تحميل، بدل 227', duration: '3–5 أيام عمل', price: 199, sort: 4 },
  { key: 'identity', name: 'هويتكم داخل الدعوة', description: 'شعاركم وألوانكم وخطكم', duration: 'نتفق على المدة', price: null, sort: 5 },
  { key: 'motion', name: 'نمط حركة جديد', description: 'حركة مصممة على فكرتكم', duration: 'نتفق على المدة', price: null, sort: 6 },
  { key: 'other', name: 'فكرة ثانية', description: 'أي شيء مو موجود', duration: 'نتفق على المدة', price: null, sort: 7 },
];

type Insertable = { insert: (t: typeof services) => { values: (v: typeof DEFAULT_SERVICES) => { onConflictDoNothing: () => PromiseLike<unknown> } } };
export async function ensureDefaults(db: unknown) {
  await (db as Insertable).insert(services).values(DEFAULT_SERVICES).onConflictDoNothing();
}
