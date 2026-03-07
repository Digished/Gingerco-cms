import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Add double opt-in and campaign scheduling support.
 *
 * Changes:
 *   subscribers        — add confirmation_token column
 *   email_campaigns    — add scheduled_for column
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add confirmation_token to subscribers
  await db.execute(sql`
    ALTER TABLE "subscribers"
      ADD COLUMN IF NOT EXISTS "confirmation_token" varchar;

    CREATE INDEX IF NOT EXISTS "subscribers_confirmation_token_idx"
      ON "subscribers" USING btree ("confirmation_token");
  `)

  // Add scheduled_for to email_campaigns
  await db.execute(sql`
    ALTER TABLE "email_campaigns"
      ADD COLUMN IF NOT EXISTS "scheduled_for" timestamp(3) with time zone;

    CREATE INDEX IF NOT EXISTS "email_campaigns_scheduled_for_idx"
      ON "email_campaigns" USING btree ("scheduled_for");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "subscribers_confirmation_token_idx";
    ALTER TABLE "subscribers" DROP COLUMN IF EXISTS "confirmation_token";

    DROP INDEX IF EXISTS "email_campaigns_scheduled_for_idx";
    ALTER TABLE "email_campaigns" DROP COLUMN IF EXISTS "scheduled_for";
  `)
}
