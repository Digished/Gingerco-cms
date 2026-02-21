import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Create alignment enum type
  await db.execute(sql`DROP TYPE IF EXISTS "enum_link_alignment" CASCADE`)
  await db.execute(sql`CREATE TYPE "enum_link_alignment" AS ENUM('left', 'center', 'right')`)

  // Add alignment column to all link tables
  // Hero links
  await db.execute(sql`ALTER TABLE "pages_blocks_hero_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_hero_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)

  // Content links
  await db.execute(sql`ALTER TABLE "pages_blocks_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)

  // About section links
  await db.execute(sql`ALTER TABLE "pages_blocks_about_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_about_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)

  // Split content links
  await db.execute(sql`ALTER TABLE "pages_blocks_split_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_split_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)

  // Showcase section links
  await db.execute(sql`ALTER TABLE "pages_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)

  // CTA links
  await db.execute(sql`ALTER TABLE "pages_blocks_cta_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)

  // FAQ links
  await db.execute(sql`ALTER TABLE "pages_blocks_faq_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_faq_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)

  // Gallery links
  await db.execute(sql`ALTER TABLE "pages_blocks_gallery_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_gallery_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)

  // Events list links
  await db.execute(sql`ALTER TABLE "pages_blocks_events_list_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_events_list_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Drop alignment columns
  await db.execute(sql`ALTER TABLE "pages_blocks_hero_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_hero_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_content_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_content_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_about_section_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_about_section_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_split_content_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_split_content_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_showcase_section_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_showcase_section_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_cta_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_cta_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_faq_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_faq_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_gallery_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_gallery_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_events_list_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_events_list_links" DROP COLUMN IF EXISTS "alignment"`)

  // Drop alignment enum type
  await db.execute(sql`DROP TYPE IF EXISTS "enum_link_alignment" CASCADE`)
}
