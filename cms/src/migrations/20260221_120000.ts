import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Only alter tables that actually exist in the schema

  // Step 1: Add alignment column to existing link tables
  await db.execute(sql`ALTER TABLE "pages_blocks_hero_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_hero_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)

  await db.execute(sql`ALTER TABLE "pages_blocks_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)

  await db.execute(sql`ALTER TABLE "pages_blocks_about_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_about_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)

  await db.execute(sql`ALTER TABLE "pages_blocks_split_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_split_content_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)

  await db.execute(sql`ALTER TABLE "pages_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)

  await db.execute(sql`ALTER TABLE "pages_blocks_cta_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)

  await db.execute(sql`ALTER TABLE "footer_columns_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "footer_social_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)

  // Step 2: Convert style columns to varchar temporarily
  await db.execute(sql`ALTER TABLE "pages_blocks_hero_links" ALTER COLUMN "style" TYPE varchar USING "style"::varchar`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_hero_links" ALTER COLUMN "style" TYPE varchar USING "style"::varchar`)
  await db.execute(sql`ALTER TABLE "pages_blocks_content_links" ALTER COLUMN "style" TYPE varchar USING "style"::varchar`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_content_links" ALTER COLUMN "style" TYPE varchar USING "style"::varchar`)
  await db.execute(sql`ALTER TABLE "pages_blocks_about_section_links" ALTER COLUMN "style" TYPE varchar USING "style"::varchar`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_about_section_links" ALTER COLUMN "style" TYPE varchar USING "style"::varchar`)
  await db.execute(sql`ALTER TABLE "pages_blocks_split_content_links" ALTER COLUMN "style" TYPE varchar USING "style"::varchar`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_split_content_links" ALTER COLUMN "style" TYPE varchar USING "style"::varchar`)
  await db.execute(sql`ALTER TABLE "pages_blocks_showcase_section_links" ALTER COLUMN "style" TYPE varchar USING "style"::varchar`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_showcase_section_links" ALTER COLUMN "style" TYPE varchar USING "style"::varchar`)
  await db.execute(sql`ALTER TABLE "pages_blocks_cta_links" ALTER COLUMN "style" TYPE varchar USING "style"::varchar`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_cta_links" ALTER COLUMN "style" TYPE varchar USING "style"::varchar`)
  await db.execute(sql`ALTER TABLE "footer_columns_links" ALTER COLUMN "style" TYPE varchar USING "style"::varchar`)
  await db.execute(sql`ALTER TABLE "footer_social_links" ALTER COLUMN "style" TYPE varchar USING "style"::varchar`)

  // Step 3: Drop old enum types
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_pages_blocks_hero_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum_pages_blocks_hero_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum__pages_v_blocks_hero_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_pages_blocks_content_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum_pages_blocks_content_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum__pages_v_blocks_content_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_pages_blocks_about_section_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum_pages_blocks_about_section_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum__pages_v_blocks_about_section_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_pages_blocks_split_content_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum_pages_blocks_split_content_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum__pages_v_blocks_split_content_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_pages_blocks_showcase_section_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum_pages_blocks_showcase_section_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum__pages_v_blocks_showcase_section_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_pages_blocks_cta_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum_pages_blocks_cta_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum__pages_v_blocks_cta_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_footer_columns_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum_footer_columns_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_footer_social_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum_footer_social_links_style" CASCADE`)

  // Step 4: Create correct enum types
  await db.execute(sql`CREATE TYPE "enum_pages_blocks_hero_links_style" AS ENUM('primary', 'outline', 'dark')`)
  await db.execute(sql`CREATE TYPE "enum__pages_v_blocks_hero_links_style" AS ENUM('primary', 'outline', 'dark')`)
  await db.execute(sql`CREATE TYPE "enum_pages_blocks_content_links_style" AS ENUM('primary', 'secondary', 'outline')`)
  await db.execute(sql`CREATE TYPE "enum__pages_v_blocks_content_links_style" AS ENUM('primary', 'secondary', 'outline')`)
  await db.execute(sql`CREATE TYPE "enum_pages_blocks_about_section_links_style" AS ENUM('primary', 'secondary', 'outline')`)
  await db.execute(sql`CREATE TYPE "enum__pages_v_blocks_about_section_links_style" AS ENUM('primary', 'secondary', 'outline')`)
  await db.execute(sql`CREATE TYPE "enum_pages_blocks_split_content_links_style" AS ENUM('primary', 'secondary', 'outline')`)
  await db.execute(sql`CREATE TYPE "enum__pages_v_blocks_split_content_links_style" AS ENUM('primary', 'secondary', 'outline')`)
  await db.execute(sql`CREATE TYPE "enum_pages_blocks_showcase_section_links_style" AS ENUM('primary', 'secondary', 'outline')`)
  await db.execute(sql`CREATE TYPE "enum__pages_v_blocks_showcase_section_links_style" AS ENUM('primary', 'secondary', 'outline')`)
  await db.execute(sql`CREATE TYPE "enum_pages_blocks_cta_links_style" AS ENUM('primary', 'secondary', 'outline')`)
  await db.execute(sql`CREATE TYPE "enum__pages_v_blocks_cta_links_style" AS ENUM('primary', 'secondary', 'outline')`)
  await db.execute(sql`CREATE TYPE "enum_footer_columns_links_style" AS ENUM('primary', 'secondary', 'outline')`)
  await db.execute(sql`CREATE TYPE "enum_footer_social_links_style" AS ENUM('primary', 'secondary', 'outline')`)

  // Step 5: Create alignment enum type
  await db.execute(sql`DROP TYPE IF EXISTS "enum_link_alignment" CASCADE`)
  await db.execute(sql`CREATE TYPE "enum_link_alignment" AS ENUM('left', 'center', 'right')`)

  // Step 6: Convert style and alignment columns to correct enum types
  await db.execute(sql`ALTER TABLE "pages_blocks_hero_links" ALTER COLUMN "style" TYPE "enum_pages_blocks_hero_links_style" USING "style"::"enum_pages_blocks_hero_links_style"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_hero_links" ALTER COLUMN "style" TYPE "enum__pages_v_blocks_hero_links_style" USING "style"::"enum__pages_v_blocks_hero_links_style"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_hero_links" ALTER COLUMN "alignment" TYPE "enum_link_alignment" USING "alignment"::"enum_link_alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_hero_links" ALTER COLUMN "alignment" TYPE "enum_link_alignment" USING "alignment"::"enum_link_alignment"`)

  await db.execute(sql`ALTER TABLE "pages_blocks_content_links" ALTER COLUMN "style" TYPE "enum_pages_blocks_content_links_style" USING "style"::"enum_pages_blocks_content_links_style"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_content_links" ALTER COLUMN "style" TYPE "enum__pages_v_blocks_content_links_style" USING "style"::"enum__pages_v_blocks_content_links_style"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_content_links" ALTER COLUMN "alignment" TYPE "enum_link_alignment" USING "alignment"::"enum_link_alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_content_links" ALTER COLUMN "alignment" TYPE "enum_link_alignment" USING "alignment"::"enum_link_alignment"`)

  await db.execute(sql`ALTER TABLE "pages_blocks_about_section_links" ALTER COLUMN "style" TYPE "enum_pages_blocks_about_section_links_style" USING "style"::"enum_pages_blocks_about_section_links_style"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_about_section_links" ALTER COLUMN "style" TYPE "enum__pages_v_blocks_about_section_links_style" USING "style"::"enum__pages_v_blocks_about_section_links_style"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_about_section_links" ALTER COLUMN "alignment" TYPE "enum_link_alignment" USING "alignment"::"enum_link_alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_about_section_links" ALTER COLUMN "alignment" TYPE "enum_link_alignment" USING "alignment"::"enum_link_alignment"`)

  await db.execute(sql`ALTER TABLE "pages_blocks_split_content_links" ALTER COLUMN "style" TYPE "enum_pages_blocks_split_content_links_style" USING "style"::"enum_pages_blocks_split_content_links_style"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_split_content_links" ALTER COLUMN "style" TYPE "enum__pages_v_blocks_split_content_links_style" USING "style"::"enum__pages_v_blocks_split_content_links_style"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_split_content_links" ALTER COLUMN "alignment" TYPE "enum_link_alignment" USING "alignment"::"enum_link_alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_split_content_links" ALTER COLUMN "alignment" TYPE "enum_link_alignment" USING "alignment"::"enum_link_alignment"`)

  await db.execute(sql`ALTER TABLE "pages_blocks_showcase_section_links" ALTER COLUMN "style" TYPE "enum_pages_blocks_showcase_section_links_style" USING "style"::"enum_pages_blocks_showcase_section_links_style"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_showcase_section_links" ALTER COLUMN "style" TYPE "enum__pages_v_blocks_showcase_section_links_style" USING "style"::"enum__pages_v_blocks_showcase_section_links_style"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_showcase_section_links" ALTER COLUMN "alignment" TYPE "enum_link_alignment" USING "alignment"::"enum_link_alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_showcase_section_links" ALTER COLUMN "alignment" TYPE "enum_link_alignment" USING "alignment"::"enum_link_alignment"`)

  await db.execute(sql`ALTER TABLE "pages_blocks_cta_links" ALTER COLUMN "style" TYPE "enum_pages_blocks_cta_links_style" USING "style"::"enum_pages_blocks_cta_links_style"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_cta_links" ALTER COLUMN "style" TYPE "enum__pages_v_blocks_cta_links_style" USING "style"::"enum__pages_v_blocks_cta_links_style"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_cta_links" ALTER COLUMN "alignment" TYPE "enum_link_alignment" USING "alignment"::"enum_link_alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_cta_links" ALTER COLUMN "alignment" TYPE "enum_link_alignment" USING "alignment"::"enum_link_alignment"`)

  await db.execute(sql`ALTER TABLE "footer_columns_links" ALTER COLUMN "style" TYPE "enum_footer_columns_links_style" USING "style"::"enum_footer_columns_links_style"`)
  await db.execute(sql`ALTER TABLE "footer_columns_links" ALTER COLUMN "alignment" TYPE "enum_link_alignment" USING "alignment"::"enum_link_alignment"`)

  await db.execute(sql`ALTER TABLE "footer_social_links" ALTER COLUMN "style" TYPE "enum_footer_social_links_style" USING "style"::"enum_footer_social_links_style"`)
  await db.execute(sql`ALTER TABLE "footer_social_links" ALTER COLUMN "alignment" TYPE "enum_link_alignment" USING "alignment"::"enum_link_alignment"`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Drop alignment columns
  await db.execute(sql`ALTER TABLE "pages_blocks_hero_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_hero_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_content_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_content_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_about_section_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_about_section_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_split_content_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_split_content_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_showcase_section_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_showcase_section_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "pages_blocks_cta_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_cta_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "footer_columns_links" DROP COLUMN IF EXISTS "alignment"`)
  await db.execute(sql`ALTER TABLE "footer_social_links" DROP COLUMN IF EXISTS "alignment"`)

  // Drop enum types
  await db.execute(sql`DROP TYPE IF EXISTS "enum_link_alignment" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum_pages_blocks_hero_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum__pages_v_blocks_hero_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum_pages_blocks_content_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum__pages_v_blocks_content_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum_pages_blocks_about_section_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum__pages_v_blocks_about_section_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum_pages_blocks_split_content_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum__pages_v_blocks_split_content_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum_pages_blocks_showcase_section_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum__pages_v_blocks_showcase_section_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum_pages_blocks_cta_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum__pages_v_blocks_cta_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum_footer_columns_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum_footer_social_links_style" CASCADE`)
}
