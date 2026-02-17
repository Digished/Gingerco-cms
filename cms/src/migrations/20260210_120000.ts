import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // --- ENUMs for link_type fields ---
  await db.execute(sql`
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_hero_links_link_type" AS ENUM('page', 'custom'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_hero_links_link_type" AS ENUM('page', 'custom'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_cta_links_link_type" AS ENUM('page', 'custom'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_cta_links_link_type" AS ENUM('page', 'custom'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_showcase_section_links_link_type" AS ENUM('page', 'custom'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_showcase_section_links_link_type" AS ENUM('page', 'custom'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_countdown_timer_link_link_type" AS ENUM('page', 'custom'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_countdown_timer_link_link_type" AS ENUM('page', 'custom'); EXCEPTION WHEN duplicate_object THEN null; END $$;`)

  // --- Fix hero links style enum: add 'dark' value (was missing from earlier migration) ---
  await db.execute(sql`
  ALTER TYPE "public"."enum_pages_blocks_hero_links_style" ADD VALUE IF NOT EXISTS 'dark';
  ALTER TYPE "public"."enum__pages_v_blocks_hero_links_style" ADD VALUE IF NOT EXISTS 'dark';`)

  // --- Events gallery tables ---
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "events_gallery" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "image_id" integer
  );

  CREATE TABLE IF NOT EXISTS "_events_v_version_gallery" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "image_id" integer,
    "_uuid" varchar
  );`)

  // --- Add link fields to Hero links ---
  await db.execute(sql`
  ALTER TABLE "pages_blocks_hero_links" ADD COLUMN IF NOT EXISTS "link_type" "enum_pages_blocks_hero_links_link_type" DEFAULT 'custom';
  ALTER TABLE "pages_blocks_hero_links" ADD COLUMN IF NOT EXISTS "page_id" integer;
  ALTER TABLE "pages_blocks_hero_links" ADD COLUMN IF NOT EXISTS "new_tab" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_hero_links" ADD COLUMN IF NOT EXISTS "link_type" "enum__pages_v_blocks_hero_links_link_type" DEFAULT 'custom';
  ALTER TABLE "_pages_v_blocks_hero_links" ADD COLUMN IF NOT EXISTS "page_id" integer;
  ALTER TABLE "_pages_v_blocks_hero_links" ADD COLUMN IF NOT EXISTS "new_tab" boolean DEFAULT false;`)

  // --- Add link fields to CTA links ---
  await db.execute(sql`
  ALTER TABLE "pages_blocks_cta_links" ADD COLUMN IF NOT EXISTS "link_type" "enum_pages_blocks_cta_links_link_type" DEFAULT 'custom';
  ALTER TABLE "pages_blocks_cta_links" ADD COLUMN IF NOT EXISTS "page_id" integer;
  ALTER TABLE "pages_blocks_cta_links" ADD COLUMN IF NOT EXISTS "new_tab" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN IF NOT EXISTS "link_type" "enum__pages_v_blocks_cta_links_link_type" DEFAULT 'custom';
  ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN IF NOT EXISTS "page_id" integer;
  ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN IF NOT EXISTS "new_tab" boolean DEFAULT false;`)

  // --- Add link fields to Showcase Section links ---
  await db.execute(sql`
  ALTER TABLE "pages_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "link_type" "enum_pages_blocks_showcase_section_links_link_type" DEFAULT 'custom';
  ALTER TABLE "pages_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "page_id" integer;
  ALTER TABLE "pages_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "new_tab" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "link_type" "enum__pages_v_blocks_showcase_section_links_link_type" DEFAULT 'custom';
  ALTER TABLE "_pages_v_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "page_id" integer;
  ALTER TABLE "_pages_v_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "new_tab" boolean DEFAULT false;`)

  // --- Add link fields to Countdown Timer (group field) ---
  await db.execute(sql`
  ALTER TABLE "pages_blocks_countdown_timer" ADD COLUMN IF NOT EXISTS "link_link_type" "enum_pages_blocks_countdown_timer_link_link_type" DEFAULT 'custom';
  ALTER TABLE "pages_blocks_countdown_timer" ADD COLUMN IF NOT EXISTS "link_page_id" integer;
  ALTER TABLE "pages_blocks_countdown_timer" ADD COLUMN IF NOT EXISTS "link_new_tab" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_countdown_timer" ADD COLUMN IF NOT EXISTS "link_link_type" "enum__pages_v_blocks_countdown_timer_link_link_type" DEFAULT 'custom';
  ALTER TABLE "_pages_v_blocks_countdown_timer" ADD COLUMN IF NOT EXISTS "link_page_id" integer;
  ALTER TABLE "_pages_v_blocks_countdown_timer" ADD COLUMN IF NOT EXISTS "link_new_tab" boolean DEFAULT false;`)

  // --- Events: add videoUrl column ---
  await db.execute(sql`
  ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "video_url" varchar;
  ALTER TABLE "_events_v" ADD COLUMN IF NOT EXISTS "version_video_url" varchar;`)

  // --- Team Members: add slug column ---
  await db.execute(sql`
  ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "slug" varchar;
  CREATE UNIQUE INDEX IF NOT EXISTS "team_members_slug_idx" ON "team_members" USING btree ("slug");`)

  // --- Foreign keys ---
  await db.execute(sql`
  DO $$ BEGIN ALTER TABLE "pages_blocks_hero_links" ADD CONSTRAINT "pages_blocks_hero_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_hero_links" ADD CONSTRAINT "_pages_v_blocks_hero_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_cta_links" ADD CONSTRAINT "pages_blocks_cta_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_cta_links" ADD CONSTRAINT "_pages_v_blocks_cta_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_showcase_section_links" ADD CONSTRAINT "pages_blocks_showcase_section_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_showcase_section_links" ADD CONSTRAINT "_pages_v_blocks_showcase_section_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_countdown_timer" ADD CONSTRAINT "pages_blocks_countdown_timer_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_countdown_timer" ADD CONSTRAINT "_pages_v_blocks_countdown_timer_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "events_gallery" ADD CONSTRAINT "events_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "events_gallery" ADD CONSTRAINT "events_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_events_v_version_gallery" ADD CONSTRAINT "_events_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_events_v_version_gallery" ADD CONSTRAINT "_events_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;`)

  // --- Indexes ---
  await db.execute(sql`
  CREATE INDEX IF NOT EXISTS "pages_blocks_hero_links_page_idx" ON "pages_blocks_hero_links" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_links_page_idx" ON "_pages_v_blocks_hero_links" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_cta_links_page_idx" ON "pages_blocks_cta_links" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_cta_links_page_idx" ON "_pages_v_blocks_cta_links" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_showcase_section_links_page_idx" ON "pages_blocks_showcase_section_links" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_showcase_section_links_page_idx" ON "_pages_v_blocks_showcase_section_links" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_countdown_timer_link_page_idx" ON "pages_blocks_countdown_timer" USING btree ("link_page_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_countdown_timer_link_page_idx" ON "_pages_v_blocks_countdown_timer" USING btree ("link_page_id");
  CREATE INDEX IF NOT EXISTS "events_gallery_order_idx" ON "events_gallery" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "events_gallery_parent_id_idx" ON "events_gallery" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "events_gallery_image_idx" ON "events_gallery" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_events_v_version_gallery_order_idx" ON "_events_v_version_gallery" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_events_v_version_gallery_parent_id_idx" ON "_events_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_events_v_version_gallery_image_idx" ON "_events_v_version_gallery" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "events_gallery" CASCADE;
  DROP TABLE IF EXISTS "_events_v_version_gallery" CASCADE;

  ALTER TABLE "pages_blocks_hero_links" DROP COLUMN IF EXISTS "link_type";
  ALTER TABLE "pages_blocks_hero_links" DROP COLUMN IF EXISTS "page_id";
  ALTER TABLE "pages_blocks_hero_links" DROP COLUMN IF EXISTS "new_tab";
  ALTER TABLE "_pages_v_blocks_hero_links" DROP COLUMN IF EXISTS "link_type";
  ALTER TABLE "_pages_v_blocks_hero_links" DROP COLUMN IF EXISTS "page_id";
  ALTER TABLE "_pages_v_blocks_hero_links" DROP COLUMN IF EXISTS "new_tab";

  ALTER TABLE "pages_blocks_cta_links" DROP COLUMN IF EXISTS "link_type";
  ALTER TABLE "pages_blocks_cta_links" DROP COLUMN IF EXISTS "page_id";
  ALTER TABLE "pages_blocks_cta_links" DROP COLUMN IF EXISTS "new_tab";
  ALTER TABLE "_pages_v_blocks_cta_links" DROP COLUMN IF EXISTS "link_type";
  ALTER TABLE "_pages_v_blocks_cta_links" DROP COLUMN IF EXISTS "page_id";
  ALTER TABLE "_pages_v_blocks_cta_links" DROP COLUMN IF EXISTS "new_tab";

  ALTER TABLE "pages_blocks_showcase_section_links" DROP COLUMN IF EXISTS "link_type";
  ALTER TABLE "pages_blocks_showcase_section_links" DROP COLUMN IF EXISTS "page_id";
  ALTER TABLE "pages_blocks_showcase_section_links" DROP COLUMN IF EXISTS "new_tab";
  ALTER TABLE "_pages_v_blocks_showcase_section_links" DROP COLUMN IF EXISTS "link_type";
  ALTER TABLE "_pages_v_blocks_showcase_section_links" DROP COLUMN IF EXISTS "page_id";
  ALTER TABLE "_pages_v_blocks_showcase_section_links" DROP COLUMN IF EXISTS "new_tab";

  ALTER TABLE "pages_blocks_countdown_timer" DROP COLUMN IF EXISTS "link_link_type";
  ALTER TABLE "pages_blocks_countdown_timer" DROP COLUMN IF EXISTS "link_page_id";
  ALTER TABLE "pages_blocks_countdown_timer" DROP COLUMN IF EXISTS "link_new_tab";
  ALTER TABLE "_pages_v_blocks_countdown_timer" DROP COLUMN IF EXISTS "link_link_type";
  ALTER TABLE "_pages_v_blocks_countdown_timer" DROP COLUMN IF EXISTS "link_page_id";
  ALTER TABLE "_pages_v_blocks_countdown_timer" DROP COLUMN IF EXISTS "link_new_tab";

  ALTER TABLE "events" DROP COLUMN IF EXISTS "video_url";
  ALTER TABLE "_events_v" DROP COLUMN IF EXISTS "version_video_url";

  DROP INDEX IF EXISTS "team_members_slug_idx";
  ALTER TABLE "team_members" DROP COLUMN IF EXISTS "slug";

  DROP TYPE IF EXISTS "public"."enum_pages_blocks_hero_links_link_type";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_hero_links_link_type";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_cta_links_link_type";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_cta_links_link_type";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_showcase_section_links_link_type";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_showcase_section_links_link_type";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_countdown_timer_link_link_type";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_countdown_timer_link_link_type";`)
}
