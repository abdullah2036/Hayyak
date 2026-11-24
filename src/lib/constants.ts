// Product rules shared by the server and the browser.

export const PATTERNS = ['لمّة نجوم', 'لمعة لؤلؤ', 'من القلب', 'ألعاب نارية', 'رشّة فرح', 'انفتح الستار', 'مرّ شهاب', 'ضوء يلحقك', 'سدو ينتسج', 'صورة خاصة'] as const;
export const PHOTO_PATTERN = 'صورة خاصة';

/** [seal name, colour, light, deep] */
export const SEALS: [string, string, string, string, number][] = [
  ['مدعو', '#0E97AE', '#4CC7DA', '#086577', 22],
  ['ضيف', '#2D5A8C', '#6E95C4', '#1A3A60', 24],
  ['عضو', '#3F7F6A', '#77B59F', '#285445', 24],
  ['متحدث', '#0A2A43', '#3E6688', '#04121F', 19],
  ['VIP', '#B8892A', '#E7C873', '#7E5B14', 24],
  ['راعي', '#7A3E5B', '#B07592', '#52253C', 22],
  ['شريك', '#4A4682', '#7E7AB8', '#2E2B5A', 22],
  ['تحكيم', '#8C2F39', '#C66972', '#5C1A22', 20],
];
export const SEAL_NAMES = SEALS.map((s) => s[0]);
/** Seals that are only available while the workspace has paid credit. */
export const PAID_SEALS = ['راعي', 'شريك', 'تحكيم'];

/** Credit packs: [count, self, email, whatsapp] in riyals. */
export const PACKS: [number, number, number, number][] = [
  [30, 35, 50, 59],
  [50, 55, 80, 95],
  [100, 105, 155, 185],
  [150, 155, 230, 275],
  [200, 199, 299, 359],
  [300, 289, 439, 529],
];
export const CHANNELS = ['self', 'email', 'whatsapp'] as const;
export const CHANNEL_NAMES: Record<string, string> = { self: 'أرسلها بنفسي', email: 'حيّــاك ترسلها بالإيميل', whatsapp: 'حيّــاك ترسلها بالواتساب' };
export const CHANNEL_SHORT: Record<string, string> = { self: 'بنفسه', email: 'إيميل', whatsapp: 'واتساب', free: 'مجاني' };

export const FREE_CREDITS = 10;
export const CREDIT_DAYS = 30;
export const SEND_LEAD_HOURS = 48;
export const CERT_LINK_DAYS = 30;
export const ARCHIVE_DAYS = 90;
export const PURGE_DAYS = 180;
export const MAX_GUESTS = 1000;

export const STAGES: [string, string][] = [
  ['طلب جديد', 'استلمنا طلبك'],
  ['بانتظار التواصل', 'بانتظار التواصل معك'],
  ['تم التواصل', 'تم التواصل'],
  ['قيد التصميم', 'قيد التصميم'],
  ['بانتظار موافقة المستخدم', 'بانتظار موافقتك'],
  ['تم التسليم', 'تم التسليم'],
];

export const ENGINES: [string, string][] = [
  ['نجوم', 'نجوم تلمع وتتحرك'],
  ['ألعاب نارية', 'انفجارات ملونة'],
  ['ضوء يلحقك', 'ذرات ضوء تطلع لفوق'],
  ['مرّ شهاب', 'خطوط ضوء تعبر السماء'],
  ['رشّة فرح', 'قصاصات ملونة تنزل'],
];

export const PLATFORMS = ['Zoom', 'Google Meet', 'Microsoft Teams', 'YouTube Live'];
export const DURATIONS: [number, string][] = [
  [60, 'ساعة'],
  [90, 'ساعة ونص'],
  [120, 'ساعتين'],
  [180, '3 ساعات'],
  [240, '4 ساعات'],
  [300, '5 ساعات'],
  [480, 'يوم كامل'],
];

/** Thank-you groups: which seals each one reaches. */
export const THANK_GROUPS: { label: string; seals: string[] | null }[] = [
  { label: 'كل الحضور', seals: null },
  { label: 'المتحدثين', seals: ['متحدث'] },
  { label: 'الرعاة', seals: ['راعي', 'شريك'] },
  { label: 'المتطوعين', seals: ['عضو'] },
];

export const STAFF_ROLES: Record<string, string> = { founder: 'مؤسس', support: 'دعم', design: 'تصميم' };
export const ORG_ROLES: Record<string, string> = { owner: 'مالك الحساب', manager: 'مشرف', viewer: 'مشاهد' };

export function packPrice(count: number, channel: string): number | null {
  const row = PACKS.find((p) => p[0] === count);
  const i = (CHANNELS as readonly string[]).indexOf(channel);
  return row && i >= 0 ? (row[1 + i] as number) : null;
}
