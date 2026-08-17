import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Flame, Hash, TrendingUp } from 'lucide-react'

import { AppShell } from '../components/AppShell'
import { FeedCard } from '../components/FeedCard'
import { ErrorMessage, LoadingSpinner } from '../components/StateViews'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { api } from '../lib/api'
import { TOPICS } from '../lib/topics'
import { useApp } from '../hooks/useApp'

export default function Explore() {
  const { prefs, savePrefs } = useApp()
  const navigate = useNavigate()
  const query = useQuery({
    queryKey: ['explore', prefs.interests.join(',')],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const response = await api.feed.explore(prefs.interests.slice(0, 6))
      return response.json()
    },
  })

  const following = new Set(prefs.interests)

  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Explore</h1>
          <p className="text-sm text-muted-foreground">Trending right now across every source.</p>
        </div>

        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide uppercase text-muted-foreground">
            <Hash className="h-4 w-4" /> Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((t) => (
              <Button
                key={t.slug}
                size="sm"
                variant={following.has(t.slug) ? 'default' : 'outline'}
                onClick={() =>
                  savePrefs({
                    interests: following.has(t.slug)
                      ? prefs.interests.filter((i) => i !== t.slug)
                      : [...prefs.interests, t.slug],
                  })
                }
              >
                {t.label}
              </Button>
            ))}
          </div>
        </section>

        {query.data?.popular_sources?.length ? (
          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide uppercase text-muted-foreground">
              <TrendingUp className="h-4 w-4" /> Most active sources
            </h2>
            <div className="flex flex-wrap gap-2">
              {query.data.popular_sources.map((s) => (
                <Badge
                  key={s.label}
                  variant="secondary"
                  className="cursor-pointer px-3 py-1.5"
                  onClick={() => navigate(`/search?q=${s.label.replace(/^r\//, '')}`)}
                >
                  {s.label} · {s.total}
                </Badge>
              ))}
            </div>
          </section>
        ) : null}

        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide uppercase text-muted-foreground">
            <Flame className="h-4 w-4" /> Trending content
          </h2>
          {query.isLoading ? <LoadingSpinner label="Finding what's trending…" /> : null}
          {query.isError ? (
            <ErrorMessage message="Trending content is unavailable right now." onRetry={() => query.refetch()} />
          ) : null}
          {query.data?.trending ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {query.data.trending.map((item) => (
                <FeedCard key={item.id} item={item} />
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </AppShell>
  )
}