import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Fix boolean column type issues in versioned tables
 *
 * Affected tables: _pages_v, _events_v, _blog_posts_v
 *
 * The 'latest' and 'autosave' columns were created as VARCHAR but should be BOOLEAN.
 * This causes type mismatch errors when Payload tries to query with boolean parameters:
 * "operator does not exist: character varying = integer"
 *
 * Solution: Convert VARCHAR → BOOLEAN with proper data coercion
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Fix _pages_v table
  try {
    await db.execute(sql`
      ALTER TABLE "_pages_v"
      ALTER COLUMN "latest" TYPE varchar,
      ALTER COLUMN "autosave" TYPE varchar
    `)
  } catch (e) {
    // Columns might already be in different state
  }

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
    )
  `)

  // Fix _events_v table
  try {
    await db.execute(sql`
      ALTER TABLE "_events_v"
      ALTER COLUMN "latest" TYPE varchar,
      ALTER COLUMN "autosave" TYPE varchar
    `)
  } catch (e) {
    // Columns might already be in different state
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
    )
  `)

  // Fix _blog_posts_v table
  try {
    await db.execute(sql`
      ALTER TABLE "_blog_posts_v"
      ALTER COLUMN "latest" TYPE varchar,
      ALTER COLUMN "autosave" TYPE varchar
    `)
  } catch (e) {
    // Columns might already be in different state
  }

  await db.execute(sql`
    ALTER TABLE "_blog_posts_v"
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
    )
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Rollback _pages_v
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
      END
    `)
  } catch (e) {
    // Columns might be in unexpected state
  }

  // Rollback _events_v
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
      END
    `)
  } catch (e) {
    // Columns might be in unexpected state
  }

  // Rollback _blog_posts_v
  try {
    await db.execute(sql`
      ALTER TABLE "_blog_posts_v"
      ALTER COLUMN "latest" TYPE varchar USING CASE
        WHEN "latest" = true THEN 'true'
        ELSE 'false'
      END,
      ALTER COLUMN "autosave" TYPE varchar USING CASE
        WHEN "autosave" = true THEN 'true'
        ELSE 'false'
      END
    `)
  } catch (e) {
    // Columns might be in unexpected state
  }
}
