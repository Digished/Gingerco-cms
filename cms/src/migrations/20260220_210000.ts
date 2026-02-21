import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add alignment and style columns to ALL link tables (pre-existing and newly created).

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

  // Events list links (newly added)
  await db.execute(sql`
  ALTER TABLE "pages_blocks_events_list_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "pages_blocks_events_list_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary';
  ALTER TABLE "_pages_v_blocks_events_list_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_events_list_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary';
  `)

  // FAQ links (newly added)
  await db.execute(sql`
  ALTER TABLE "pages_blocks_faq_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "pages_blocks_faq_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary';
  ALTER TABLE "_pages_v_blocks_faq_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_faq_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary';
  `)

  // Gallery links (newly added)
  await db.execute(sql`
  ALTER TABLE "pages_blocks_gallery_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "pages_blocks_gallery_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary';
  ALTER TABLE "_pages_v_blocks_gallery_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_gallery_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary';
  `)

  // Partner section links (newly added)
  await db.execute(sql`
  ALTER TABLE "pages_blocks_partner_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "pages_blocks_partner_section_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary';
  ALTER TABLE "_pages_v_blocks_partner_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_partner_section_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary';
  `)

  // Team block links (newly added)
  await db.execute(sql`
  ALTER TABLE "pages_blocks_team_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "pages_blocks_team_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary';
  ALTER TABLE "_pages_v_blocks_team_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_team_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary';
  `)

  // Testimonials links (newly added)
  await db.execute(sql`
  ALTER TABLE "pages_blocks_testimonials_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "pages_blocks_testimonials_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary';
  ALTER TABLE "_pages_v_blocks_testimonials_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_testimonials_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary';
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
  ALTER TABLE "pages_blocks_events_list_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "pages_blocks_events_list_links" DROP COLUMN IF EXISTS "style";
  ALTER TABLE "_pages_v_blocks_events_list_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "_pages_v_blocks_events_list_links" DROP COLUMN IF EXISTS "style";
  ALTER TABLE "pages_blocks_faq_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "pages_blocks_faq_links" DROP COLUMN IF EXISTS "style";
  ALTER TABLE "_pages_v_blocks_faq_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "_pages_v_blocks_faq_links" DROP COLUMN IF EXISTS "style";
  ALTER TABLE "pages_blocks_gallery_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "pages_blocks_gallery_links" DROP COLUMN IF EXISTS "style";
  ALTER TABLE "_pages_v_blocks_gallery_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "_pages_v_blocks_gallery_links" DROP COLUMN IF EXISTS "style";
  ALTER TABLE "pages_blocks_partner_section_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "pages_blocks_partner_section_links" DROP COLUMN IF EXISTS "style";
  ALTER TABLE "_pages_v_blocks_partner_section_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "_pages_v_blocks_partner_section_links" DROP COLUMN IF EXISTS "style";
  ALTER TABLE "pages_blocks_team_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "pages_blocks_team_links" DROP COLUMN IF EXISTS "style";
  ALTER TABLE "_pages_v_blocks_team_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "_pages_v_blocks_team_links" DROP COLUMN IF EXISTS "style";
  ALTER TABLE "pages_blocks_testimonials_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "pages_blocks_testimonials_links" DROP COLUMN IF EXISTS "style";
  ALTER TABLE "_pages_v_blocks_testimonials_links" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "_pages_v_blocks_testimonials_links" DROP COLUMN IF EXISTS "style";
  `)
}
