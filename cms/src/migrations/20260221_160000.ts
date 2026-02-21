import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Fix the 'latest' and 'autosave' column types in _pages_v table
  // First, ensure columns are varchar (in case they're in mixed state)
  await db.execute(sql`
    ALTER TABLE "_pages_v"
    ALTER COLUMN "latest" TYPE varchar,
    ALTER COLUMN "autosave" TYPE varchar;
  `);

  // Now convert to boolean with proper data handling
  await db.execute(sql`
    ALTER TABLE "_pages_v"
    ALTER COLUMN "latest" TYPE boolean USING CASE
      WHEN "latest" = 'true' OR "latest" = '1' OR "latest" = 't' THEN true
      ELSE false
    END,
    ALTER COLUMN "autosave" TYPE boolean USING CASE
      WHEN "autosave" = 'true' OR "autosave" = '1' OR "autosave" = 't' THEN true
      ELSE false
    END;
  `);

  // Fix the 'latest' and 'autosave' column types in _events_v table
  await db.execute(sql`
    ALTER TABLE "_events_v"
    ALTER COLUMN "latest" TYPE varchar,
    ALTER COLUMN "autosave" TYPE varchar;
  `);

  await db.execute(sql`
    ALTER TABLE "_events_v"
    ALTER COLUMN "latest" TYPE boolean USING CASE
      WHEN "latest" = 'true' OR "latest" = '1' OR "latest" = 't' THEN true
      ELSE false
    END,
    ALTER COLUMN "autosave" TYPE boolean USING CASE
      WHEN "autosave" = 'true' OR "autosave" = '1' OR "autosave" = 't' THEN true
      ELSE false
    END;
  `);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Rollback: convert back to varchar if needed
  await db.execute(sql`
    ALTER TABLE "_pages_v"
    ALTER COLUMN "latest" TYPE varchar USING "latest"::varchar,
    ALTER COLUMN "autosave" TYPE varchar USING "autosave"::varchar;
  `);

  await db.execute(sql`
    ALTER TABLE "_events_v"
    ALTER COLUMN "latest" TYPE varchar USING "latest"::varchar,
    ALTER COLUMN "autosave" TYPE varchar USING "autosave"::varchar;
  `);
}
