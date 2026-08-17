import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'

import { AppShell } from '../components/AppShell'
import { FeedCard } from '../components/FeedCard'
import { FilterBar } from '../components/FilterBar'
import { EmptyState, ErrorMessage, GuestBanner, LoadingSpinner } from '../components/StateViews'
import { Button } from '../components/ui/button'
import { useApp } from '../hooks/useApp'
import { useFeedQuery } from '../hooks/useFeedQuery'

export default function Feed() {
  const { prefs, isGuest } = useApp()
  const [topic, setTopic] = useState(null)
  const [sources, setSources] = useState(['reddit', 'youtube', 'news'])
  const [sort, setSort] = useState('relevance')

  const query = useFeedQuery({ topic, sources, sort })

  return (
    <AppShell>
      <div className="space-y-6">
        {isGuest ? <GuestBanner context="You're browsing as a guest — login to keep your feed and saved posts." /> : null}

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold">Your feed</h1>
            <p className="text-sm text-muted-foreground">
              {prefs.interests.length
                ? `Ranked from ${prefs.interests.length} topics you follow.`
                : 'Using default topics — add interests to personalize.'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => query.refetch()}>
              <RefreshCw className="mr-1.5 h-4 w-4" /> Refresh
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link to="/settings">Edit interests</Link>
            </Button>
          </div>
        </div>

        <FilterBar
          topics={prefs.interests}
          activeTopic={topic}
          onTopicChange={setTopic}
          activeSources={sources}
          onSourcesChange={setSources}
          sort={sort}
          onSortChange={setSort}
        />

        {query.isLoading ? <LoadingSpinner /> : null}
        {query.isError ? (
          <ErrorMessage message="We couldn't load your feed. Please try again." onRetry={() => query.refetch()} />
        ) : null}
        {query.data && query.data.items?.length === 0 ? (
          <EmptyState title="Nothing matched those filters" body="Try enabling more sources or removing the topic filter." />
        ) : null}

        {query.data && query.data.items?.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {query.data.items.map((item) => (
              <FeedCard key={item.id} item={item} />
            ))}
          </div>
        ) : null}
      </div>
    </AppShell>
  )
}