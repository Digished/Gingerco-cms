import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add alignment column to all link tables

  // Content block links
  await db.execute(sql`
  ALTER TABLE "pages_blocks_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  `)

  // About section links
  await db.execute(sql`
  ALTER TABLE "pages_blocks_about_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_about_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  `)

  // Split content links
  await db.execute(sql`
  ALTER TABLE "pages_blocks_split_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_split_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  `)

  // Gallery links
  await db.execute(sql`
  ALTER TABLE "pages_blocks_gallery_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_gallery_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  `)

  // EventsList links
  await db.execute(sql`
  ALTER TABLE "pages_blocks_eventsList_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_eventsList_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  `)

  // FAQ links
  await db.execute(sql`
  ALTER TABLE "pages_blocks_faq_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_faq_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  `)

  // TeamBlock links
  await db.execute(sql`
  ALTER TABLE "pages_blocks_team_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_team_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  `)

  // Testimonials links
  await db.execute(sql`
  ALTER TABLE "pages_blocks_testimonials_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_testimonials_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  `)

  // PartnerSection links
  await db.execute(sql`
  ALTER TABLE "pages_blocks_partnerSection_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_partnerSection_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  `)

  // Hero links (already existed, add alignment column if it doesn't have it)
  await db.execute(sql`
  ALTER TABLE "pages_blocks_hero_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_hero_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Remove alignment column from all link tables
  await db.execute(sql`
  ALTER TABLE "pages_blocks_content_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "_pages_v_blocks_content_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "pages_blocks_about_section_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "_pages_v_blocks_about_section_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "pages_blocks_split_content_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "_pages_v_blocks_split_content_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "pages_blocks_gallery_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "_pages_v_blocks_gallery_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "pages_blocks_eventsList_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "_pages_v_blocks_eventsList_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "pages_blocks_faq_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "_pages_v_blocks_faq_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "pages_blocks_team_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "_pages_v_blocks_team_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "pages_blocks_testimonials_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "_pages_v_blocks_testimonials_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "pages_blocks_partnerSection_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "_pages_v_blocks_partnerSection_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "pages_blocks_hero_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "_pages_v_blocks_hero_links" DROP COLUMN IF EXISTS "alignment";
  `)
}
