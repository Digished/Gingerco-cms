import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add square image size columns to media table
  await db.execute(sql`
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_square_url" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_square_width" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_square_height" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_square_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_square_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_square_filename" varchar;
  `)

  await db.execute(sql`
  CREATE INDEX IF NOT EXISTS "media_sizes_square_sizes_square_filename_idx" ON "media" USING btree ("sizes_square_filename");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_square_url";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_square_width";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_square_height";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_square_mime_type";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_square_filesize";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_square_filename";
  `)
}
