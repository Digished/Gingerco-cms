# Netlify Deployment Guide for Gingerco CMS

Complete step-by-step guide to deploy your Next.js CMS frontend to Netlify with proper build settings and environment configuration.

**Time to Deploy**: 15-20 minutes

---

## 📋 Prerequisites

Before deploying, ensure you have:

1. ✅ **GitHub/GitLab Account**
   - Repository with your code pushed

2. ✅ **Netlify Account** (Free)
   - Sign up at https://netlify.com

3. ✅ **Supabase Credentials**
   - Project URL
   - Anon key
   - Service role key (for backend)

4. ✅ **Git Repository**
   - Code pushed to remote (GitHub, GitLab, Bitbucket)
   - Branch: `claude/plan-headless-cms-OhICB` or your main branch

---

## STEP 1: Connect Repository to Netlify

### 1.1 Create New Site

1. Go to **https://netlify.com**
2. Sign in with your account
3. Click **"Add new site"** → **"Import an existing project"**
4. Select your Git provider:
   - GitHub
   - GitLab
   - Bitbucket

### 1.2 Authorize Netlify

1. Click on your chosen Git provider
2. Click **"Authorize Netlify"**
3. Sign in to your Git account
4. Grant Netlify permission to access repositories

### 1.3 Select Repository

1. Choose your Gingerco repository from the list
2. Click **"Install and authorize"** (if prompted)
3. Click on the repository name

### 1.4 Configure Build Settings

This is the critical part! Netlify will detect some settings automatically, but we need to customize them.

---

## STEP 2: Configure Build Settings

### 2.1 Build Command

**Default Path**: `/cms`

When Netlify asks for build command, use:

```
cd cms && npm run build
```

**Why**?
- Your Next.js app is in the `cms/` subfolder
- `npm run build` compiles TypeScript and optimizes for production

### 2.2 Publish Directory

**Publish directory**: `cms/.next`

**Why**?
- Next.js outputs production build to `.next` folder
- This is what gets deployed to CDN

### 2.3 Node Version

Netlify should auto-detect Node.js 18 or higher.

To verify/set explicitly:
1. Go to **Site settings** → **Build & deploy** → **Environment**
2. Look for `NODE_VERSION`
3. If not set, add:
   - Key: `NODE_VERSION`
   - Value: `18` or `20`

### 2.4 Example Screenshot Values

```
Base directory: cms
Build command: npm run build
Publish directory: .next
```

---

## STEP 3: Set Environment Variables

This is crucial! Your app needs Supabase credentials.

### 3.1 Go to Environment Variables

After connecting repository:

1. Click **"Build & deploy"** tab
2. Click **"Environment"** section
3. Click **"Edit variables"** button

OR if already deployed:

1. Click **"Site settings"**
2. Click **"Build & deploy"**
3. Click **"Environment"**

### 3.2 Add Required Variables

Copy from your local `.env.local` and paste these in Netlify:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key-here
NEXT_PUBLIC_SITE_URL=https://your-domain.netlify.app
NODE_ENV=production
```

**⚠️ IMPORTANT SECURITY NOTES**:

1. **NEVER commit `.env.local`** to Git
2. **NEVER paste keys in public docs or Slack**
3. **Keys in Netlify** are encrypted at rest
4. **Service role key** is only used in API routes (safe on server)
5. **Anon key** is public (safe in browser)

### 3.3 How to Find Your Keys

**NEXT_PUBLIC_SUPABASE_URL**:
- Go to **Supabase Dashboard**
- Click your project
- Settings → API
- Copy "Project URL"

**NEXT_PUBLIC_SUPABASE_ANON_KEY**:
- Same location
- Copy "anon public key"

**SUPABASE_SERVICE_ROLE_KEY**:
- Settings → API
- Copy "service_role key" (scroll down)

**NEXT_PUBLIC_SITE_URL**:
- After Netlify deployment completes
- Use your Netlify domain: `https://your-site.netlify.app`
- Or your custom domain once set up

---

## STEP 4: Deploy

### 4.1 Initial Deployment

After configuring build settings and environment variables:

1. Scroll down
2. Click **"Deploy site"** button
3. Netlify will start building your site

**What happens**:
- Netlify pulls code from Git
- Installs `npm install`
- Runs `npm run build` from `cms/` folder
- Uploads `.next` folder to CDN
- Creates SSL certificate automatically
- Assigns temporary domain (e.g., `xyz123.netlify.app`)

### 4.2 Monitor Build

Click **"Deploys"** tab to watch:
- Build logs in real-time
- Status: "Building" → "Published"
- Build time: ~3-5 minutes

**Build output will show**:
```
✓ 23 pages generated
✓ Images optimized
✓ Assets compressed
✓ Build successful
```

### 4.3 Access Your Site

Once published:

1. Netlify gives you a **temporary domain**:
   - Format: `https://xxxxx.netlify.app`
   - Unique for your site

2. Click the domain link to visit your site

3. Test login:
   - Go to `/login`
   - Enter admin credentials
   - Should see admin dashboard

---

## STEP 5: Connect Custom Domain (Optional)

Skip this if using `netlify.app` domain.

### 5.1 Domain Setup

1. **Site settings** → **Domain management**
2. Click **"Add domain"**
3. Enter your domain (e.g., `cms.gingerandco.at`)
4. Select **"Connect external domain"**

### 5.2 Update DNS Records

Netlify will show you what to do. Usually:

**Option A: Change Name Servers** (recommended)
- Go to your domain registrar
- Point nameservers to Netlify's nameservers
- Takes 24-48 hours to propagate

**Option B: Add CNAME Record**
- Create CNAME record in registrar pointing to Netlify
- Faster than changing nameservers

### 5.3 SSL Certificate

Netlify automatically creates free SSL certificate for your domain.

Status:
- **Pending**: Waiting for DNS propagation
- **Issued**: Ready to use (shows lock icon 🔒)

---

## STEP 6: Continuous Deployment

### 6.1 Automatic Deploys

Every time you push to Git:

```bash
git push origin claude/plan-headless-cms-OhICB
```

Netlify automatically:
1. Detects the push
2. Pulls new code
3. Runs build
4. Publishes new version
5. Sends you email with status

### 6.2 Rollback (If Something Breaks)

1. Go to **"Deploys"** tab
2. Find previous working deployment
3. Click the **three dots** menu
4. Select **"Publish"**
5. Site reverts to that version instantly

---

## STEP 7: Monitor & Logs

### 7.1 View Build Logs

1. Click **"Deploys"** tab
2. Click on a deployment
3. Scroll to see detailed logs

**Common errors**:
- **"Cannot find module"**: Missing dependency in `package.json`
- **"Build failed"**: TypeScript error or missing environment variable
- **"ENOENT"**: File not found (check file paths)

### 7.2 View Analytics

1. Click **"Analytics"** tab
2. See:
   - Page views
   - Bandwidth usage
   - Countries accessing site
   - Response times

### 7.3 View Function Logs (for API routes)

1. Click **"Functions"** tab
2. See logs for `/api/auth/logout` and other routes
3. Helps debug server-side issues

---

## STEP 8: Environment Variable Updates

If you need to change Supabase credentials or settings later:

### 8.1 Update Variables

1. **Site settings** → **Build & deploy** → **Environment**
2. Edit or add variables
3. Click **"Save"**

### 8.2 Trigger Redeploy

After updating environment variables, redeploy:

**Option A: Automatic**
1. Push any change to Git
2. Netlify automatically rebuilds with new env vars

**Option B: Manual**
1. Go to **"Deploys"** tab
2. Click **three dots** on latest deploy
3. Select **"Retry"** or **"Trigger deploy"**
4. Netlify rebuilds with new variables

---

## STEP 9: Performance Optimization

### 9.1 Enable Caching

Netlify automatically caches static assets. Cache headers are set by Next.js.

**Verify cache headers**:
- Open DevTools (F12)
- Go to **Network** tab
- Reload page
- Check **Response Headers** for `Cache-Control`

### 9.2 Enable Edge Functions (Optional)

For faster API responses, use Netlify Edge Functions:

1. Create files in `netlify/edge-functions/`
2. Deploy automatically
3. Runs at edge servers worldwide

**Example edge function for redirect**:
```typescript
// netlify/edge-functions/redirect.ts
export default async (request: Request) => {
  if (request.url.includes('/old-path')) {
    return new Response(null, {
      status: 301,
      headers: { Location: '/new-path' },
    })
  }
  return null
}
```

### 9.3 Minify & Compression

Netlify automatically:
- Minifies CSS, JS, HTML
- Compresses images
- Uses Brotli compression
- Serves optimal formats (WebP for images)

---

## STEP 10: Security & Monitoring

### 10.1 Environment Variables Security

Netlify securely stores:
- Encrypted at rest
- Masked in build logs
- Only decrypted during build
- Not shown in deploy preview links

### 10.2 Monitoring

Set up notifications:

1. **Site settings** → **Notifications**
2. Add notification for:
   - Deploy failures
   - Deploy succeeded
   - Comments on deploy

### 10.3 Branch Deploys

Deploy multiple branches for testing:

1. **Site settings** → **Build & deploy**
2. Enable **"Deploy contexts"**
3. Create preview deploys for:
   - Feature branches
   - Staging environment
   - Production (main branch)

Example:
```
main branch → production deployment
develop branch → staging deployment
feature/* → preview deployments
```

---

## Troubleshooting

### Build Fails with "Cannot find module"

**Cause**: Missing dependency

**Fix**:
```bash
npm install missing-package --save
git push origin branch-name
# Netlify rebuilds automatically
```

### Build Succeeds but Site 404s

**Cause**: Wrong publish directory

**Fix**:
1. Check **Site settings** → **Build & deploy**
2. Verify `Publish directory: cms/.next`
3. Check build output logs

### Environment Variables Not Working

**Cause**: Variables not set correctly

**Fix**:
1. Go to **Site settings** → **Build & deploy** → **Environment**
2. Verify all variables are present
3. Check for typos (case-sensitive)
4. Trigger redeploy: **Deploys** tab → **Retry**

### Login Not Working

**Cause**: Wrong Supabase URL or anon key

**Fix**:
1. Verify env variables match your Supabase project
2. Check Supabase is in same region
3. Verify `NEXT_PUBLIC_SITE_URL` matches your domain

### Slow Site Performance

**Cause**: Unoptimized images or large bundles

**Fix**:
1. Check **Analytics** → **Page Speed**
2. Optimize images in database
3. Check **Network** tab in DevTools
4. Consider enabling Edge Functions for APIs

---

## Quick Reference Commands

### Deploy Changes

```bash
# Make changes
git add .
git commit -m "Your message"
git push origin claude/plan-headless-cms-OhICB
# Netlify auto-deploys within 30 seconds
```

### View Netlify Site Locally

First deploy generates a domain like `https://xyz123.netlify.app`

### Revert to Previous Version

1. **Deploys** tab
2. Click previous working version
3. Click menu (three dots)
4. Select **"Publish"**

### Update Environment Variable

1. Site settings → Build & deploy → Environment
2. Edit variable
3. Click menu on latest deploy
4. Select **"Retry"**

---

## After Deployment Checklist

- [ ] Site loads at netlify.app domain
- [ ] Login page works (go to `/login`)
- [ ] Can login with admin credentials
- [ ] Dashboard displays with real data
- [ ] Sidebar navigation works
- [ ] Events page loads and shows list
- [ ] Create new event form works
- [ ] Registrations page shows data
- [ ] Forms page loads
- [ ] Analytics dashboard displays charts
- [ ] Settings page accessible
- [ ] Logout button works
- [ ] Protected routes redirect to login when not authenticated
- [ ] Real-time updates work (create event, see it appear)
- [ ] Mobile responsive design works

---

## DNS Configuration (If Using Custom Domain)

### Example: cms.gingerandco.at

**If using Netlify nameservers**:
```
Nameserver 1: dns1.netlify.com
Nameserver 2: dns2.netlify.com
Nameserver 3: dns3.netlify.com
Nameserver 4: dns4.netlify.com
```

**If using CNAME**:
```
CNAME: cms.gingerandco.at → xyz123.netlify.app
```

**Propagation**: 24-48 hours for nameservers, 5-30 minutes for CNAME

---

## Further Resources

- **Netlify Docs**: https://docs.netlify.com
- **Next.js on Netlify**: https://docs.netlify.com/frameworks/next-js/overview/
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Build Process**: https://nextjs.org/docs/pages/api-reference/next-config-js/output

---

## Support

If deployment fails:

1. **Check build logs**: Deploys tab → click failed deploy → scroll down
2. **Common issues**: See Troubleshooting section above
3. **GitHub issues**: Check Netlify or Next.js issues
4. **Netlify support**: netlify.com/support

---

**Congratulations!** Your CMS is now deployed to Netlify! 🚀

Every time you push code changes, Netlify automatically rebuilds and deploys within 30 seconds. Your site is now live, secure, and globally distributed on Netlify's CDN.
