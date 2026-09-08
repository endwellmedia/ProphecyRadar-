// Run with: npm run discover
// Intended to be triggered by an external scheduler (Vercel Cron,
// GitHub Actions cron, a simple crontab entry hitting this via `tsx`,
// or a curl to the deployed /api/discover route) for the morning/
// afternoon/evening scans described in the spec, since most serverless
// hosts don't keep long-running background workers alive by themselves.
import { runDiscovery } from '../services/discovery';

runDiscovery()
  .then((summary) => {
    console.log('Discovery run complete:', summary);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Discovery run failed:', err);
    process.exit(1);
  });
