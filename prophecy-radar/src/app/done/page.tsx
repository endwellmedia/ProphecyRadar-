import { PageHeader } from '@/components/page-header';
import { ContentFeed } from '@/components/content-feed';

export default function DonePage() {
  return (
    <div>
      <PageHeader title="Done" subtitle="Your history — content you've already reacted to. Nothing here is ever deleted." />
      <ContentFeed status="DONE" emptyTitle="No completed reactions yet" emptyBody="Videos you mark Done will show up here permanently, so they're never suggested again." />
    </div>
  );
}
