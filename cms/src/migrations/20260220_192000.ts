import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add toggle_icon to site_settings
  await db.execute(sql`
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "toggle_icon" varchar DEFAULT 'chat';
  `)

  // Add layout_mode to gallery blocks
  await db.execute(sql`
  ALTER TABLE "pages_blocks_gallery" ADD COLUMN IF NOT EXISTS "layout_mode" varchar DEFAULT 'grid';
  ALTER TABLE "_pages_v_blocks_gallery" ADD COLUMN IF NOT EXISTS "layout_mode" varchar DEFAULT 'grid';
  `)

  // Create pages_blocks_content_links table with proper schema
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "pages_blocks_content_links" (
    "_order" integer,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY,
    "_uuid" uuid,
    "label" varchar NOT NULL,
    "link_type" varchar DEFAULT 'custom',
    "link_collection" varchar DEFAULT 'pages',
    "page_id" varchar,
    "event_id" varchar,
    "blog_post_id" varchar,
    "team_member_id" varchar,
    "url" varchar,
    "new_tab" boolean DEFAULT false,
    "link_action" varchar DEFAULT 'navigate',
    "popup_form_id" varchar,
    "popup_redirect_url" varchar,
    "style" varchar DEFAULT 'primary'
  );
  CREATE INDEX IF NOT EXISTS "pages_blocks_content_links_parent_id_idx" on "pages_blocks_content_links" ("_parent_id");
  `)

  // Create pages_blocks_about_section_links table
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "pages_blocks_about_section_links" (
    "_order" integer,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY,
    "_uuid" uuid,
    "label" varchar NOT NULL,
    "link_type" varchar DEFAULT 'custom',
    "link_collection" varchar DEFAULT 'pages',
    "page_id" varchar,
    "event_id" varchar,
    "blog_post_id" varchar,
    "team_member_id" varchar,
    "url" varchar,
    "new_tab" boolean DEFAULT false,
    "link_action" varchar DEFAULT 'navigate',
    "popup_form_id" varchar,
    "popup_redirect_url" varchar,
    "style" varchar DEFAULT 'primary'
  );
  CREATE INDEX IF NOT EXISTS "pages_blocks_about_section_links_parent_id_idx" on "pages_blocks_about_section_links" ("_parent_id");
  `)

  // Create pages_blocks_split_content_links table
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "pages_blocks_split_content_links" (
    "_order" integer,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY,
    "_uuid" uuid,
    "label" varchar NOT NULL,
    "link_type" varchar DEFAULT 'custom',
    "link_collection" varchar DEFAULT 'pages',
    "page_id" varchar,
    "event_id" varchar,
    "blog_post_id" varchar,
    "team_member_id" varchar,
    "url" varchar,
    "new_tab" boolean DEFAULT false,
    "link_action" varchar DEFAULT 'navigate',
    "popup_form_id" varchar,
    "popup_redirect_url" varchar,
    "style" varchar DEFAULT 'primary'
  );
  CREATE INDEX IF NOT EXISTS "pages_blocks_split_content_links_parent_id_idx" on "pages_blocks_split_content_links" ("_parent_id");
  `)

  // Create version tables with proper schema
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_content_links" (
    "_order" integer,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY,
    "_uuid" uuid,
    "label" varchar NOT NULL,
    "link_type" varchar DEFAULT 'custom',
    "link_collection" varchar DEFAULT 'pages',
    "page_id" varchar,
    "event_id" varchar,
    "blog_post_id" varchar,
    "team_member_id" varchar,
    "url" varchar,
    "new_tab" boolean DEFAULT false,
    "link_action" varchar DEFAULT 'navigate',
    "popup_form_id" varchar,
    "popup_redirect_url" varchar,
    "style" varchar DEFAULT 'primary'
  );
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_content_links_parent_id_idx" on "_pages_v_blocks_content_links" ("_parent_id");
  `)

  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_about_section_links" (
    "_order" integer,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY,
    "_uuid" uuid,
    "label" varchar NOT NULL,
    "link_type" varchar DEFAULT 'custom',
    "link_collection" varchar DEFAULT 'pages',
    "page_id" varchar,
    "event_id" varchar,
    "blog_post_id" varchar,
    "team_member_id" varchar,
    "url" varchar,
    "new_tab" boolean DEFAULT false,
    "link_action" varchar DEFAULT 'navigate',
    "popup_form_id" varchar,
    "popup_redirect_url" varchar,
    "style" varchar DEFAULT 'primary'
  );
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_about_section_links_parent_id_idx" on "_pages_v_blocks_about_section_links" ("_parent_id");
  `)

  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_split_content_links" (
    "_order" integer,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY,
    "_uuid" uuid,
    "label" varchar NOT NULL,
    "link_type" varchar DEFAULT 'custom',
    "link_collection" varchar DEFAULT 'pages',
    "page_id" varchar,
    "event_id" varchar,
    "blog_post_id" varchar,
    "team_member_id" varchar,
    "url" varchar,
    "new_tab" boolean DEFAULT false,
    "link_action" varchar DEFAULT 'navigate',
    "popup_form_id" varchar,
    "popup_redirect_url" varchar,
    "style" varchar DEFAULT 'primary'
  );
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_split_content_links_parent_id_idx" on "_pages_v_blocks_split_content_links" ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Drop toggle_icon column
  await db.execute(sql`
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "toggle_icon";
  `)

  // Drop layout_mode columns
  await db.execute(sql`
  ALTER TABLE "pages_blocks_gallery" DROP COLUMN IF EXISTS "layout_mode";
  ALTER TABLE "_pages_v_blocks_gallery" DROP COLUMN IF EXISTS "layout_mode";
  `)

  // Drop link tables
  await db.execute(sql`
  DROP TABLE IF EXISTS "pages_blocks_content_links" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_about_section_links" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_split_content_links" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_content_links" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_about_section_links" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_split_content_links" CASCADE;
  `)
}
