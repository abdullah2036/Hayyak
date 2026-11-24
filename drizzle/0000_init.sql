CREATE TABLE "assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid,
	"kind" text NOT NULL,
	"mime" text NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"bytes" "bytea" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attendance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"invitation_id" uuid NOT NULL,
	"guest_id" uuid NOT NULL,
	"method" text NOT NULL,
	"start_at" timestamp with time zone,
	"at" timestamp with time zone DEFAULT now() NOT NULL,
	"complete" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attendance_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"invitation_id" uuid NOT NULL,
	"phase" text DEFAULT 'end' NOT NULL,
	"mode" text DEFAULT 'person' NOT NULL,
	"code" text NOT NULL,
	"qr_token" text NOT NULL,
	"opened_at" timestamp with time zone DEFAULT now() NOT NULL,
	"closes_at" timestamp with time zone NOT NULL,
	"closed_at" timestamp with time zone,
	"final" boolean DEFAULT true NOT NULL,
	"auto_cert" boolean DEFAULT true NOT NULL,
	CONSTRAINT "attendance_sessions_qr_token_unique" UNIQUE("qr_token")
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_type" text NOT NULL,
	"actor_id" text DEFAULT '' NOT NULL,
	"actor_name" text DEFAULT '' NOT NULL,
	"action" text NOT NULL,
	"detail" text DEFAULT '' NOT NULL,
	"reason" text DEFAULT '' NOT NULL,
	"org_id" uuid,
	"ip" text DEFAULT '' NOT NULL,
	"at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cert_configs" (
	"invitation_id" uuid PRIMARY KEY NOT NULL,
	"org_id" uuid NOT NULL,
	"config" jsonb NOT NULL,
	"issued_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "certificates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"org_id" uuid NOT NULL,
	"invitation_id" uuid NOT NULL,
	"guest_id" uuid NOT NULL,
	"kind" text DEFAULT 'attend' NOT NULL,
	"name_ar" text NOT NULL,
	"name_en" text DEFAULT '' NOT NULL,
	"downloads" integer DEFAULT 0 NOT NULL,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "certificates_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "credit_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"lot_id" uuid NOT NULL,
	"delta" integer NOT NULL,
	"reason" text NOT NULL,
	"invitation_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "credit_lots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"channel" text NOT NULL,
	"total" integer NOT NULL,
	"used" integer DEFAULT 0 NOT NULL,
	"order_id" uuid,
	"expires_at" timestamp with time zone,
	"low_notified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lots_used" CHECK ("credit_lots"."used" >= 0 and "credit_lots"."used" <= "credit_lots"."total")
);
--> statement-breakpoint
CREATE TABLE "custom_designs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" text NOT NULL,
	"name" text NOT NULL,
	"org_id" uuid,
	"data" jsonb NOT NULL,
	"approved" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "custom_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"user_id" uuid,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"contact_via" text DEFAULT '' NOT NULL,
	"contact_phone" text DEFAULT '' NOT NULL,
	"contact_email" text DEFAULT '' NOT NULL,
	"stage" integer DEFAULT 0 NOT NULL,
	"price" text DEFAULT '' NOT NULL,
	"message" text DEFAULT '' NOT NULL,
	"design_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"invitation_id" uuid NOT NULL,
	"token" text NOT NULL,
	"name" text NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"seal" text DEFAULT 'مدعو' NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"source" text DEFAULT 'manual' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"charged" boolean DEFAULT false NOT NULL,
	"open_count" integer DEFAULT 0 NOT NULL,
	"first_opened_at" timestamp with time zone,
	"last_opened_at" timestamp with time zone,
	"responded_at" timestamp with time zone,
	"saved_video" boolean DEFAULT false NOT NULL,
	"cert_name_ar" text DEFAULT '' NOT NULL,
	"cert_name_en" text DEFAULT '' NOT NULL,
	"extra_value" text DEFAULT '' NOT NULL,
	"sent_via" text DEFAULT '' NOT NULL,
	"sent_at" timestamp with time zone,
	"archive" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "guests_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "invitation_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invitation_id" uuid NOT NULL,
	"text" text NOT NULL,
	"detail" text DEFAULT '' NOT NULL,
	"tone" text DEFAULT 'info' NOT NULL,
	"at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"audience" text DEFAULT 'private' NOT NULL,
	"pattern" text DEFAULT 'لمّة نجوم' NOT NULL,
	"color" integer DEFAULT 0 NOT NULL,
	"custom_pattern_id" uuid,
	"custom_colors_id" uuid,
	"custom_seal_id" uuid,
	"custom_loading_id" uuid,
	"seal" text DEFAULT 'مدعو' NOT NULL,
	"photo_asset_id" uuid,
	"title" text DEFAULT '' NOT NULL,
	"latin" text DEFAULT '' NOT NULL,
	"event_label" text DEFAULT '' NOT NULL,
	"starts_at" timestamp with time zone,
	"duration_min" integer DEFAULT 120 NOT NULL,
	"online" boolean DEFAULT false NOT NULL,
	"place_name" text DEFAULT '' NOT NULL,
	"place_area" text DEFAULT '' NOT NULL,
	"map_url" text DEFAULT '' NOT NULL,
	"platform" text DEFAULT 'Zoom' NOT NULL,
	"live_url" text DEFAULT '' NOT NULL,
	"send_by" text DEFAULT 'self' NOT NULL,
	"send_channels" jsonb DEFAULT '["link","message"]'::jsonb NOT NULL,
	"message" text DEFAULT '' NOT NULL,
	"scheduled_at" timestamp with time zone,
	"reminders" jsonb DEFAULT '{"by":"self","day":true,"hours":true}'::jsonb NOT NULL,
	"cap" integer,
	"closes_at" timestamp with time zone,
	"sent_at" timestamp with time zone,
	"archived_at" timestamp with time zone,
	"purged_at" timestamp with time zone,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "invitations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "memberships" (
	"org_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "memberships_org_id_user_id_pk" PRIMARY KEY("org_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "name_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"invitation_id" uuid NOT NULL,
	"guest_id" uuid NOT NULL,
	"from_name" text NOT NULL,
	"to_name" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"decided_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"number" integer NOT NULL,
	"org_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"count" integer NOT NULL,
	"channel" text NOT NULL,
	"items" jsonb NOT NULL,
	"total" integer NOT NULL,
	"contact" jsonb NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"decided_by" text DEFAULT '' NOT NULL,
	"decided_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "orders_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE "org_invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"email" text NOT NULL,
	"role" text NOT NULL,
	"invited_by" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orgs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"kind" text DEFAULT '' NOT NULL,
	"contact_email" text DEFAULT '' NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"logo_asset_id" uuid,
	"status" text DEFAULT 'active' NOT NULL,
	"report_token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_active_at" timestamp with time zone,
	CONSTRAINT "orgs_report_token_unique" UNIQUE("report_token")
);
--> statement-breakpoint
CREATE TABLE "otps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"purpose" text NOT NULL,
	"email" text NOT NULL,
	"code_hash" text NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"consumed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "outbox" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"to_email" text NOT NULL,
	"from_name" text DEFAULT 'حيّــاك' NOT NULL,
	"subject" text NOT NULL,
	"body_text" text NOT NULL,
	"body_html" text NOT NULL,
	"guest_id" uuid,
	"status" text DEFAULT 'queued' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"error" text DEFAULT '' NOT NULL,
	"not_before" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sent_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "rate_limits" (
	"key" text PRIMARY KEY NOT NULL,
	"count" integer NOT NULL,
	"reset_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "send_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"invitation_id" uuid NOT NULL,
	"kind" text DEFAULT 'invite' NOT NULL,
	"channels" jsonb NOT NULL,
	"count" integer NOT NULL,
	"status" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"duration" text DEFAULT '' NOT NULL,
	"price" integer,
	"available" boolean DEFAULT true NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "services_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_hash" text NOT NULL,
	"kind" text NOT NULL,
	"user_id" uuid,
	"staff_id" uuid,
	"org_id" uuid,
	"device" text DEFAULT '' NOT NULL,
	"ip" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	CONSTRAINT "sessions_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_login_at" timestamp with time zone,
	CONSTRAINT "staff_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "thank_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invitation_id" uuid NOT NULL,
	"grp" integer NOT NULL,
	"text" text NOT NULL,
	"with_cert" boolean DEFAULT false NOT NULL,
	"posted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trusted_devices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"password_hash" text NOT NULL,
	"email_verified_at" timestamp with time zone,
	"status" text DEFAULT 'active' NOT NULL,
	"cert_name_ar" text DEFAULT '' NOT NULL,
	"cert_name_en" text DEFAULT '' NOT NULL,
	"uni_id" text DEFAULT '' NOT NULL,
	"notify" jsonb DEFAULT '{"daily":true,"each":false,"low":true,"requests":true,"offers":false}'::jsonb NOT NULL,
	"tour_seen" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_invitation_id_invitations_id_fk" FOREIGN KEY ("invitation_id") REFERENCES "public"."invitations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_guest_id_guests_id_fk" FOREIGN KEY ("guest_id") REFERENCES "public"."guests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_sessions" ADD CONSTRAINT "attendance_sessions_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_sessions" ADD CONSTRAINT "attendance_sessions_invitation_id_invitations_id_fk" FOREIGN KEY ("invitation_id") REFERENCES "public"."invitations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cert_configs" ADD CONSTRAINT "cert_configs_invitation_id_invitations_id_fk" FOREIGN KEY ("invitation_id") REFERENCES "public"."invitations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cert_configs" ADD CONSTRAINT "cert_configs_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_invitation_id_invitations_id_fk" FOREIGN KEY ("invitation_id") REFERENCES "public"."invitations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_guest_id_guests_id_fk" FOREIGN KEY ("guest_id") REFERENCES "public"."guests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_ledger" ADD CONSTRAINT "credit_ledger_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_ledger" ADD CONSTRAINT "credit_ledger_lot_id_credit_lots_id_fk" FOREIGN KEY ("lot_id") REFERENCES "public"."credit_lots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_lots" ADD CONSTRAINT "credit_lots_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_designs" ADD CONSTRAINT "custom_designs_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_requests" ADD CONSTRAINT "custom_requests_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guests" ADD CONSTRAINT "guests_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guests" ADD CONSTRAINT "guests_invitation_id_invitations_id_fk" FOREIGN KEY ("invitation_id") REFERENCES "public"."invitations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation_log" ADD CONSTRAINT "invitation_log_invitation_id_invitations_id_fk" FOREIGN KEY ("invitation_id") REFERENCES "public"."invitations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "name_requests" ADD CONSTRAINT "name_requests_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "name_requests" ADD CONSTRAINT "name_requests_invitation_id_invitations_id_fk" FOREIGN KEY ("invitation_id") REFERENCES "public"."invitations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "name_requests" ADD CONSTRAINT "name_requests_guest_id_guests_id_fk" FOREIGN KEY ("guest_id") REFERENCES "public"."guests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "org_invites" ADD CONSTRAINT "org_invites_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "send_requests" ADD CONSTRAINT "send_requests_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "send_requests" ADD CONSTRAINT "send_requests_invitation_id_invitations_id_fk" FOREIGN KEY ("invitation_id") REFERENCES "public"."invitations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_staff_id_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_org_id_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."orgs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thank_notes" ADD CONSTRAINT "thank_notes_invitation_id_invitations_id_fk" FOREIGN KEY ("invitation_id") REFERENCES "public"."invitations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trusted_devices" ADD CONSTRAINT "trusted_devices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "assets_org" ON "assets" USING btree ("org_id");--> statement-breakpoint
CREATE UNIQUE INDEX "attendance_once" ON "attendance" USING btree ("invitation_id","guest_id");--> statement-breakpoint
CREATE INDEX "att_sess_inv" ON "attendance_sessions" USING btree ("invitation_id");--> statement-breakpoint
CREATE INDEX "audit_at" ON "audit_log" USING btree ("at");--> statement-breakpoint
CREATE INDEX "audit_org" ON "audit_log" USING btree ("org_id","at");--> statement-breakpoint
CREATE UNIQUE INDEX "cert_once" ON "certificates" USING btree ("invitation_id","guest_id","kind");--> statement-breakpoint
CREATE INDEX "ledger_org" ON "credit_ledger" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "lots_org" ON "credit_lots" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "designs_org" ON "custom_designs" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "requests_org" ON "custom_requests" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "requests_stage" ON "custom_requests" USING btree ("stage");--> statement-breakpoint
CREATE INDEX "guests_inv" ON "guests" USING btree ("invitation_id");--> statement-breakpoint
CREATE INDEX "guests_org" ON "guests" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "guests_email" ON "guests" USING btree ("email");--> statement-breakpoint
CREATE INDEX "invlog_inv" ON "invitation_log" USING btree ("invitation_id","at");--> statement-breakpoint
CREATE INDEX "inv_org" ON "invitations" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "inv_status" ON "invitations" USING btree ("status","starts_at");--> statement-breakpoint
CREATE INDEX "memberships_user" ON "memberships" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "namereq_inv" ON "name_requests" USING btree ("invitation_id");--> statement-breakpoint
CREATE INDEX "orders_org" ON "orders" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "orders_status" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "org_invites_once" ON "org_invites" USING btree ("org_id","email");--> statement-breakpoint
CREATE INDEX "org_invites_email" ON "org_invites" USING btree ("email");--> statement-breakpoint
CREATE INDEX "otps_lookup" ON "otps" USING btree ("purpose","email");--> statement-breakpoint
CREATE INDEX "outbox_queue" ON "outbox" USING btree ("status","not_before");--> statement-breakpoint
CREATE INDEX "sendreq_status" ON "send_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "sessions_user" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_staff" ON "sessions" USING btree ("staff_id");--> statement-breakpoint
CREATE UNIQUE INDEX "thanks_once" ON "thank_notes" USING btree ("invitation_id","grp");--> statement-breakpoint
CREATE UNIQUE INDEX "trusted_once" ON "trusted_devices" USING btree ("user_id","token_hash");