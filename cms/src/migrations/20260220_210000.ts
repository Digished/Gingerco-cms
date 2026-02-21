import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add alignment and style columns to ALL pre-existing link tables.
  // Tables for blocks that newly received a links field (eventsList, faq, team,
  // testimonials, partnerSection, gallery) are created fresh by Payload from the
  // updated schema and therefore already include these columns — no ALTER needed.

  // Content block links (already existed)
  await db.execute(sql`
  ALTER TABLE "pages_blocks_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "pages_blocks_content_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary';
  ALTER TABLE "_pages_v_blocks_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_content_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary';
  `)

  // About section links (already existed)
  await db.execute(sql`
  ALTER TABLE "pages_blocks_about_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "pages_blocks_about_section_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary';
  ALTER TABLE "_pages_v_blocks_about_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_about_section_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary';
  `)

  // Split content links (already existed)
  await db.execute(sql`
  ALTER TABLE "pages_blocks_split_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "pages_blocks_split_content_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary';
  ALTER TABLE "_pages_v_blocks_split_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_split_content_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary';
  `)

  // Hero links (already existed)
  await db.execute(sql`
  ALTER TABLE "pages_blocks_hero_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "pages_blocks_hero_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary';
  ALTER TABLE "_pages_v_blocks_hero_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_hero_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary';
  `)

  // Showcase section links (already existed)
  await db.execute(sql`
  ALTER TABLE "pages_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "pages_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary';
  ALTER TABLE "_pages_v_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary';
  `)

  // Call to action links (already existed)
  await db.execute(sql`
  ALTER TABLE "pages_blocks_cta_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "pages_blocks_cta_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary';
  ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages_blocks_content_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "pages_blocks_content_links" DROP COLUMN IF EXISTS "style";
  ALTER TABLE "_pages_v_blocks_content_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "_pages_v_blocks_content_links" DROP COLUMN IF EXISTS "style";
  ALTER TABLE "pages_blocks_about_section_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "pages_blocks_about_section_links" DROP COLUMN IF EXISTS "style";
  ALTER TABLE "_pages_v_blocks_about_section_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "_pages_v_blocks_about_section_links" DROP COLUMN IF EXISTS "style";
  ALTER TABLE "pages_blocks_split_content_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "pages_blocks_split_content_links" DROP COLUMN IF EXISTS "style";
  ALTER TABLE "_pages_v_blocks_split_content_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "_pages_v_blocks_split_content_links" DROP COLUMN IF EXISTS "style";
  ALTER TABLE "pages_blocks_hero_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "pages_blocks_hero_links" DROP COLUMN IF EXISTS "style";
  ALTER TABLE "_pages_v_blocks_hero_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "_pages_v_blocks_hero_links" DROP COLUMN IF EXISTS "style";
  ALTER TABLE "pages_blocks_showcase_section_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "pages_blocks_showcase_section_links" DROP COLUMN IF EXISTS "style";
  ALTER TABLE "_pages_v_blocks_showcase_section_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "_pages_v_blocks_showcase_section_links" DROP COLUMN IF EXISTS "style";
  ALTER TABLE "pages_blocks_cta_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "pages_blocks_cta_links" DROP COLUMN IF EXISTS "style";
  ALTER TABLE "_pages_v_blocks_cta_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "_pages_v_blocks_cta_links" DROP COLUMN IF EXISTS "style";
  `)
}
