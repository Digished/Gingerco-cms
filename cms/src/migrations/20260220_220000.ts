import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add slides_per_view to gallery blocks
  await db.execute(sql`
  ALTER TABLE "pages_blocks_gallery" ADD COLUMN IF NOT EXISTS "slides_per_view" varchar DEFAULT '1';
  ALTER TABLE "_pages_v_blocks_gallery" ADD COLUMN IF NOT EXISTS "slides_per_view" varchar DEFAULT '1';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages_blocks_gallery" DROP COLUMN IF EXISTS "slides_per_view";
  ALTER TABLE "_pages_v_blocks_gallery" DROP COLUMN IF EXISTS "slides_per_view";
  `)
}
