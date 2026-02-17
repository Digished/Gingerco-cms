import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Create enum types for the gallery items mediaType select field
  await db.execute(sql`
  DO $$ BEGIN CREATE TYPE "enum_pages_blocks_gallery_items_media_type" AS ENUM('image','video'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN CREATE TYPE "enum__pages_v_blocks_gallery_items_media_type" AS ENUM('image','video'); EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // Create the gallery items table (new "items" array field)
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "pages_blocks_gallery_items" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "media_type" "enum_pages_blocks_gallery_items_media_type" DEFAULT 'image',
    "image_id" integer,
    "video_url" varchar,
    "caption" varchar
  );
  `)

  // Create the version table counterpart
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "_pages_v_blocks_gallery_items" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "_uuid" varchar,
    "media_type" "enum__pages_v_blocks_gallery_items_media_type" DEFAULT 'image',
    "image_id" integer,
    "video_url" varchar,
    "caption" varchar
  );
  `)

  // Foreign keys
  await db.execute(sql`
  DO $$ BEGIN ALTER TABLE "pages_blocks_gallery_items" ADD CONSTRAINT "pages_blocks_gallery_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_gallery_items" ADD CONSTRAINT "pages_blocks_gallery_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_gallery_items" ADD CONSTRAINT "_pages_v_blocks_gallery_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_gallery_items" ADD CONSTRAINT "_pages_v_blocks_gallery_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // Indexes
  await db.execute(sql`
  CREATE INDEX IF NOT EXISTS "pages_blocks_gallery_items_order_idx" ON "pages_blocks_gallery_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_gallery_items_parent_id_idx" ON "pages_blocks_gallery_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_gallery_items_image_idx" ON "pages_blocks_gallery_items" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_gallery_items_order_idx" ON "_pages_v_blocks_gallery_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_gallery_items_parent_id_idx" ON "_pages_v_blocks_gallery_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_gallery_items_image_idx" ON "_pages_v_blocks_gallery_items" USING btree ("image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "_pages_v_blocks_gallery_items";
  DROP TABLE IF EXISTS "pages_blocks_gallery_items";
  DROP TYPE IF EXISTS "enum__pages_v_blocks_gallery_items_media_type";
  DROP TYPE IF EXISTS "enum_pages_blocks_gallery_items_media_type";
  `)
}
