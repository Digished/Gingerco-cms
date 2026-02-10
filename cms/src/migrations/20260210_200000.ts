import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── 1. Partners collection ──
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "partners" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "logo_id" integer,
      "url" varchar,
      "type" varchar DEFAULT 'partner',
      "description" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_id_media_id_fk"
        FOREIGN KEY ("logo_id") REFERENCES "media"("id") ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "partners_logo_idx" ON "partners" USING btree ("logo_id");
    CREATE INDEX IF NOT EXISTS "partners_created_at_idx" ON "partners" USING btree ("created_at");
  `)

  // ── 1b. Add partners_id to Payload internal rels tables ──
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "partners_id" integer;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_id_partners_id_fk"
        FOREIGN KEY ("partners_id") REFERENCES "partners"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_partners_idx" ON "payload_locked_documents_rels" USING btree ("partners_id");
  `)

  // ── 2. Hero subheadingSize field ──
  await db.execute(sql`
    ALTER TABLE "pages_blocks_hero" ADD COLUMN IF NOT EXISTS "subheading_size" varchar DEFAULT 'default';
    ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN IF NOT EXISTS "subheading_size" varchar DEFAULT 'default';
  `)

  // ── 3. Popup Modal block tables ──
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_blocks_popup_modal" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "trigger_label" varchar DEFAULT 'Open Form',
      "trigger_style" varchar DEFAULT 'primary',
      "alignment" varchar DEFAULT 'center',
      "modal_heading" varchar,
      "modal_subtitle" varchar,
      "form_id" integer,
      "block_name" varchar
    );

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_popup_modal" ADD CONSTRAINT "pages_blocks_popup_modal_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "pages"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_popup_modal" ADD CONSTRAINT "pages_blocks_popup_modal_form_id_forms_id_fk"
        FOREIGN KEY ("form_id") REFERENCES "forms"("id") ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "pages_blocks_popup_modal_order_idx" ON "pages_blocks_popup_modal" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_popup_modal_parent_id_idx" ON "pages_blocks_popup_modal" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_popup_modal_path_idx" ON "pages_blocks_popup_modal" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "pages_blocks_popup_modal_form_idx" ON "pages_blocks_popup_modal" USING btree ("form_id");
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_popup_modal" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "trigger_label" varchar DEFAULT 'Open Form',
      "trigger_style" varchar DEFAULT 'primary',
      "alignment" varchar DEFAULT 'center',
      "modal_heading" varchar,
      "modal_subtitle" varchar,
      "form_id" integer,
      "block_name" varchar,
      "_uuid" varchar
    );

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_popup_modal" ADD CONSTRAINT "_pages_v_blocks_popup_modal_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_pages_v"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_popup_modal" ADD CONSTRAINT "_pages_v_blocks_popup_modal_form_id_forms_id_fk"
        FOREIGN KEY ("form_id") REFERENCES "forms"("id") ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_popup_modal_order_idx" ON "_pages_v_blocks_popup_modal" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_popup_modal_parent_id_idx" ON "_pages_v_blocks_popup_modal" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_popup_modal_path_idx" ON "_pages_v_blocks_popup_modal" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_popup_modal_form_idx" ON "_pages_v_blocks_popup_modal" USING btree ("form_id");
  `)

  // ── 4. Partner Section block tables ──
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_blocks_partner_section" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "heading" varchar DEFAULT 'Event Partners',
      "description" varchar,
      "layout" varchar DEFAULT 'grid',
      "background_color" varchar DEFAULT 'white',
      "block_name" varchar
    );

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_partner_section" ADD CONSTRAINT "pages_blocks_partner_section_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "pages"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "pages_blocks_partner_section_order_idx" ON "pages_blocks_partner_section" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_partner_section_parent_id_idx" ON "pages_blocks_partner_section" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_partner_section_path_idx" ON "pages_blocks_partner_section" USING btree ("_path");
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_partner_section" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "heading" varchar DEFAULT 'Event Partners',
      "description" varchar,
      "layout" varchar DEFAULT 'grid',
      "background_color" varchar DEFAULT 'white',
      "block_name" varchar,
      "_uuid" varchar
    );

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_partner_section" ADD CONSTRAINT "_pages_v_blocks_partner_section_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_pages_v"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_partner_section_order_idx" ON "_pages_v_blocks_partner_section" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_partner_section_parent_id_idx" ON "_pages_v_blocks_partner_section" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_partner_section_path_idx" ON "_pages_v_blocks_partner_section" USING btree ("_path");
  `)

  // ── 5. Pages rels table (for PartnerSection hasMany partners) ──
  // Tables may already exist (auto-created by Payload), so only add missing column + constraints
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "partners_id" integer
    );

    ALTER TABLE "pages_rels" ADD COLUMN IF NOT EXISTS "partners_id" integer;

    DO $$ BEGIN
      ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "pages"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_partners_fk"
        FOREIGN KEY ("partners_id") REFERENCES "partners"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "pages_rels_partners_idx" ON "pages_rels" USING btree ("partners_id");
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_pages_v_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "partners_id" integer
    );

    ALTER TABLE "_pages_v_rels" ADD COLUMN IF NOT EXISTS "partners_id" integer;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "_pages_v"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_partners_fk"
        FOREIGN KEY ("partners_id") REFERENCES "partners"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "_pages_v_rels_partners_idx" ON "_pages_v_rels" USING btree ("partners_id");
  `)

  // ── 6. Events rels table (for sponsors hasMany relationship) ──
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "events_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "partners_id" integer
    );

    ALTER TABLE "events_rels" ADD COLUMN IF NOT EXISTS "partners_id" integer;

    DO $$ BEGIN
      ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "events"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_partners_fk"
        FOREIGN KEY ("partners_id") REFERENCES "partners"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "events_rels_order_idx" ON "events_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "events_rels_parent_idx" ON "events_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "events_rels_path_idx" ON "events_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "events_rels_partners_idx" ON "events_rels" USING btree ("partners_id");
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_events_v_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "partners_id" integer
    );

    ALTER TABLE "_events_v_rels" ADD COLUMN IF NOT EXISTS "partners_id" integer;

    DO $$ BEGIN
      ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "_events_v"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_partners_fk"
        FOREIGN KEY ("partners_id") REFERENCES "partners"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "_events_v_rels_order_idx" ON "_events_v_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "_events_v_rels_parent_idx" ON "_events_v_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "_events_v_rels_path_idx" ON "_events_v_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "_events_v_rels_partners_idx" ON "_events_v_rels" USING btree ("partners_id");
  `)

  // ── 7. Forms GDPR fields ──
  await db.execute(sql`
    ALTER TABLE "forms" ADD COLUMN IF NOT EXISTS "arrival_notice" varchar;
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "forms_consent_sections" (
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
    CREATE TABLE IF NOT EXISTS "forms_consent_sections_declarations" (
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

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "forms_consent_sections_declarations";
    DROP TABLE IF EXISTS "forms_consent_sections";
    ALTER TABLE "forms" DROP COLUMN IF EXISTS "arrival_notice";

    DROP TABLE IF EXISTS "_events_v_rels";
    DROP TABLE IF EXISTS "events_rels";
    DROP TABLE IF EXISTS "_pages_v_rels";
    DROP TABLE IF EXISTS "pages_rels";

    DROP TABLE IF EXISTS "_pages_v_blocks_partner_section";
    DROP TABLE IF EXISTS "pages_blocks_partner_section";
    DROP TABLE IF EXISTS "_pages_v_blocks_popup_modal";
    DROP TABLE IF EXISTS "pages_blocks_popup_modal";

    ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN IF EXISTS "subheading_size";
    ALTER TABLE "pages_blocks_hero" DROP COLUMN IF EXISTS "subheading_size";

    DROP TABLE IF EXISTS "partners";
  `)
}
