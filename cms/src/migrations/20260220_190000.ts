import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add seo_title to site_settings
  await db.execute(sql`
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "seo_title" varchar;
  ALTER TABLE "_site_settings_v" ADD COLUMN IF NOT EXISTS "version_seo_title" varchar;
  `)

  // Add alignment to CTA block
  await db.execute(sql`
  ALTER TABLE "pages_blocks_cta" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'center';
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'center';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "seo_title";
  ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_seo_title";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN IF EXISTS "alignment";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN IF EXISTS "alignment";
  `)
}
