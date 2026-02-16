import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add "prefix" column required by @payloadcms/storage-s3 plugin.
  // This is a separate migration because 20260216_120000 may have already
  // run on a previous deployment without this column.
  await db.execute(sql`
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "prefix" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "media" DROP COLUMN IF EXISTS "prefix";
  `)
}
