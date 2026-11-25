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

/** Starting values. The founders change them later from the Studio (settings table). */
export const DEFAULT_PACKS = [
  { count: 30, self: 35, email: 50, whatsapp: 59, on: true },
  { count: 50, self: 55, email: 80, whatsapp: 95, on: true },
  { count: 100, self: 105, email: 155, whatsapp: 185, on: true },
  { count: 150, self: 155, email: 230, whatsapp: 275, on: true },
  { count: 200, self: 199, email: 299, whatsapp: 359, on: true },
  { count: 300, self: 289, email: 439, whatsapp: 529, on: true },
];
export type Pack = (typeof DEFAULT_PACKS)[number];
export const DEFAULT_FREE = 10;
export const CHANNELS = ['self', 'email', 'whatsapp'] as const;
export const CHANNEL_NAMES: Record<string, string> = { self: 'أرسلها بنفسي', email: 'حيّــاك ترسلها بالإيميل', whatsapp: 'حيّــاك ترسلها بالواتساب' };
export const CHANNEL_SHORT: Record<string, string> = { self: 'بنفسه', email: 'إيميل', whatsapp: 'واتساب', free: 'مجاني' };

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
