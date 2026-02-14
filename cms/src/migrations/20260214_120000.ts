import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add contact_phone column to footer table
  await db.execute(sql`
  ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "contact_phone" varchar DEFAULT '+43 676 7261062';`)

  // Add profile_content (richText stored as jsonb) to team_members table
  await db.execute(sql`
  ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "profile_content" jsonb;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "contact_phone";
  ALTER TABLE "team_members" DROP COLUMN IF EXISTS "profile_content";`)
}
