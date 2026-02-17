import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── Fix: Recreate block tables with varchar id instead of serial ──
  // Payload 3.x uses hex string IDs for blocks, not auto-increment integers.
  // The original tables are empty (inserts failed), so safe to drop & recreate.

  // Drop old tables (order matters for FK constraints)
  await db.execute(sql`
    DROP TABLE IF EXISTS "_pages_v_blocks_popup_modal";
    DROP TABLE IF EXISTS "pages_blocks_popup_modal";
    DROP TABLE IF EXISTS "_pages_v_blocks_partner_section";
    DROP TABLE IF EXISTS "pages_blocks_partner_section";
    DROP TABLE IF EXISTS "_pages_v_blocks_coming_soon";
    DROP TABLE IF EXISTS "pages_blocks_coming_soon";
  `)

  // ── Popup Modal block (correct id type) ──
  await db.execute(sql`
    CREATE TABLE "pages_blocks_popup_modal" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
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
    CREATE TABLE "_pages_v_blocks_popup_modal" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
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

  // ── Partner Section block (correct id type) ──
  await db.execute(sql`
    CREATE TABLE "pages_blocks_partner_section" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
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
    CREATE TABLE "_pages_v_blocks_partner_section" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
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

  // ── Coming Soon block (new) ──
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_blocks_coming_soon" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "heading" varchar DEFAULT 'More Details Coming Soon',
      "description" varchar,
      "emoji" varchar DEFAULT '',
      "background_color" varchar DEFAULT 'light-gray',
      "block_name" varchar
    );

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_coming_soon" ADD CONSTRAINT "pages_blocks_coming_soon_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "pages"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "pages_blocks_coming_soon_order_idx" ON "pages_blocks_coming_soon" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_coming_soon_parent_id_idx" ON "pages_blocks_coming_soon" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_coming_soon_path_idx" ON "pages_blocks_coming_soon" USING btree ("_path");
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_coming_soon" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "heading" varchar DEFAULT 'More Details Coming Soon',
      "description" varchar,
      "emoji" varchar DEFAULT '',
      "background_color" varchar DEFAULT 'light-gray',
      "block_name" varchar,
      "_uuid" varchar
    );

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_coming_soon" ADD CONSTRAINT "_pages_v_blocks_coming_soon_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_pages_v"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_coming_soon_order_idx" ON "_pages_v_blocks_coming_soon" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_coming_soon_parent_id_idx" ON "_pages_v_blocks_coming_soon" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_coming_soon_path_idx" ON "_pages_v_blocks_coming_soon" USING btree ("_path");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "_pages_v_blocks_coming_soon";
    DROP TABLE IF EXISTS "pages_blocks_coming_soon";
    DROP TABLE IF EXISTS "_pages_v_blocks_partner_section";
    DROP TABLE IF EXISTS "pages_blocks_partner_section";
    DROP TABLE IF EXISTS "_pages_v_blocks_popup_modal";
    DROP TABLE IF EXISTS "pages_blocks_popup_modal";
  `)
}
