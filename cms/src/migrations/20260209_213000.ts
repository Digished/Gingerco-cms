import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN CREATE TYPE "public"."enum_footer_columns_links_icon" AS ENUM('none', 'email', 'instagram', 'tiktok', 'linkedin', 'facebook', 'youtube', 'twitter', 'phone', 'globe', 'map-pin', 'arrow-right'); EXCEPTION WHEN duplicate_object THEN null; END $$;

  ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "hashtag" varchar DEFAULT '#NOPAINNOGINGER';
  ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "logo_id" integer;
  ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "brand_name" varchar DEFAULT 'Ginger & Co.';
  ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "contact_label" varchar DEFAULT 'For more information contact:';
  ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "contact_email" varchar DEFAULT 'info@gingerandco.at';

  ALTER TABLE "footer_columns_links" ADD COLUMN IF NOT EXISTS "icon" "enum_footer_columns_links_icon" DEFAULT 'none';
  ALTER TABLE "footer_columns_links" ADD COLUMN IF NOT EXISTS "new_tab" boolean DEFAULT false;

  DO $$ BEGIN ALTER TABLE "footer" ADD CONSTRAINT "footer_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "footer_logo_idx" ON "footer" USING btree ("logo_id");

  DROP TABLE IF EXISTS "footer_social_links" CASCADE;
  DROP TYPE IF EXISTS "public"."enum_footer_social_links_platform";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN CREATE TYPE "public"."enum_footer_social_links_platform" AS ENUM('instagram', 'facebook', 'tiktok', 'youtube', 'twitter'); EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE TABLE IF NOT EXISTS "footer_social_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "platform" "enum_footer_social_links_platform" NOT NULL,
    "url" varchar NOT NULL
  );

  DO $$ BEGIN ALTER TABLE "footer_social_links" ADD CONSTRAINT "footer_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  CREATE INDEX IF NOT EXISTS "footer_social_links_order_idx" ON "footer_social_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_social_links_parent_id_idx" ON "footer_social_links" USING btree ("_parent_id");

  ALTER TABLE "footer" DROP CONSTRAINT IF EXISTS "footer_logo_id_media_id_fk";
  DROP INDEX IF EXISTS "footer_logo_idx";

  ALTER TABLE "footer" DROP COLUMN IF EXISTS "hashtag";
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "logo_id";
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "brand_name";
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "contact_label";
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "contact_email";

  ALTER TABLE "footer_columns_links" DROP COLUMN IF EXISTS "icon";
  ALTER TABLE "footer_columns_links" DROP COLUMN IF EXISTS "new_tab";

  DROP TYPE IF EXISTS "public"."enum_footer_columns_links_icon";`)
}
