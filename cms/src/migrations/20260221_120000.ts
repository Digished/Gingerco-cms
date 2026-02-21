import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Create enum types for style and alignment fields in all link tables
  // Ensure columns exist first (in case migration 20260220_210000 didn't run)

  // Add columns if they don't exist
  await db.execute(sql`ALTER TABLE "pages_blocks_hero_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "pages_blocks_hero_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_hero_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
  await db.execute(sql`ALTER TABLE "_pages_v_blocks_hero_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)

  // Hero-specific style enum (includes 'dark')
  await db.execute(sql`DROP TYPE IF EXISTS "enum_pages_blocks_hero_links_style" CASCADE`)
  await db.execute(sql`
    CREATE TYPE "enum_pages_blocks_hero_links_style" AS ENUM('primary', 'outline', 'dark');
  `)
  await db.execute(sql`
    ALTER TABLE "pages_blocks_hero_links"
    ALTER COLUMN "style" TYPE "enum_pages_blocks_hero_links_style" USING "style"::"enum_pages_blocks_hero_links_style";
  `)

  await db.execute(sql`DROP TYPE IF EXISTS "enum__pages_v_blocks_hero_links_style" CASCADE`)
  await db.execute(sql`
    CREATE TYPE "enum__pages_v_blocks_hero_links_style" AS ENUM('primary', 'outline', 'dark');
  `)
  await db.execute(sql`
    ALTER TABLE "_pages_v_blocks_hero_links"
    ALTER COLUMN "style" TYPE "enum__pages_v_blocks_hero_links_style" USING "style"::"enum__pages_v_blocks_hero_links_style";
  `)

  // Standard style enum (primary, secondary, outline) for all other blocks
  const standardStyleBlocks = [
    'content', 'about_section', 'split_content', 'showcase_section',
    'cta', 'events_list', 'faq', 'gallery', 'partner_section', 'team', 'testimonials'
  ];

  // Add columns if they don't exist for standard blocks
  for (const block of standardStyleBlocks) {
    await db.execute(sql`ALTER TABLE "pages_blocks_${block}_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
    await db.execute(sql`ALTER TABLE "pages_blocks_${block}_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
    await db.execute(sql`ALTER TABLE "_pages_v_blocks_${block}_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
    await db.execute(sql`ALTER TABLE "_pages_v_blocks_${block}_links" ADD COLUMN IF NOT EXISTS "style" varchar DEFAULT 'primary'`)
  }

  for (const block of standardStyleBlocks) {
    await db.execute(sql`DROP TYPE IF EXISTS "enum_pages_blocks_${block}_links_style" CASCADE`)
    await db.execute(sql`
      CREATE TYPE "enum_pages_blocks_${block}_links_style" AS ENUM('primary', 'secondary', 'outline');
    `)
    await db.execute(sql`
      ALTER TABLE "pages_blocks_${block}_links"
      ALTER COLUMN "style" TYPE "enum_pages_blocks_${block}_links_style" USING "style"::"enum_pages_blocks_${block}_links_style";
    `)
  }

  for (const block of standardStyleBlocks) {
    await db.execute(sql`DROP TYPE IF EXISTS "enum__pages_v_blocks_${block}_links_style" CASCADE`)
    await db.execute(sql`
      CREATE TYPE "enum__pages_v_blocks_${block}_links_style" AS ENUM('primary', 'secondary', 'outline');
    `)
    await db.execute(sql`
      ALTER TABLE "_pages_v_blocks_${block}_links"
      ALTER COLUMN "style" TYPE "enum__pages_v_blocks_${block}_links_style" USING "style"::"enum__pages_v_blocks_${block}_links_style";
    `)
  }

  // Create alignment enum for all link tables
  await db.execute(sql`DROP TYPE IF EXISTS "enum_link_alignment" CASCADE`)
  await db.execute(sql`
    CREATE TYPE "enum_link_alignment" AS ENUM('left', 'center', 'right');
  `)

  const allLinkBlocks = [
    'hero', 'content', 'about_section', 'split_content', 'showcase_section',
    'cta', 'events_list', 'faq', 'gallery', 'partner_section', 'team', 'testimonials'
  ];

  for (const block of allLinkBlocks) {
    await db.execute(sql`
      ALTER TABLE "pages_blocks_${block}_links"
      ALTER COLUMN "alignment" TYPE "enum_link_alignment" USING "alignment"::"enum_link_alignment";
    `)
    await db.execute(sql`
      ALTER TABLE "_pages_v_blocks_${block}_links"
      ALTER COLUMN "alignment" TYPE "enum_link_alignment" USING "alignment"::"enum_link_alignment";
    `)
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Convert enum columns back to varchar and drop enum types
  const allLinkBlocks = [
    'hero', 'content', 'about_section', 'split_content', 'showcase_section',
    'cta', 'events_list', 'faq', 'gallery', 'partner_section', 'team', 'testimonials'
  ];

  for (const block of allLinkBlocks) {
    await db.execute(sql`
      ALTER TABLE "pages_blocks_${block}_links"
      ALTER COLUMN "alignment" TYPE varchar USING "alignment"::varchar;
    `)
    await db.execute(sql`
      ALTER TABLE "_pages_v_blocks_${block}_links"
      ALTER COLUMN "alignment" TYPE varchar USING "alignment"::varchar;
    `)
  }

  await db.execute(sql`DROP TYPE IF EXISTS "enum_link_alignment" CASCADE`)

  // Drop hero style enum
  await db.execute(sql`
    ALTER TABLE "pages_blocks_hero_links"
    ALTER COLUMN "style" TYPE varchar USING "style"::varchar;
  `)
  await db.execute(sql`
    ALTER TABLE "_pages_v_blocks_hero_links"
    ALTER COLUMN "style" TYPE varchar USING "style"::varchar;
  `)
  await db.execute(sql`DROP TYPE IF EXISTS "enum_pages_blocks_hero_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum__pages_v_blocks_hero_links_style" CASCADE`)

  // Drop standard style enums
  const standardStyleBlocks = [
    'content', 'about_section', 'split_content', 'showcase_section',
    'cta', 'events_list', 'faq', 'gallery', 'partner_section', 'team', 'testimonials'
  ];

  for (const block of standardStyleBlocks) {
    await db.execute(sql`
      ALTER TABLE "pages_blocks_${block}_links"
      ALTER COLUMN "style" TYPE varchar USING "style"::varchar;
    `)
    await db.execute(sql`
      ALTER TABLE "_pages_v_blocks_${block}_links"
      ALTER COLUMN "style" TYPE varchar USING "style"::varchar;
    `)
    await db.execute(sql`DROP TYPE IF EXISTS "enum_pages_blocks_${block}_links_style" CASCADE`)
    await db.execute(sql`DROP TYPE IF EXISTS "enum__pages_v_blocks_${block}_links_style" CASCADE`)
  }
}
