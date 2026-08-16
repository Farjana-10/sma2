import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search as SearchIcon } from 'lucide-react'

import { AppShell } from '@/components/AppShell'
import { FeedCard } from '@/components/FeedCard'
import { FilterBar } from '@/components/FilterBar'
import { EmptyState, ErrorMessage, LoadingSpinner } from '@/components/StateViews'
import { api } from '@/lib/api'

export default function Search() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const [sources, setSources] = useState(['reddit', 'youtube', 'news'])
  const [sort, setSort] = useState('relevance')

  const query = useQuery({
    enabled: q.length >= 2,
    queryKey: ['search', q, sources.join(',')],
    staleTime: 2 * 60 * 1000,
    queryFn: async () => {
      const response = await api.search.query(q, sources)
      return response.json()
    },
  })

  const items = useMemo(() => {
    const list = query.data?.items ?? []
    if (sort === 'newest') return list
    return [...list].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
  }, [query.data, sort])

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="flex items-center gap-2 font-display text-3xl font-bold">
            <SearchIcon className="h-6 w-6 text-primary" />
            {q ? `Results for “${q}”` : 'Search'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {q ? 'Matching posts, videos and articles.' : 'Use the search box in the header to begin.'}
          </p>
        </div>

        {q ? (
          <FilterBar
            topics={[]}
            activeTopic={null}
            onTopicChange={() => {}}
            activeSources={sources}
            onSourcesChange={setSources}
            sort={sort}
            onSortChange={setSort}
          />
        ) : null}

        {query.isLoading ? <LoadingSpinner label="Searching…" /> : null}
        {query.isError ? (
          <ErrorMessage message="Search failed. Please try again." onRetry={() => query.refetch()} />
        ) : null}
        {q && query.data && items.length === 0 ? (
          <EmptyState title="No results found" body="Try a different keyword or enable more sources." />
        ) : null}
        {items.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <FeedCard key={item.id} item={item} />
            ))}
          </div>
        ) : null}
      </div>
    </AppShell>
  )
}