import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add alignment column to pre-existing link tables only.
  // Tables for blocks that newly received a links field (eventsList, faq, team,
  // testimonials, partnerSection, gallery) are created fresh by Payload from the
  // updated schema and therefore already include the alignment column — no ALTER needed.

  // Content block links (already existed)
  await db.execute(sql`
  ALTER TABLE "pages_blocks_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  `)

  // About section links (already existed)
  await db.execute(sql`
  ALTER TABLE "pages_blocks_about_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_about_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  `)

  // Split content links (already existed)
  await db.execute(sql`
  ALTER TABLE "pages_blocks_split_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_split_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  `)

  // Hero links (already existed)
  await db.execute(sql`
  ALTER TABLE "pages_blocks_hero_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_hero_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages_blocks_content_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "_pages_v_blocks_content_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "pages_blocks_about_section_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "_pages_v_blocks_about_section_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "pages_blocks_split_content_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "_pages_v_blocks_split_content_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "pages_blocks_hero_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "_pages_v_blocks_hero_links" DROP COLUMN IF EXISTS "alignment";
  `)
}
