import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Gallery items: add poster_image_id column
  await db.execute(sql`
  ALTER TABLE "pages_blocks_gallery_items" ADD COLUMN IF NOT EXISTS "poster_image_id" integer;
  ALTER TABLE "_pages_v_blocks_gallery_items" ADD COLUMN IF NOT EXISTS "poster_image_id" integer;
  `)

  // Showcase section: add poster_image_id column
  await db.execute(sql`
  ALTER TABLE "pages_blocks_showcase_section" ADD COLUMN IF NOT EXISTS "poster_image_id" integer;
  ALTER TABLE "_pages_v_blocks_showcase_section" ADD COLUMN IF NOT EXISTS "poster_image_id" integer;
  `)

  // Events: add video_poster_image_id column
  await db.execute(sql`
  ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "video_poster_image_id" integer;
  ALTER TABLE "_events_v" ADD COLUMN IF NOT EXISTS "version_video_poster_image_id" integer;
  `)

  // Foreign keys
  await db.execute(sql`
  DO $$ BEGIN ALTER TABLE "pages_blocks_gallery_items" ADD CONSTRAINT "pages_blocks_gallery_items_poster_image_id_media_id_fk" FOREIGN KEY ("poster_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_gallery_items" ADD CONSTRAINT "_pages_v_blocks_gallery_items_poster_image_id_media_id_fk" FOREIGN KEY ("poster_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_showcase_section" ADD CONSTRAINT "pages_blocks_showcase_section_poster_image_id_media_id_fk" FOREIGN KEY ("poster_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_pages_v_blocks_showcase_section" ADD CONSTRAINT "_pages_v_blocks_showcase_section_poster_image_id_media_id_fk" FOREIGN KEY ("poster_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "events" ADD CONSTRAINT "events_video_poster_image_id_media_id_fk" FOREIGN KEY ("video_poster_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_video_poster_image_id_media_id_fk" FOREIGN KEY ("version_video_poster_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // Indexes
  await db.execute(sql`
  CREATE INDEX IF NOT EXISTS "pages_blocks_gallery_items_poster_image_idx" ON "pages_blocks_gallery_items" USING btree ("poster_image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_gallery_items_poster_image_idx" ON "_pages_v_blocks_gallery_items" USING btree ("poster_image_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_showcase_section_poster_image_idx" ON "pages_blocks_showcase_section" USING btree ("poster_image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_showcase_section_poster_image_idx" ON "_pages_v_blocks_showcase_section" USING btree ("poster_image_id");
  CREATE INDEX IF NOT EXISTS "events_video_poster_image_idx" ON "events" USING btree ("video_poster_image_id");
  CREATE INDEX IF NOT EXISTS "_events_v_version_video_poster_image_idx" ON "_events_v" USING btree ("version_video_poster_image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages_blocks_gallery_items" DROP COLUMN IF EXISTS "poster_image_id";
  ALTER TABLE "_pages_v_blocks_gallery_items" DROP COLUMN IF EXISTS "poster_image_id";
  ALTER TABLE "pages_blocks_showcase_section" DROP COLUMN IF EXISTS "poster_image_id";
  ALTER TABLE "_pages_v_blocks_showcase_section" DROP COLUMN IF EXISTS "poster_image_id";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "video_poster_image_id";
  ALTER TABLE "_events_v" DROP COLUMN IF EXISTS "version_video_poster_image_id";
  `)
}
