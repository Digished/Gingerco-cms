import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_hero_text_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_hero_min_height" AS ENUM('400px', '600px', '80vh', '100vh'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_hero_links_style" AS ENUM('primary', 'outline', 'dark'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_about_section_image_position" AS ENUM('left', 'right'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_about_section_background_color" AS ENUM('white', 'light-gray', 'dark'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_showcase_section_media_type" AS ENUM('image', 'video'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_showcase_section_media_position" AS ENUM('left', 'right'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_showcase_section_links_style" AS ENUM('outline', 'primary'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_showcase_section_background_color" AS ENUM('white', 'light-gray', 'dark'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_testimonials_items_type" AS ENUM('text', 'video'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_hero_text_align" AS ENUM('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_hero_min_height" AS ENUM('400px', '600px', '80vh', '100vh'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_hero_links_style" AS ENUM('primary', 'outline', 'dark'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_about_section_image_position" AS ENUM('left', 'right'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_about_section_background_color" AS ENUM('white', 'light-gray', 'dark'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_showcase_section_media_type" AS ENUM('image', 'video'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_showcase_section_media_position" AS ENUM('left', 'right'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_showcase_section_links_style" AS ENUM('outline', 'primary'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_showcase_section_background_color" AS ENUM('white', 'light-gray', 'dark'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_testimonials_items_type" AS ENUM('text', 'video'); EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE TABLE IF NOT EXISTS "pages_blocks_hero_heading_segments" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "text" varchar,
    "color" varchar,
    "bold" boolean DEFAULT false,
    "line_break_after" boolean DEFAULT false
  );

  CREATE TABLE IF NOT EXISTS "pages_blocks_about_section" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "heading" varchar DEFAULT 'ABOUT US',
    "content" jsonb,
    "image_id" integer,
    "image_position" "enum_pages_blocks_about_section_image_position" DEFAULT 'left',
    "image_caption_title" varchar,
    "image_caption_badge" varchar,
    "image_caption_badge_color" varchar DEFAULT '#D4AF37',
    "image_caption_description" varchar,
    "background_color" "enum_pages_blocks_about_section_background_color" DEFAULT 'white',
    "block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "pages_blocks_showcase_section_details" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL,
    "value" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "pages_blocks_showcase_section_links" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar NOT NULL,
    "url" varchar NOT NULL,
    "style" "enum_pages_blocks_showcase_section_links_style" DEFAULT 'outline'
  );

  CREATE TABLE IF NOT EXISTS "pages_blocks_showcase_section" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "section_heading" varchar,
    "media_type" "enum_pages_blocks_showcase_section_media_type" DEFAULT 'image',
    "image_id" integer,
    "video_url" varchar,
    "media_position" "enum_pages_blocks_showcase_section_media_position" DEFAULT 'left',
    "info_heading" varchar,
    "info_description" varchar,
    "background_color" "enum_pages_blocks_showcase_section_background_color" DEFAULT 'light-gray',
    "block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_hero_heading_segments" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "text" varchar,
    "color" varchar,
    "bold" boolean DEFAULT false,
    "line_break_after" boolean DEFAULT false,
    "_uuid" varchar
  );

  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_about_section" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "heading" varchar DEFAULT 'ABOUT US',
    "content" jsonb,
    "image_id" integer,
    "image_position" "enum__pages_v_blocks_about_section_image_position" DEFAULT 'left',
    "image_caption_title" varchar,
    "image_caption_badge" varchar,
    "image_caption_badge_color" varchar DEFAULT '#D4AF37',
    "image_caption_description" varchar,
    "background_color" "enum__pages_v_blocks_about_section_background_color" DEFAULT 'white',
    "_uuid" varchar,
    "block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_showcase_section_details" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "label" varchar,
    "value" varchar,
    "_uuid" varchar
  );

  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_showcase_section_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "label" varchar,
    "url" varchar,
    "style" "enum__pages_v_blocks_showcase_section_links_style" DEFAULT 'outline',
    "_uuid" varchar
  );

  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_showcase_section" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "section_heading" varchar,
    "media_type" "enum__pages_v_blocks_showcase_section_media_type" DEFAULT 'image',
    "image_id" integer,
    "video_url" varchar,
    "media_position" "enum__pages_v_blocks_showcase_section_media_position" DEFAULT 'left',
    "info_heading" varchar,
    "info_description" varchar,
    "background_color" "enum__pages_v_blocks_showcase_section_background_color" DEFAULT 'light-gray',
    "_uuid" varchar,
    "block_name" varchar
  );

  ALTER TABLE "pages_blocks_hero" ADD COLUMN IF NOT EXISTS "subheading" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN IF NOT EXISTS "text_align" "enum_pages_blocks_hero_text_align" DEFAULT 'left';
  ALTER TABLE "pages_blocks_hero" ADD COLUMN IF NOT EXISTS "min_height" "enum_pages_blocks_hero_min_height" DEFAULT '600px';
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN IF NOT EXISTS "subheading" varchar;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN IF NOT EXISTS "text_align" "enum__pages_v_blocks_hero_text_align" DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN IF NOT EXISTS "min_height" "enum__pages_v_blocks_hero_min_height" DEFAULT '600px';

  ALTER TABLE "pages_blocks_testimonials" ADD COLUMN IF NOT EXISTS "intro" varchar;
  ALTER TABLE "pages_blocks_testimonials" ADD COLUMN IF NOT EXISTS "sub_label" varchar DEFAULT 'TESTIMONIALS';
  ALTER TABLE "pages_blocks_testimonials_items" ADD COLUMN IF NOT EXISTS "type" "enum_pages_blocks_testimonials_items_type" DEFAULT 'text';
  ALTER TABLE "pages_blocks_testimonials_items" ADD COLUMN IF NOT EXISTS "video_url" varchar;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD COLUMN IF NOT EXISTS "intro" varchar;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD COLUMN IF NOT EXISTS "sub_label" varchar DEFAULT 'TESTIMONIALS';
  ALTER TABLE "_pages_v_blocks_testimonials_items" ADD COLUMN IF NOT EXISTS "type" "enum__pages_v_blocks_testimonials_items_type" DEFAULT 'text';
  ALTER TABLE "_pages_v_blocks_testimonials_items" ADD COLUMN IF NOT EXISTS "video_url" varchar;

  DO $$ BEGIN ALTER TABLE "pages_blocks_hero_heading_segments" ADD CONSTRAINT "pages_blocks_hero_heading_segments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_about_section" ADD CONSTRAINT "pages_blocks_about_section_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_about_section" ADD CONSTRAINT "pages_blocks_about_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_showcase_section_details" ADD CONSTRAINT "pages_blocks_showcase_section_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_showcase_section"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_showcase_section_links" ADD CONSTRAINT "pages_blocks_showcase_section_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_showcase_section"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_showcase_section" ADD CONSTRAINT "pages_blocks_showcase_section_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_showcase_section" ADD CONSTRAINT "pages_blocks_showcase_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_hero_heading_segments" ADD CONSTRAINT "_pages_v_blocks_hero_heading_segments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_about_section" ADD CONSTRAINT "_pages_v_blocks_about_section_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_about_section" ADD CONSTRAINT "_pages_v_blocks_about_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_showcase_section_details" ADD CONSTRAINT "_pages_v_blocks_showcase_section_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_showcase_section"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_showcase_section_links" ADD CONSTRAINT "_pages_v_blocks_showcase_section_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_showcase_section"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_showcase_section" ADD CONSTRAINT "_pages_v_blocks_showcase_section_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_showcase_section" ADD CONSTRAINT "_pages_v_blocks_showcase_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "pages_blocks_hero_heading_segments_order_idx" ON "pages_blocks_hero_heading_segments" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_hero_heading_segments_parent_id_idx" ON "pages_blocks_hero_heading_segments" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_about_section_order_idx" ON "pages_blocks_about_section" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_about_section_parent_id_idx" ON "pages_blocks_about_section" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_about_section_path_idx" ON "pages_blocks_about_section" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_about_section_image_idx" ON "pages_blocks_about_section" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_showcase_section_details_order_idx" ON "pages_blocks_showcase_section_details" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_showcase_section_details_parent_id_idx" ON "pages_blocks_showcase_section_details" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_showcase_section_links_order_idx" ON "pages_blocks_showcase_section_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_showcase_section_links_parent_id_idx" ON "pages_blocks_showcase_section_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_showcase_section_order_idx" ON "pages_blocks_showcase_section" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_showcase_section_parent_id_idx" ON "pages_blocks_showcase_section" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_showcase_section_path_idx" ON "pages_blocks_showcase_section" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_showcase_section_image_idx" ON "pages_blocks_showcase_section" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_heading_segments_order_idx" ON "_pages_v_blocks_hero_heading_segments" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_heading_segments_parent_id_idx" ON "_pages_v_blocks_hero_heading_segments" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_about_section_order_idx" ON "_pages_v_blocks_about_section" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_about_section_parent_id_idx" ON "_pages_v_blocks_about_section" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_about_section_path_idx" ON "_pages_v_blocks_about_section" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_about_section_image_idx" ON "_pages_v_blocks_about_section" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_showcase_section_details_order_idx" ON "_pages_v_blocks_showcase_section_details" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_showcase_section_details_parent_id_idx" ON "_pages_v_blocks_showcase_section_details" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_showcase_section_links_order_idx" ON "_pages_v_blocks_showcase_section_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_showcase_section_links_parent_id_idx" ON "_pages_v_blocks_showcase_section_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_showcase_section_order_idx" ON "_pages_v_blocks_showcase_section" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_showcase_section_parent_id_idx" ON "_pages_v_blocks_showcase_section" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_showcase_section_path_idx" ON "_pages_v_blocks_showcase_section" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_showcase_section_image_idx" ON "_pages_v_blocks_showcase_section" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "pages_blocks_hero_heading_segments" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_about_section" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_showcase_section_details" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_showcase_section_links" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_showcase_section" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_hero_heading_segments" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_about_section" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_showcase_section_details" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_showcase_section_links" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_showcase_section" CASCADE;

  ALTER TABLE "pages_blocks_hero" DROP COLUMN IF EXISTS "subheading";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN IF EXISTS "text_align";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN IF EXISTS "min_height";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN IF EXISTS "subheading";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN IF EXISTS "text_align";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN IF EXISTS "min_height";

  ALTER TABLE "pages_blocks_testimonials" DROP COLUMN IF EXISTS "intro";
  ALTER TABLE "pages_blocks_testimonials" DROP COLUMN IF EXISTS "sub_label";
  ALTER TABLE "pages_blocks_testimonials_items" DROP COLUMN IF EXISTS "type";
  ALTER TABLE "pages_blocks_testimonials_items" DROP COLUMN IF EXISTS "video_url";
  ALTER TABLE "_pages_v_blocks_testimonials" DROP COLUMN IF EXISTS "intro";
  ALTER TABLE "_pages_v_blocks_testimonials" DROP COLUMN IF EXISTS "sub_label";
  ALTER TABLE "_pages_v_blocks_testimonials_items" DROP COLUMN IF EXISTS "type";
  ALTER TABLE "_pages_v_blocks_testimonials_items" DROP COLUMN IF EXISTS "video_url";

  DROP TYPE IF EXISTS "public"."enum_pages_blocks_hero_text_align";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_hero_min_height";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_hero_links_style";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_about_section_image_position";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_about_section_background_color";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_showcase_section_media_type";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_showcase_section_media_position";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_showcase_section_links_style";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_showcase_section_background_color";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_testimonials_items_type";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_hero_text_align";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_hero_min_height";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_hero_links_style";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_about_section_image_position";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_about_section_background_color";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_showcase_section_media_type";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_showcase_section_media_position";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_showcase_section_links_style";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_showcase_section_background_color";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_testimonials_items_type";`)
}
