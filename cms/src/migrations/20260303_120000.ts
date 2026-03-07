import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Add Subscribers and EmailCampaigns collections for Resend-based email management.
 *
 * New tables:
 *   - subscribers            — opt-in email subscriber list
 *   - subscribers_tags       — array of tags per subscriber
 *   - email_campaigns        — campaign composer (slug: email-campaigns)
 *   - email_campaigns_filter_tags — target-tag array per campaign
 *
 * Also registers both collections in Payload's internal locking/preferences tables.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── 1. subscribers table ──────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "subscribers" (
      "id"                serial PRIMARY KEY NOT NULL,
      "email"             varchar NOT NULL,
      "first_name"        varchar,
      "last_name"         varchar,
      "status"            varchar DEFAULT 'subscribed' NOT NULL,
      "source"            varchar,
      "subscribed_at"     timestamp(3) with time zone,
      "unsubscribe_token" varchar,
      "notes"             varchar,
      "updated_at"        timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at"        timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS "subscribers_email_idx" ON "subscribers" USING btree ("email");
    CREATE INDEX IF NOT EXISTS "subscribers_created_at_idx" ON "subscribers" USING btree ("created_at");
  `)

  // ── 2. subscribers_tags (array field) ────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "subscribers_tags" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         serial PRIMARY KEY NOT NULL,
      "tag"        varchar
    );

    DO $$ BEGIN
      ALTER TABLE "subscribers_tags" ADD CONSTRAINT "subscribers_tags_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "subscribers"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "subscribers_tags_order_idx"     ON "subscribers_tags" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "subscribers_tags_parent_id_idx" ON "subscribers_tags" USING btree ("_parent_id");
  `)

  // ── 3. email_campaigns table (slug: email-campaigns) ─────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "email_campaigns" (
      "id"               serial PRIMARY KEY NOT NULL,
      "subject"          varchar NOT NULL,
      "preview_text"     varchar(90),
      "body"             jsonb,
      "status"           varchar DEFAULT 'draft' NOT NULL,
      "recipient_filter" varchar DEFAULT 'all' NOT NULL,
      "sent_at"          timestamp(3) with time zone,
      "total_sent"       integer DEFAULT 0,
      "updated_at"       timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at"       timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "email_campaigns_created_at_idx" ON "email_campaigns" USING btree ("created_at");
  `)

  // ── 4. email_campaigns_filter_tags (array field) ─────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "email_campaigns_filter_tags" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         serial PRIMARY KEY NOT NULL,
      "tag"        varchar
    );

    DO $$ BEGIN
      ALTER TABLE "email_campaigns_filter_tags" ADD CONSTRAINT "email_campaigns_filter_tags_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "email_campaigns"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "email_campaigns_filter_tags_order_idx"     ON "email_campaigns_filter_tags" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "email_campaigns_filter_tags_parent_id_idx" ON "email_campaigns_filter_tags" USING btree ("_parent_id");
  `)

  // ── 5. Register in payload_locked_documents_rels ──────────────────────────
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "subscribers_id"      integer,
      ADD COLUMN IF NOT EXISTS "email_campaigns_id"  integer;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscribers_id_subscribers_id_fk"
        FOREIGN KEY ("subscribers_id") REFERENCES "subscribers"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_email_campaigns_id_email_campaigns_id_fk"
        FOREIGN KEY ("email_campaigns_id") REFERENCES "email_campaigns"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_subscribers_idx"
      ON "payload_locked_documents_rels" USING btree ("subscribers_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_email_campaigns_idx"
      ON "payload_locked_documents_rels" USING btree ("email_campaigns_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP COLUMN IF EXISTS "subscribers_id",
      DROP COLUMN IF EXISTS "email_campaigns_id";

    DROP TABLE IF EXISTS "email_campaigns_filter_tags";
    DROP TABLE IF EXISTS "email_campaigns";
    DROP TABLE IF EXISTS "subscribers_tags";
    DROP TABLE IF EXISTS "subscribers";
  `)
}
