/**
 * Fills the local development database with a sample workspace:  npm run seed:demo
 * Never runs against a real database. Stop the dev server first (the embedded database has one user at a time).
 * Prints a random password for the sample account.
 */
import { randomBytes, scryptSync } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';
import * as s from '../src/server/db/schema';
import { ensureDefaults } from '../src/server/db/defaults';

if (process.env.DATABASE_URL || process.env.NODE_ENV === 'production') {
  console.error('The demo data is only for the embedded development database.');
  process.exit(1);
}
const dir = process.env.PGLITE_DIR || '.data/pg';
mkdirSync(dir, { recursive: true });
const client = new PGlite(dir);
const db = drizzle(client, { schema: s });
await migrate(db, { migrationsFolder: './drizzle' });
await ensureDefaults(db);

const A = 'abcdefghijkmnpqrstuvwxyz23456789';
const token = (n: number) => [...randomBytes(n)].map((b) => A[b & 31]).join('');
const hours = (h: number) => new Date(Date.now() + h * 36e5);
const pick = <T>(a: T[], i: number) => a[i % a.length]!;
const password = process.env.DEMO_PASSWORD || `${token(5)}-${token(5)}-${token(5)}`;
const salt = randomBytes(16);
const passwordHash = `scrypt$131072$8$1$${salt.toString('base64')}$${scryptSync(password, salt, 32, { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 }).toString('base64')}`;
const email = 'demo@hayyak.test';

const [user] = await db.insert(s.users).values({ email, name: 'سارة الغامدي', passwordHash, emailVerifiedAt: new Date(), certNameAr: 'سارة أحمد الغامدي', certNameEn: 'Sara Ahmed Alghamdi', uniId: '444001234', tourSeen: true }).returning();
const [org] = await db.insert(s.orgs).values({ name: 'نادي العلوم', kind: 'تعليمي', contactEmail: email, phone: '+966551234567', reportToken: token(24) }).returning();
await db.insert(s.memberships).values({ orgId: org!.id, userId: user!.id, role: 'owner' });
const [lot] = await db.insert(s.creditLots).values({ orgId: org!.id, kind: 'paid', channel: 'whatsapp', total: 300, used: 0, expiresAt: hours(17 * 24), createdAt: hours(-13 * 24) }).returning();
await db.insert(s.creditLedger).values({ orgId: org!.id, lotId: lot!.id, delta: 300, reason: 'رصيد تجريبي' });

const FIRST = ['سارة', 'نورة', 'عبدالله', 'ريم', 'محمد', 'فهد', 'هيا', 'خالد', 'لمى', 'تركي', 'ماجد', 'منى', 'سلطان', 'جود', 'ليان', 'ياسر'];
const LAST = ['أحمد', 'العتيبي', 'الحربي', 'الزهراني', 'القحطاني', 'الشهري', 'المطيري', 'السبيعي', 'العنزي', 'الدوسري'];
const SEALS = ['مدعو', 'مدعو', 'مدعو', 'ضيف', 'متحدث', 'VIP', 'عضو', 'مدعو'];
let used = 0;

async function event(o: Partial<typeof s.invitations.$inferInsert> & { title: string }, n: number, odds: { open: number; yes: number; no: number; came: number }) {
  const [i] = await db.insert(s.invitations).values({ orgId: org!.id, slug: token(7), createdBy: user!.id, placeName: 'قاعة الملك فيصل', placeArea: 'العابدية، مكة', mapUrl: 'https://maps.app.goo.gl/example', sentAt: hours(-200), ...o }).returning();
  const charged = i!.status !== 'draft';
  const rows = n
    ? await db
        .insert(s.guests)
        .values(
          Array.from({ length: n }, (_, k) => {
            const r = (k * 37 + n) % 100;
            const status = r < odds.yes ? 'yes' : r < odds.yes + odds.no ? 'no' : 'pending';
            const opened = r < odds.open;
            return {
              orgId: org!.id, invitationId: i!.id, token: token(16), name: `${pick(FIRST, k * 5 + n)} ${pick(LAST, k * 3 + n)}`, email: k === 0 ? email : k % 3 ? '' : `guest${k}@example.com`, phone: k % 3 ? `+96655${String(1000000 + k * 137 + n).slice(0, 7)}` : '', seal: pick(SEALS, k), source: 'import' as const, charged, status: charged ? (status as 'yes' | 'no' | 'pending') : ('pending' as const),
              openCount: opened && charged ? 1 + (k % 3) : 0, firstOpenedAt: opened && charged ? hours(-100 + (k % 60)) : null, lastOpenedAt: opened && charged ? hours(-20 - (k % 40)) : null, respondedAt: status !== 'pending' && charged ? hours(-80 + (k % 70)) : null, sentVia: charged ? pick(['واتساب', 'واتساب', 'رابط', 'إيميل'], k) : '', sentAt: charged ? hours(-190) : null, certNameAr: '',
            };
          }),
        )
        .returning()
    : [];
  if (charged) used += n;
  await db.insert(s.invitationLog).values([{ invitationId: i!.id, text: 'انشأت الدعوة', tone: 'mute', at: hours(-320) }, ...(charged ? [{ invitationId: i!.id, text: `تجهزت ${n} دعوة ترسلها بنفسك`, tone: 'main', at: hours(-200) }] : [])]);
  if (odds.came) {
    const came = rows.filter((g) => g.status === 'yes').filter((_, k) => (k * 13) % 100 < odds.came);
    const day = i!.startsAt!;
    await db.insert(s.attendanceSessions).values({ orgId: org!.id, invitationId: i!.id, code: '4827', qrToken: token(18), openedAt: day, closesAt: new Date(day.getTime() + 6e5), closedAt: new Date(day.getTime() + 6e5) });
    if (came.length) {
      await db.insert(s.attendance).values(came.map((g, k) => ({ orgId: org!.id, invitationId: i!.id, guestId: g.id, method: 'code' as const, at: new Date(day.getTime() + (k % 9) * 60_000) })));
      await db.insert(s.certificates).values(came.map((g, k) => ({ code: token(14), orgId: org!.id, invitationId: i!.id, guestId: g.id, nameAr: g.name, downloads: k % 4 ? 1 : 0 })));
      await db.insert(s.certConfigs).values({ invitationId: i!.id, orgId: org!.id, config: {}, issuedAt: day });
    }
  }
  return { i: i!, rows };
}

const day = 24;
for (const [k, t] of [['لقاء التعارف', 'ضوء يلحقك'], ['ورشة البحث العلمي', 'لمعة لؤلؤ'], ['محاضرة الذكاء الاصطناعي', 'من القلب'], ['ورشة الإلقاء', 'مرّ شهاب'], ['ملتقى الأندية', 'ألعاب نارية']].entries()) await event({ title: t[0]!, pattern: t[1]!, status: 'ended', startsAt: hours(-(70 - k * 12) * day), eventLabel: 'أسبوع الكيمياء العربي' }, 18 + k * 6, { open: 90, yes: 66, no: 12, came: 74 + k * 4 });
const main = await event({ title: 'الحفل الختامي', latin: 'CLOSING CEREMONY', pattern: 'رشّة فرح', seal: 'عضو', status: 'sent', startsAt: hours(3 * day), eventLabel: 'أسبوع الكيمياء العربي' }, 40, { open: 85, yes: 60, no: 12, came: 0 });
await event({ title: 'دعوة المتحدثين', latin: 'SPEAKERS', pattern: 'لمعة لؤلؤ', seal: 'متحدث', status: 'sent', startsAt: hours(3 * day - 1), eventLabel: 'أسبوع الكيمياء العربي' }, 8, { open: 100, yes: 75, no: 0, came: 0 });
await event({ title: 'ليلة التراث', latin: 'HERITAGE NIGHT', pattern: 'سدو ينتسج', color: 1, seal: 'VIP', status: 'scheduled', scheduledAt: hours(4 * day), startsAt: hours(12 * day) }, 12, { open: 0, yes: 0, no: 0, came: 0 });
await event({ title: 'لقاء مفتوح', latin: 'OPEN MEETUP', pattern: 'مرّ شهاب', audience: 'public', cap: 60, status: 'sent', online: true, platform: 'Zoom', liveUrl: 'https://zoom.us/j/123456789', startsAt: hours(6 * day) }, 0, { open: 0, yes: 0, no: 0, came: 0 });
await event({ title: 'أمسية الشعر', latin: 'POETRY EVENING', pattern: 'انفتح الستار', seal: 'ضيف', status: 'draft' }, 0, { open: 0, yes: 0, no: 0, came: 0 });
await db.update(s.creditLots).set({ used });
const [svc] = await db.insert(s.customDesigns).values({ kind: 'seal', name: 'ختم سفير', orgId: org!.id, data: { text: 'سفير', wax: '#0A2A43', logo: '' } }).returning();
await db.insert(s.customRequests).values([{ orgId: org!.id, userId: user!.id, title: 'شاشة تحميل بشعاركم', description: 'نبي شعار النادي يتحرك', stage: 3, price: '99 ر.س', contactVia: 'واتساب', contactPhone: '+966551234567' }, { orgId: org!.id, userId: user!.id, title: 'ختم خاص', description: 'ختم سفير النادي', stage: 5, price: '79 ر.س', designId: svc!.id, contactVia: 'إيميل', contactEmail: email }]);
await db.insert(s.orders).values({ number: 10481, orgId: org!.id, userId: user!.id, count: 100, channel: 'email', items: [{ k: '100 دعوة', v: '155 ر.س', price: 155 }, { k: 'الإرسال', v: 'حيّــاك ترسلها بالإيميل', price: null }], total: 155, contact: { name: 'نادي العلوم', email, phone: '+966551234567' } });

await client.close();
console.log(`Demo workspace ready.\n  email:    ${email}\n  password: ${password}\n  guest:    /i/${main.i.slug}/${main.rows[1]!.token}`);
