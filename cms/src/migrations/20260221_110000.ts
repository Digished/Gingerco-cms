import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Create missing link tables that Payload is trying to query

  // FAQ links table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_blocks_faq_links" (
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
      "alignment" varchar DEFAULT 'left',
      "style" varchar DEFAULT 'primary'
    )
  `)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "pages_blocks_faq_links_parent_id_idx" on "pages_blocks_faq_links" ("_parent_id")`)

  // Gallery links table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_blocks_gallery_links" (
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
      "alignment" varchar DEFAULT 'left',
      "style" varchar DEFAULT 'primary'
    )
  `)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "pages_blocks_gallery_links_parent_id_idx" on "pages_blocks_gallery_links" ("_parent_id")`)

  // Events list links table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_blocks_events_list_links" (
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
      "alignment" varchar DEFAULT 'left',
      "style" varchar DEFAULT 'primary'
    )
  `)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "pages_blocks_events_list_links_parent_id_idx" on "pages_blocks_events_list_links" ("_parent_id")`)

  // Create versioned tables
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_faq_links" (
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
      "alignment" varchar DEFAULT 'left',
      "style" varchar DEFAULT 'primary'
    )
  `)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_links_parent_id_idx" on "_pages_v_blocks_faq_links" ("_parent_id")`)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_gallery_links" (
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
      "alignment" varchar DEFAULT 'left',
      "style" varchar DEFAULT 'primary'
    )
  `)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_pages_v_blocks_gallery_links_parent_id_idx" on "_pages_v_blocks_gallery_links" ("_parent_id")`)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_events_list_links" (
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
      "alignment" varchar DEFAULT 'left',
      "style" varchar DEFAULT 'primary'
    )
  `)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_pages_v_blocks_events_list_links_parent_id_idx" on "_pages_v_blocks_events_list_links" ("_parent_id")`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "pages_blocks_faq_links" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "pages_blocks_gallery_links" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "pages_blocks_events_list_links" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "_pages_v_blocks_faq_links" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "_pages_v_blocks_gallery_links" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "_pages_v_blocks_events_list_links" CASCADE`)
}
