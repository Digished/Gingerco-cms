import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Fix: Add only alignment column (style already exists)
  // and convert both to correct enum types

  const allBlocks = [
    'hero', 'content', 'about_section', 'split_content', 'showcase_section',
    'cta', 'events_list', 'faq', 'gallery', 'partner_section', 'team', 'testimonials'
  ];

  const heroStyleValues = ['primary', 'outline', 'dark'];
  const standardStyleValues = ['primary', 'secondary', 'outline'];

  // Step 1: Add alignment column where missing, convert existing style columns to varchar
  for (const block of allBlocks) {
    const isHero = block === 'hero';

    // Add alignment column if missing
    await db.execute(sql`ALTER TABLE "pages_blocks_${block}_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)
    await db.execute(sql`ALTER TABLE "_pages_v_blocks_${block}_links" ADD COLUMN IF NOT EXISTS "alignment" varchar DEFAULT 'left'`)

    // Convert style to varchar temporarily (needed to recreate enum)
    await db.execute(sql`ALTER TABLE "pages_blocks_${block}_links" ALTER COLUMN "style" TYPE varchar USING "style"::varchar`)
    await db.execute(sql`ALTER TABLE "_pages_v_blocks_${block}_links" ALTER COLUMN "style" TYPE varchar USING "style"::varchar`)
  }

  // Step 2: Drop old enum types
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_pages_blocks_hero_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum_pages_blocks_hero_links_style" CASCADE`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum__pages_v_blocks_hero_links_style" CASCADE`)

  const standardStyleBlocks = [
    'content', 'about_section', 'split_content', 'showcase_section',
    'cta', 'events_list', 'faq', 'gallery', 'partner_section', 'team', 'testimonials'
  ];

  for (const block of standardStyleBlocks) {
    await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_pages_blocks_${block}_links_style" CASCADE`)
    await db.execute(sql`DROP TYPE IF EXISTS "enum_pages_blocks_${block}_links_style" CASCADE`)
    await db.execute(sql`DROP TYPE IF EXISTS "enum__pages_v_blocks_${block}_links_style" CASCADE`)
  }

  // Step 3: Create correct enum types
  // Hero enum with dark value
  await db.execute(sql`
    CREATE TYPE "enum_pages_blocks_hero_links_style" AS ENUM('primary', 'outline', 'dark');
  `)
  await db.execute(sql`
    CREATE TYPE "enum__pages_v_blocks_hero_links_style" AS ENUM('primary', 'outline', 'dark');
  `)

  // Standard enum for other blocks
  for (const block of standardStyleBlocks) {
    await db.execute(sql`
      CREATE TYPE "enum_pages_blocks_${block}_links_style" AS ENUM('primary', 'secondary', 'outline');
    `)
    await db.execute(sql`
      CREATE TYPE "enum__pages_v_blocks_${block}_links_style" AS ENUM('primary', 'secondary', 'outline');
    `)
  }

  // Step 4: Convert style columns back to correct enum types
  await db.execute(sql`
    ALTER TABLE "pages_blocks_hero_links"
    ALTER COLUMN "style" TYPE "enum_pages_blocks_hero_links_style" USING "style"::"enum_pages_blocks_hero_links_style";
  `)
  await db.execute(sql`
    ALTER TABLE "_pages_v_blocks_hero_links"
    ALTER COLUMN "style" TYPE "enum__pages_v_blocks_hero_links_style" USING "style"::"enum__pages_v_blocks_hero_links_style";
  `)

  for (const block of standardStyleBlocks) {
    await db.execute(sql`
      ALTER TABLE "pages_blocks_${block}_links"
      ALTER COLUMN "style" TYPE "enum_pages_blocks_${block}_links_style" USING "style"::"enum_pages_blocks_${block}_links_style";
    `)
    await db.execute(sql`
      ALTER TABLE "_pages_v_blocks_${block}_links"
      ALTER COLUMN "style" TYPE "enum__pages_v_blocks_${block}_links_style" USING "style"::"enum__pages_v_blocks_${block}_links_style";
    `)
  }

  // Step 5: Create alignment enum type
  await db.execute(sql`DROP TYPE IF EXISTS "enum_link_alignment" CASCADE`)
  await db.execute(sql`
    CREATE TYPE "enum_link_alignment" AS ENUM('left', 'center', 'right');
  `)

  // Step 6: Convert alignment columns to enum
  for (const block of allBlocks) {
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
  const allBlocks = [
    'hero', 'content', 'about_section', 'split_content', 'showcase_section',
    'cta', 'events_list', 'faq', 'gallery', 'partner_section', 'team', 'testimonials'
  ];

  // Convert back to varchar
  for (const block of allBlocks) {
    await db.execute(sql`
      ALTER TABLE "pages_blocks_${block}_links"
      ALTER COLUMN "alignment" TYPE varchar USING "alignment"::varchar;
    `)
    await db.execute(sql`
      ALTER TABLE "_pages_v_blocks_${block}_links"
      ALTER COLUMN "alignment" TYPE varchar USING "alignment"::varchar;
    `)
    await db.execute(sql`
      ALTER TABLE "pages_blocks_${block}_links"
      ALTER COLUMN "style" TYPE varchar USING "style"::varchar;
    `)
    await db.execute(sql`
      ALTER TABLE "_pages_v_blocks_${block}_links"
      ALTER COLUMN "style" TYPE varchar USING "style"::varchar;
    `)
  }

  // Drop enum types
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

  // Drop alignment column
  for (const block of allBlocks) {
    await db.execute(sql`ALTER TABLE "pages_blocks_${block}_links" DROP COLUMN IF EXISTS "alignment"`)
    await db.execute(sql`ALTER TABLE "_pages_v_blocks_${block}_links" DROP COLUMN IF EXISTS "alignment"`)
  }
}
