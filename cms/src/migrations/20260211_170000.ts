import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Fix: forms_consent_sections and forms_consent_sections_declarations
  // were created with serial (auto-increment) id, but Payload 3 expects
  // varchar (hex string) id for non-version array/block tables.

  await db.execute(sql`
    DROP TABLE IF EXISTS "forms_consent_sections_declarations";
    DROP TABLE IF EXISTS "forms_consent_sections";
  `)

  await db.execute(sql`
    CREATE TABLE "forms_consent_sections" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "section_title" varchar NOT NULL,
      "collapsible_label" varchar DEFAULT 'View Full Consent Details',
      "collapsible_content" jsonb
    );

    DO $$ BEGIN
      ALTER TABLE "forms_consent_sections" ADD CONSTRAINT "forms_consent_sections_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "forms"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "forms_consent_sections_order_idx" ON "forms_consent_sections" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "forms_consent_sections_parent_id_idx" ON "forms_consent_sections" USING btree ("_parent_id");
  `)

  await db.execute(sql`
    CREATE TABLE "forms_consent_sections_declarations" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "description" varchar,
      "required" boolean DEFAULT true
    );

    DO $$ BEGIN
      ALTER TABLE "forms_consent_sections_declarations" ADD CONSTRAINT "forms_consent_sections_declarations_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "forms_consent_sections"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "forms_consent_sections_declarations_order_idx" ON "forms_consent_sections_declarations" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "forms_consent_sections_declarations_parent_id_idx" ON "forms_consent_sections_declarations" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "forms_consent_sections_declarations";
    DROP TABLE IF EXISTS "forms_consent_sections";
  `)

  await db.execute(sql`
    CREATE TABLE "forms_consent_sections" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "section_title" varchar NOT NULL,
      "collapsible_label" varchar DEFAULT 'View Full Consent Details',
      "collapsible_content" jsonb
    );

    DO $$ BEGIN
      ALTER TABLE "forms_consent_sections" ADD CONSTRAINT "forms_consent_sections_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "forms"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "forms_consent_sections_order_idx" ON "forms_consent_sections" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "forms_consent_sections_parent_id_idx" ON "forms_consent_sections" USING btree ("_parent_id");
  `)

  await db.execute(sql`
    CREATE TABLE "forms_consent_sections_declarations" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "description" varchar,
      "required" boolean DEFAULT true
    );

    DO $$ BEGIN
      ALTER TABLE "forms_consent_sections_declarations" ADD CONSTRAINT "forms_consent_sections_declarations_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "forms_consent_sections"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "forms_consent_sections_declarations_order_idx" ON "forms_consent_sections_declarations" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "forms_consent_sections_declarations_parent_id_idx" ON "forms_consent_sections_declarations" USING btree ("_parent_id");
  `)
}
