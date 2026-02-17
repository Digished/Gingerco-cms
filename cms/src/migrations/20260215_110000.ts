import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add accent_color and form_style to form_block tables
  await db.execute(sql`
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN IF NOT EXISTS "accent_color" varchar DEFAULT 'gold';
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN IF NOT EXISTS "form_style" varchar DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN IF NOT EXISTS "accent_color" varchar DEFAULT 'gold';
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN IF NOT EXISTS "form_style" varchar DEFAULT 'default';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN IF EXISTS "accent_color";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN IF EXISTS "form_style";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN IF EXISTS "accent_color";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN IF EXISTS "form_style";
  `)
}
