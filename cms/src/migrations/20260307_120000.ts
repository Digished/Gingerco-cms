import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Fix FK column types and add missing FK constraints to *_links tables.
 *
 * Background:
 *   The newer pages_blocks_*_links tables (content, about_section, split_content,
 *   faq, gallery, events_list, team, testimonials, partner_section) were created
 *   in 20260220_192000 / 20260221_110000 / 20260221_130000 with every column as
 *   varchar — including columns that reference integer-PK collections:
 *     page_id, event_id, blog_post_id, team_member_id, popup_form_id
 *   This causes "operator does not exist: character varying = integer" when Payload
 *   joins these tables against pages / events / blog_posts / team_members / forms.
 *
 *   Note: _parent_id varchar is CORRECT for these live tables because the parent
 *   block tables (pages_blocks_*) use varchar UUID primary keys.
 *
 *   The _pages_v_blocks_*_links tables were already fixed to integer types in
 *   20260220_200000 / 20260221_190000, but FK constraints were never added.
 *
 * This migration:
 *   1. Converts page_id/event_id/blog_post_id/team_member_id/popup_form_id from
 *      varchar → integer in all 9 live pages_blocks_*_links tables.
 *   2. Adds FK constraints to all 9 live link tables (_parent_id + collection refs).
 *   3. Adds FK constraints to all 9 version _pages_v_blocks_*_links tables.
 */

const LIVE_LINK_TABLES = [
  { table: 'pages_blocks_content_links',        parent: 'pages_blocks_content' },
  { table: 'pages_blocks_about_section_links',   parent: 'pages_blocks_about_section' },
  { table: 'pages_blocks_split_content_links',   parent: 'pages_blocks_split_content' },
  { table: 'pages_blocks_faq_links',             parent: 'pages_blocks_faq' },
  { table: 'pages_blocks_gallery_links',         parent: 'pages_blocks_gallery' },
  { table: 'pages_blocks_events_list_links',     parent: 'pages_blocks_events_list' },
  { table: 'pages_blocks_team_links',            parent: 'pages_blocks_team' },
  { table: 'pages_blocks_testimonials_links',    parent: 'pages_blocks_testimonials' },
  { table: 'pages_blocks_partner_section_links', parent: 'pages_blocks_partner_section' },
] as const

const VERSION_LINK_TABLES = [
  { table: '_pages_v_blocks_content_links',        parent: '_pages_v_blocks_content' },
  { table: '_pages_v_blocks_about_section_links',   parent: '_pages_v_blocks_about_section' },
  { table: '_pages_v_blocks_split_content_links',   parent: '_pages_v_blocks_split_content' },
  { table: '_pages_v_blocks_faq_links',             parent: '_pages_v_blocks_faq' },
  { table: '_pages_v_blocks_gallery_links',         parent: '_pages_v_blocks_gallery' },
  { table: '_pages_v_blocks_events_list_links',     parent: '_pages_v_blocks_events_list' },
  { table: '_pages_v_blocks_team_links',            parent: '_pages_v_blocks_team' },
  { table: '_pages_v_blocks_testimonials_links',    parent: '_pages_v_blocks_testimonials' },
  { table: '_pages_v_blocks_partner_section_links', parent: '_pages_v_blocks_partner_section' },
] as const

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── Step 1: Fix column types in live link tables ────────────────────────────
  // page_id, event_id, blog_post_id, team_member_id, popup_form_id were created
  // as varchar but must be integer to match their target collections' serial PKs.
  for (const { table } of LIVE_LINK_TABLES) {
    // Idempotent: only alter if page_id is still character varying.
    // A previous failed migration run may have partially converted some tables
    // already (Drizzle does not wrap migrations in a transaction).
    // NULL out all values first to avoid any cast issues, then retype.
    await db.execute(sql.raw(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name   = '${table}'
            AND column_name  = 'page_id'
            AND data_type    = 'character varying'
        ) THEN
          UPDATE "${table}"
          SET "page_id" = NULL, "event_id" = NULL, "blog_post_id" = NULL,
              "team_member_id" = NULL, "popup_form_id" = NULL;
          ALTER TABLE "${table}"
            ALTER COLUMN "page_id"        TYPE integer USING NULL::integer,
            ALTER COLUMN "event_id"       TYPE integer USING NULL::integer,
            ALTER COLUMN "blog_post_id"   TYPE integer USING NULL::integer,
            ALTER COLUMN "team_member_id" TYPE integer USING NULL::integer,
            ALTER COLUMN "popup_form_id"  TYPE integer USING NULL::integer;
        END IF;
      END $$;
    `))
  }

  // ── Step 2: Add FK constraints to live link tables ──────────────────────────
  // _parent_id (varchar) → parent block table id (varchar UUID)
  // page_id / event_id / blog_post_id / team_member_id / popup_form_id → integer PKs
  for (const { table, parent } of LIVE_LINK_TABLES) {
    // Clean up orphaned rows / stale references before enforcing constraints
    await db.execute(sql.raw(`
      DELETE FROM "${table}" WHERE "_parent_id" NOT IN (SELECT "id" FROM "${parent}");
      UPDATE "${table}" SET "page_id"        = NULL WHERE "page_id"        IS NOT NULL AND "page_id"        NOT IN (SELECT "id" FROM "pages");
      UPDATE "${table}" SET "event_id"       = NULL WHERE "event_id"       IS NOT NULL AND "event_id"       NOT IN (SELECT "id" FROM "events");
      UPDATE "${table}" SET "blog_post_id"   = NULL WHERE "blog_post_id"   IS NOT NULL AND "blog_post_id"   NOT IN (SELECT "id" FROM "blog_posts");
      UPDATE "${table}" SET "team_member_id" = NULL WHERE "team_member_id" IS NOT NULL AND "team_member_id" NOT IN (SELECT "id" FROM "team_members");
      UPDATE "${table}" SET "popup_form_id"  = NULL WHERE "popup_form_id"  IS NOT NULL AND "popup_form_id"  NOT IN (SELECT "id" FROM "forms");
    `))
    await db.execute(sql.raw(`
      DO $$ BEGIN
        ALTER TABLE "${table}" ADD CONSTRAINT "${table}_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."${parent}"("id")
          ON DELETE cascade ON UPDATE no action;
      EXCEPTION WHEN duplicate_object THEN null; END $$;

      DO $$ BEGIN
        ALTER TABLE "${table}" ADD CONSTRAINT "${table}_page_id_pages_id_fk"
          FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id")
          ON DELETE set null ON UPDATE no action;
      EXCEPTION WHEN duplicate_object THEN null; END $$;

      DO $$ BEGIN
        ALTER TABLE "${table}" ADD CONSTRAINT "${table}_event_id_events_id_fk"
          FOREIGN KEY ("event_id") REFERENCES "public"."events"("id")
          ON DELETE set null ON UPDATE no action;
      EXCEPTION WHEN duplicate_object THEN null; END $$;

      DO $$ BEGIN
        ALTER TABLE "${table}" ADD CONSTRAINT "${table}_blog_post_id_blog_posts_id_fk"
          FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_posts"("id")
          ON DELETE set null ON UPDATE no action;
      EXCEPTION WHEN duplicate_object THEN null; END $$;

      DO $$ BEGIN
        ALTER TABLE "${table}" ADD CONSTRAINT "${table}_team_member_id_team_members_id_fk"
          FOREIGN KEY ("team_member_id") REFERENCES "public"."team_members"("id")
          ON DELETE set null ON UPDATE no action;
      EXCEPTION WHEN duplicate_object THEN null; END $$;

      DO $$ BEGIN
        ALTER TABLE "${table}" ADD CONSTRAINT "${table}_popup_form_id_forms_id_fk"
          FOREIGN KEY ("popup_form_id") REFERENCES "public"."forms"("id")
          ON DELETE set null ON UPDATE no action;
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `))

    // Indexes for the newly-typed integer FK columns
    await db.execute(sql.raw(`
      CREATE INDEX IF NOT EXISTS "${table}_page_id_idx"        ON "${table}" USING btree ("page_id");
      CREATE INDEX IF NOT EXISTS "${table}_event_id_idx"       ON "${table}" USING btree ("event_id");
      CREATE INDEX IF NOT EXISTS "${table}_blog_post_id_idx"   ON "${table}" USING btree ("blog_post_id");
      CREATE INDEX IF NOT EXISTS "${table}_team_member_id_idx" ON "${table}" USING btree ("team_member_id");
      CREATE INDEX IF NOT EXISTS "${table}_popup_form_id_idx"  ON "${table}" USING btree ("popup_form_id");
    `))
  }

  // ── Step 3: Add FK constraints to version link tables ───────────────────────
  // _parent_id (integer) → parent version block table id (serial integer)
  // Collection ref columns are already integer from the prior fix migrations.
  for (const { table, parent } of VERSION_LINK_TABLES) {
    // Clean up orphaned rows / stale references before enforcing constraints
    await db.execute(sql.raw(`
      DELETE FROM "${table}" WHERE "_parent_id" NOT IN (SELECT "id" FROM "${parent}");
      UPDATE "${table}" SET "page_id"        = NULL WHERE "page_id"        IS NOT NULL AND "page_id"        NOT IN (SELECT "id" FROM "pages");
      UPDATE "${table}" SET "event_id"       = NULL WHERE "event_id"       IS NOT NULL AND "event_id"       NOT IN (SELECT "id" FROM "events");
      UPDATE "${table}" SET "blog_post_id"   = NULL WHERE "blog_post_id"   IS NOT NULL AND "blog_post_id"   NOT IN (SELECT "id" FROM "blog_posts");
      UPDATE "${table}" SET "team_member_id" = NULL WHERE "team_member_id" IS NOT NULL AND "team_member_id" NOT IN (SELECT "id" FROM "team_members");
      UPDATE "${table}" SET "popup_form_id"  = NULL WHERE "popup_form_id"  IS NOT NULL AND "popup_form_id"  NOT IN (SELECT "id" FROM "forms");
    `))
    await db.execute(sql.raw(`
      DO $$ BEGIN
        ALTER TABLE "${table}" ADD CONSTRAINT "${table}_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."${parent}"("id")
          ON DELETE cascade ON UPDATE no action;
      EXCEPTION WHEN duplicate_object THEN null; END $$;

      DO $$ BEGIN
        ALTER TABLE "${table}" ADD CONSTRAINT "${table}_page_id_pages_id_fk"
          FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id")
          ON DELETE set null ON UPDATE no action;
      EXCEPTION WHEN duplicate_object THEN null; END $$;

      DO $$ BEGIN
        ALTER TABLE "${table}" ADD CONSTRAINT "${table}_event_id_events_id_fk"
          FOREIGN KEY ("event_id") REFERENCES "public"."events"("id")
          ON DELETE set null ON UPDATE no action;
      EXCEPTION WHEN duplicate_object THEN null; END $$;

      DO $$ BEGIN
        ALTER TABLE "${table}" ADD CONSTRAINT "${table}_blog_post_id_blog_posts_id_fk"
          FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_posts"("id")
          ON DELETE set null ON UPDATE no action;
      EXCEPTION WHEN duplicate_object THEN null; END $$;

      DO $$ BEGIN
        ALTER TABLE "${table}" ADD CONSTRAINT "${table}_team_member_id_team_members_id_fk"
          FOREIGN KEY ("team_member_id") REFERENCES "public"."team_members"("id")
          ON DELETE set null ON UPDATE no action;
      EXCEPTION WHEN duplicate_object THEN null; END $$;

      DO $$ BEGIN
        ALTER TABLE "${table}" ADD CONSTRAINT "${table}_popup_form_id_forms_id_fk"
          FOREIGN KEY ("popup_form_id") REFERENCES "public"."forms"("id")
          ON DELETE set null ON UPDATE no action;
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `))

    await db.execute(sql.raw(`
      CREATE INDEX IF NOT EXISTS "${table}_page_id_idx"        ON "${table}" USING btree ("page_id");
      CREATE INDEX IF NOT EXISTS "${table}_event_id_idx"       ON "${table}" USING btree ("event_id");
      CREATE INDEX IF NOT EXISTS "${table}_blog_post_id_idx"   ON "${table}" USING btree ("blog_post_id");
      CREATE INDEX IF NOT EXISTS "${table}_team_member_id_idx" ON "${table}" USING btree ("team_member_id");
      CREATE INDEX IF NOT EXISTS "${table}_popup_form_id_idx"  ON "${table}" USING btree ("popup_form_id");
    `))
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Drop FK constraints and revert column types back to varchar for live tables
  for (const { table } of LIVE_LINK_TABLES) {
    await db.execute(sql.raw(`
      ALTER TABLE "${table}" DROP CONSTRAINT IF EXISTS "${table}_parent_id_fk";
      ALTER TABLE "${table}" DROP CONSTRAINT IF EXISTS "${table}_page_id_pages_id_fk";
      ALTER TABLE "${table}" DROP CONSTRAINT IF EXISTS "${table}_event_id_events_id_fk";
      ALTER TABLE "${table}" DROP CONSTRAINT IF EXISTS "${table}_blog_post_id_blog_posts_id_fk";
      ALTER TABLE "${table}" DROP CONSTRAINT IF EXISTS "${table}_team_member_id_team_members_id_fk";
      ALTER TABLE "${table}" DROP CONSTRAINT IF EXISTS "${table}_popup_form_id_forms_id_fk";
      DROP INDEX IF EXISTS "${table}_page_id_idx";
      DROP INDEX IF EXISTS "${table}_event_id_idx";
      DROP INDEX IF EXISTS "${table}_blog_post_id_idx";
      DROP INDEX IF EXISTS "${table}_team_member_id_idx";
      DROP INDEX IF EXISTS "${table}_popup_form_id_idx";
      ALTER TABLE "${table}"
        ALTER COLUMN "page_id"        TYPE varchar USING "page_id"::varchar,
        ALTER COLUMN "event_id"       TYPE varchar USING "event_id"::varchar,
        ALTER COLUMN "blog_post_id"   TYPE varchar USING "blog_post_id"::varchar,
        ALTER COLUMN "team_member_id" TYPE varchar USING "team_member_id"::varchar,
        ALTER COLUMN "popup_form_id"  TYPE varchar USING "popup_form_id"::varchar
    `))
  }

  // Drop FK constraints from version tables
  for (const { table } of VERSION_LINK_TABLES) {
    await db.execute(sql.raw(`
      ALTER TABLE "${table}" DROP CONSTRAINT IF EXISTS "${table}_parent_id_fk";
      ALTER TABLE "${table}" DROP CONSTRAINT IF EXISTS "${table}_page_id_pages_id_fk";
      ALTER TABLE "${table}" DROP CONSTRAINT IF EXISTS "${table}_event_id_events_id_fk";
      ALTER TABLE "${table}" DROP CONSTRAINT IF EXISTS "${table}_blog_post_id_blog_posts_id_fk";
      ALTER TABLE "${table}" DROP CONSTRAINT IF EXISTS "${table}_team_member_id_team_members_id_fk";
      ALTER TABLE "${table}" DROP CONSTRAINT IF EXISTS "${table}_popup_form_id_forms_id_fk";
      DROP INDEX IF EXISTS "${table}_page_id_idx";
      DROP INDEX IF EXISTS "${table}_event_id_idx";
      DROP INDEX IF EXISTS "${table}_blog_post_id_idx";
      DROP INDEX IF EXISTS "${table}_team_member_id_idx";
      DROP INDEX IF EXISTS "${table}_popup_form_id_idx";
    `))
  }
}
