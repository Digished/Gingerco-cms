import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Create missing link tables for Team, Testimonials, and Partner Section blocks

  // Team block links table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_blocks_team_links" (
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
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "pages_blocks_team_links_parent_id_idx" on "pages_blocks_team_links" ("_parent_id")`)

  // Testimonials links table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_blocks_testimonials_links" (
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
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "pages_blocks_testimonials_links_parent_id_idx" on "pages_blocks_testimonials_links" ("_parent_id")`)

  // Partner section links table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_blocks_partner_section_links" (
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
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "pages_blocks_partner_section_links_parent_id_idx" on "pages_blocks_partner_section_links" ("_parent_id")`)

  // Create versioned tables
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_team_links" (
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
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_pages_v_blocks_team_links_parent_id_idx" on "_pages_v_blocks_team_links" ("_parent_id")`)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_testimonials_links" (
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
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_pages_v_blocks_testimonials_links_parent_id_idx" on "_pages_v_blocks_testimonials_links" ("_parent_id")`)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_partner_section_links" (
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
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "_pages_v_blocks_partner_section_links_parent_id_idx" on "_pages_v_blocks_partner_section_links" ("_parent_id")`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "pages_blocks_team_links" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "pages_blocks_testimonials_links" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "pages_blocks_partner_section_links" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "_pages_v_blocks_team_links" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "_pages_v_blocks_testimonials_links" CASCADE`)
  await db.execute(sql`DROP TABLE IF EXISTS "_pages_v_blocks_partner_section_links" CASCADE`)
}
