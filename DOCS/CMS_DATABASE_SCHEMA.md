# Database Schema

> This document is obsolete. It described an earlier Supabase-based schema that was never used.
>
> The current database schema is **managed automatically by Payload CMS** via its PostgreSQL adapter. Payload generates and runs migrations from the collection definitions in `cms/src/collections/`.
>
> To inspect the schema:
> - Read the collection files in `cms/src/collections/`
> - Run `npm run generate:types` to regenerate `src/payload-types.ts` (the TypeScript representation of the full schema)
> - Inspect migration files in `cms/src/migrations/` for the raw SQL
>
> See `DOCS/CMS_ARCHITECTURE.md` for a human-readable description of each collection and its fields.
