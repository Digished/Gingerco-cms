import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Fix version link tables: version tables use serial (integer) IDs, not varchar
  // The _parent_id must be integer to match parent version block table's serial id

  // Drop and recreate _pages_v_blocks_content_links with correct types
  await db.execute(sql`
  DROP TABLE IF EXISTS "_pages_v_blocks_content_links" CASCADE;
  CREATE TABLE "_pages_v_blocks_content_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "_uuid" varchar,
    "label" varchar NOT NULL,
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

  // Drop and recreate _pages_v_blocks_about_section_links with correct types
  await db.execute(sql`
  DROP TABLE IF EXISTS "_pages_v_blocks_about_section_links" CASCADE;
  CREATE TABLE "_pages_v_blocks_about_section_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "_uuid" varchar,
    "label" varchar NOT NULL,
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

  // Drop and recreate _pages_v_blocks_split_content_links with correct types
  await db.execute(sql`
  DROP TABLE IF EXISTS "_pages_v_blocks_split_content_links" CASCADE;
  CREATE TABLE "_pages_v_blocks_split_content_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "_uuid" varchar,
    "label" varchar NOT NULL,
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
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "_pages_v_blocks_content_links" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_about_section_links" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_split_content_links" CASCADE;
  `)
}
