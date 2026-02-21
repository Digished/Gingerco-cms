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
  // Helper function to fix a table's boolean columns
  const fixTable = async (tableName: string) => {
    try {
      await db.execute(sql`
        ALTER TABLE "${tableName}"
        ALTER COLUMN "latest" TYPE varchar,
        ALTER COLUMN "autosave" TYPE varchar;
      `)
    } catch (e) {
      // Columns might already be in a different state, continue anyway
    }

    await db.execute(sql`
      ALTER TABLE "${tableName}"
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

  // Apply fix to all versioned collections with autosave enabled
  await fixTable('_pages_v')
  await fixTable('_events_v')
  await fixTable('_blog_posts_v')
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Rollback: convert back to varchar
  const revertTable = async (tableName: string) => {
    try {
      await db.execute(sql`
        ALTER TABLE "${tableName}"
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

  await revertTable('_pages_v')
  await revertTable('_events_v')
  await revertTable('_blog_posts_v')
}
