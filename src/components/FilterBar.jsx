import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { SOURCES, TOPIC_BY_SLUG } from '@/lib/topics'

export function FilterBar({
  topics,
  activeTopic,
  onTopicChange,
  activeSources,
  onSourcesChange,
  sort,
  onSortChange,
}) {
  const toggleSource = (id) => {
    const next = activeSources.includes(id) ? activeSources.filter(s => s !== id) : [...activeSources, id]
    onSourcesChange(next.length ? next : [id])
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <FilterChip active={activeTopic === null} onClick={() => onTopicChange(null)}>All topics</FilterChip>
        {topics.map((slug) => (
          <FilterChip key={slug} active={activeTopic === slug} onClick={() => onTopicChange(slug)}>
            {TOPIC_BY_SLUG.get(slug)?.label ?? slug}
          </FilterChip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Sources</span>
        <FilterChip active={activeSources.length === SOURCES.length} onClick={() => onSourcesChange(SOURCES.map(s => s.id))}>All</FilterChip>
        {SOURCES.map((source) => (
          <FilterChip key={source.id} active={activeSources.includes(source.id)} onClick={() => toggleSource(source.id)}>
            {source.label}
          </FilterChip>
        ))}

        <div className="ml-auto flex items-center gap-1">
          <Button size="sm" variant={sort === 'relevance' ? 'secondary' : 'ghost'} onClick={() => onSortChange('relevance')}>Relevance</Button>
          <Button size="sm" variant={sort === 'newest' ? 'secondary' : 'ghost'} onClick={() => onSortChange('newest')}>Newest</Button>
        </div>
      </div>
    </div>
  )
}

function FilterChip({ active, onClick, children }) {
  return (
    <button type="button" onClick={onClick}>
      <Badge variant={active ? 'default' : 'outline'} className={cn('cursor-pointer px-3 py-1 text-xs font-medium transition-colors', !active && 'hover:border-primary/50 hover:text-primary')}>
        {children}
      </Badge>
    </button>
  )
}