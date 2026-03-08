import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Fix _pages_v_blocks_newsletter_block.id column type.
 *
 * Version tables (_pages_v_blocks_*) use serial (auto-increment integer) primary
 * keys, while live block tables (pages_blocks_*) use varchar UUID primary keys.
 * The previous migration (20260308_120000) incorrectly created the version table
 * with "id" varchar PRIMARY KEY NOT NULL (no default), causing:
 *   null value in column "id" ... violates not-null constraint
 *
 * Fix: drop and recreate the version table with "id" serial PRIMARY KEY NOT NULL.
 * The live pages_blocks_newsletter_block table is correct and is left untouched.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "_pages_v_blocks_newsletter_block" CASCADE`)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_newsletter_block" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "hidden" boolean DEFAULT false,
      "heading" varchar DEFAULT 'Stay in the loop',
      "description" varchar,
      "collect_first_name" boolean DEFAULT false,
      "collect_last_name" boolean DEFAULT false,
      "submit_button_label" varchar DEFAULT 'Subscribe',
      "success_message" varchar DEFAULT 'Thanks! Please check your email to confirm your subscription.',
      "source" varchar,
      "tags" varchar,
      "background_color" varchar DEFAULT 'light-gray',
      "alignment" varchar DEFAULT 'center',
      "block_name" varchar,
      "_uuid" varchar
    );

    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_newsletter_block" ADD CONSTRAINT "_pages_v_blocks_newsletter_block_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "_pages_v"("id") ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_newsletter_block_order_idx" ON "_pages_v_blocks_newsletter_block" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_newsletter_block_parent_id_idx" ON "_pages_v_blocks_newsletter_block" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_newsletter_block_path_idx" ON "_pages_v_blocks_newsletter_block" USING btree ("_path");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "_pages_v_blocks_newsletter_block" CASCADE`)
}
