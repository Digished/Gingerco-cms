import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add hashtag_align to footer table (safe if column already exists from 20260215_090000)
  await db.execute(sql`
  ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "hashtag_align" varchar DEFAULT 'left';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "hashtag_align";
  `)
}
