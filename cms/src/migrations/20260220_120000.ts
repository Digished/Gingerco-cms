import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── 1. Add heading_color to all 8 block tables and their version counterparts ──
  await db.execute(sql`
  ALTER TABLE "pages_blocks_content" ADD COLUMN IF NOT EXISTS "heading_color" varchar;
  ALTER TABLE "_pages_v_blocks_content" ADD COLUMN IF NOT EXISTS "heading_color" varchar;
  ALTER TABLE "pages_blocks_faq" ADD COLUMN IF NOT EXISTS "heading_color" varchar;
  ALTER TABLE "_pages_v_blocks_faq" ADD COLUMN IF NOT EXISTS "heading_color" varchar;
  ALTER TABLE "pages_blocks_gallery" ADD COLUMN IF NOT EXISTS "heading_color" varchar;
  ALTER TABLE "_pages_v_blocks_gallery" ADD COLUMN IF NOT EXISTS "heading_color" varchar;
  ALTER TABLE "pages_blocks_about_section" ADD COLUMN IF NOT EXISTS "heading_color" varchar;
  ALTER TABLE "_pages_v_blocks_about_section" ADD COLUMN IF NOT EXISTS "heading_color" varchar;
  ALTER TABLE "pages_blocks_events_list" ADD COLUMN IF NOT EXISTS "heading_color" varchar;
  ALTER TABLE "_pages_v_blocks_events_list" ADD COLUMN IF NOT EXISTS "heading_color" varchar;
  ALTER TABLE "pages_blocks_team" ADD COLUMN IF NOT EXISTS "heading_color" varchar;
  ALTER TABLE "_pages_v_blocks_team" ADD COLUMN IF NOT EXISTS "heading_color" varchar;
  ALTER TABLE "pages_blocks_testimonials" ADD COLUMN IF NOT EXISTS "heading_color" varchar;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD COLUMN IF NOT EXISTS "heading_color" varchar;
  ALTER TABLE "pages_blocks_bullet_list" ADD COLUMN IF NOT EXISTS "heading_color" varchar;
  ALTER TABLE "_pages_v_blocks_bullet_list" ADD COLUMN IF NOT EXISTS "heading_color" varchar;
  `)

  // ── 2. Add display_mode to gallery block ──
  await db.execute(sql`
  ALTER TABLE "pages_blocks_gallery" ADD COLUMN IF NOT EXISTS "display_mode" varchar DEFAULT 'grid';
  ALTER TABLE "_pages_v_blocks_gallery" ADD COLUMN IF NOT EXISTS "display_mode" varchar DEFAULT 'grid';
  `)

  // ── 3. Add new columns to site_settings ──
  await db.execute(sql`
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fab_toggle_icon" varchar DEFAULT 'plus';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fab_toggle_color" varchar DEFAULT '#333333';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "seo_indexing" varchar DEFAULT 'index';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "canonical_url" varchar;
  `)

  // ── 4. Create link tables for all 8 new blocks ──

  // Content block links
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "pages_blocks_content_links" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
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
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_content_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
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
    "style" varchar DEFAULT 'primary',
    "_uuid" varchar
  );
  `)

  // FAQ block links
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "pages_blocks_faq_links" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
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
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_faq_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
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
    "style" varchar DEFAULT 'primary',
    "_uuid" varchar
  );
  `)

  // About Section block links
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "pages_blocks_about_section_links" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
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
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_about_section_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
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
    "style" varchar DEFAULT 'primary',
    "_uuid" varchar
  );
  `)

  // Events List block links
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "pages_blocks_events_list_links" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
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
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_events_list_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
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
    "style" varchar DEFAULT 'primary',
    "_uuid" varchar
  );
  `)

  // Team block links
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "pages_blocks_team_links" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
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
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_team_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
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
    "style" varchar DEFAULT 'primary',
    "_uuid" varchar
  );
  `)

  // Testimonials block links
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "pages_blocks_testimonials_links" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
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
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_testimonials_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
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
    "style" varchar DEFAULT 'primary',
    "_uuid" varchar
  );
  `)

  // Bullet List block links
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "pages_blocks_bullet_list_links" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
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
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_bullet_list_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
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
    "style" varchar DEFAULT 'primary',
    "_uuid" varchar
  );
  `)

  // Gallery block links
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "pages_blocks_gallery_links" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
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
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_gallery_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
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
    "style" varchar DEFAULT 'primary',
    "_uuid" varchar
  );
  `)

  // ── 5. Foreign key constraints for all new link tables ──

  // Content links
  await db.execute(sql`
  DO $$ BEGIN ALTER TABLE "pages_blocks_content_links" ADD CONSTRAINT "pages_blocks_content_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_content_links" ADD CONSTRAINT "pages_blocks_content_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_content_links" ADD CONSTRAINT "pages_blocks_content_links_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_content_links" ADD CONSTRAINT "pages_blocks_content_links_blog_post_id_blog_posts_id_fk" FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_content_links" ADD CONSTRAINT "pages_blocks_content_links_team_member_id_team_members_id_fk" FOREIGN KEY ("team_member_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_content_links" ADD CONSTRAINT "pages_blocks_content_links_popup_form_id_forms_id_fk" FOREIGN KEY ("popup_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_content_links" ADD CONSTRAINT "_pages_v_blocks_content_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_content_links" ADD CONSTRAINT "_pages_v_blocks_content_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_content_links" ADD CONSTRAINT "_pages_v_blocks_content_links_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_content_links" ADD CONSTRAINT "_pages_v_blocks_content_links_blog_post_id_blog_posts_id_fk" FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_content_links" ADD CONSTRAINT "_pages_v_blocks_content_links_team_member_id_team_members_id_fk" FOREIGN KEY ("team_member_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_content_links" ADD CONSTRAINT "_pages_v_blocks_content_links_popup_form_id_forms_id_fk" FOREIGN KEY ("popup_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // FAQ links
  await db.execute(sql`
  DO $$ BEGIN ALTER TABLE "pages_blocks_faq_links" ADD CONSTRAINT "pages_blocks_faq_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_faq_links" ADD CONSTRAINT "pages_blocks_faq_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_faq_links" ADD CONSTRAINT "pages_blocks_faq_links_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_faq_links" ADD CONSTRAINT "pages_blocks_faq_links_blog_post_id_blog_posts_id_fk" FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_faq_links" ADD CONSTRAINT "pages_blocks_faq_links_team_member_id_team_members_id_fk" FOREIGN KEY ("team_member_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_faq_links" ADD CONSTRAINT "pages_blocks_faq_links_popup_form_id_forms_id_fk" FOREIGN KEY ("popup_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_faq_links" ADD CONSTRAINT "_pages_v_blocks_faq_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_faq_links" ADD CONSTRAINT "_pages_v_blocks_faq_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_faq_links" ADD CONSTRAINT "_pages_v_blocks_faq_links_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_faq_links" ADD CONSTRAINT "_pages_v_blocks_faq_links_blog_post_id_blog_posts_id_fk" FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_faq_links" ADD CONSTRAINT "_pages_v_blocks_faq_links_team_member_id_team_members_id_fk" FOREIGN KEY ("team_member_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_faq_links" ADD CONSTRAINT "_pages_v_blocks_faq_links_popup_form_id_forms_id_fk" FOREIGN KEY ("popup_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // About Section links
  await db.execute(sql`
  DO $$ BEGIN ALTER TABLE "pages_blocks_about_section_links" ADD CONSTRAINT "pages_blocks_about_section_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_about_section"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_about_section_links" ADD CONSTRAINT "pages_blocks_about_section_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_about_section_links" ADD CONSTRAINT "pages_blocks_about_section_links_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_about_section_links" ADD CONSTRAINT "pages_blocks_about_section_links_blog_post_id_blog_posts_id_fk" FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_about_section_links" ADD CONSTRAINT "pages_blocks_about_section_links_team_member_id_team_members_id_fk" FOREIGN KEY ("team_member_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_about_section_links" ADD CONSTRAINT "pages_blocks_about_section_links_popup_form_id_forms_id_fk" FOREIGN KEY ("popup_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_about_section_links" ADD CONSTRAINT "_pages_v_blocks_about_section_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_about_section"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_about_section_links" ADD CONSTRAINT "_pages_v_blocks_about_section_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_about_section_links" ADD CONSTRAINT "_pages_v_blocks_about_section_links_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_about_section_links" ADD CONSTRAINT "_pages_v_blocks_about_section_links_blog_post_id_blog_posts_id_fk" FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_about_section_links" ADD CONSTRAINT "_pages_v_blocks_about_section_links_team_member_id_team_members_id_fk" FOREIGN KEY ("team_member_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_about_section_links" ADD CONSTRAINT "_pages_v_blocks_about_section_links_popup_form_id_forms_id_fk" FOREIGN KEY ("popup_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // Events List links
  await db.execute(sql`
  DO $$ BEGIN ALTER TABLE "pages_blocks_events_list_links" ADD CONSTRAINT "pages_blocks_events_list_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_events_list"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_events_list_links" ADD CONSTRAINT "pages_blocks_events_list_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_events_list_links" ADD CONSTRAINT "pages_blocks_events_list_links_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_events_list_links" ADD CONSTRAINT "pages_blocks_events_list_links_blog_post_id_blog_posts_id_fk" FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_events_list_links" ADD CONSTRAINT "pages_blocks_events_list_links_team_member_id_team_members_id_fk" FOREIGN KEY ("team_member_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_events_list_links" ADD CONSTRAINT "pages_blocks_events_list_links_popup_form_id_forms_id_fk" FOREIGN KEY ("popup_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_events_list_links" ADD CONSTRAINT "_pages_v_blocks_events_list_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_events_list"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_events_list_links" ADD CONSTRAINT "_pages_v_blocks_events_list_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_events_list_links" ADD CONSTRAINT "_pages_v_blocks_events_list_links_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_events_list_links" ADD CONSTRAINT "_pages_v_blocks_events_list_links_blog_post_id_blog_posts_id_fk" FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_events_list_links" ADD CONSTRAINT "_pages_v_blocks_events_list_links_team_member_id_team_members_id_fk" FOREIGN KEY ("team_member_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_events_list_links" ADD CONSTRAINT "_pages_v_blocks_events_list_links_popup_form_id_forms_id_fk" FOREIGN KEY ("popup_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // Team links
  await db.execute(sql`
  DO $$ BEGIN ALTER TABLE "pages_blocks_team_links" ADD CONSTRAINT "pages_blocks_team_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_team"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_team_links" ADD CONSTRAINT "pages_blocks_team_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_team_links" ADD CONSTRAINT "pages_blocks_team_links_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_team_links" ADD CONSTRAINT "pages_blocks_team_links_blog_post_id_blog_posts_id_fk" FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_team_links" ADD CONSTRAINT "pages_blocks_team_links_team_member_id_team_members_id_fk" FOREIGN KEY ("team_member_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_team_links" ADD CONSTRAINT "pages_blocks_team_links_popup_form_id_forms_id_fk" FOREIGN KEY ("popup_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_team_links" ADD CONSTRAINT "_pages_v_blocks_team_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_team"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_team_links" ADD CONSTRAINT "_pages_v_blocks_team_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_team_links" ADD CONSTRAINT "_pages_v_blocks_team_links_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_team_links" ADD CONSTRAINT "_pages_v_blocks_team_links_blog_post_id_blog_posts_id_fk" FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_team_links" ADD CONSTRAINT "_pages_v_blocks_team_links_team_member_id_team_members_id_fk" FOREIGN KEY ("team_member_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_team_links" ADD CONSTRAINT "_pages_v_blocks_team_links_popup_form_id_forms_id_fk" FOREIGN KEY ("popup_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // Testimonials links
  await db.execute(sql`
  DO $$ BEGIN ALTER TABLE "pages_blocks_testimonials_links" ADD CONSTRAINT "pages_blocks_testimonials_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_testimonials_links" ADD CONSTRAINT "pages_blocks_testimonials_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_testimonials_links" ADD CONSTRAINT "pages_blocks_testimonials_links_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_testimonials_links" ADD CONSTRAINT "pages_blocks_testimonials_links_blog_post_id_blog_posts_id_fk" FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_testimonials_links" ADD CONSTRAINT "pages_blocks_testimonials_links_team_member_id_team_members_id_fk" FOREIGN KEY ("team_member_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_testimonials_links" ADD CONSTRAINT "pages_blocks_testimonials_links_popup_form_id_forms_id_fk" FOREIGN KEY ("popup_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_testimonials_links" ADD CONSTRAINT "_pages_v_blocks_testimonials_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_testimonials_links" ADD CONSTRAINT "_pages_v_blocks_testimonials_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_testimonials_links" ADD CONSTRAINT "_pages_v_blocks_testimonials_links_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_testimonials_links" ADD CONSTRAINT "_pages_v_blocks_testimonials_links_blog_post_id_blog_posts_id_fk" FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_testimonials_links" ADD CONSTRAINT "_pages_v_blocks_testimonials_links_team_member_id_team_members_id_fk" FOREIGN KEY ("team_member_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_testimonials_links" ADD CONSTRAINT "_pages_v_blocks_testimonials_links_popup_form_id_forms_id_fk" FOREIGN KEY ("popup_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // Bullet List links
  await db.execute(sql`
  DO $$ BEGIN ALTER TABLE "pages_blocks_bullet_list_links" ADD CONSTRAINT "pages_blocks_bullet_list_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_bullet_list"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_bullet_list_links" ADD CONSTRAINT "pages_blocks_bullet_list_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_bullet_list_links" ADD CONSTRAINT "pages_blocks_bullet_list_links_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_bullet_list_links" ADD CONSTRAINT "pages_blocks_bullet_list_links_blog_post_id_blog_posts_id_fk" FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_bullet_list_links" ADD CONSTRAINT "pages_blocks_bullet_list_links_team_member_id_team_members_id_fk" FOREIGN KEY ("team_member_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_bullet_list_links" ADD CONSTRAINT "pages_blocks_bullet_list_links_popup_form_id_forms_id_fk" FOREIGN KEY ("popup_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_bullet_list_links" ADD CONSTRAINT "_pages_v_blocks_bullet_list_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_bullet_list"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_bullet_list_links" ADD CONSTRAINT "_pages_v_blocks_bullet_list_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_bullet_list_links" ADD CONSTRAINT "_pages_v_blocks_bullet_list_links_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_bullet_list_links" ADD CONSTRAINT "_pages_v_blocks_bullet_list_links_blog_post_id_blog_posts_id_fk" FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_bullet_list_links" ADD CONSTRAINT "_pages_v_blocks_bullet_list_links_team_member_id_team_members_id_fk" FOREIGN KEY ("team_member_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_bullet_list_links" ADD CONSTRAINT "_pages_v_blocks_bullet_list_links_popup_form_id_forms_id_fk" FOREIGN KEY ("popup_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // Gallery links
  await db.execute(sql`
  DO $$ BEGIN ALTER TABLE "pages_blocks_gallery_links" ADD CONSTRAINT "pages_blocks_gallery_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_gallery_links" ADD CONSTRAINT "pages_blocks_gallery_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_gallery_links" ADD CONSTRAINT "pages_blocks_gallery_links_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_gallery_links" ADD CONSTRAINT "pages_blocks_gallery_links_blog_post_id_blog_posts_id_fk" FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_gallery_links" ADD CONSTRAINT "pages_blocks_gallery_links_team_member_id_team_members_id_fk" FOREIGN KEY ("team_member_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_gallery_links" ADD CONSTRAINT "pages_blocks_gallery_links_popup_form_id_forms_id_fk" FOREIGN KEY ("popup_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_gallery_links" ADD CONSTRAINT "_pages_v_blocks_gallery_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_gallery_links" ADD CONSTRAINT "_pages_v_blocks_gallery_links_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_gallery_links" ADD CONSTRAINT "_pages_v_blocks_gallery_links_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_gallery_links" ADD CONSTRAINT "_pages_v_blocks_gallery_links_blog_post_id_blog_posts_id_fk" FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_gallery_links" ADD CONSTRAINT "_pages_v_blocks_gallery_links_team_member_id_team_members_id_fk" FOREIGN KEY ("team_member_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_gallery_links" ADD CONSTRAINT "_pages_v_blocks_gallery_links_popup_form_id_forms_id_fk" FOREIGN KEY ("popup_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // ── 6. Indexes for all new link tables ──
  await db.execute(sql`
  CREATE INDEX IF NOT EXISTS "pages_blocks_content_links_order_idx" ON "pages_blocks_content_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_content_links_parent_id_idx" ON "pages_blocks_content_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_content_links_page_idx" ON "pages_blocks_content_links" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_content_links_event_idx" ON "pages_blocks_content_links" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_content_links_blog_post_idx" ON "pages_blocks_content_links" USING btree ("blog_post_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_content_links_team_member_idx" ON "pages_blocks_content_links" USING btree ("team_member_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_content_links_popup_form_idx" ON "pages_blocks_content_links" USING btree ("popup_form_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_content_links_order_idx" ON "_pages_v_blocks_content_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_content_links_parent_id_idx" ON "_pages_v_blocks_content_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_content_links_page_idx" ON "_pages_v_blocks_content_links" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_content_links_event_idx" ON "_pages_v_blocks_content_links" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_content_links_blog_post_idx" ON "_pages_v_blocks_content_links" USING btree ("blog_post_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_content_links_team_member_idx" ON "_pages_v_blocks_content_links" USING btree ("team_member_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_content_links_popup_form_idx" ON "_pages_v_blocks_content_links" USING btree ("popup_form_id");

  CREATE INDEX IF NOT EXISTS "pages_blocks_faq_links_order_idx" ON "pages_blocks_faq_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_faq_links_parent_id_idx" ON "pages_blocks_faq_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_faq_links_page_idx" ON "pages_blocks_faq_links" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_faq_links_event_idx" ON "pages_blocks_faq_links" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_faq_links_blog_post_idx" ON "pages_blocks_faq_links" USING btree ("blog_post_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_faq_links_team_member_idx" ON "pages_blocks_faq_links" USING btree ("team_member_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_faq_links_popup_form_idx" ON "pages_blocks_faq_links" USING btree ("popup_form_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_links_order_idx" ON "_pages_v_blocks_faq_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_links_parent_id_idx" ON "_pages_v_blocks_faq_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_links_page_idx" ON "_pages_v_blocks_faq_links" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_links_event_idx" ON "_pages_v_blocks_faq_links" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_links_blog_post_idx" ON "_pages_v_blocks_faq_links" USING btree ("blog_post_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_links_team_member_idx" ON "_pages_v_blocks_faq_links" USING btree ("team_member_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_faq_links_popup_form_idx" ON "_pages_v_blocks_faq_links" USING btree ("popup_form_id");

  CREATE INDEX IF NOT EXISTS "pages_blocks_about_section_links_order_idx" ON "pages_blocks_about_section_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_about_section_links_parent_id_idx" ON "pages_blocks_about_section_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_about_section_links_page_idx" ON "pages_blocks_about_section_links" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_about_section_links_event_idx" ON "pages_blocks_about_section_links" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_about_section_links_blog_post_idx" ON "pages_blocks_about_section_links" USING btree ("blog_post_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_about_section_links_team_member_idx" ON "pages_blocks_about_section_links" USING btree ("team_member_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_about_section_links_popup_form_idx" ON "pages_blocks_about_section_links" USING btree ("popup_form_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_about_section_links_order_idx" ON "_pages_v_blocks_about_section_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_about_section_links_parent_id_idx" ON "_pages_v_blocks_about_section_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_about_section_links_page_idx" ON "_pages_v_blocks_about_section_links" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_about_section_links_event_idx" ON "_pages_v_blocks_about_section_links" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_about_section_links_blog_post_idx" ON "_pages_v_blocks_about_section_links" USING btree ("blog_post_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_about_section_links_team_member_idx" ON "_pages_v_blocks_about_section_links" USING btree ("team_member_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_about_section_links_popup_form_idx" ON "_pages_v_blocks_about_section_links" USING btree ("popup_form_id");

  CREATE INDEX IF NOT EXISTS "pages_blocks_events_list_links_order_idx" ON "pages_blocks_events_list_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_events_list_links_parent_id_idx" ON "pages_blocks_events_list_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_events_list_links_page_idx" ON "pages_blocks_events_list_links" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_events_list_links_event_idx" ON "pages_blocks_events_list_links" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_events_list_links_blog_post_idx" ON "pages_blocks_events_list_links" USING btree ("blog_post_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_events_list_links_team_member_idx" ON "pages_blocks_events_list_links" USING btree ("team_member_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_events_list_links_popup_form_idx" ON "pages_blocks_events_list_links" USING btree ("popup_form_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_events_list_links_order_idx" ON "_pages_v_blocks_events_list_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_events_list_links_parent_id_idx" ON "_pages_v_blocks_events_list_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_events_list_links_page_idx" ON "_pages_v_blocks_events_list_links" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_events_list_links_event_idx" ON "_pages_v_blocks_events_list_links" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_events_list_links_blog_post_idx" ON "_pages_v_blocks_events_list_links" USING btree ("blog_post_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_events_list_links_team_member_idx" ON "_pages_v_blocks_events_list_links" USING btree ("team_member_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_events_list_links_popup_form_idx" ON "_pages_v_blocks_events_list_links" USING btree ("popup_form_id");

  CREATE INDEX IF NOT EXISTS "pages_blocks_team_links_order_idx" ON "pages_blocks_team_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_team_links_parent_id_idx" ON "pages_blocks_team_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_team_links_page_idx" ON "pages_blocks_team_links" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_team_links_event_idx" ON "pages_blocks_team_links" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_team_links_blog_post_idx" ON "pages_blocks_team_links" USING btree ("blog_post_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_team_links_team_member_idx" ON "pages_blocks_team_links" USING btree ("team_member_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_team_links_popup_form_idx" ON "pages_blocks_team_links" USING btree ("popup_form_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_team_links_order_idx" ON "_pages_v_blocks_team_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_team_links_parent_id_idx" ON "_pages_v_blocks_team_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_team_links_page_idx" ON "_pages_v_blocks_team_links" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_team_links_event_idx" ON "_pages_v_blocks_team_links" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_team_links_blog_post_idx" ON "_pages_v_blocks_team_links" USING btree ("blog_post_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_team_links_team_member_idx" ON "_pages_v_blocks_team_links" USING btree ("team_member_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_team_links_popup_form_idx" ON "_pages_v_blocks_team_links" USING btree ("popup_form_id");

  CREATE INDEX IF NOT EXISTS "pages_blocks_testimonials_links_order_idx" ON "pages_blocks_testimonials_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_testimonials_links_parent_id_idx" ON "pages_blocks_testimonials_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_testimonials_links_page_idx" ON "pages_blocks_testimonials_links" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_testimonials_links_event_idx" ON "pages_blocks_testimonials_links" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_testimonials_links_blog_post_idx" ON "pages_blocks_testimonials_links" USING btree ("blog_post_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_testimonials_links_team_member_idx" ON "pages_blocks_testimonials_links" USING btree ("team_member_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_testimonials_links_popup_form_idx" ON "pages_blocks_testimonials_links" USING btree ("popup_form_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_testimonials_links_order_idx" ON "_pages_v_blocks_testimonials_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_testimonials_links_parent_id_idx" ON "_pages_v_blocks_testimonials_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_testimonials_links_page_idx" ON "_pages_v_blocks_testimonials_links" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_testimonials_links_event_idx" ON "_pages_v_blocks_testimonials_links" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_testimonials_links_blog_post_idx" ON "_pages_v_blocks_testimonials_links" USING btree ("blog_post_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_testimonials_links_team_member_idx" ON "_pages_v_blocks_testimonials_links" USING btree ("team_member_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_testimonials_links_popup_form_idx" ON "_pages_v_blocks_testimonials_links" USING btree ("popup_form_id");

  CREATE INDEX IF NOT EXISTS "pages_blocks_bullet_list_links_order_idx" ON "pages_blocks_bullet_list_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_bullet_list_links_parent_id_idx" ON "pages_blocks_bullet_list_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_bullet_list_links_page_idx" ON "pages_blocks_bullet_list_links" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_bullet_list_links_event_idx" ON "pages_blocks_bullet_list_links" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_bullet_list_links_blog_post_idx" ON "pages_blocks_bullet_list_links" USING btree ("blog_post_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_bullet_list_links_team_member_idx" ON "pages_blocks_bullet_list_links" USING btree ("team_member_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_bullet_list_links_popup_form_idx" ON "pages_blocks_bullet_list_links" USING btree ("popup_form_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_bullet_list_links_order_idx" ON "_pages_v_blocks_bullet_list_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_bullet_list_links_parent_id_idx" ON "_pages_v_blocks_bullet_list_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_bullet_list_links_page_idx" ON "_pages_v_blocks_bullet_list_links" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_bullet_list_links_event_idx" ON "_pages_v_blocks_bullet_list_links" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_bullet_list_links_blog_post_idx" ON "_pages_v_blocks_bullet_list_links" USING btree ("blog_post_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_bullet_list_links_team_member_idx" ON "_pages_v_blocks_bullet_list_links" USING btree ("team_member_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_bullet_list_links_popup_form_idx" ON "_pages_v_blocks_bullet_list_links" USING btree ("popup_form_id");

  CREATE INDEX IF NOT EXISTS "pages_blocks_gallery_links_order_idx" ON "pages_blocks_gallery_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_gallery_links_parent_id_idx" ON "pages_blocks_gallery_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_gallery_links_page_idx" ON "pages_blocks_gallery_links" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_gallery_links_event_idx" ON "pages_blocks_gallery_links" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_gallery_links_blog_post_idx" ON "pages_blocks_gallery_links" USING btree ("blog_post_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_gallery_links_team_member_idx" ON "pages_blocks_gallery_links" USING btree ("team_member_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_gallery_links_popup_form_idx" ON "pages_blocks_gallery_links" USING btree ("popup_form_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_gallery_links_order_idx" ON "_pages_v_blocks_gallery_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_gallery_links_parent_id_idx" ON "_pages_v_blocks_gallery_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_gallery_links_page_idx" ON "_pages_v_blocks_gallery_links" USING btree ("page_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_gallery_links_event_idx" ON "_pages_v_blocks_gallery_links" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_gallery_links_blog_post_idx" ON "_pages_v_blocks_gallery_links" USING btree ("blog_post_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_gallery_links_team_member_idx" ON "_pages_v_blocks_gallery_links" USING btree ("team_member_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_gallery_links_popup_form_idx" ON "_pages_v_blocks_gallery_links" USING btree ("popup_form_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Drop all new link tables
  await db.execute(sql`
  DROP TABLE IF EXISTS "pages_blocks_content_links" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_content_links" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_faq_links" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_faq_links" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_about_section_links" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_about_section_links" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_events_list_links" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_events_list_links" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_team_links" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_team_links" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_testimonials_links" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_testimonials_links" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_bullet_list_links" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_bullet_list_links" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_gallery_links" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_gallery_links" CASCADE;
  `)

  // Drop heading_color columns
  await db.execute(sql`
  ALTER TABLE "pages_blocks_content" DROP COLUMN IF EXISTS "heading_color";
  ALTER TABLE "_pages_v_blocks_content" DROP COLUMN IF EXISTS "heading_color";
  ALTER TABLE "pages_blocks_faq" DROP COLUMN IF EXISTS "heading_color";
  ALTER TABLE "_pages_v_blocks_faq" DROP COLUMN IF EXISTS "heading_color";
  ALTER TABLE "pages_blocks_gallery" DROP COLUMN IF EXISTS "heading_color";
  ALTER TABLE "_pages_v_blocks_gallery" DROP COLUMN IF EXISTS "heading_color";
  ALTER TABLE "pages_blocks_about_section" DROP COLUMN IF EXISTS "heading_color";
  ALTER TABLE "_pages_v_blocks_about_section" DROP COLUMN IF EXISTS "heading_color";
  ALTER TABLE "pages_blocks_events_list" DROP COLUMN IF EXISTS "heading_color";
  ALTER TABLE "_pages_v_blocks_events_list" DROP COLUMN IF EXISTS "heading_color";
  ALTER TABLE "pages_blocks_team" DROP COLUMN IF EXISTS "heading_color";
  ALTER TABLE "_pages_v_blocks_team" DROP COLUMN IF EXISTS "heading_color";
  ALTER TABLE "pages_blocks_testimonials" DROP COLUMN IF EXISTS "heading_color";
  ALTER TABLE "_pages_v_blocks_testimonials" DROP COLUMN IF EXISTS "heading_color";
  ALTER TABLE "pages_blocks_bullet_list" DROP COLUMN IF EXISTS "heading_color";
  ALTER TABLE "_pages_v_blocks_bullet_list" DROP COLUMN IF EXISTS "heading_color";
  `)

  // Drop display_mode from gallery
  await db.execute(sql`
  ALTER TABLE "pages_blocks_gallery" DROP COLUMN IF EXISTS "display_mode";
  ALTER TABLE "_pages_v_blocks_gallery" DROP COLUMN IF EXISTS "display_mode";
  `)

  // Drop new site_settings columns
  await db.execute(sql`
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fab_toggle_icon";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fab_toggle_color";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "seo_indexing";
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "canonical_url";
  `)
}
