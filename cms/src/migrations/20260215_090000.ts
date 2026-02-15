import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add background_color column to all block tables that received the backgroundColor field
  // Main tables
  await db.execute(sql`
  ALTER TABLE "pages_blocks_content" ADD COLUMN IF NOT EXISTS "background_color" varchar DEFAULT 'white';
  ALTER TABLE "pages_blocks_faq" ADD COLUMN IF NOT EXISTS "background_color" varchar DEFAULT 'white';
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN IF NOT EXISTS "background_color" varchar DEFAULT 'white';
  ALTER TABLE "pages_blocks_gallery" ADD COLUMN IF NOT EXISTS "background_color" varchar DEFAULT 'white';
  ALTER TABLE "pages_blocks_cta" ADD COLUMN IF NOT EXISTS "background_color" varchar DEFAULT 'white';
  ALTER TABLE "pages_blocks_team" ADD COLUMN IF NOT EXISTS "background_color" varchar DEFAULT 'white';
  ALTER TABLE "pages_blocks_testimonials" ADD COLUMN IF NOT EXISTS "background_color" varchar DEFAULT 'white';
  ALTER TABLE "pages_blocks_countdown_timer" ADD COLUMN IF NOT EXISTS "background_color" varchar DEFAULT 'white';
  ALTER TABLE "pages_blocks_events_list" ADD COLUMN IF NOT EXISTS "background_color" varchar DEFAULT 'white';
  ALTER TABLE "pages_blocks_blog_list" ADD COLUMN IF NOT EXISTS "background_color" varchar DEFAULT 'white';
  `)

  // Version tables
  await db.execute(sql`
  ALTER TABLE "_pages_v_blocks_content" ADD COLUMN IF NOT EXISTS "background_color" varchar DEFAULT 'white';
  ALTER TABLE "_pages_v_blocks_faq" ADD COLUMN IF NOT EXISTS "background_color" varchar DEFAULT 'white';
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN IF NOT EXISTS "background_color" varchar DEFAULT 'white';
  ALTER TABLE "_pages_v_blocks_gallery" ADD COLUMN IF NOT EXISTS "background_color" varchar DEFAULT 'white';
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN IF NOT EXISTS "background_color" varchar DEFAULT 'white';
  ALTER TABLE "_pages_v_blocks_team" ADD COLUMN IF NOT EXISTS "background_color" varchar DEFAULT 'white';
  ALTER TABLE "_pages_v_blocks_testimonials" ADD COLUMN IF NOT EXISTS "background_color" varchar DEFAULT 'white';
  ALTER TABLE "_pages_v_blocks_countdown_timer" ADD COLUMN IF NOT EXISTS "background_color" varchar DEFAULT 'white';
  ALTER TABLE "_pages_v_blocks_events_list" ADD COLUMN IF NOT EXISTS "background_color" varchar DEFAULT 'white';
  ALTER TABLE "_pages_v_blocks_blog_list" ADD COLUMN IF NOT EXISTS "background_color" varchar DEFAULT 'white';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Drop background_color from main tables
  await db.execute(sql`
  ALTER TABLE "pages_blocks_content" DROP COLUMN IF EXISTS "background_color";
  ALTER TABLE "pages_blocks_faq" DROP COLUMN IF EXISTS "background_color";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN IF EXISTS "background_color";
  ALTER TABLE "pages_blocks_gallery" DROP COLUMN IF EXISTS "background_color";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN IF EXISTS "background_color";
  ALTER TABLE "pages_blocks_team" DROP COLUMN IF EXISTS "background_color";
  ALTER TABLE "pages_blocks_testimonials" DROP COLUMN IF EXISTS "background_color";
  ALTER TABLE "pages_blocks_countdown_timer" DROP COLUMN IF EXISTS "background_color";
  ALTER TABLE "pages_blocks_events_list" DROP COLUMN IF EXISTS "background_color";
  ALTER TABLE "pages_blocks_blog_list" DROP COLUMN IF EXISTS "background_color";
  `)

  // Drop background_color from version tables
  await db.execute(sql`
  ALTER TABLE "_pages_v_blocks_content" DROP COLUMN IF EXISTS "background_color";
  ALTER TABLE "_pages_v_blocks_faq" DROP COLUMN IF EXISTS "background_color";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN IF EXISTS "background_color";
  ALTER TABLE "_pages_v_blocks_gallery" DROP COLUMN IF EXISTS "background_color";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN IF EXISTS "background_color";
  ALTER TABLE "_pages_v_blocks_team" DROP COLUMN IF EXISTS "background_color";
  ALTER TABLE "_pages_v_blocks_testimonials" DROP COLUMN IF EXISTS "background_color";
  ALTER TABLE "_pages_v_blocks_countdown_timer" DROP COLUMN IF EXISTS "background_color";
  ALTER TABLE "_pages_v_blocks_events_list" DROP COLUMN IF EXISTS "background_color";
  ALTER TABLE "_pages_v_blocks_blog_list" DROP COLUMN IF EXISTS "background_color";
  `)
}
