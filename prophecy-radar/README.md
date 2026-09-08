# Prophecy Radar

A discovery and research tool for producing reaction/commentary videos about
Nigeria-related prophecy content on YouTube, TikTok, and Facebook.

> Prophecy Radar is a **content discovery tool**, not a prophecy-truth
> verification system. It never claims a prediction is true, false, or
> fulfilled — it surfaces content and attributes every claim to its speaker.

---

## 1. What's implemented in this MVP

| Feature | Status |
|---|---|
| Dashboard / "Today" page with stats + best discoveries | ✅ |
| Categories (built-in 12 + custom category creation) | ✅ |
| YouTube discovery (YouTube Data API v3) | ✅ real integration |
| TikTok discovery (TikTok Research API) | ✅ real integration, gated behind TikTok's approval process |
| Facebook discovery (Graph API, per followed Page) | ✅ real integration, keyword-search not offered by FB's API — see below |
| Deduplication (ID → URL → fuzzy title match) | ✅ |
| NEW / REVIEWED / DONE / IGNORED status (never deletes) | ✅ |
| AI relevance scoring + extraction | ✅ (Anthropic API) |
| AI title generator | ✅ |
| AI thumbnail caption generator + Viral Package | ✅ |
| Search & filters | ✅ |
| Followed Prophets | ✅ |
| Notes per content item | ✅ |
| Mobile-first responsive UI, dark theme | ✅ |
| Demo mode (runs without any keys/DB) | ✅ |
| In-app editable Settings (scan frequency, min relevance, results/category) | ✅ |
| Morning briefing (data + real email delivery via Resend) | ✅ |
| Scheduled background scans + daily briefing (Vercel Cron) | ✅ config included, see `vercel.json` |

**Why some things are "ready but not wired":** TikTok's keyword-search API
(Research API) requires an approved application from TikTok — the connector
is written against its real request/response shape and activates the moment
you have credentials. Facebook's Graph API does not offer open keyword
search across public posts for third-party apps (removed platform-wide for
privacy reasons); the realistic, ToS-compliant path is pulling from Pages
you've added under **Followed Prophets**, which this connector does.

---

## 2. Project structure

```
src/
  app/                    # Next.js pages (App Router) + API routes
  components/             # UI components
  connectors/              # /connectors/youtube, /tiktok, /facebook
  services/                # discovery, deduplication, scoring, ai-analysis,
                            # title-generator, thumbnail-generator, notifications
  lib/                     # prisma client, types, env config, mock data, ai client
  scripts/                 # run-discovery.ts (for cron)
prisma/
  schema.prisma            # full DB schema (users, categories, sources,
                            # content_items, user_content_status, generated_ideas,
                            # followed_prophets, app_settings)
  seed.ts                  # seeds default categories + a default user
```

---

## 3. Running it locally

```bash
npm install
cp .env.example .env      # then fill in what you have — see below
```

**You can run the app right now with zero configuration.** With no
`DATABASE_URL` set, it runs in demo mode against realistic sample data so
you can click through every page and feature immediately:

```bash
npm run dev
```

Open http://localhost:3000.

### To go live with real data

1. **Database** — spin up a free Postgres instance (e.g. [Neon](https://neon.tech),
   [Supabase](https://supabase.com), or Railway), and set `DATABASE_URL` in `.env`.
   Then:
   ```bash
   npm run db:push     # creates tables from prisma/schema.prisma
   npm run db:seed      # seeds the 12 default categories + default user
   ```
2. **YouTube** — create a project in [Google Cloud Console](https://console.cloud.google.com/),
   enable the "YouTube Data API v3", create an API key, set `YOUTUBE_API_KEY`.
3. **TikTok** — apply for the [TikTok Research API](https://developers.tiktok.com/products/research-api/),
   set `TIKTOK_API_KEY` once approved.
4. **Facebook** — create a Meta app, generate a Page access token for the
   Pages you want to follow, set `FACEBOOK_API_KEY`.
5. **AI** — get an API key from [console.anthropic.com](https://console.anthropic.com),
   set `AI_API_KEY`.

Restart the dev server after changing `.env`. The Settings page shows you
exactly which integrations are connected.

---

## 4. Deploying

The app is a standard Next.js app — deploy to **Vercel** (recommended),
Railway, or Render:

1. Push this repo to GitHub.
2. Import it into Vercel.
3. Add the same environment variables from `.env` in the Vercel project settings.
4. Vercel will run `npm run build` (which runs `prisma generate` via `postinstall`).
5. After the first deploy, run `npm run db:push && npm run db:seed` once
   (locally, pointed at your production `DATABASE_URL`, or via a one-off
   Vercel deploy hook / `vercel exec`).

---

## 5. Scheduling discovery scans & the morning briefing

Serverless hosting doesn't keep a background worker alive, so scans are
triggered externally. A `vercel.json` is included with:

```json
{
  "crons": [
    { "path": "/api/cron/morning-briefing", "schedule": "0 6 * * *" },
    { "path": "/api/discover", "schedule": "0 13,19 * * *" }
  ]
}
```

- **6am** — `/api/cron/morning-briefing` runs a discovery pass, then emails
  a summary via Resend *only if* both "Daily morning briefing" and "Email
  delivery" are switched on in Settings.
- **1pm / 7pm** — `/api/discover` runs an extra discovery-only pass (no email).

Set `CRON_SECRET` in your environment and Vercel Cron will authenticate
automatically; the route rejects any other caller. On other hosts, hit the
same paths with any external cron service (GitHub Actions, cron-job.org).

The dashboard also triggers a scan automatically every time it's opened
(client-side, fire-and-forget), so you'll never open the app to nothing new
even between scheduled runs.

To wire the morning briefing email, set in your environment:
```
RESEND_API_KEY=...
BRIEFING_EMAIL_TO=[email protected]
```
Then turn on both toggles under **Settings → Notifications**.

---

## 6. Key design decisions worth knowing about

- **Deduplication** (`services/deduplication.ts`) checks, in order: exact
  platform content ID → normalized URL (strips tracking params) → same
  creator + fuzzy title match within a 48h window. Matches update the
  existing row's metadata (views, description) instead of inserting a
  duplicate.
- **Marking something DONE never deletes it** — it's a status flip. History
  lives forever in the `Done` tab and is what prevents the same video from
  ever being recommended as "new" again.
- **The AI never invents.** Every AI call in `lib/ai/prompts.ts` shares one
  base system prompt that forbids fabricating quotes, people, dates, or
  claims of fulfillment, and requires neutral attribution ("claims",
  "predicts", "according to the speaker").
- **Relevance is AI-judged, not keyword-matched** — a video that only
  namedrops "Nigeria" without an actual prophecy/prediction should score
  low and won't be padded into results; the app does not fabricate a sixth
  result if only five genuinely relevant ones exist.

---

## 7. What I'd build next (see spec §32)

Automatic transcript extraction → richer AI analysis, AI script drafts for
the reaction video itself, thumbnail *image* generation (this MVP only
generates caption text), a trending-prophets dashboard, and wiring the
morning briefing to actual email/push delivery.
