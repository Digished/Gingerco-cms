import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN CREATE TYPE "public"."enum_site_settings_heading_font" AS ENUM('Playfair Display', 'Merriweather', 'Lora', 'Poppins', 'Montserrat', 'Raleway', 'Oswald', 'Dancing Script'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_site_settings_body_font" AS ENUM('Poppins', 'Inter', 'Open Sans', 'Lato', 'Nunito', 'Roboto', 'Source Sans 3'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "public"."enum_site_settings_button_style" AS ENUM('rounded', 'slight', 'square'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "primary_color" varchar DEFAULT '#E85D3A';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "secondary_color" varchar DEFAULT '#F4A261';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "background_color" varchar DEFAULT '#FFFAF5';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "text_color" varchar DEFAULT '#2D2D2D';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "heading_font" "enum_site_settings_heading_font" DEFAULT 'Playfair Display';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "body_font" "enum_site_settings_body_font" DEFAULT 'Poppins';
  ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "button_style" "enum_site_settings_button_style" DEFAULT 'rounded';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "primary_color";
  ALTER TABLE "site_settings" DROP COLUMN "secondary_color";
  ALTER TABLE "site_settings" DROP COLUMN "background_color";
  ALTER TABLE "site_settings" DROP COLUMN "text_color";
  ALTER TABLE "site_settings" DROP COLUMN "heading_font";
  ALTER TABLE "site_settings" DROP COLUMN "body_font";
  ALTER TABLE "site_settings" DROP COLUMN "button_style";
  DROP TYPE "public"."enum_site_settings_heading_font";
  DROP TYPE "public"."enum_site_settings_body_font";
  DROP TYPE "public"."enum_site_settings_button_style";`)
}
