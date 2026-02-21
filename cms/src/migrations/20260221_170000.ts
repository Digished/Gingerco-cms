import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Convert varchar columns to boolean type with proper handling
  // First for _pages_v
  await db.execute(sql`
    ALTER TABLE "_pages_v"
    ALTER COLUMN "latest" TYPE boolean USING (
      CASE
        WHEN "latest" IN ('true', '1', 't', 'yes', 'y') THEN true
        ELSE false
      END
    );
  `);

  await db.execute(sql`
    ALTER TABLE "_pages_v"
    ALTER COLUMN "autosave" TYPE boolean USING (
      CASE
        WHEN "autosave" IN ('true', '1', 't', 'yes', 'y') THEN true
        ELSE false
      END
    );
  `);

  // Then for _events_v
  await db.execute(sql`
    ALTER TABLE "_events_v"
    ALTER COLUMN "latest" TYPE boolean USING (
      CASE
        WHEN "latest" IN ('true', '1', 't', 'yes', 'y') THEN true
        ELSE false
      END
    );
  `);

  await db.execute(sql`
    ALTER TABLE "_events_v"
    ALTER COLUMN "autosave" TYPE boolean USING (
      CASE
        WHEN "autosave" IN ('true', '1', 't', 'yes', 'y') THEN true
        ELSE false
      END
    );
  `);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
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
