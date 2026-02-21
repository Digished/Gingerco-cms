import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Fix the 'latest' and 'autosave' column types in _pages_v table
  await db.execute(sql`
    ALTER TABLE "_pages_v"
    ALTER COLUMN "latest" TYPE boolean USING "latest"::boolean,
    ALTER COLUMN "autosave" TYPE boolean USING "autosave"::boolean;
  `);

  // Fix the 'latest' and 'autosave' column types in _events_v table
  await db.execute(sql`
    ALTER TABLE "_events_v"
    ALTER COLUMN "latest" TYPE boolean USING "latest"::boolean,
    ALTER COLUMN "autosave" TYPE boolean USING "autosave"::boolean;
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
