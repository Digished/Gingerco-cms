# Vercel Deployment Guide for Gingerco CMS

Deploy the Gingerco CMS (Payload CMS 3 + Next.js 15) to Vercel.

**Cost**: Free tier (Hobby plan) covers everything needed.

---

## Prerequisites

1. **Git repository** with code pushed (GitHub, GitLab, or Bitbucket)
2. **Vercel account** (free) -- sign up at https://vercel.com
3. **PostgreSQL database** -- either:
   - Supabase project (free tier, get the connection string from Project Settings > Database)
   - Vercel Postgres (Neon-based, add from Vercel's Storage tab)
   - Any PostgreSQL provider

---

## Step 1: Create a Vercel Account

1. Go to **https://vercel.com**
2. Click **Sign Up**
3. Choose your Git provider (GitHub recommended)
4. Authorize Vercel to access your repositories

---

## Step 2: Import Your Project

1. Click **Add New... > Project**
2. Find and select the **Gingerco-cms** repository
3. Click **Import**

---

## Step 3: Configure Build Settings

### Root Directory

```
Root Directory: cms
```

Click **Edit** next to Root Directory and type `cms`.

### Build & Output Settings

Vercel auto-detects Next.js. Defaults are correct:

```
Framework Preset:   Next.js
Build Command:      next build
Output Directory:   .next (auto-detected)
Install Command:    npm install (auto-detected)
```

### Node.js Version

Set to **20.x** or higher (Payload CMS requires Node.js 20.9+).

---

## Step 4: Add Environment Variables

In the **Environment Variables** section, add:

### Required Variables

| Variable | Value | Where to Find |
|----------|-------|---------------|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db` | Supabase: Project Settings > Database > Connection string (URI). Use the "Transaction" pooler connection string for serverless. |
| `PAYLOAD_SECRET` | Random 32+ character string | Generate with `openssl rand -hex 32` |
| `NEXT_PUBLIC_SERVER_URL` | `https://your-project.vercel.app` | Your Vercel domain (update after first deploy) |

### Optional Variables

| Variable | Value | Purpose |
|----------|-------|---------|
| `BLOB_READ_WRITE_TOKEN` | Auto-set by Vercel Blob integration | Media uploads in production |

### Setting Up Media Storage (Vercel Blob)

In production on Vercel, local file storage does not persist. For media uploads:

1. Go to your Vercel project **Storage** tab
2. Click **Create** > **Blob**
3. Follow the setup -- this automatically adds `BLOB_READ_WRITE_TOKEN` to your env vars
4. Redeploy

Without this, media uploads will not persist between deployments.

### Security Notes

- `PAYLOAD_SECRET` is used to encrypt auth cookies and tokens -- keep it secret
- `DATABASE_URL` contains database credentials -- never expose it
- Vercel encrypts all environment variables at rest

---

## Step 5: Deploy

1. Click **Deploy**
2. Vercel will install dependencies, build, and deploy
3. First build takes 2-4 minutes

---

## Step 6: Create Your First Admin User

1. Visit `https://your-project.vercel.app/admin`
2. Payload shows a registration form on first visit
3. Create your admin account (email + password)
4. You'll be logged into the admin panel

---

## Step 7: Verify Your Deployment

### Test Checklist

- [ ] `/admin` loads the Payload admin panel
- [ ] Can create a new Page with blocks (Hero, Content, etc.)
- [ ] Can create a new Event
- [ ] Can upload media (images)
- [ ] Can configure Header navigation
- [ ] Can configure Footer
- [ ] Can create a Form
- [ ] Public pages render at `/` and `/your-slug`

### Update NEXT_PUBLIC_SERVER_URL

After the first deploy, update `NEXT_PUBLIC_SERVER_URL` in **Settings > Environment Variables** to match your actual domain, then redeploy.

---

## Step 8: Custom Domain (Optional)

1. Go to project **Settings > Domains**
2. Enter your domain: `cms.gingerandco.at`
3. Click **Add**
4. Configure DNS at your registrar:

**Subdomain** (e.g., `cms.gingerandco.at`):

| Type | Name | Value |
|------|------|-------|
| CNAME | `cms` | `cname.vercel-dns.com` |

**Apex domain** (e.g., `gingerandco.at`):

| Type | Name | Value |
|------|------|-------|
| A | `@` | `76.76.21.21` |

SSL certificates are provisioned automatically.

---

## Automatic Deployments

Every push to Git triggers an automatic deployment. Every pull request gets a preview URL.

```bash
git push origin main        # triggers production deployment
```

---

## Database Migrations

Payload manages database schema through Drizzle migrations.

### Development

In dev mode (`npm run dev`), Payload auto-syncs your schema to the database. No migrations needed.

### Production

Before deploying schema changes:

```bash
# Generate a migration file from your current schema changes
npx payload migrate:create

# The migration file is created in src/migrations/
# Commit it and push -- the build process runs migrations automatically
```

---

## Rollbacks

1. Go to **Deployments** tab
2. Find the last working deployment
3. Click the three dots menu > **Promote to Production**

Rollback takes effect instantly.

---

## Troubleshooting

### Build Fails: DATABASE_URL error

**Cause**: `DATABASE_URL` not set or invalid.

**Fix**: Go to Settings > Environment Variables, verify the connection string format: `postgresql://user:password@host:port/database`

### Admin Panel Shows 500 Error

**Cause**: Missing `PAYLOAD_SECRET` or database connection issue.

**Fix**:
1. Verify both `DATABASE_URL` and `PAYLOAD_SECRET` are set
2. Check that the database is accessible from Vercel (not blocked by firewall)
3. For Supabase: use the "Transaction" pooler connection string for serverless

### Media Uploads Fail

**Cause**: No persistent storage configured.

**Fix**: Set up Vercel Blob storage (see Step 4). Local filesystem storage does not persist on Vercel.

### Supabase Connection Refused

**Cause**: Using the wrong connection string format.

**Fix**: In Supabase, go to Project Settings > Database > Connection string. Use the **Transaction** pooler URI (port 6543), not the direct connection, for serverless environments.

---

## Quick Reference

| Action | How |
|--------|-----|
| Deploy | Push to Git (automatic) |
| Access admin | Visit `/admin` |
| View logs | Vercel Dashboard > Logs |
| Update env vars | Settings > Environment Variables > Redeploy |
| Add domain | Settings > Domains > Add |
| Rollback | Deployments > Previous > Promote to Production |
| Run migrations | `npx payload migrate:create` then push |

---

## Links

- **Payload CMS Docs**: https://payloadcms.com/docs
- **Payload Deployment Guide**: https://payloadcms.com/docs/production/deployment
- **Vercel Docs**: https://vercel.com/docs
- **Next.js on Vercel**: https://vercel.com/docs/frameworks/nextjs
- **Supabase**: https://supabase.com/docs

---

## Support

If deployment fails:

1. Check **Deployments** tab for build logs
2. Review the Troubleshooting section above
3. Payload CMS docs: https://payloadcms.com/docs
4. Vercel support: https://vercel.com/support
