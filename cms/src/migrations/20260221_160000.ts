import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Fix boolean column type issues in versioned tables (_pages_v, _events_v)
 *
 * The 'latest' and 'autosave' columns were created as VARCHAR but should be BOOLEAN.
 * This causes type mismatch errors when Payload tries to query with boolean parameters.
 *
 * Solution: Convert VARCHAR → BOOLEAN with proper data coercion
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Fix _pages_v table
  // Step 1: Ensure columns are varchar first (idempotent - won't error if already varchar)
  try {
    await db.execute(sql`
      ALTER TABLE "_pages_v"
      ALTER COLUMN "latest" TYPE varchar,
      ALTER COLUMN "autosave" TYPE varchar;
    `)
  } catch (e) {
    // Columns might already be in a different state, continue anyway
  }

  // Step 2: Convert to boolean with proper data handling
  await db.execute(sql`
    ALTER TABLE "_pages_v"
    ALTER COLUMN "latest" TYPE boolean USING (
      CASE
        WHEN "latest" IN ('true', '1', 't', 'yes', 'y', 'on') THEN true
        WHEN "latest" IS NULL THEN false
        ELSE false
      END
    ),
    ALTER COLUMN "autosave" TYPE boolean USING (
      CASE
        WHEN "autosave" IN ('true', '1', 't', 'yes', 'y', 'on') THEN true
        WHEN "autosave" IS NULL THEN false
        ELSE false
      END
    );
  `)

  // Fix _events_v table
  try {
    await db.execute(sql`
      ALTER TABLE "_events_v"
      ALTER COLUMN "latest" TYPE varchar,
      ALTER COLUMN "autosave" TYPE varchar;
    `)
  } catch (e) {
    // Columns might already be in a different state, continue anyway
  }

  await db.execute(sql`
    ALTER TABLE "_events_v"
    ALTER COLUMN "latest" TYPE boolean USING (
      CASE
        WHEN "latest" IN ('true', '1', 't', 'yes', 'y', 'on') THEN true
        WHEN "latest" IS NULL THEN false
        ELSE false
      END
    ),
    ALTER COLUMN "autosave" TYPE boolean USING (
      CASE
        WHEN "autosave" IN ('true', '1', 't', 'yes', 'y', 'on') THEN true
        WHEN "autosave" IS NULL THEN false
        ELSE false
      END
    );
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Rollback: convert back to varchar
  try {
    await db.execute(sql`
      ALTER TABLE "_pages_v"
      ALTER COLUMN "latest" TYPE varchar USING CASE
        WHEN "latest" = true THEN 'true'
        ELSE 'false'
      END,
      ALTER COLUMN "autosave" TYPE varchar USING CASE
        WHEN "autosave" = true THEN 'true'
        ELSE 'false'
      END;
    `)
  } catch (e) {
    // Columns might be in an unexpected state
  }

  try {
    await db.execute(sql`
      ALTER TABLE "_events_v"
      ALTER COLUMN "latest" TYPE varchar USING CASE
        WHEN "latest" = true THEN 'true'
        ELSE 'false'
      END,
      ALTER COLUMN "autosave" TYPE varchar USING CASE
        WHEN "autosave" = true THEN 'true'
        ELSE 'false'
      END;
    `)
  } catch (e) {
    // Columns might be in an unexpected state
  }
}
