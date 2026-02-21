import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add alignment column to existing link tables that were created before alignment was added
  // (Tables created in 20260221_110000 already have alignment included)

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
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Drop alignment columns from existing tables
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
}
