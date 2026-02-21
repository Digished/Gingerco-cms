import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Only hero_links and cta_links have a style column based on the schema
  // Add alignment column and update enum for style to include 'dark'

  // Create alignment enum type
  await db.execute(sql`DROP TYPE IF EXISTS "enum_link_alignment" CASCADE`)
  await db.execute(sql`CREATE TYPE "enum_link_alignment" AS ENUM('left', 'center', 'right')`)

  // Update hero_links
  await db.execute(sql`ALTER TABLE "pages_blocks_hero_links" ADD COLUMN IF NOT EXISTS "alignment" "enum_link_alignment" DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_hero_links" ADD COLUMN IF NOT EXISTS "alignment" "enum_link_alignment" DEFAULT 'left'`)

  // Update CTA links
  await db.execute(sql`ALTER TABLE "pages_blocks_cta_links" ADD COLUMN IF NOT EXISTS "alignment" "enum_link_alignment" DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN IF NOT EXISTS "alignment" "enum_link_alignment" DEFAULT 'left'`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Drop alignment columns
  await db.execute(sql`ALTER TABLE "pages_blocks_hero_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_hero_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_cta_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_cta_links" DROP COLUMN IF EXISTS "alignment"`)

  // Drop alignment enum type
  await db.execute(sql`DROP TYPE IF EXISTS "enum_link_alignment" CASCADE`)
}
