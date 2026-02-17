import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── Events CTA fields ──
  await db.execute(sql`
  ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "cta_label" varchar DEFAULT 'Register Now';
  ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "cta_action" varchar DEFAULT 'navigate';
  ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "cta_new_tab" boolean DEFAULT true;
  ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "cta_redirect_url" varchar;

  ALTER TABLE "_events_v" ADD COLUMN IF NOT EXISTS "version_cta_label" varchar DEFAULT 'Register Now';
  ALTER TABLE "_events_v" ADD COLUMN IF NOT EXISTS "version_cta_action" varchar DEFAULT 'navigate';
  ALTER TABLE "_events_v" ADD COLUMN IF NOT EXISTS "version_cta_new_tab" boolean DEFAULT true;
  ALTER TABLE "_events_v" ADD COLUMN IF NOT EXISTS "version_cta_redirect_url" varchar;
  `)

  // ── popup_redirect_url on all link tables that have linkFields ──

  // Header nav items
  await db.execute(sql`
  ALTER TABLE "header_nav_items" ADD COLUMN IF NOT EXISTS "popup_redirect_url" varchar;
  `)

  // Footer column links
  await db.execute(sql`
  ALTER TABLE "footer_columns_links" ADD COLUMN IF NOT EXISTS "popup_redirect_url" varchar;
  `)

  // Hero block links
  await db.execute(sql`
  ALTER TABLE "pages_blocks_hero_links" ADD COLUMN IF NOT EXISTS "popup_redirect_url" varchar;
  ALTER TABLE "_pages_v_blocks_hero_links" ADD COLUMN IF NOT EXISTS "popup_redirect_url" varchar;
  `)

  // CTA block links
  await db.execute(sql`
  ALTER TABLE "pages_blocks_cta_links" ADD COLUMN IF NOT EXISTS "popup_redirect_url" varchar;
  ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN IF NOT EXISTS "popup_redirect_url" varchar;
  `)

  // Showcase section links
  await db.execute(sql`
  ALTER TABLE "pages_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "popup_redirect_url" varchar;
  ALTER TABLE "_pages_v_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "popup_redirect_url" varchar;
  `)

  // Countdown timer (group field, prefixed with "link_")
  await db.execute(sql`
  ALTER TABLE "pages_blocks_countdown_timer" ADD COLUMN IF NOT EXISTS "link_popup_redirect_url" varchar;
  ALTER TABLE "_pages_v_blocks_countdown_timer" ADD COLUMN IF NOT EXISTS "link_popup_redirect_url" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "events" DROP COLUMN IF EXISTS "cta_label";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "cta_action";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "cta_new_tab";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "cta_redirect_url";

  ALTER TABLE "_events_v" DROP COLUMN IF EXISTS "version_cta_label";
  ALTER TABLE "_events_v" DROP COLUMN IF EXISTS "version_cta_action";
  ALTER TABLE "_events_v" DROP COLUMN IF EXISTS "version_cta_new_tab";
  ALTER TABLE "_events_v" DROP COLUMN IF EXISTS "version_cta_redirect_url";

  ALTER TABLE "header_nav_items" DROP COLUMN IF EXISTS "popup_redirect_url";
  ALTER TABLE "footer_columns_links" DROP COLUMN IF EXISTS "popup_redirect_url";
  ALTER TABLE "pages_blocks_hero_links" DROP COLUMN IF EXISTS "popup_redirect_url";
  ALTER TABLE "_pages_v_blocks_hero_links" DROP COLUMN IF EXISTS "popup_redirect_url";
  ALTER TABLE "pages_blocks_cta_links" DROP COLUMN IF EXISTS "popup_redirect_url";
  ALTER TABLE "_pages_v_blocks_cta_links" DROP COLUMN IF EXISTS "popup_redirect_url";
  ALTER TABLE "pages_blocks_showcase_section_links" DROP COLUMN IF EXISTS "popup_redirect_url";
  ALTER TABLE "_pages_v_blocks_showcase_section_links" DROP COLUMN IF EXISTS "popup_redirect_url";
  ALTER TABLE "pages_blocks_countdown_timer" DROP COLUMN IF EXISTS "link_popup_redirect_url";
  ALTER TABLE "_pages_v_blocks_countdown_timer" DROP COLUMN IF EXISTS "link_popup_redirect_url";
  `)
}
