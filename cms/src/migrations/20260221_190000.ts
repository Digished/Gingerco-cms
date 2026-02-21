import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Fix _parent_id type mismatch in _pages_v block link tables
 *
 * Root cause: Several _pages_v_blocks_*_links tables were created with
 * "_parent_id" varchar, but the parent block tables (_pages_v_blocks_*)
 * use "id" serial PRIMARY KEY (integer). This causes:
 *   "operator does not exist: character varying = integer"
 * when Payload joins: WHERE link_table._parent_id = block_table.id
 *
 * Fix: Drop and recreate the affected tables with "_parent_id" integer.
 *
 * Affected tables (created with wrong varchar types):
 *   - _pages_v_blocks_faq_links        (20260221_110000)
 *   - _pages_v_blocks_gallery_links     (20260221_110000)
 *   - _pages_v_blocks_events_list_links (20260221_110000)
 *   - _pages_v_blocks_team_links        (20260221_130000)
 *   - _pages_v_blocks_testimonials_links (20260221_130000)
 *   - _pages_v_blocks_partner_section_links (20260221_130000)
 *
 * Also re-fixing the tables from 20260220_192000 in case 20260220_200000
 * did not run successfully:
 *   - _pages_v_blocks_content_links
 *   - _pages_v_blocks_about_section_links
 *   - _pages_v_blocks_split_content_links
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Fix _pages_v_blocks_content_links
  await db.execute(sql`
    DROP TABLE IF EXISTS "_pages_v_blocks_content_links" CASCADE;
    CREATE TABLE "_pages_v_blocks_content_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "label" varchar,
      "link_type" varchar DEFAULT 'custom',
      "link_collection" varchar DEFAULT 'pages',
      "page_id" integer,
      "event_id" integer,
      "blog_post_id" integer,
      "team_member_id" integer,
      "url" varchar,
      "new_tab" boolean DEFAULT false,
      "link_action" varchar DEFAULT 'navigate',
      "popup_form_id" integer,
      "popup_redirect_url" varchar,
      "style" varchar DEFAULT 'primary'
    );
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_content_links_order_idx" ON "_pages_v_blocks_content_links" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_content_links_parent_id_idx" ON "_pages_v_blocks_content_links" USING btree ("_parent_id");
  `)

  // Fix _pages_v_blocks_about_section_links
  await db.execute(sql`
    DROP TABLE IF EXISTS "_pages_v_blocks_about_section_links" CASCADE;
    CREATE TABLE "_pages_v_blocks_about_section_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "label" varchar,
      "link_type" varchar DEFAULT 'custom',
      "link_collection" varchar DEFAULT 'pages',
      "page_id" integer,
      "event_id" integer,
      "blog_post_id" integer,
      "team_member_id" integer,
      "url" varchar,
      "new_tab" boolean DEFAULT false,
      "link_action" varchar DEFAULT 'navigate',
      "popup_form_id" integer,
      "popup_redirect_url" varchar,
      "style" varchar DEFAULT 'primary'
    );
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_about_section_links_order_idx" ON "_pages_v_blocks_about_section_links" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_about_section_links_parent_id_idx" ON "_pages_v_blocks_about_section_links" USING btree ("_parent_id");
  `)

  // Fix _pages_v_blocks_split_content_links
  await db.execute(sql`
    DROP TABLE IF EXISTS "_pages_v_blocks_split_content_links" CASCADE;
    CREATE TABLE "_pages_v_blocks_split_content_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "label" varchar,
      "link_type" varchar DEFAULT 'custom',
      "link_collection" varchar DEFAULT 'pages',
      "page_id" integer,
      "event_id" integer,
      "blog_post_id" integer,
      "team_member_id" integer,
      "url" varchar,
      "new_tab" boolean DEFAULT false,
      "link_action" varchar DEFAULT 'navigate',
      "popup_form_id" integer,
      "popup_redirect_url" varchar,
      "style" varchar DEFAULT 'primary'
    );
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_split_content_links_order_idx" ON "_pages_v_blocks_split_content_links" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_split_content_links_parent_id_idx" ON "_pages_v_blocks_split_content_links" USING btree ("_parent_id");
  `)

  // Fix _pages_v_blocks_faq_links
  await db.execute(sql`
    DROP TABLE IF EXISTS "_pages_v_blocks_faq_links" CASCADE;
    CREATE TABLE "_pages_v_blocks_faq_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "label" varchar,
      "link_type" varchar DEFAULT 'custom',
      "link_collection" varchar DEFAULT 'pages',
      "page_id" integer,
      "event_id" integer,
      "blog_post_id" integer,
      "team_member_id" integer,
      "url" varchar,
      "new_tab" boolean DEFAULT false,
      "link_action" varchar DEFAULT 'navigate',
      "popup_form_id" integer,
      "popup_redirect_url" varchar,
      "style" varchar DEFAULT 'primary'
    );
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_links_order_idx" ON "_pages_v_blocks_faq_links" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_links_parent_id_idx" ON "_pages_v_blocks_faq_links" USING btree ("_parent_id");
  `)

  // Fix _pages_v_blocks_gallery_links
  await db.execute(sql`
    DROP TABLE IF EXISTS "_pages_v_blocks_gallery_links" CASCADE;
    CREATE TABLE "_pages_v_blocks_gallery_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "label" varchar,
      "link_type" varchar DEFAULT 'custom',
      "link_collection" varchar DEFAULT 'pages',
      "page_id" integer,
      "event_id" integer,
      "blog_post_id" integer,
      "team_member_id" integer,
      "url" varchar,
      "new_tab" boolean DEFAULT false,
      "link_action" varchar DEFAULT 'navigate',
      "popup_form_id" integer,
      "popup_redirect_url" varchar,
      "style" varchar DEFAULT 'primary'
    );
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_gallery_links_order_idx" ON "_pages_v_blocks_gallery_links" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_gallery_links_parent_id_idx" ON "_pages_v_blocks_gallery_links" USING btree ("_parent_id");
  `)

  // Fix _pages_v_blocks_events_list_links
  await db.execute(sql`
    DROP TABLE IF EXISTS "_pages_v_blocks_events_list_links" CASCADE;
    CREATE TABLE "_pages_v_blocks_events_list_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "label" varchar,
      "link_type" varchar DEFAULT 'custom',
      "link_collection" varchar DEFAULT 'pages',
      "page_id" integer,
      "event_id" integer,
      "blog_post_id" integer,
      "team_member_id" integer,
      "url" varchar,
      "new_tab" boolean DEFAULT false,
      "link_action" varchar DEFAULT 'navigate',
      "popup_form_id" integer,
      "popup_redirect_url" varchar,
      "style" varchar DEFAULT 'primary'
    );
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_events_list_links_order_idx" ON "_pages_v_blocks_events_list_links" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_events_list_links_parent_id_idx" ON "_pages_v_blocks_events_list_links" USING btree ("_parent_id");
  `)

  // Fix _pages_v_blocks_team_links
  await db.execute(sql`
    DROP TABLE IF EXISTS "_pages_v_blocks_team_links" CASCADE;
    CREATE TABLE "_pages_v_blocks_team_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "label" varchar,
      "link_type" varchar DEFAULT 'custom',
      "link_collection" varchar DEFAULT 'pages',
      "page_id" integer,
      "event_id" integer,
      "blog_post_id" integer,
      "team_member_id" integer,
      "url" varchar,
      "new_tab" boolean DEFAULT false,
      "link_action" varchar DEFAULT 'navigate',
      "popup_form_id" integer,
      "popup_redirect_url" varchar,
      "style" varchar DEFAULT 'primary'
    );
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_team_links_order_idx" ON "_pages_v_blocks_team_links" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_team_links_parent_id_idx" ON "_pages_v_blocks_team_links" USING btree ("_parent_id");
  `)

  // Fix _pages_v_blocks_testimonials_links
  await db.execute(sql`
    DROP TABLE IF EXISTS "_pages_v_blocks_testimonials_links" CASCADE;
    CREATE TABLE "_pages_v_blocks_testimonials_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "label" varchar,
      "link_type" varchar DEFAULT 'custom',
      "link_collection" varchar DEFAULT 'pages',
      "page_id" integer,
      "event_id" integer,
      "blog_post_id" integer,
      "team_member_id" integer,
      "url" varchar,
      "new_tab" boolean DEFAULT false,
      "link_action" varchar DEFAULT 'navigate',
      "popup_form_id" integer,
      "popup_redirect_url" varchar,
      "style" varchar DEFAULT 'primary'
    );
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_testimonials_links_order_idx" ON "_pages_v_blocks_testimonials_links" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_testimonials_links_parent_id_idx" ON "_pages_v_blocks_testimonials_links" USING btree ("_parent_id");
  `)

  // Fix _pages_v_blocks_partner_section_links
  await db.execute(sql`
    DROP TABLE IF EXISTS "_pages_v_blocks_partner_section_links" CASCADE;
    CREATE TABLE "_pages_v_blocks_partner_section_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "label" varchar,
      "link_type" varchar DEFAULT 'custom',
      "link_collection" varchar DEFAULT 'pages',
      "page_id" integer,
      "event_id" integer,
      "blog_post_id" integer,
      "team_member_id" integer,
      "url" varchar,
      "new_tab" boolean DEFAULT false,
      "link_action" varchar DEFAULT 'navigate',
      "popup_form_id" integer,
      "popup_redirect_url" varchar,
      "style" varchar DEFAULT 'primary'
    );
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_partner_section_links_order_idx" ON "_pages_v_blocks_partner_section_links" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_partner_section_links_parent_id_idx" ON "_pages_v_blocks_partner_section_links" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "_pages_v_blocks_content_links" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "_pages_v_blocks_about_section_links" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "_pages_v_blocks_split_content_links" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "_pages_v_blocks_faq_links" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "_pages_v_blocks_gallery_links" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "_pages_v_blocks_events_list_links" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "_pages_v_blocks_team_links" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "_pages_v_blocks_testimonials_links" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "_pages_v_blocks_partner_section_links" CASCADE`)
}
