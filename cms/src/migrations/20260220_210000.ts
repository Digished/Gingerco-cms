import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add alignment and style columns to ALL link tables
  // Executed separately to ensure each completes before the next

  await db.execute(sql`ALTER TABLE "pages_blocks_hero_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "pages_blocks_hero_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_hero_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_hero_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)

  await db.execute(sql`ALTER TABLE "pages_blocks_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "pages_blocks_content_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_content_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)

  await db.execute(sql`ALTER TABLE "pages_blocks_about_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "pages_blocks_about_section_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_about_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_about_section_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)

  await db.execute(sql`ALTER TABLE "pages_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "pages_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)

  await db.execute(sql`ALTER TABLE "pages_blocks_cta_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "pages_blocks_cta_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)

  await db.execute(sql`ALTER TABLE "pages_blocks_split_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "pages_blocks_split_content_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_split_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_split_content_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)

  await db.execute(sql`ALTER TABLE "pages_blocks_events_list_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "pages_blocks_events_list_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_events_list_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_events_list_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)

  await db.execute(sql`ALTER TABLE "pages_blocks_faq_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "pages_blocks_faq_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_faq_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_faq_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)

  await db.execute(sql`ALTER TABLE "pages_blocks_gallery_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "pages_blocks_gallery_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_gallery_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_gallery_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)

  await db.execute(sql`ALTER TABLE "pages_blocks_partner_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "pages_blocks_partner_section_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_partner_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_partner_section_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)

  await db.execute(sql`ALTER TABLE "pages_blocks_team_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "pages_blocks_team_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_team_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_team_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)

  await db.execute(sql`ALTER TABLE "pages_blocks_testimonials_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "pages_blocks_testimonials_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_testimonials_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_testimonials_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "pages_blocks_hero_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_hero_links" DROP COLUMN IF EXISTS "style"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_hero_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_hero_links" DROP COLUMN IF EXISTS "style"`)

  await db.execute(sql`ALTER TABLE "pages_blocks_content_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_content_links" DROP COLUMN IF EXISTS "style"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_content_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_content_links" DROP COLUMN IF EXISTS "style"`)

  await db.execute(sql`ALTER TABLE "pages_blocks_about_section_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_about_section_links" DROP COLUMN IF EXISTS "style"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_about_section_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_about_section_links" DROP COLUMN IF EXISTS "style"`)

  await db.execute(sql`ALTER TABLE "pages_blocks_showcase_section_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_showcase_section_links" DROP COLUMN IF EXISTS "style"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_showcase_section_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_showcase_section_links" DROP COLUMN IF EXISTS "style"`)

  await db.execute(sql`ALTER TABLE "pages_blocks_cta_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_cta_links" DROP COLUMN IF EXISTS "style"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_cta_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_cta_links" DROP COLUMN IF EXISTS "style"`)

  await db.execute(sql`ALTER TABLE "pages_blocks_split_content_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_split_content_links" DROP COLUMN IF EXISTS "style"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_split_content_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_split_content_links" DROP COLUMN IF EXISTS "style"`)

  await db.execute(sql`ALTER TABLE "pages_blocks_events_list_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_events_list_links" DROP COLUMN IF EXISTS "style"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_events_list_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_events_list_links" DROP COLUMN IF EXISTS "style"`)

  await db.execute(sql`ALTER TABLE "pages_blocks_faq_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_faq_links" DROP COLUMN IF EXISTS "style"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_faq_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_faq_links" DROP COLUMN IF EXISTS "style"`)

  await db.execute(sql`ALTER TABLE "pages_blocks_gallery_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_gallery_links" DROP COLUMN IF EXISTS "style"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_gallery_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_gallery_links" DROP COLUMN IF EXISTS "style"`)

  await db.execute(sql`ALTER TABLE "pages_blocks_partner_section_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_partner_section_links" DROP COLUMN IF EXISTS "style"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_partner_section_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_partner_section_links" DROP COLUMN IF EXISTS "style"`)

  await db.execute(sql`ALTER TABLE "pages_blocks_team_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_team_links" DROP COLUMN IF EXISTS "style"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_team_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_team_links" DROP COLUMN IF EXISTS "style"`)

  await db.execute(sql`ALTER TABLE "pages_blocks_testimonials_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_testimonials_links" DROP COLUMN IF EXISTS "style"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_testimonials_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_testimonials_links" DROP COLUMN IF EXISTS "style"`)
}
