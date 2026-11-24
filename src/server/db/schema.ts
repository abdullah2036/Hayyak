import { sql } from 'drizzle-orm';
import { boolean, customType, index, integer, jsonb, pgTable, primaryKey, text, timestamp, uniqueIndex, uuid, check } from 'drizzle-orm/pg-core';

const bytea = customType<{ data: Buffer; driverData: Uint8Array }>({
  dataType: () => 'bytea',
  toDriver: (v) => v,
  fromDriver: (v) => Buffer.from(v),
});

const id = () => uuid('id').primaryKey().defaultRandom();
const ts = (n: string) => timestamp(n, { withTimezone: true, mode: 'date' });
const created = () => ts('created_at').notNull().defaultNow();

/* ---------- people and workspaces ---------- */

export const users = pgTable('users', {
  id: id(),
  email: text('email').notNull().unique(), // always stored lower case
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  emailVerifiedAt: ts('email_verified_at'),
  status: text('status').$type<'active' | 'suspended'>().notNull().default('active'),
  certNameAr: text('cert_name_ar').notNull().default(''),
  certNameEn: text('cert_name_en').notNull().default(''),
  uniId: text('uni_id').notNull().default(''),
  notify: jsonb('notify').$type<Record<string, boolean>>().notNull().default({ daily: true, each: false, low: true, requests: true, offers: false }),
  tourSeen: boolean('tour_seen').notNull().default(false),
  createdAt: created(),
  lastSeenAt: ts('last_seen_at'),
});

export const orgs = pgTable('orgs', {
  id: id(),
  name: text('name').notNull(),
  kind: text('kind').notNull().default(''),
  contactEmail: text('contact_email').notNull().default(''),
  phone: text('phone').notNull().default(''),
  logoAssetId: uuid('logo_asset_id'),
  status: text('status').$type<'active' | 'suspended'>().notNull().default('active'),
  reportToken: text('report_token').notNull().unique(),
  createdAt: created(),
  lastActiveAt: ts('last_active_at'),
});

export type OrgRole = 'owner' | 'manager' | 'viewer';
export const memberships = pgTable(
  'memberships',
  {
    orgId: uuid('org_id').notNull().references(() => orgs.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    role: text('role').$type<OrgRole>().notNull(),
    createdAt: created(),
  },
  (t) => [primaryKey({ columns: [t.orgId, t.userId] }), index('memberships_user').on(t.userId)],
);

export const orgInvites = pgTable(
  'org_invites',
  {
    id: id(),
    orgId: uuid('org_id').notNull().references(() => orgs.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    role: text('role').$type<OrgRole>().notNull(),
    invitedBy: uuid('invited_by').notNull(),
    expiresAt: ts('expires_at').notNull(),
    createdAt: created(),
  },
  (t) => [uniqueIndex('org_invites_once').on(t.orgId, t.email), index('org_invites_email').on(t.email)],
);

/** Hayyak team members who can enter the Studio. Kept apart from customers on purpose. */
export type StaffRole = 'founder' | 'support' | 'design';
export const staff = pgTable('staff', {
  id: id(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').$type<StaffRole>().notNull(),
  status: text('status').$type<'pending' | 'active' | 'disabled'>().notNull().default('pending'),
  createdAt: created(),
  lastLoginAt: ts('last_login_at'),
});

export const sessions = pgTable(
  'sessions',
  {
    id: id(),
    tokenHash: text('token_hash').notNull().unique(),
    kind: text('kind').$type<'user' | 'staff'>().notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    staffId: uuid('staff_id').references(() => staff.id, { onDelete: 'cascade' }),
    orgId: uuid('org_id').references(() => orgs.id, { onDelete: 'set null' }),
    device: text('device').notNull().default(''),
    ip: text('ip').notNull().default(''),
    createdAt: created(),
    lastSeenAt: ts('last_seen_at').notNull().defaultNow(),
    expiresAt: ts('expires_at').notNull(),
  },
  (t) => [index('sessions_user').on(t.userId), index('sessions_staff').on(t.staffId)],
);

/** Devices that already passed an email code, so they are not asked again. */
export const trustedDevices = pgTable(
  'trusted_devices',
  {
    id: id(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: text('token_hash').notNull(),
    expiresAt: ts('expires_at').notNull(),
    createdAt: created(),
  },
  (t) => [uniqueIndex('trusted_once').on(t.userId, t.tokenHash)],
);

export const otps = pgTable(
  'otps',
  {
    id: id(),
    purpose: text('purpose').$type<'signup' | 'login' | 'reset' | 'studio'>().notNull(),
    email: text('email').notNull(),
    codeHash: text('code_hash').notNull(),
    payload: jsonb('payload').$type<Record<string, unknown>>().notNull().default({}),
    attempts: integer('attempts').notNull().default(0),
    expiresAt: ts('expires_at').notNull(),
    consumedAt: ts('consumed_at'),
    createdAt: created(),
  },
  (t) => [index('otps_lookup').on(t.purpose, t.email)],
);

export const rateLimits = pgTable('rate_limits', {
  key: text('key').primaryKey(),
  count: integer('count').notNull(),
  resetAt: ts('reset_at').notNull(),
});

export const auditLog = pgTable(
  'audit_log',
  {
    id: id(),
    actorType: text('actor_type').$type<'user' | 'staff' | 'system' | 'guest'>().notNull(),
    actorId: text('actor_id').notNull().default(''),
    actorName: text('actor_name').notNull().default(''),
    action: text('action').notNull(),
    detail: text('detail').notNull().default(''),
    reason: text('reason').notNull().default(''),
    orgId: uuid('org_id'),
    ip: text('ip').notNull().default(''),
    at: ts('at').notNull().defaultNow(),
  },
  (t) => [index('audit_at').on(t.at), index('audit_org').on(t.orgId, t.at)],
);

/** Uploaded images. Every file is re-encoded by the server before it is stored. */
export const assets = pgTable(
  'assets',
  {
    id: id(),
    orgId: uuid('org_id').references(() => orgs.id, { onDelete: 'cascade' }),
    kind: text('kind').$type<'logo' | 'photo' | 'signature' | 'certbg' | 'custom'>().notNull(),
    mime: text('mime').notNull(),
    width: integer('width').notNull(),
    height: integer('height').notNull(),
    bytes: bytea('bytes').notNull(),
    createdAt: created(),
  },
  (t) => [index('assets_org').on(t.orgId)],
);

/* ---------- credit, orders, customisation ---------- */

export type Channel = 'self' | 'email' | 'whatsapp';
export const creditLots = pgTable(
  'credit_lots',
  {
    id: id(),
    orgId: uuid('org_id').notNull().references(() => orgs.id, { onDelete: 'cascade' }),
    kind: text('kind').$type<'free' | 'paid' | 'grant'>().notNull(),
    channel: text('channel').$type<Channel>().notNull(),
    total: integer('total').notNull(),
    used: integer('used').notNull().default(0),
    orderId: uuid('order_id'),
    expiresAt: ts('expires_at'),
    lowNotifiedAt: ts('low_notified_at'),
    createdAt: created(),
  },
  (t) => [index('lots_org').on(t.orgId), check('lots_used', sql`${t.used} >= 0 and ${t.used} <= ${t.total}`)],
);

export const creditLedger = pgTable(
  'credit_ledger',
  {
    id: id(),
    orgId: uuid('org_id').notNull().references(() => orgs.id, { onDelete: 'cascade' }),
    lotId: uuid('lot_id').notNull().references(() => creditLots.id, { onDelete: 'cascade' }),
    delta: integer('delta').notNull(),
    reason: text('reason').notNull(),
    invitationId: uuid('invitation_id'),
    createdAt: created(),
  },
  (t) => [index('ledger_org').on(t.orgId, t.createdAt)],
);

export const orders = pgTable(
  'orders',
  {
    id: id(),
    number: integer('number').notNull().unique(),
    orgId: uuid('org_id').notNull().references(() => orgs.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').notNull(),
    count: integer('count').notNull(),
    channel: text('channel').$type<Channel>().notNull(),
    items: jsonb('items').$type<{ k: string; v: string; price: number | null }[]>().notNull(),
    total: integer('total').notNull(), // whole riyals
    contact: jsonb('contact').$type<{ name: string; email: string; phone: string }>().notNull(),
    status: text('status').$type<'pending' | 'paid' | 'cancelled'>().notNull().default('pending'),
    decidedBy: text('decided_by').notNull().default(''),
    decidedAt: ts('decided_at'),
    createdAt: created(),
  },
  (t) => [index('orders_org').on(t.orgId), index('orders_status').on(t.status)],
);

export const services = pgTable('services', {
  id: id(),
  key: text('key').notNull().unique(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  duration: text('duration').notNull().default(''),
  price: integer('price'), // null = quoted on request
  available: boolean('available').notNull().default(true),
  sort: integer('sort').notNull().default(0),
});

export const customRequests = pgTable(
  'custom_requests',
  {
    id: id(),
    orgId: uuid('org_id').notNull().references(() => orgs.id, { onDelete: 'cascade' }),
    userId: uuid('user_id'),
    title: text('title').notNull(),
    description: text('description').notNull().default(''),
    contactVia: text('contact_via').notNull().default(''),
    contactPhone: text('contact_phone').notNull().default(''),
    contactEmail: text('contact_email').notNull().default(''),
    stage: integer('stage').notNull().default(0), // 0..5, see lib/constants
    price: text('price').notNull().default(''),
    message: text('message').notNull().default(''),
    designId: uuid('design_id'),
    createdAt: created(),
    updatedAt: ts('updated_at').notNull().defaultNow(),
  },
  (t) => [index('requests_org').on(t.orgId), index('requests_stage').on(t.stage)],
);

/** Private or public designs delivered by the Studio: a seal, a colour set, a loading screen, or a whole pattern. */
export const customDesigns = pgTable(
  'custom_designs',
  {
    id: id(),
    kind: text('kind').$type<'seal' | 'colors' | 'loading' | 'pattern'>().notNull(),
    name: text('name').notNull(),
    orgId: uuid('org_id').references(() => orgs.id, { onDelete: 'cascade' }), // null = public
    data: jsonb('data').$type<Record<string, unknown>>().notNull(),
    approved: boolean('approved').notNull().default(true),
    createdAt: created(),
  },
  (t) => [index('designs_org').on(t.orgId)],
);

/* ---------- invitations and guests ---------- */

export type InvStatus = 'draft' | 'scheduled' | 'sent' | 'ended';
export type Reminders = { by: 'hayyak' | 'self' | 'none'; day: boolean; hours: boolean; dayDone?: boolean; hoursDone?: boolean };
export const invitations = pgTable(
  'invitations',
  {
    id: id(),
    orgId: uuid('org_id').notNull().references(() => orgs.id, { onDelete: 'cascade' }),
    slug: text('slug').notNull().unique(),
    status: text('status').$type<InvStatus>().notNull().default('draft'),
    audience: text('audience').$type<'private' | 'public'>().notNull().default('private'),
    pattern: text('pattern').notNull().default('لمّة نجوم'),
    color: integer('color').notNull().default(0),
    customPatternId: uuid('custom_pattern_id'),
    customColorsId: uuid('custom_colors_id'),
    customSealId: uuid('custom_seal_id'),
    customLoadingId: uuid('custom_loading_id'),
    seal: text('seal').notNull().default('مدعو'),
    photoAssetId: uuid('photo_asset_id'),
    title: text('title').notNull().default(''),
    latin: text('latin').notNull().default(''),
    eventLabel: text('event_label').notNull().default(''),
    startsAt: ts('starts_at'),
    durationMin: integer('duration_min').notNull().default(120),
    online: boolean('online').notNull().default(false),
    placeName: text('place_name').notNull().default(''),
    placeArea: text('place_area').notNull().default(''),
    mapUrl: text('map_url').notNull().default(''),
    platform: text('platform').notNull().default('Zoom'),
    liveUrl: text('live_url').notNull().default(''),
    sendBy: text('send_by').$type<'self' | 'hayyak'>().notNull().default('self'),
    sendChannels: jsonb('send_channels').$type<string[]>().notNull().default(['link', 'message']),
    message: text('message').notNull().default(''),
    scheduledAt: ts('scheduled_at'),
    reminders: jsonb('reminders').$type<Reminders>().notNull().default({ by: 'self', day: true, hours: true }),
    cap: integer('cap'),
    closesAt: ts('closes_at'),
    sentAt: ts('sent_at'),
    archivedAt: ts('archived_at'),
    purgedAt: ts('purged_at'),
    createdBy: uuid('created_by'),
    createdAt: created(),
    updatedAt: ts('updated_at').notNull().defaultNow(),
  },
  (t) => [index('inv_org').on(t.orgId, t.createdAt), index('inv_status').on(t.status, t.startsAt)],
);

export type GuestStatus = 'pending' | 'yes' | 'no';
export const guests = pgTable(
  'guests',
  {
    id: id(),
    orgId: uuid('org_id').notNull().references(() => orgs.id, { onDelete: 'cascade' }),
    invitationId: uuid('invitation_id').notNull().references(() => invitations.id, { onDelete: 'cascade' }),
    token: text('token').notNull().unique(),
    name: text('name').notNull(),
    title: text('title').notNull().default(''),
    phone: text('phone').notNull().default(''),
    email: text('email').notNull().default(''),
    seal: text('seal').notNull().default('مدعو'),
    note: text('note').notNull().default(''),
    source: text('source').$type<'manual' | 'import' | 'public' | 'walkin'>().notNull().default('manual'),
    status: text('status').$type<GuestStatus>().notNull().default('pending'),
    charged: boolean('charged').notNull().default(false),
    openCount: integer('open_count').notNull().default(0),
    firstOpenedAt: ts('first_opened_at'),
    lastOpenedAt: ts('last_opened_at'),
    respondedAt: ts('responded_at'),
    savedVideo: boolean('saved_video').notNull().default(false),
    certNameAr: text('cert_name_ar').notNull().default(''),
    certNameEn: text('cert_name_en').notNull().default(''),
    extraValue: text('extra_value').notNull().default(''),
    sentVia: text('sent_via').notNull().default(''),
    sentAt: ts('sent_at'),
    archive: text('archive'), // encrypted personal data after 90 days
    createdAt: created(),
  },
  (t) => [index('guests_inv').on(t.invitationId), index('guests_org').on(t.orgId), index('guests_email').on(t.email)],
);

export const invitationLog = pgTable(
  'invitation_log',
  {
    id: id(),
    invitationId: uuid('invitation_id').notNull().references(() => invitations.id, { onDelete: 'cascade' }),
    text: text('text').notNull(),
    detail: text('detail').notNull().default(''),
    tone: text('tone').notNull().default('info'),
    at: ts('at').notNull().defaultNow(),
  },
  (t) => [index('invlog_inv').on(t.invitationId, t.at)],
);

/** "Hayyak sends it for you": a request the Studio works through. */
export const sendRequests = pgTable(
  'send_requests',
  {
    id: id(),
    orgId: uuid('org_id').notNull().references(() => orgs.id, { onDelete: 'cascade' }),
    invitationId: uuid('invitation_id').notNull().references(() => invitations.id, { onDelete: 'cascade' }),
    kind: text('kind').$type<'invite' | 'reminder'>().notNull().default('invite'),
    channels: jsonb('channels').$type<Channel[]>().notNull(),
    count: integer('count').notNull(),
    status: integer('status').notNull().default(0), // 0 new, 1 sending, 2 sent
    createdAt: created(),
    updatedAt: ts('updated_at').notNull().defaultNow(),
  },
  (t) => [index('sendreq_status').on(t.status)],
);

/** Outgoing email queue. */
export const outbox = pgTable(
  'outbox',
  {
    id: id(),
    toEmail: text('to_email').notNull(),
    fromName: text('from_name').notNull().default('حيّــاك'),
    subject: text('subject').notNull(),
    text: text('body_text').notNull(),
    html: text('body_html').notNull(),
    guestId: uuid('guest_id'),
    status: text('status').$type<'queued' | 'sent' | 'failed'>().notNull().default('queued'),
    attempts: integer('attempts').notNull().default(0),
    error: text('error').notNull().default(''),
    notBefore: ts('not_before').notNull().defaultNow(),
    createdAt: created(),
    sentAt: ts('sent_at'),
  },
  (t) => [index('outbox_queue').on(t.status, t.notBefore)],
);

/* ---------- attendance and certificates ---------- */

export const attendanceSessions = pgTable(
  'attendance_sessions',
  {
    id: id(),
    orgId: uuid('org_id').notNull().references(() => orgs.id, { onDelete: 'cascade' }),
    invitationId: uuid('invitation_id').notNull().references(() => invitations.id, { onDelete: 'cascade' }),
    phase: text('phase').$type<'start' | 'end'>().notNull().default('end'),
    mode: text('mode').$type<'person' | 'online'>().notNull().default('person'),
    code: text('code').notNull(),
    qrToken: text('qr_token').notNull().unique(),
    openedAt: ts('opened_at').notNull().defaultNow(),
    closesAt: ts('closes_at').notNull(),
    closedAt: ts('closed_at'),
    final: boolean('final').notNull().default(true),
    autoCert: boolean('auto_cert').notNull().default(true),
  },
  (t) => [index('att_sess_inv').on(t.invitationId)],
);

export const attendance = pgTable(
  'attendance',
  {
    id: id(),
    orgId: uuid('org_id').notNull().references(() => orgs.id, { onDelete: 'cascade' }),
    invitationId: uuid('invitation_id').notNull().references(() => invitations.id, { onDelete: 'cascade' }),
    guestId: uuid('guest_id').notNull().references(() => guests.id, { onDelete: 'cascade' }),
    method: text('method').$type<'code' | 'qr' | 'manual'>().notNull(),
    startAt: ts('start_at'),
    at: ts('at').notNull().defaultNow(),
    complete: boolean('complete').notNull().default(true),
  },
  (t) => [uniqueIndex('attendance_once').on(t.invitationId, t.guestId)],
);

export const certConfigs = pgTable('cert_configs', {
  invitationId: uuid('invitation_id').primaryKey().references(() => invitations.id, { onDelete: 'cascade' }),
  orgId: uuid('org_id').notNull().references(() => orgs.id, { onDelete: 'cascade' }),
  config: jsonb('config').$type<Record<string, unknown>>().notNull(),
  issuedAt: ts('issued_at'),
  updatedAt: ts('updated_at').notNull().defaultNow(),
});

export const certificates = pgTable(
  'certificates',
  {
    id: id(),
    code: text('code').notNull().unique(),
    orgId: uuid('org_id').notNull().references(() => orgs.id, { onDelete: 'cascade' }),
    invitationId: uuid('invitation_id').notNull().references(() => invitations.id, { onDelete: 'cascade' }),
    guestId: uuid('guest_id').notNull().references(() => guests.id, { onDelete: 'cascade' }),
    kind: text('kind').$type<'attend' | 'thanks'>().notNull().default('attend'),
    nameAr: text('name_ar').notNull(),
    nameEn: text('name_en').notNull().default(''),
    downloads: integer('downloads').notNull().default(0),
    issuedAt: ts('issued_at').notNull().defaultNow(),
  },
  (t) => [uniqueIndex('cert_once').on(t.invitationId, t.guestId, t.kind)],
);

export const nameRequests = pgTable(
  'name_requests',
  {
    id: id(),
    orgId: uuid('org_id').notNull().references(() => orgs.id, { onDelete: 'cascade' }),
    invitationId: uuid('invitation_id').notNull().references(() => invitations.id, { onDelete: 'cascade' }),
    guestId: uuid('guest_id').notNull().references(() => guests.id, { onDelete: 'cascade' }),
    fromName: text('from_name').notNull(),
    toName: text('to_name').notNull(),
    status: text('status').$type<'pending' | 'ok' | 'no'>().notNull().default('pending'),
    createdAt: created(),
    decidedAt: ts('decided_at'),
  },
  (t) => [index('namereq_inv').on(t.invitationId)],
);

export const thankNotes = pgTable(
  'thank_notes',
  {
    id: id(),
    invitationId: uuid('invitation_id').notNull().references(() => invitations.id, { onDelete: 'cascade' }),
    group: integer('grp').notNull(), // 0 everyone, 1 speakers, 2 sponsors, 3 volunteers
    text: text('text').notNull(),
    withCert: boolean('with_cert').notNull().default(false),
    postedAt: ts('posted_at').notNull().defaultNow(),
  },
  (t) => [uniqueIndex('thanks_once').on(t.invitationId, t.group)],
);
