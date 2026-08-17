import { useMemo, useState } from 'react'
import { Bookmark, ExternalLink, Trash2 } from 'lucide-react'

import { AppShell } from '../components/Appshell'
import { EmptyState, GuestBanner } from '../components/StateViews'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useApp } from '../hooks/useApp'
import { topicLabel } from '../lib/topics'
import { cn } from '../lib/utils'

export default function Saved() {
  const { saved, toggleSave, isGuest } = useApp()
  const [q, setQ] = useState('')
  const [platform, setPlatform] = useState('all')

  const platforms = useMemo(
    () => ['all', ...new Set(saved.map((s) => s.platform))],
    [saved]
  )

  const filtered = saved.filter((s) => {
    if (platform !== 'all' && s.platform !== platform) return false
    if (!q.trim()) return true
    return `${s.title} ${s.author ?? ''}`.toLowerCase().includes(q.trim().toLowerCase())
  })

  return (
    <AppShell>
      <div className="space-y-6">
        {isGuest ? <GuestBanner context="Guest saves live on this device only." /> : null}

        <div>
          <h1 className="flex items-center gap-2 font-display text-3xl font-bold">
            <Bookmark className="h-6 w-6 text-primary" /> Saved
          </h1>
          <p className="text-sm text-muted-foreground">{saved.length} items bookmarked.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter saved items"
            className="max-w-xs"
          />
          {platforms.map((p) => (
            <Badge
              key={p}
              variant={platform === p ? 'default' : 'outline'}
              className={cn('cursor-pointer px-3 py-1 capitalize')}
              onClick={() => setPlatform(p)}
            >
              {p}
            </Badge>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No saved items yet"
            body="Tap the bookmark icon on any card in your feed to keep it here."
          />
        ) : (
          <div className="grid gap-3">
            {filtered.map((item) => (
              <article key={item.content_id} className="surface-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                {item.image ? (
                  <img src={item.image} alt="" loading="lazy" className="h-20 w-full rounded-lg object-cover sm:w-32" />
                ) : null}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="capitalize">{item.platform}</Badge>
                    {item.category ? <span>{topicLabel(item.category)}</span> : null}
                    <span>{new Date(item.saved_at).toLocaleDateString()}</span>
                  </div>
                  <h2 className="mt-1 line-clamp-2 font-medium">{item.title}</h2>
                  {item.author ? <p className="text-xs text-muted-foreground">{item.author}</p> : null}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1 h-4 w-4" /> Open
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    aria-label="Remove from saved"
                    onClick={() =>
                      toggleSave({
                        id: item.content_id,
                        platform: item.platform,
                        title: item.title,
                        description: item.description ?? '',
                        author: item.author ?? '',
                        url: item.url,
                        image: item.image,
                        category: item.category ?? '',
                        publishedAt: item.published_at ?? item.saved_at,
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}