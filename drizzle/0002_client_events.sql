CREATE TABLE "client_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" text NOT NULL,
	"path" text DEFAULT '' NOT NULL,
	"message" text DEFAULT '' NOT NULL,
	"device" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "client_events_created" ON "client_events" USING btree ("created_at");