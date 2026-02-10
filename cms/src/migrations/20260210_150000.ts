import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // --- ENUMs for new blocks ---
  await db.execute(sql`
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_bullet_list_columns" AS ENUM('1', '2'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_bullet_list_bullet_style" AS ENUM('dot', 'dash', 'check', 'arrow'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_bullet_list_background_color" AS ENUM('white', 'light-gray', 'dark'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_split_content_layout" AS ENUM('50-50', '60-40', '40-60', '70-30', '30-70'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_split_content_left_column_content_type" AS ENUM('richText', 'form'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_split_content_right_column_content_type" AS ENUM('richText', 'form'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_split_content_background_color" AS ENUM('white', 'light-gray', 'dark'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_split_content_vertical_align" AS ENUM('top', 'center'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_bullet_list_columns" AS ENUM('1', '2'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_bullet_list_bullet_style" AS ENUM('dot', 'dash', 'check', 'arrow'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_bullet_list_background_color" AS ENUM('white', 'light-gray', 'dark'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_split_content_layout" AS ENUM('50-50', '60-40', '40-60', '70-30', '30-70'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_split_content_left_column_content_type" AS ENUM('richText', 'form'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_split_content_right_column_content_type" AS ENUM('richText', 'form'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_split_content_background_color" AS ENUM('white', 'light-gray', 'dark'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_split_content_vertical_align" AS ENUM('top', 'center'); EXCEPTION WHEN duplicate_object THEN null; END $$;`)

  // --- BulletList block tables ---
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "pages_blocks_bullet_list_lists_items" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "text" varchar
  );

  CREATE TABLE IF NOT EXISTS "pages_blocks_bullet_list_lists" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "list_heading" varchar
  );

  CREATE TABLE IF NOT EXISTS "pages_blocks_bullet_list" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "heading" varchar,
    "description" varchar,
    "columns" "enum_pages_blocks_bullet_list_columns" DEFAULT '1',
    "bullet_color" varchar DEFAULT '#D4AF37',
    "bullet_style" "enum_pages_blocks_bullet_list_bullet_style" DEFAULT 'dot',
    "background_color" "enum_pages_blocks_bullet_list_background_color" DEFAULT 'white',
    "block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_bullet_list_lists_items" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "text" varchar,
    "_uuid" varchar
  );

  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_bullet_list_lists" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "list_heading" varchar,
    "_uuid" varchar
  );

  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_bullet_list" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "heading" varchar,
    "description" varchar,
    "columns" "enum__pages_v_blocks_bullet_list_columns" DEFAULT '1',
    "bullet_color" varchar DEFAULT '#D4AF37',
    "bullet_style" "enum__pages_v_blocks_bullet_list_bullet_style" DEFAULT 'dot',
    "background_color" "enum__pages_v_blocks_bullet_list_background_color" DEFAULT 'white',
    "_uuid" varchar,
    "block_name" varchar
  );`)

  // --- SplitContent block tables ---
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "pages_blocks_split_content" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "layout" "enum_pages_blocks_split_content_layout" DEFAULT '50-50',
    "left_column_content_type" "enum_pages_blocks_split_content_left_column_content_type" DEFAULT 'richText',
    "left_column_heading" varchar,
    "left_column_rich_text" jsonb,
    "left_column_form_id" integer,
    "right_column_content_type" "enum_pages_blocks_split_content_right_column_content_type" DEFAULT 'form',
    "right_column_heading" varchar,
    "right_column_rich_text" jsonb,
    "right_column_form_id" integer,
    "background_color" "enum_pages_blocks_split_content_background_color" DEFAULT 'white',
    "vertical_align" "enum_pages_blocks_split_content_vertical_align" DEFAULT 'top',
    "block_name" varchar
  );

  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_split_content" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "layout" "enum__pages_v_blocks_split_content_layout" DEFAULT '50-50',
    "left_column_content_type" "enum__pages_v_blocks_split_content_left_column_content_type" DEFAULT 'richText',
    "left_column_heading" varchar,
    "left_column_rich_text" jsonb,
    "left_column_form_id" integer,
    "right_column_content_type" "enum__pages_v_blocks_split_content_right_column_content_type" DEFAULT 'form',
    "right_column_heading" varchar,
    "right_column_rich_text" jsonb,
    "right_column_form_id" integer,
    "background_color" "enum__pages_v_blocks_split_content_background_color" DEFAULT 'white',
    "vertical_align" "enum__pages_v_blocks_split_content_vertical_align" DEFAULT 'top',
    "_uuid" varchar,
    "block_name" varchar
  );`)

  // --- TeamMembers: add photo2_id and photo3_id ---
  await db.execute(sql`
  ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "photo2_id" integer;
  ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "photo3_id" integer;`)

  // --- Foreign keys ---
  await db.execute(sql`
  DO $$ BEGIN ALTER TABLE "pages_blocks_bullet_list_lists_items" ADD CONSTRAINT "pages_blocks_bullet_list_lists_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_bullet_list_lists"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_bullet_list_lists" ADD CONSTRAINT "pages_blocks_bullet_list_lists_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_bullet_list"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_bullet_list" ADD CONSTRAINT "pages_blocks_bullet_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_bullet_list_lists_items" ADD CONSTRAINT "_pages_v_blocks_bullet_list_lists_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_bullet_list_lists"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_bullet_list_lists" ADD CONSTRAINT "_pages_v_blocks_bullet_list_lists_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_bullet_list"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_bullet_list" ADD CONSTRAINT "_pages_v_blocks_bullet_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_split_content" ADD CONSTRAINT "pages_blocks_split_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_split_content" ADD CONSTRAINT "pages_blocks_split_content_left_column_form_id_forms_id_fk" FOREIGN KEY ("left_column_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_split_content" ADD CONSTRAINT "pages_blocks_split_content_right_column_form_id_forms_id_fk" FOREIGN KEY ("right_column_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_split_content" ADD CONSTRAINT "_pages_v_blocks_split_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_split_content" ADD CONSTRAINT "_pages_v_blocks_split_content_left_column_form_id_forms_id_fk" FOREIGN KEY ("left_column_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_split_content" ADD CONSTRAINT "_pages_v_blocks_split_content_right_column_form_id_forms_id_fk" FOREIGN KEY ("right_column_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "team_members" ADD CONSTRAINT "team_members_photo2_id_media_id_fk" FOREIGN KEY ("photo2_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "team_members" ADD CONSTRAINT "team_members_photo3_id_media_id_fk" FOREIGN KEY ("photo3_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;`)

  // --- Indexes ---
  await db.execute(sql`
  CREATE INDEX IF NOT EXISTS "pages_blocks_bullet_list_lists_items_order_idx" ON "pages_blocks_bullet_list_lists_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_bullet_list_lists_items_parent_id_idx" ON "pages_blocks_bullet_list_lists_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_bullet_list_lists_order_idx" ON "pages_blocks_bullet_list_lists" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_bullet_list_lists_parent_id_idx" ON "pages_blocks_bullet_list_lists" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_bullet_list_order_idx" ON "pages_blocks_bullet_list" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_bullet_list_parent_id_idx" ON "pages_blocks_bullet_list" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_bullet_list_path_idx" ON "pages_blocks_bullet_list" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_bullet_list_lists_items_order_idx" ON "_pages_v_blocks_bullet_list_lists_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_bullet_list_lists_items_parent_id_idx" ON "_pages_v_blocks_bullet_list_lists_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_bullet_list_lists_order_idx" ON "_pages_v_blocks_bullet_list_lists" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_bullet_list_lists_parent_id_idx" ON "_pages_v_blocks_bullet_list_lists" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_bullet_list_order_idx" ON "_pages_v_blocks_bullet_list" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_bullet_list_parent_id_idx" ON "_pages_v_blocks_bullet_list" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_bullet_list_path_idx" ON "_pages_v_blocks_bullet_list" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_split_content_order_idx" ON "pages_blocks_split_content" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_split_content_parent_id_idx" ON "pages_blocks_split_content" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_split_content_path_idx" ON "pages_blocks_split_content" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pages_blocks_split_content_left_column_form_idx" ON "pages_blocks_split_content" USING btree ("left_column_form_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_split_content_right_column_form_idx" ON "pages_blocks_split_content" USING btree ("right_column_form_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_split_content_order_idx" ON "_pages_v_blocks_split_content" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_split_content_parent_id_idx" ON "_pages_v_blocks_split_content" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_split_content_path_idx" ON "_pages_v_blocks_split_content" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_split_content_left_column_form_idx" ON "_pages_v_blocks_split_content" USING btree ("left_column_form_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_split_content_right_column_form_idx" ON "_pages_v_blocks_split_content" USING btree ("right_column_form_id");
  CREATE INDEX IF NOT EXISTS "team_members_photo2_idx" ON "team_members" USING btree ("photo2_id");
  CREATE INDEX IF NOT EXISTS "team_members_photo3_idx" ON "team_members" USING btree ("photo3_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "pages_blocks_bullet_list_lists_items" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_bullet_list_lists" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_bullet_list" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_bullet_list_lists_items" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_bullet_list_lists" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_bullet_list" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_split_content" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_split_content" CASCADE;

  ALTER TABLE "team_members" DROP COLUMN IF EXISTS "photo2_id";
  ALTER TABLE "team_members" DROP COLUMN IF EXISTS "photo3_id";

  DROP TYPE IF EXISTS "public"."enum_pages_blocks_bullet_list_columns";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_bullet_list_bullet_style";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_bullet_list_background_color";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_split_content_layout";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_split_content_left_column_content_type";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_split_content_right_column_content_type";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_split_content_background_color";
  DROP TYPE IF EXISTS "public"."enum_pages_blocks_split_content_vertical_align";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_bullet_list_columns";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_bullet_list_bullet_style";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_bullet_list_background_color";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_split_content_layout";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_split_content_left_column_content_type";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_split_content_right_column_content_type";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_split_content_background_color";
  DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_split_content_vertical_align";`)
}
