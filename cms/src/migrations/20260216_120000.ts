import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── Block visibility: add "hidden" column to every block table and its version counterpart ──
  await db.execute(sql`
  ALTER TABLE "pages_blocks_hero" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_content" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_content" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_about_section" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_about_section" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_showcase_section" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_showcase_section" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_events_list" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_events_list" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_gallery" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_gallery" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_faq" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_faq" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_countdown_timer" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_countdown_timer" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_team" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_team" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_testimonials" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_blog_list" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_blog_list" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_bullet_list" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_bullet_list" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_split_content" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_split_content" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_popup_modal" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_popup_modal" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_partner_section" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_partner_section" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_coming_soon" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_coming_soon" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
  `)

  // ── Internal links: add linkCollection + relationship columns for events, blog-posts, team-members ──

  // Header nav items
  await db.execute(sql`
  ALTER TABLE "header_nav_items" ADD COLUMN IF NOT EXISTS "link_collection" varchar DEFAULT 'pages';
  ALTER TABLE "header_nav_items" ADD COLUMN IF NOT EXISTS "event_id" integer;
  ALTER TABLE "header_nav_items" ADD COLUMN IF NOT EXISTS "blog_post_id" integer;
  ALTER TABLE "header_nav_items" ADD COLUMN IF NOT EXISTS "team_member_id" integer;
  `)

  // Footer column links
  await db.execute(sql`
  ALTER TABLE "footer_columns_links" ADD COLUMN IF NOT EXISTS "link_collection" varchar DEFAULT 'pages';
  ALTER TABLE "footer_columns_links" ADD COLUMN IF NOT EXISTS "event_id" integer;
  ALTER TABLE "footer_columns_links" ADD COLUMN IF NOT EXISTS "blog_post_id" integer;
  ALTER TABLE "footer_columns_links" ADD COLUMN IF NOT EXISTS "team_member_id" integer;
  `)

  // Hero block links (+ version table)
  await db.execute(sql`
  ALTER TABLE "pages_blocks_hero_links" ADD COLUMN IF NOT EXISTS "link_collection" varchar DEFAULT 'pages';
  ALTER TABLE "pages_blocks_hero_links" ADD COLUMN IF NOT EXISTS "event_id" integer;
  ALTER TABLE "pages_blocks_hero_links" ADD COLUMN IF NOT EXISTS "blog_post_id" integer;
  ALTER TABLE "pages_blocks_hero_links" ADD COLUMN IF NOT EXISTS "team_member_id" integer;
  ALTER TABLE "_pages_v_blocks_hero_links" ADD COLUMN IF NOT EXISTS "link_collection" varchar DEFAULT 'pages';
  ALTER TABLE "_pages_v_blocks_hero_links" ADD COLUMN IF NOT EXISTS "event_id" integer;
  ALTER TABLE "_pages_v_blocks_hero_links" ADD COLUMN IF NOT EXISTS "blog_post_id" integer;
  ALTER TABLE "_pages_v_blocks_hero_links" ADD COLUMN IF NOT EXISTS "team_member_id" integer;
  `)

  // CTA block links (+ version table)
  await db.execute(sql`
  ALTER TABLE "pages_blocks_cta_links" ADD COLUMN IF NOT EXISTS "link_collection" varchar DEFAULT 'pages';
  ALTER TABLE "pages_blocks_cta_links" ADD COLUMN IF NOT EXISTS "event_id" integer;
  ALTER TABLE "pages_blocks_cta_links" ADD COLUMN IF NOT EXISTS "blog_post_id" integer;
  ALTER TABLE "pages_blocks_cta_links" ADD COLUMN IF NOT EXISTS "team_member_id" integer;
  ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN IF NOT EXISTS "link_collection" varchar DEFAULT 'pages';
  ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN IF NOT EXISTS "event_id" integer;
  ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN IF NOT EXISTS "blog_post_id" integer;
  ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN IF NOT EXISTS "team_member_id" integer;
  `)

  // Showcase section links (+ version table)
  await db.execute(sql`
  ALTER TABLE "pages_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "link_collection" varchar DEFAULT 'pages';
  ALTER TABLE "pages_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "event_id" integer;
  ALTER TABLE "pages_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "blog_post_id" integer;
  ALTER TABLE "pages_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "team_member_id" integer;
  ALTER TABLE "_pages_v_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "link_collection" varchar DEFAULT 'pages';
  ALTER TABLE "_pages_v_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "event_id" integer;
  ALTER TABLE "_pages_v_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "blog_post_id" integer;
  ALTER TABLE "_pages_v_blocks_showcase_section_links" ADD COLUMN IF NOT EXISTS "team_member_id" integer;
  `)

  // Countdown timer (group field, so columns are prefixed with "link_")
  await db.execute(sql`
  ALTER TABLE "pages_blocks_countdown_timer" ADD COLUMN IF NOT EXISTS "link_link_collection" varchar DEFAULT 'pages';
  ALTER TABLE "pages_blocks_countdown_timer" ADD COLUMN IF NOT EXISTS "link_event_id" integer;
  ALTER TABLE "pages_blocks_countdown_timer" ADD COLUMN IF NOT EXISTS "link_blog_post_id" integer;
  ALTER TABLE "pages_blocks_countdown_timer" ADD COLUMN IF NOT EXISTS "link_team_member_id" integer;
  ALTER TABLE "_pages_v_blocks_countdown_timer" ADD COLUMN IF NOT EXISTS "link_link_collection" varchar DEFAULT 'pages';
  ALTER TABLE "_pages_v_blocks_countdown_timer" ADD COLUMN IF NOT EXISTS "link_event_id" integer;
  ALTER TABLE "_pages_v_blocks_countdown_timer" ADD COLUMN IF NOT EXISTS "link_blog_post_id" integer;
  ALTER TABLE "_pages_v_blocks_countdown_timer" ADD COLUMN IF NOT EXISTS "link_team_member_id" integer;
  `)

  // ── Foreign keys for new relationship columns ──
  await db.execute(sql`
  DO $$ BEGIN ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_blog_post_id_blog_posts_id_fk" FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_team_member_id_team_members_id_fk" FOREIGN KEY ("team_member_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_blog_post_id_blog_posts_id_fk" FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_team_member_id_team_members_id_fk" FOREIGN KEY ("team_member_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN ALTER TABLE "pages_blocks_hero_links" ADD CONSTRAINT "pages_blocks_hero_links_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_hero_links" ADD CONSTRAINT "pages_blocks_hero_links_blog_post_id_blog_posts_id_fk" FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_hero_links" ADD CONSTRAINT "pages_blocks_hero_links_team_member_id_team_members_id_fk" FOREIGN KEY ("team_member_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN ALTER TABLE "pages_blocks_cta_links" ADD CONSTRAINT "pages_blocks_cta_links_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_cta_links" ADD CONSTRAINT "pages_blocks_cta_links_blog_post_id_blog_posts_id_fk" FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_cta_links" ADD CONSTRAINT "pages_blocks_cta_links_team_member_id_team_members_id_fk" FOREIGN KEY ("team_member_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN ALTER TABLE "pages_blocks_showcase_section_links" ADD CONSTRAINT "pages_blocks_showcase_section_links_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_showcase_section_links" ADD CONSTRAINT "pages_blocks_showcase_section_links_blog_post_id_blog_posts_id_fk" FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_showcase_section_links" ADD CONSTRAINT "pages_blocks_showcase_section_links_team_member_id_team_members_id_fk" FOREIGN KEY ("team_member_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN ALTER TABLE "pages_blocks_countdown_timer" ADD CONSTRAINT "pages_blocks_countdown_timer_link_event_id_events_id_fk" FOREIGN KEY ("link_event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_countdown_timer" ADD CONSTRAINT "pages_blocks_countdown_timer_link_blog_post_id_blog_posts_id_fk" FOREIGN KEY ("link_blog_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  DO $$ BEGIN ALTER TABLE "pages_blocks_countdown_timer" ADD CONSTRAINT "pages_blocks_countdown_timer_link_team_member_id_team_members_id_fk" FOREIGN KEY ("link_team_member_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  // ── Indexes for new FK columns ──
  await db.execute(sql`
  CREATE INDEX IF NOT EXISTS "header_nav_items_event_idx" ON "header_nav_items" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "header_nav_items_blog_post_idx" ON "header_nav_items" USING btree ("blog_post_id");
  CREATE INDEX IF NOT EXISTS "header_nav_items_team_member_idx" ON "header_nav_items" USING btree ("team_member_id");
  CREATE INDEX IF NOT EXISTS "footer_columns_links_event_idx" ON "footer_columns_links" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "footer_columns_links_blog_post_idx" ON "footer_columns_links" USING btree ("blog_post_id");
  CREATE INDEX IF NOT EXISTS "footer_columns_links_team_member_idx" ON "footer_columns_links" USING btree ("team_member_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_hero_links_event_idx" ON "pages_blocks_hero_links" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_hero_links_blog_post_idx" ON "pages_blocks_hero_links" USING btree ("blog_post_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_hero_links_team_member_idx" ON "pages_blocks_hero_links" USING btree ("team_member_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_cta_links_event_idx" ON "pages_blocks_cta_links" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_cta_links_blog_post_idx" ON "pages_blocks_cta_links" USING btree ("blog_post_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_cta_links_team_member_idx" ON "pages_blocks_cta_links" USING btree ("team_member_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_showcase_section_links_event_idx" ON "pages_blocks_showcase_section_links" USING btree ("event_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_showcase_section_links_blog_post_idx" ON "pages_blocks_showcase_section_links" USING btree ("blog_post_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_showcase_section_links_team_member_idx" ON "pages_blocks_showcase_section_links" USING btree ("team_member_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_countdown_timer_link_event_idx" ON "pages_blocks_countdown_timer" USING btree ("link_event_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_countdown_timer_link_blog_post_idx" ON "pages_blocks_countdown_timer" USING btree ("link_blog_post_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_countdown_timer_link_team_member_idx" ON "pages_blocks_countdown_timer" USING btree ("link_team_member_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Drop link relationship columns
  await db.execute(sql`
  ALTER TABLE "header_nav_items" DROP COLUMN IF EXISTS "link_collection";
  ALTER TABLE "header_nav_items" DROP COLUMN IF EXISTS "event_id";
  ALTER TABLE "header_nav_items" DROP COLUMN IF EXISTS "blog_post_id";
  ALTER TABLE "header_nav_items" DROP COLUMN IF EXISTS "team_member_id";
  ALTER TABLE "footer_columns_links" DROP COLUMN IF EXISTS "link_collection";
  ALTER TABLE "footer_columns_links" DROP COLUMN IF EXISTS "event_id";
  ALTER TABLE "footer_columns_links" DROP COLUMN IF EXISTS "blog_post_id";
  ALTER TABLE "footer_columns_links" DROP COLUMN IF EXISTS "team_member_id";
  ALTER TABLE "pages_blocks_hero_links" DROP COLUMN IF EXISTS "link_collection";
  ALTER TABLE "pages_blocks_hero_links" DROP COLUMN IF EXISTS "event_id";
  ALTER TABLE "pages_blocks_hero_links" DROP COLUMN IF EXISTS "blog_post_id";
  ALTER TABLE "pages_blocks_hero_links" DROP COLUMN IF EXISTS "team_member_id";
  ALTER TABLE "_pages_v_blocks_hero_links" DROP COLUMN IF EXISTS "link_collection";
  ALTER TABLE "_pages_v_blocks_hero_links" DROP COLUMN IF EXISTS "event_id";
  ALTER TABLE "_pages_v_blocks_hero_links" DROP COLUMN IF EXISTS "blog_post_id";
  ALTER TABLE "_pages_v_blocks_hero_links" DROP COLUMN IF EXISTS "team_member_id";
  ALTER TABLE "pages_blocks_cta_links" DROP COLUMN IF EXISTS "link_collection";
  ALTER TABLE "pages_blocks_cta_links" DROP COLUMN IF EXISTS "event_id";
  ALTER TABLE "pages_blocks_cta_links" DROP COLUMN IF EXISTS "blog_post_id";
  ALTER TABLE "pages_blocks_cta_links" DROP COLUMN IF EXISTS "team_member_id";
  ALTER TABLE "_pages_v_blocks_cta_links" DROP COLUMN IF EXISTS "link_collection";
  ALTER TABLE "_pages_v_blocks_cta_links" DROP COLUMN IF EXISTS "event_id";
  ALTER TABLE "_pages_v_blocks_cta_links" DROP COLUMN IF EXISTS "blog_post_id";
  ALTER TABLE "_pages_v_blocks_cta_links" DROP COLUMN IF EXISTS "team_member_id";
  ALTER TABLE "pages_blocks_showcase_section_links" DROP COLUMN IF EXISTS "link_collection";
  ALTER TABLE "pages_blocks_showcase_section_links" DROP COLUMN IF EXISTS "event_id";
  ALTER TABLE "pages_blocks_showcase_section_links" DROP COLUMN IF EXISTS "blog_post_id";
  ALTER TABLE "pages_blocks_showcase_section_links" DROP COLUMN IF EXISTS "team_member_id";
  ALTER TABLE "_pages_v_blocks_showcase_section_links" DROP COLUMN IF EXISTS "link_collection";
  ALTER TABLE "_pages_v_blocks_showcase_section_links" DROP COLUMN IF EXISTS "event_id";
  ALTER TABLE "_pages_v_blocks_showcase_section_links" DROP COLUMN IF EXISTS "blog_post_id";
  ALTER TABLE "_pages_v_blocks_showcase_section_links" DROP COLUMN IF EXISTS "team_member_id";
  ALTER TABLE "pages_blocks_countdown_timer" DROP COLUMN IF EXISTS "link_link_collection";
  ALTER TABLE "pages_blocks_countdown_timer" DROP COLUMN IF EXISTS "link_event_id";
  ALTER TABLE "pages_blocks_countdown_timer" DROP COLUMN IF EXISTS "link_blog_post_id";
  ALTER TABLE "pages_blocks_countdown_timer" DROP COLUMN IF EXISTS "link_team_member_id";
  ALTER TABLE "_pages_v_blocks_countdown_timer" DROP COLUMN IF EXISTS "link_link_collection";
  ALTER TABLE "_pages_v_blocks_countdown_timer" DROP COLUMN IF EXISTS "link_event_id";
  ALTER TABLE "_pages_v_blocks_countdown_timer" DROP COLUMN IF EXISTS "link_blog_post_id";
  ALTER TABLE "_pages_v_blocks_countdown_timer" DROP COLUMN IF EXISTS "link_team_member_id";
  `)

  // Drop hidden columns from all block tables
  await db.execute(sql`
  ALTER TABLE "pages_blocks_hero" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "pages_blocks_content" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "_pages_v_blocks_content" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "pages_blocks_about_section" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "_pages_v_blocks_about_section" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "pages_blocks_showcase_section" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "_pages_v_blocks_showcase_section" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "pages_blocks_events_list" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "_pages_v_blocks_events_list" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "pages_blocks_gallery" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "_pages_v_blocks_gallery" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "pages_blocks_faq" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "_pages_v_blocks_faq" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "pages_blocks_countdown_timer" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "_pages_v_blocks_countdown_timer" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "pages_blocks_team" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "_pages_v_blocks_team" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "pages_blocks_testimonials" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "_pages_v_blocks_testimonials" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "pages_blocks_blog_list" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "_pages_v_blocks_blog_list" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "pages_blocks_bullet_list" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "_pages_v_blocks_bullet_list" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "pages_blocks_split_content" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "_pages_v_blocks_split_content" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "pages_blocks_popup_modal" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "_pages_v_blocks_popup_modal" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "pages_blocks_partner_section" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "_pages_v_blocks_partner_section" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "pages_blocks_coming_soon" DROP COLUMN IF EXISTS "hidden";
  ALTER TABLE "_pages_v_blocks_coming_soon" DROP COLUMN IF EXISTS "hidden";
  `)
}
