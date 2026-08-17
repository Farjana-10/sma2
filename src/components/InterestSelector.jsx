import { useMemo, useState } from 'react'
import { Check, Search } from 'lucide-react'

import { Input } from '../components/ui/input'
import { cn } from '../lib/utils'
import { TOPICS } from '../lib/topics'

export function InterestSelector({ selected, onChange }) {
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return TOPICS
    return TOPICS.filter(t => t.label.toLowerCase().includes(q) || t.keywords.some(k => k.toLowerCase().includes(q)))
  }, [query])

  const toggle = (slug) => onChange(selected.includes(slug) ? selected.filter(s => s !== slug) : [...selected, slug])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search interests" className="pl-9" />
        </div>
        <div className="flex gap-2">
          <button type="button" className="text-sm text-muted-foreground hover:text-primary" onClick={() => onChange(TOPICS.map(t => t.slug))}>Select all</button>
          <button type="button" className="text-sm text-muted-foreground hover:text-primary" onClick={() => onChange([])}>Clear all</button>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((topic) => {
          const active = selected.includes(topic.slug)
          return (
            <button
              key={topic.slug}
              type="button"
              onClick={() => toggle(topic.slug)}
              className={cn(
                'flex items-start gap-3 rounded-xl border p-3 text-left transition-colors',
                active ? 'border-primary bg-primary/8 text-foreground' : 'border-border bg-card hover:border-primary/40'
              )}
            >
              <span className={cn('mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border', active ? 'border-primary bg-primary text-primary-foreground' : 'border-border')}>
                {active ? <Check className="h-3.5 w-3.5" /> : null}
              </span>
              <span>
                <span className="block text-sm font-semibold">{topic.label}</span>
                <span className="block text-xs text-muted-foreground">{topic.blurb}</span>
              </span>
            </button>
          )
        })}
      </div>
      {visible.length === 0 ? <p className="text-sm text-muted-foreground">No interests match "{query}".</p> : null}
      <p className="text-xs text-muted-foreground">{selected.length} topics selected</p>
    </div>
  )
}