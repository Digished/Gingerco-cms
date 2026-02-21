import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Comprehensive fix-all migration.
 * Ensures ALL link tables exist and have alignment + style columns.
 * Safe to run regardless of database state (uses IF NOT EXISTS everywhere).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {

  // ─── 1. Create any missing link tables ───────────────────────────────

  // Team links
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_blocks_team_links" (
      "_order" integer, "_parent_id" varchar NOT NULL, "id" varchar PRIMARY KEY, "_uuid" uuid,
      "label" varchar NOT NULL, "link_type" varchar DEFAULT 'custom', "link_collection" varchar DEFAULT 'pages',
      "page_id" varchar, "event_id" varchar, "blog_post_id" varchar, "team_member_id" varchar,
      "url" varchar, "new_tab" boolean DEFAULT false, "link_action" varchar DEFAULT 'navigate',
      "popup_form_id" varchar, "popup_redirect_url" varchar, "alignment" varchar DEFAULT 'left', "style" varchar DEFAULT 'primary'
    )`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "pages_blocks_team_links_parent_id_idx" ON "pages_blocks_team_links" ("_parent_id")`)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_team_links" (
      "_order" integer, "_parent_id" varchar NOT NULL, "id" varchar PRIMARY KEY, "_uuid" uuid,
      "label" varchar NOT NULL, "link_type" varchar DEFAULT 'custom', "link_collection" varchar DEFAULT 'pages',
      "page_id" varchar, "event_id" varchar, "blog_post_id" varchar, "team_member_id" varchar,
      "url" varchar, "new_tab" boolean DEFAULT false, "link_action" varchar DEFAULT 'navigate',
      "popup_form_id" varchar, "popup_redirect_url" varchar, "alignment" varchar DEFAULT 'left', "style" varchar DEFAULT 'primary'
    )`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_pages_v_blocks_team_links_parent_id_idx" ON "_pages_v_blocks_team_links" ("_parent_id")`)

  // Testimonials links
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_blocks_testimonials_links" (
      "_order" integer, "_parent_id" varchar NOT NULL, "id" varchar PRIMARY KEY, "_uuid" uuid,
      "label" varchar NOT NULL, "link_type" varchar DEFAULT 'custom', "link_collection" varchar DEFAULT 'pages',
      "page_id" varchar, "event_id" varchar, "blog_post_id" varchar, "team_member_id" varchar,
      "url" varchar, "new_tab" boolean DEFAULT false, "link_action" varchar DEFAULT 'navigate',
      "popup_form_id" varchar, "popup_redirect_url" varchar, "alignment" varchar DEFAULT 'left', "style" varchar DEFAULT 'primary'
    )`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "pages_blocks_testimonials_links_parent_id_idx" ON "pages_blocks_testimonials_links" ("_parent_id")`)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_testimonials_links" (
      "_order" integer, "_parent_id" varchar NOT NULL, "id" varchar PRIMARY KEY, "_uuid" uuid,
      "label" varchar NOT NULL, "link_type" varchar DEFAULT 'custom', "link_collection" varchar DEFAULT 'pages',
      "page_id" varchar, "event_id" varchar, "blog_post_id" varchar, "team_member_id" varchar,
      "url" varchar, "new_tab" boolean DEFAULT false, "link_action" varchar DEFAULT 'navigate',
      "popup_form_id" varchar, "popup_redirect_url" varchar, "alignment" varchar DEFAULT 'left', "style" varchar DEFAULT 'primary'
    )`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_pages_v_blocks_testimonials_links_parent_id_idx" ON "_pages_v_blocks_testimonials_links" ("_parent_id")`)

  // Partner section links
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_blocks_partner_section_links" (
      "_order" integer, "_parent_id" varchar NOT NULL, "id" varchar PRIMARY KEY, "_uuid" uuid,
      "label" varchar NOT NULL, "link_type" varchar DEFAULT 'custom', "link_collection" varchar DEFAULT 'pages',
      "page_id" varchar, "event_id" varchar, "blog_post_id" varchar, "team_member_id" varchar,
      "url" varchar, "new_tab" boolean DEFAULT false, "link_action" varchar DEFAULT 'navigate',
      "popup_form_id" varchar, "popup_redirect_url" varchar, "alignment" varchar DEFAULT 'left', "style" varchar DEFAULT 'primary'
    )`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "pages_blocks_partner_section_links_parent_id_idx" ON "pages_blocks_partner_section_links" ("_parent_id")`)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_partner_section_links" (
      "_order" integer, "_parent_id" varchar NOT NULL, "id" varchar PRIMARY KEY, "_uuid" uuid,
      "label" varchar NOT NULL, "link_type" varchar DEFAULT 'custom', "link_collection" varchar DEFAULT 'pages',
      "page_id" varchar, "event_id" varchar, "blog_post_id" varchar, "team_member_id" varchar,
      "url" varchar, "new_tab" boolean DEFAULT false, "link_action" varchar DEFAULT 'navigate',
      "popup_form_id" varchar, "popup_redirect_url" varchar, "alignment" varchar DEFAULT 'left', "style" varchar DEFAULT 'primary'
    )`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_pages_v_blocks_partner_section_links_parent_id_idx" ON "_pages_v_blocks_partner_section_links" ("_parent_id")`)

  // FAQ links (in case missing)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_blocks_faq_links" (
      "_order" integer, "_parent_id" varchar NOT NULL, "id" varchar PRIMARY KEY, "_uuid" uuid,
      "label" varchar NOT NULL, "link_type" varchar DEFAULT 'custom', "link_collection" varchar DEFAULT 'pages',
      "page_id" varchar, "event_id" varchar, "blog_post_id" varchar, "team_member_id" varchar,
      "url" varchar, "new_tab" boolean DEFAULT false, "link_action" varchar DEFAULT 'navigate',
      "popup_form_id" varchar, "popup_redirect_url" varchar, "alignment" varchar DEFAULT 'left', "style" varchar DEFAULT 'primary'
    )`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "pages_blocks_faq_links_parent_id_idx" ON "pages_blocks_faq_links" ("_parent_id")`)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_faq_links" (
      "_order" integer, "_parent_id" varchar NOT NULL, "id" varchar PRIMARY KEY, "_uuid" uuid,
      "label" varchar NOT NULL, "link_type" varchar DEFAULT 'custom', "link_collection" varchar DEFAULT 'pages',
      "page_id" varchar, "event_id" varchar, "blog_post_id" varchar, "team_member_id" varchar,
      "url" varchar, "new_tab" boolean DEFAULT false, "link_action" varchar DEFAULT 'navigate',
      "popup_form_id" varchar, "popup_redirect_url" varchar, "alignment" varchar DEFAULT 'left', "style" varchar DEFAULT 'primary'
    )`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_links_parent_id_idx" ON "_pages_v_blocks_faq_links" ("_parent_id")`)

  // Gallery links (in case missing)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_blocks_gallery_links" (
      "_order" integer, "_parent_id" varchar NOT NULL, "id" varchar PRIMARY KEY, "_uuid" uuid,
      "label" varchar NOT NULL, "link_type" varchar DEFAULT 'custom', "link_collection" varchar DEFAULT 'pages',
      "page_id" varchar, "event_id" varchar, "blog_post_id" varchar, "team_member_id" varchar,
      "url" varchar, "new_tab" boolean DEFAULT false, "link_action" varchar DEFAULT 'navigate',
      "popup_form_id" varchar, "popup_redirect_url" varchar, "alignment" varchar DEFAULT 'left', "style" varchar DEFAULT 'primary'
    )`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "pages_blocks_gallery_links_parent_id_idx" ON "pages_blocks_gallery_links" ("_parent_id")`)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_gallery_links" (
      "_order" integer, "_parent_id" varchar NOT NULL, "id" varchar PRIMARY KEY, "_uuid" uuid,
      "label" varchar NOT NULL, "link_type" varchar DEFAULT 'custom', "link_collection" varchar DEFAULT 'pages',
      "page_id" varchar, "event_id" varchar, "blog_post_id" varchar, "team_member_id" varchar,
      "url" varchar, "new_tab" boolean DEFAULT false, "link_action" varchar DEFAULT 'navigate',
      "popup_form_id" varchar, "popup_redirect_url" varchar, "alignment" varchar DEFAULT 'left', "style" varchar DEFAULT 'primary'
    )`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_pages_v_blocks_gallery_links_parent_id_idx" ON "_pages_v_blocks_gallery_links" ("_parent_id")`)

  // Events list links (in case missing)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_blocks_events_list_links" (
      "_order" integer, "_parent_id" varchar NOT NULL, "id" varchar PRIMARY KEY, "_uuid" uuid,
      "label" varchar NOT NULL, "link_type" varchar DEFAULT 'custom', "link_collection" varchar DEFAULT 'pages',
      "page_id" varchar, "event_id" varchar, "blog_post_id" varchar, "team_member_id" varchar,
      "url" varchar, "new_tab" boolean DEFAULT false, "link_action" varchar DEFAULT 'navigate',
      "popup_form_id" varchar, "popup_redirect_url" varchar, "alignment" varchar DEFAULT 'left', "style" varchar DEFAULT 'primary'
    )`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "pages_blocks_events_list_links_parent_id_idx" ON "pages_blocks_events_list_links" ("_parent_id")`)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_events_list_links" (
      "_order" integer, "_parent_id" varchar NOT NULL, "id" varchar PRIMARY KEY, "_uuid" uuid,
      "label" varchar NOT NULL, "link_type" varchar DEFAULT 'custom', "link_collection" varchar DEFAULT 'pages',
      "page_id" varchar, "event_id" varchar, "blog_post_id" varchar, "team_member_id" varchar,
      "url" varchar, "new_tab" boolean DEFAULT false, "link_action" varchar DEFAULT 'navigate',
      "popup_form_id" varchar, "popup_redirect_url" varchar, "alignment" varchar DEFAULT 'left', "style" varchar DEFAULT 'primary'
    )`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_pages_v_blocks_events_list_links_parent_id_idx" ON "_pages_v_blocks_events_list_links" ("_parent_id")`)

  // ─── 2. Add alignment + style columns to ALL existing link tables ────

  // Hero
  await db.execute(sql`ALTER TABLE "pages_blocks_hero_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "pages_blocks_hero_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_hero_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_hero_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)

  // Content
  await db.execute(sql`ALTER TABLE "pages_blocks_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "pages_blocks_content_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_content_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)

  // About section
  await db.execute(sql`ALTER TABLE "pages_blocks_about_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "pages_blocks_about_section_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_about_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_about_section_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)

  // Showcase section
  await db.execute(sql`ALTER TABLE "pages_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "pages_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)

  // CTA
  await db.execute(sql`ALTER TABLE "pages_blocks_cta_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "pages_blocks_cta_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)

  // Split content
  await db.execute(sql`ALTER TABLE "pages_blocks_split_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "pages_blocks_split_content_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_split_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_split_content_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "pages_blocks_team_links" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "pages_blocks_testimonials_links" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "pages_blocks_partner_section_links" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "_pages_v_blocks_team_links" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "_pages_v_blocks_testimonials_links" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "_pages_v_blocks_partner_section_links" CASCADE`)
}
