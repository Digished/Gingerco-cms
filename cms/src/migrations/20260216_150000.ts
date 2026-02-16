import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── Link popup form columns: add link_action + popup_form_id to all link tables ──

  // Header nav items
  await db.execute(sql`
  ALTER TABLE "header_nav_items" ADD COLUMN IF NOT EXISTS "link_action" varchar DEFAULT 'navigate';
  ALTER TABLE "header_nav_items" ADD COLUMN IF NOT EXISTS "popup_form_id" integer;
  `)

  // Footer column links
  await db.execute(sql`
  ALTER TABLE "footer_columns_links" ADD COLUMN IF NOT EXISTS "link_action" varchar DEFAULT 'navigate';
  ALTER TABLE "footer_columns_links" ADD COLUMN IF NOT EXISTS "popup_form_id" integer;
  `)

  // Hero block links (+ version tables)
  await db.execute(sql`
  ALTER TABLE "pages_blocks_hero_links" ADD COLUMN IF NOT EXISTS "link_action" varchar DEFAULT 'navigate';
  ALTER TABLE "pages_blocks_hero_links" ADD COLUMN IF NOT EXISTS "popup_form_id" integer;
  ALTER TABLE "_pages_v_blocks_hero_links" ADD COLUMN IF NOT EXISTS "link_action" varchar DEFAULT 'navigate';
  ALTER TABLE "_pages_v_blocks_hero_links" ADD COLUMN IF NOT EXISTS "popup_form_id" integer;
  `)

  // CTA block links (+ version tables)
  await db.execute(sql`
  ALTER TABLE "pages_blocks_cta_links" ADD COLUMN IF NOT EXISTS "link_action" varchar DEFAULT 'navigate';
  ALTER TABLE "pages_blocks_cta_links" ADD COLUMN IF NOT EXISTS "popup_form_id" integer;
  ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN IF NOT EXISTS "link_action" varchar DEFAULT 'navigate';
  ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN IF NOT EXISTS "popup_form_id" integer;
  `)

  // Showcase section links (+ version tables)
  await db.execute(sql`
  ALTER TABLE "pages_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "link_action" varchar DEFAULT 'navigate';
  ALTER TABLE "pages_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "popup_form_id" integer;
  ALTER TABLE "_pages_v_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "link_action" varchar DEFAULT 'navigate';
  ALTER TABLE "_pages_v_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "popup_form_id" integer;
  `)

  // Countdown timer (group field, prefixed with "link_")
  await db.execute(sql`
  ALTER TABLE "pages_blocks_countdown_timer" ADD COLUMN IF NOT EXISTS "link_link_action" varchar DEFAULT 'navigate';
  ALTER TABLE "pages_blocks_countdown_timer" ADD COLUMN IF NOT EXISTS "link_popup_form_id" integer;
  ALTER TABLE "_pages_v_blocks_countdown_timer" ADD COLUMN IF NOT EXISTS "link_link_action" varchar DEFAULT 'navigate';
  ALTER TABLE "_pages_v_blocks_countdown_timer" ADD COLUMN IF NOT EXISTS "link_popup_form_id" integer;
  `)

  // Foreign keys for popup_form_id columns
  await db.execute(sql`
  DO $$ BEGIN ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_popup_form_id_forms_id_fk" FOREIGN KEY ("popup_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_popup_form_id_forms_id_fk" FOREIGN KEY ("popup_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_hero_links" ADD CONSTRAINT "pages_blocks_hero_links_popup_form_id_forms_id_fk" FOREIGN KEY ("popup_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_cta_links" ADD CONSTRAINT "pages_blocks_cta_links_popup_form_id_forms_id_fk" FOREIGN KEY ("popup_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_showcase_section_links" ADD CONSTRAINT "pages_blocks_showcase_section_links_popup_form_id_forms_id_fk" FOREIGN KEY ("popup_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_countdown_timer" ADD CONSTRAINT "pages_blocks_countdown_timer_link_popup_form_id_forms_id_fk" FOREIGN KEY ("link_popup_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // Indexes for popup_form_id columns
  await db.execute(sql`
  CREATE INDEX IF NOT EXISTS "header_nav_items_popup_form_idx" ON "header_nav_items" USING btree ("popup_form_id");
  CREATE INDEX IF NOT EXISTS "footer_columns_links_popup_form_idx" ON "footer_columns_links" USING btree ("popup_form_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_hero_links_popup_form_idx" ON "pages_blocks_hero_links" USING btree ("popup_form_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_cta_links_popup_form_idx" ON "pages_blocks_cta_links" USING btree ("popup_form_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_showcase_section_links_popup_form_idx" ON "pages_blocks_showcase_section_links" USING btree ("popup_form_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_countdown_timer_link_popup_form_idx" ON "pages_blocks_countdown_timer" USING btree ("link_popup_form_id");
  `)

  // ── Floating Action Buttons: create site_settings_floating_buttons table ──
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "site_settings_floating_buttons" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar,
    "icon" varchar,
    "color" varchar DEFAULT '#25D366',
    "action" varchar,
    "url" varchar,
    "whatsapp_number" varchar,
    "whatsapp_message" varchar,
    "phone_number" varchar,
    "email_address" varchar,
    "popup_form_id" integer
  );
  `)

  await db.execute(sql`
  DO $$ BEGIN ALTER TABLE "site_settings_floating_buttons" ADD CONSTRAINT "site_settings_floating_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "site_settings_floating_buttons" ADD CONSTRAINT "site_settings_floating_buttons_popup_form_id_forms_id_fk" FOREIGN KEY ("popup_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  await db.execute(sql`
  CREATE INDEX IF NOT EXISTS "site_settings_floating_buttons_order_idx" ON "site_settings_floating_buttons" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "site_settings_floating_buttons_parent_id_idx" ON "site_settings_floating_buttons" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "site_settings_floating_buttons_popup_form_idx" ON "site_settings_floating_buttons" USING btree ("popup_form_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Drop floating buttons table
  await db.execute(sql`
  DROP TABLE IF EXISTS "site_settings_floating_buttons";
  `)

  // Drop link_action and popup_form_id columns
  await db.execute(sql`
  ALTER TABLE "header_nav_items" DROP COLUMN IF EXISTS "link_action";
  ALTER TABLE "header_nav_items" DROP COLUMN IF EXISTS "popup_form_id";
  ALTER TABLE "footer_columns_links" DROP COLUMN IF EXISTS "link_action";
  ALTER TABLE "footer_columns_links" DROP COLUMN IF EXISTS "popup_form_id";
  ALTER TABLE "pages_blocks_hero_links" DROP COLUMN IF EXISTS "link_action";
  ALTER TABLE "pages_blocks_hero_links" DROP COLUMN IF EXISTS "popup_form_id";
  ALTER TABLE "_pages_v_blocks_hero_links" DROP COLUMN IF EXISTS "link_action";
  ALTER TABLE "_pages_v_blocks_hero_links" DROP COLUMN IF EXISTS "popup_form_id";
  ALTER TABLE "pages_blocks_cta_links" DROP COLUMN IF EXISTS "link_action";
  ALTER TABLE "pages_blocks_cta_links" DROP COLUMN IF EXISTS "popup_form_id";
  ALTER TABLE "_pages_v_blocks_cta_links" DROP COLUMN IF EXISTS "link_action";
  ALTER TABLE "_pages_v_blocks_cta_links" DROP COLUMN IF EXISTS "popup_form_id";
  ALTER TABLE "pages_blocks_showcase_section_links" DROP COLUMN IF EXISTS "link_action";
  ALTER TABLE "pages_blocks_showcase_section_links" DROP COLUMN IF EXISTS "popup_form_id";
  ALTER TABLE "_pages_v_blocks_showcase_section_links" DROP COLUMN IF EXISTS "link_action";
  ALTER TABLE "_pages_v_blocks_showcase_section_links" DROP COLUMN IF EXISTS "popup_form_id";
  ALTER TABLE "pages_blocks_countdown_timer" DROP COLUMN IF EXISTS "link_link_action";
  ALTER TABLE "pages_blocks_countdown_timer" DROP COLUMN IF EXISTS "link_popup_form_id";
  ALTER TABLE "_pages_v_blocks_countdown_timer" DROP COLUMN IF EXISTS "link_link_action";
  ALTER TABLE "_pages_v_blocks_countdown_timer" DROP COLUMN IF EXISTS "link_popup_form_id";
  `)
}
