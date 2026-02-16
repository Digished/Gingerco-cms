import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add profile_theme column to team_members
  await db.execute(sql`
  ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "profile_theme" varchar DEFAULT 'standard';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "team_members" DROP COLUMN IF EXISTS "profile_theme";
  `)
}
