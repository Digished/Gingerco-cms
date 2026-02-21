import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Create enum types for style field in all link tables

  // Hero-specific enum (includes 'dark')
  await db.execute(sql`
    DROP TYPE IF EXISTS "enum_pages_blocks_hero_links_style" CASCADE;
  `)
  await db.execute(sql`
    CREATE TYPE "enum_pages_blocks_hero_links_style" AS ENUM('primary', 'outline', 'dark');
  `)
  await db.execute(sql`
    ALTER TABLE "pages_blocks_hero_links"
    ALTER COLUMN "style" TYPE "enum_pages_blocks_hero_links_style" USING "style"::"enum_pages_blocks_hero_links_style";
  `)

  // Version table for hero
  await db.execute(sql`
    DROP TYPE IF EXISTS "enum__pages_v_blocks_hero_links_style" CASCADE;
  `)
  await db.execute(sql`
    CREATE TYPE "enum__pages_v_blocks_hero_links_style" AS ENUM('primary', 'outline', 'dark');
  `)
  await db.execute(sql`
    ALTER TABLE "_pages_v_blocks_hero_links"
    ALTER COLUMN "style" TYPE "enum__pages_v_blocks_hero_links_style" USING "style"::"enum__pages_v_blocks_hero_links_style";
  `)

  // Standard enum (primary, secondary, outline) for all other blocks
  const standardStyleBlocks = [
    'content', 'about_section', 'split_content', 'showcase_section',
    'cta', 'events_list', 'faq', 'gallery', 'partner_section', 'team', 'testimonials'
  ];

  for (const block of standardStyleBlocks) {
    await db.execute(sql`DROP TYPE IF EXISTS "enum_pages_blocks_${block}_links_style" CASCADE`)
  }

  for (const block of standardStyleBlocks) {
    await db.execute(sql`
      CREATE TYPE "enum_pages_blocks_${block}_links_style" AS ENUM('primary', 'secondary', 'outline');
    `)
  }

  for (const block of standardStyleBlocks) {
    await db.execute(sql`
      ALTER TABLE "pages_blocks_${block}_links"
      ALTER COLUMN "style" TYPE "enum_pages_blocks_${block}_links_style" USING "style"::"enum_pages_blocks_${block}_links_style";
    `)
  }

  // Version tables with same enum types
  for (const block of standardStyleBlocks) {
    await db.execute(sql`DROP TYPE IF EXISTS "enum__pages_v_blocks_${block}_links_style" CASCADE`)
  }

  for (const block of standardStyleBlocks) {
    await db.execute(sql`
      CREATE TYPE "enum__pages_v_blocks_${block}_links_style" AS ENUM('primary', 'secondary', 'outline');
    `)
  }

  for (const block of standardStyleBlocks) {
    await db.execute(sql`
      ALTER TABLE "_pages_v_blocks_${block}_links"
      ALTER COLUMN "style" TYPE "enum__pages_v_blocks_${block}_links_style" USING "style"::"enum__pages_v_blocks_${block}_links_style";
    `)
  }

  // Create enum type for alignment (used by all link tables)
  await db.execute(sql`
    DROP TYPE IF EXISTS "enum_link_alignment" CASCADE;
  `)
  await db.execute(sql`
    CREATE TYPE "enum_link_alignment" AS ENUM('left', 'center', 'right');
  `)

  // Apply alignment enum to all link tables
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
  // Drop all created enum types
  await db.execute(sql`DROP TYPE IF EXISTS "enum_pages_blocks_hero_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum__pages_v_blocks_hero_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum_link_alignment" CASCADE`)

  const standardStyleBlocks = [
    'content', 'about_section', 'split_content', 'showcase_section',
    'cta', 'events_list', 'faq', 'gallery', 'partner_section', 'team', 'testimonials'
  ];

  for (const block of standardStyleBlocks) {
    await db.execute(sql`DROP TYPE IF EXISTS "enum_pages_blocks_${block}_links_style" CASCADE`)
    await db.execute(sql`DROP TYPE IF EXISTS "enum__pages_v_blocks_${block}_links_style" CASCADE`)
  }
}
