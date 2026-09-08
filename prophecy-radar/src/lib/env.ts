// Central place to read integration config. Never import API keys into
// client components — this file should only ever be imported from
// server-side code (API routes, server components, scripts).

export const env = {
  youtubeApiKey: process.env.YOUTUBE_API_KEY ?? null,
  tiktokApiKey: process.env.TIKTOK_API_KEY ?? null,
  facebookApiKey: process.env.FACEBOOK_API_KEY ?? null,
  aiApiKey: process.env.AI_API_KEY ?? null,
  aiProvider: process.env.AI_PROVIDER ?? 'anthropic',
  aiModel: process.env.AI_MODEL ?? 'claude-sonnet-4-6',
  databaseUrl: process.env.DATABASE_URL ?? null
};

export const integrationStatus = {
  youtube: Boolean(env.youtubeApiKey),
  tiktok: Boolean(env.tiktokApiKey),
  facebook: Boolean(env.facebookApiKey),
  ai: Boolean(env.aiApiKey),
  database: Boolean(env.databaseUrl)
};

/** True if nothing is configured yet — app should run on mock data. */
export const isDemoMode = !integrationStatus.database;
