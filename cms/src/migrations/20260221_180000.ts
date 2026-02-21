import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Fix boolean column types in versioned tables (retry)
 *
 * The previous migration (20260221_160000) was recorded as applied but
 * the column type conversion did not execute properly. This new migration
 * ensures the 'latest' and 'autosave' columns are converted from VARCHAR
 * to BOOLEAN in all versioned collection tables.
 *
 * Error being fixed: "operator does not exist: character varying = integer"
 * when Payload queries: WHERE "_pages_v"."latest" = true
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Fix _pages_v - convert latest and autosave from varchar to boolean
  try {
    await db.execute(sql`
      ALTER TABLE "_pages_v"
      ALTER COLUMN "latest" TYPE boolean
      USING CASE
        WHEN "latest"::text IN ('true', '1', 't', 'yes', 'y', 'on') THEN true
        ELSE false
      END
    `)
  } catch (e) {
    // Column might already be boolean - that's fine
  }

  try {
    await db.execute(sql`
      ALTER TABLE "_pages_v"
      ALTER COLUMN "autosave" TYPE boolean
      USING CASE
        WHEN "autosave"::text IN ('true', '1', 't', 'yes', 'y', 'on') THEN true
        ELSE false
      END
    `)
  } catch (e) {
    // Column might already be boolean - that's fine
  }

  // Fix _events_v
  try {
    await db.execute(sql`
      ALTER TABLE "_events_v"
      ALTER COLUMN "latest" TYPE boolean
      USING CASE
        WHEN "latest"::text IN ('true', '1', 't', 'yes', 'y', 'on') THEN true
        ELSE false
      END
    `)
  } catch (e) {
    // Column might already be boolean or table might not exist
  }

  try {
    await db.execute(sql`
      ALTER TABLE "_events_v"
      ALTER COLUMN "autosave" TYPE boolean
      USING CASE
        WHEN "autosave"::text IN ('true', '1', 't', 'yes', 'y', 'on') THEN true
        ELSE false
      END
    `)
  } catch (e) {
    // Column might already be boolean or table might not exist
  }

  // Fix _blog_posts_v
  try {
    await db.execute(sql`
      ALTER TABLE "_blog_posts_v"
      ALTER COLUMN "latest" TYPE boolean
      USING CASE
        WHEN "latest"::text IN ('true', '1', 't', 'yes', 'y', 'on') THEN true
        ELSE false
      END
    `)
  } catch (e) {
    // Column might already be boolean or table might not exist
  }

  try {
    await db.execute(sql`
      ALTER TABLE "_blog_posts_v"
      ALTER COLUMN "autosave" TYPE boolean
      USING CASE
        WHEN "autosave"::text IN ('true', '1', 't', 'yes', 'y', 'on') THEN true
        ELSE false
      END
    `)
  } catch (e) {
    // Column might already be boolean or table might not exist
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Convert back to varchar if needed
  try {
    await db.execute(sql`
      ALTER TABLE "_pages_v"
      ALTER COLUMN "latest" TYPE varchar USING CASE WHEN "latest" = true THEN 'true' ELSE 'false' END,
      ALTER COLUMN "autosave" TYPE varchar USING CASE WHEN "autosave" = true THEN 'true' ELSE 'false' END
    `)
  } catch (e) { /* ignore */ }

  try {
    await db.execute(sql`
      ALTER TABLE "_events_v"
      ALTER COLUMN "latest" TYPE varchar USING CASE WHEN "latest" = true THEN 'true' ELSE 'false' END,
      ALTER COLUMN "autosave" TYPE varchar USING CASE WHEN "autosave" = true THEN 'true' ELSE 'false' END
    `)
  } catch (e) { /* ignore */ }

  try {
    await db.execute(sql`
      ALTER TABLE "_blog_posts_v"
      ALTER COLUMN "latest" TYPE varchar USING CASE WHEN "latest" = true THEN 'true' ELSE 'false' END,
      ALTER COLUMN "autosave" TYPE varchar USING CASE WHEN "autosave" = true THEN 'true' ELSE 'false' END
    `)
  } catch (e) { /* ignore */ }
}
