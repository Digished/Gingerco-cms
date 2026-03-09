# Platform Walkthrough — Ginger & Co CMS

This document explains how to use the platform day-to-day, from logging in to sending a newsletter campaign.

---

## 1. Accessing the Admin

The admin panel is at `/admin` on the CMS deployment (e.g. `https://cms.gingerandco.at/admin`).

Log in with your admin credentials. If this is the first time, Payload prompts you to create an admin account automatically on first startup.

---

## 2. Managing Pages

Pages are the main content type. Each page is assembled from **blocks** — reusable sections you add, reorder, and configure.

### Creating a page

1. Go to **Content → Pages** in the left sidebar
2. Click **Create New**
3. Set the **Title** and **Slug** (the URL path, e.g. `about` → `gingerandco.at/about`)
4. Set **Status** to `Draft` while working, `Published` when ready
5. In the **Layout** field, click **Add Block** and choose from the available block types

### Available blocks

| Block | When to use |
|-------|------------|
| **Hero** | Top of a page — large image, heading, subheading, and optional CTA buttons |
| **Content** | Body text, full-width or two-column layout, optionally with a side image |
| **Events List** | Auto-displays upcoming published events |
| **Blog List** | Auto-displays recent blog posts |
| **Gallery** | Grid of images from your Media library |
| **Call to Action** | Bold section with a headline and one or two buttons |
| **FAQ** | Expandable question-and-answer accordion |
| **Team Block** | Cards for each team member |
| **Testimonials** | Customer quote cards |
| **Partner Section** | Logo grid for sponsors/partners |
| **About Section** | Image + text layout for an about/mission section |
| **Showcase Section** | Feature highlight layout |
| **Split Content** | Two-column content layout |
| **Bullet List** | Styled list of items |
| **Countdown Timer** | Live countdown to a date |
| **Newsletter Block** | Email signup form (see section 6) |
| **Inline Form** | Embeds one of your custom forms (see section 5) |
| **Coming Soon** | Placeholder section |
| **Popup Modal** | Overlay that triggers on a button click |

### Drafts and publishing

Pages use **autosave**. Changes are saved as a draft automatically. Use the **Publish** button in the top-right to make a page live. You can revert to any previous version from the **Versions** tab.

---

## 3. Managing Events

Events are fitness classes, workshops, and performances.

### Creating an event

1. Go to **Content → Events**
2. Click **Create New**
3. Fill in **Title**, **Slug**, **Date**, **Location**, and **Status**
4. Add a description and cover image
5. Use the **Layout** blocks field to build out the event page content
6. Set status to **Published** to make it appear on the site

### Event statuses

| Status | Meaning |
|--------|---------|
| Draft | Not visible on the site |
| Published | Visible and accepting registrations |
| Cancelled | Visible but marked as cancelled |
| Completed | Visible as a past event |

Events with a **Form** block attached will collect registrations directly (see section 5).

---

## 4. Managing Blog Posts

1. Go to **Content → Blog Posts**
2. Create a new post with title, slug, cover image, author, and rich text body
3. Publish when ready

Blog posts appear on pages that have a **Blog List** block.

---

## 5. Forms and Registration

### Creating a form

1. Go to **Forms → Forms**
2. Click **Create New**
3. Add fields (text, email, select, checkbox, etc.) by dragging them in
4. Add **Consent Sections** for GDPR/waiver declarations if needed
5. Add an **Arrival Notice** (optional warning shown at the top of the form)
6. Configure confirmation email settings if desired
7. Save the form

### Embedding a form on a page or event

1. Edit the page or event
2. Add an **Inline Form** block
3. Select the form you created
4. Save and publish

### Viewing submissions

Go to **Forms → Form Submissions**. Each submission shows all field values. You can filter by form.

---

## 6. Newsletter Subscriptions

### Adding a signup form to a page

1. Edit any page
2. Add a **Newsletter Block**
3. Configure:
   - **Heading** — e.g. "Stay in the loop"
   - **Description** — short text below the heading
   - **Collect First/Last Name** — toggle on if you want name fields
   - **Submit Button Label** — e.g. "Subscribe"
   - **Success Message** — shown after submission
   - **Source** — internal label for tracking (e.g. `homepage-footer`)
   - **Tags** — comma-separated tags added to subscribers from this form
   - **Background Color** / **Alignment**
4. Save and publish

### What happens when someone signs up

1. Visitor enters their email and clicks Subscribe
2. The form posts to `/api/subscribe`
3. A **confirmation email** is sent with a "Confirm My Subscription" button
4. When they click that button, their status changes to **Subscribed** and they receive a **welcome email**
5. The subscriber appears in **Email → Subscribers** with status `subscribed`

### Managing subscribers

Go to **Email → Subscribers**. You can see each subscriber's status, source, tags, and subscription date. Do not manually change `confirmationToken` or `unsubscribeToken`.

| Status | Meaning |
|--------|---------|
| `pending` | Signed up but not yet confirmed |
| `subscribed` | Confirmed, active subscriber |
| `unsubscribed` | Opted out |

---

## 7. Email Campaigns

### Creating a campaign

1. Go to **Email → Email Campaigns**
2. Click **Create New**
3. Fill in:
   - **Subject** — email subject line
   - **HTML Body** — the email content (write HTML or paste from a template)
   - **Recipient Filter** — who receives it (`all`, `subscribed`, or filter by tag)
   - **Scheduled For** — optional future send time
4. Save (status will be `draft`)

### Sending a campaign

**Send immediately:** Click the **Send Campaign** button at the top of the edit view. The campaign is dispatched to all matching subscribers right away.

**Schedule:** Set the **Scheduled For** date/time and save. A Vercel cron job checks for campaigns ready to send and dispatches them automatically.

### Campaign statuses

| Status | Meaning |
|--------|---------|
| `draft` | Not yet sent |
| `scheduled` | Will send at `scheduledFor` time |
| `sending` | Currently being dispatched |
| `sent` | Completed — check `totalSent` |
| `failed` | Send encountered an error |

---

## 8. Media Library

### Uploading images

1. Go to **Media**
2. Drag and drop images or click **Create New**
3. Add an **Alt Text** for accessibility

Uploads go to Vercel Blob. Payload automatically generates `thumbnail`, `card`, and `hero` size variants.

### Using images

In any block or field with an image picker, click the image field and select from your media library or upload a new file.

---

## 9. Team Members and Partners

### Team Members

1. Go to **Content → Team Members**
2. Create a profile with name, role, bio, and photo
3. The **Team Block** on pages will display all active team members

### Partners

1. Go to **Content → Partners**
2. Add a partner with name, logo, and optional website URL
3. The **Partner Section** block displays partner logos in a grid

---

## 10. Site-wide Settings

### Header

Go to **Globals → Header** to update the logo and navigation links.

### Footer

Go to **Globals → Footer** to update footer columns, social links, and copyright text.

### Site Settings

Go to **Globals → Site Settings** to update:
- Site name
- Contact email and phone
- Default SEO title and description
- Analytics ID (Google Analytics or similar)

---

## 11. User Management

Go to **Users** to add or remove admin users. Each user needs an email and password. There is no public registration — only users created here can access the admin panel.

---

## 12. Deployment and Environment

The CMS is deployed on Vercel. To trigger a new deployment, push to the `main` branch (or the configured production branch).

### Critical environment variables

| Variable | What it affects |
|----------|----------------|
| `NEXT_PUBLIC_CMS_URL` | The URL inside confirmation and unsubscribe email links. Must point to the CMS deployment. |
| `NEXT_PUBLIC_SERVER_URL` | "Explore Our Events" links in emails. Points to the public website. |
| `RESEND_API_KEY` | All outgoing email. If missing, no emails are sent. |

If subscribers report that clicking "Confirm My Subscription" shows a 404 or "Route not found", the most likely cause is `NEXT_PUBLIC_CMS_URL` pointing to the wrong URL. Set it to the stable Vercel project URL (e.g. `https://cms.gingerandco.at`), not a per-deployment preview URL.

---

*Last updated: 2026-03-08*
