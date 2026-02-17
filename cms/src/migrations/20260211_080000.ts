import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Fix: Version block tables need serial id (auto-increment), not varchar.
  // Payload inserts "default" for the id column on version tables.
  // Main tables use varchar (Payload provides hex string IDs).

  // Drop and recreate version tables with correct id type
  await db.execute(sql`
    DROP TABLE IF EXISTS "_pages_v_blocks_coming_soon";
    DROP TABLE IF EXISTS "_pages_v_blocks_popup_modal";
    DROP TABLE IF EXISTS "_pages_v_blocks_partner_section";
  `)

  await db.execute(sql`
    CREATE TABLE "_pages_v_blocks_popup_modal" (
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
      "_uuid" varchar,
      "block_name" varchar
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

  await db.execute(sql`
    CREATE TABLE "_pages_v_blocks_partner_section" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "heading" varchar DEFAULT 'Event Partners',
      "description" varchar,
      "layout" varchar DEFAULT 'grid',
      "background_color" varchar DEFAULT 'white',
      "_uuid" varchar,
      "block_name" varchar
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

  await db.execute(sql`
    CREATE TABLE "_pages_v_blocks_coming_soon" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "heading" varchar DEFAULT 'More Details Coming Soon',
      "description" varchar,
      "emoji" varchar DEFAULT '',
      "background_color" varchar DEFAULT 'light-gray',
      "_uuid" varchar,
      "block_name" varchar
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
    DROP TABLE IF EXISTS "_pages_v_blocks_partner_section";
    DROP TABLE IF EXISTS "_pages_v_blocks_popup_modal";
  `)
}
