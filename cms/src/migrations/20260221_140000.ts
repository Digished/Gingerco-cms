import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Fix-all migration to add alignment + style columns to all link tables.
 * Safe to run regardless of database state (uses ADD COLUMN IF NOT EXISTS).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Payload CMS converts camelCase/kebab-case block slugs to snake_case for table names
  // E.g., eventsList → pages_blocks_events_list, partnerSection → pages_blocks_partner_section

  // Hero
  await db.execute(sql`ALTER TABLE "pages_blocks_hero_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "pages_blocks_hero_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_hero_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_hero_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)

  // Content
  await db.execute(sql`ALTER TABLE "pages_blocks_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "pages_blocks_content_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_content_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)

  // About section
  await db.execute(sql`ALTER TABLE "pages_blocks_about_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "pages_blocks_about_section_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_about_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_about_section_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)

  // Showcase section
  await db.execute(sql`ALTER TABLE "pages_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "pages_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)

  // CTA
  await db.execute(sql`ALTER TABLE "pages_blocks_cta_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "pages_blocks_cta_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)

  // Split content (splitContent → split_content)
  await db.execute(sql`ALTER TABLE "pages_blocks_split_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "pages_blocks_split_content_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_split_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_split_content_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)

  // Events list (eventsList → events_list)
  await db.execute(sql`ALTER TABLE "pages_blocks_events_list_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "pages_blocks_events_list_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_events_list_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_events_list_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)

  // FAQ
  await db.execute(sql`ALTER TABLE "pages_blocks_faq_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "pages_blocks_faq_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_faq_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_faq_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)

  // Gallery
  await db.execute(sql`ALTER TABLE "pages_blocks_gallery_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "pages_blocks_gallery_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_gallery_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_gallery_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)

  // Partner section (partnerSection → partner_section)
  await db.execute(sql`ALTER TABLE "pages_blocks_partner_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "pages_blocks_partner_section_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_partner_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_partner_section_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)

  // Team
  await db.execute(sql`ALTER TABLE "pages_blocks_team_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "pages_blocks_team_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_team_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_team_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)

  // Testimonials
  await db.execute(sql`ALTER TABLE "pages_blocks_testimonials_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "pages_blocks_testimonials_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_testimonials_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_testimonials_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Rollback would remove the columns, but since they may be needed, we'll just keep them
  // This migration is idempotent - it only adds columns that don't exist
}
