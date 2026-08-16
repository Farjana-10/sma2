import { useState } from 'react'
import { Bookmark, BookmarkCheck, Heart, Play, ArrowUpRight, EyeOff, Link2, Share2, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useApp } from '@/hooks/useApp'
import { topicLabel } from '@/lib/topics'

const PLATFORM_STYLES = {
  reddit: { label: 'Reddit', className: 'bg-reddit/10 text-reddit border-reddit/30' },
  youtube: { label: 'YouTube', className: 'bg-youtube/10 text-youtube border-youtube/30' },
  news: { label: 'News', className: 'bg-news/10 text-news border-news/30' },
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

function compact(n) {
  return Intl.NumberFormat('en', { notation: 'compact' }).format(n)
}

export function FeedCard({ item }) {
  const { savedIds, likedIds, toggleSave, toggleLike, registerView, markNotInterested } = useApp()
  const [broken, setBroken] = useState(false)
  const platform = PLATFORM_STYLES[item.platform] ?? { label: item.platform, className: 'bg-muted text-muted-foreground border-border' }
  const isSaved = savedIds.has(item.id)
  const isLiked = likedIds.has(item.id)

  const open = () => {
    registerView(item)
    window.open(item.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <article className="surface-card hover-lift group flex flex-col overflow-hidden">
      {item.image && !broken ? (
        <button type="button" onClick={open} className="relative block aspect-video w-full overflow-hidden">
          <img
            src={item.image}
            alt=""
            loading="lazy"
            onError={() => setBroken(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          {item.platform === 'youtube' ? (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-background/85 shadow">
                <Play className="h-5 w-5 fill-current text-youtube" />
              </span>
            </span>
          ) : null}
        </button>
      ) : null}

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge variant="outline" className={cn('font-medium', platform.className)}>{platform.label}</Badge>
          <Badge variant="secondary">{topicLabel(item.category)}</Badge>
          <span className="text-muted-foreground">{timeAgo(item.publishedAt)}</span>
        </div>

        <button type="button" onClick={open} className="text-left">
          <h3 className="font-display text-base leading-snug font-semibold group-hover:text-primary">{item.title}</h3>
        </button>

        {item.description ? (
          <p className="line-clamp-3 text-sm text-muted-foreground">{item.description}</p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-secondary-foreground">
              {(item.authorLabel ?? item.author).charAt(0).toUpperCase()}
            </span>
            {item.authorLabel ?? item.author}
          </span>
          {item.score != null ? <span>▲ {compact(item.score)}</span> : null}
          {item.comments != null ? <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {compact(item.comments)}</span> : null}
          {item.views != null ? <span>{compact(item.views)} views</span> : null}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-1 border-t border-border pt-3">
          <Button variant="ghost" size="sm" onClick={() => toggleLike(item)} className={cn(isLiked && 'text-destructive')}>
            <Heart className={cn('mr-1 h-4 w-4', isLiked && 'fill-current')} /> Like
          </Button>
          <Button variant="ghost" size="sm" onClick={() => toggleSave(item)} className={cn(isSaved && 'text-primary')}>
            {isSaved ? <BookmarkCheck className="mr-1 h-4 w-4" /> : <Bookmark className="mr-1 h-4 w-4" />}
            {isSaved ? 'Saved' : 'Save'}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { navigator.share?.({ title: item.title, url: item.url }).catch(() => {}) }}>
            <Share2 className="mr-1 h-4 w-4" /> Share
          </Button>
          <Button variant="ghost" size="sm" onClick={open} className="ml-auto text-primary">
            Open <ArrowUpRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <button type="button" className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => markNotInterested(item)}>
            <EyeOff className="h-3.5 w-3.5" /> Not interested
          </button>
          <button type="button" className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => { navigator.clipboard.writeText(item.url); toast('Link copied') }}>
            <Link2 className="h-3.5 w-3.5" /> Copy link
          </button>
        </div>
      </div>
    </article>
  )
}