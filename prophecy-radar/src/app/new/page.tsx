import { PageHeader } from '@/components/page-header';
import { ContentFeed } from '@/components/content-feed';

export default function NewDiscoveriesPage() {
  return (
    <div>
      <PageHeader title="New Discoveries" subtitle="Fresh content that hasn't been reviewed yet." />
      <ContentFeed status="NEW" emptyTitle="You're caught up" emptyBody="No new discoveries right now — check back after the next scan." />
    </div>
  );
}
