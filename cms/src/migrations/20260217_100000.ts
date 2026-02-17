import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Remove ctaRedirectUrl from events — redirect is now handled by the form builder's own config
  await db.execute(sql`
  ALTER TABLE "events" DROP COLUMN IF EXISTS "cta_redirect_url";
  ALTER TABLE "_events_v" DROP COLUMN IF EXISTS "version_cta_redirect_url";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "cta_redirect_url" varchar;
  ALTER TABLE "_events_v" ADD COLUMN IF NOT EXISTS "version_cta_redirect_url" varchar;
  `)
}
