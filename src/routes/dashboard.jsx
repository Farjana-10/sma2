import { Link } from 'react-router-dom'
import { Activity, Bookmark, Clock, Heart, Eye, Search } from 'lucide-react'

import { AppShell } from '../components/AppShell'
import { GuestBanner } from '../components/StateViews'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Progress } from '../components/ui/progress'
import { useApp } from '../hooks/useApp'
import { formatDuration, formatMinutes, topicLabel } from '../lib/topics'

export default function Dashboard() {
  const { prefs, secondsUsed, extraSeconds, saved, activity, likedIds, usageHistory, searches, isGuest } = useApp()

  const limitSeconds = prefs.dailyLimit * 60
  const pct = Math.min(100, (secondsUsed / limitSeconds) * 100)
  const views = activity.filter((a) => a.activity_type === 'view').length

  const topicCounts = activity.reduce((acc, a) => {
    if (!a.category) return acc
    acc[a.category] = (acc[a.category] ?? 0) + 1
    return acc
  }, {})
  const topTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
  const maxTopic = topTopics[0]?.[1] ?? 1

  const week = usageHistory.slice(0, 7).reverse()
  const maxDay = Math.max(1, ...week.map((d) => d.seconds_used))

  return (
    <AppShell>
      <div className="space-y-6">
        {isGuest ? <GuestBanner context="Login to keep your stats across devices." /> : null}

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Your reading habits at a glance.</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/settings">Settings</Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={Clock} label="Time today" value={formatDuration(secondsUsed)} sub={`of ${formatMinutes(prefs.dailyLimit)}`} />
          <Stat icon={Eye} label="Items viewed" value={String(views)} sub="all time" />
          <Stat icon={Bookmark} label="Saved" value={String(saved.length)} sub="bookmarks" />
          <Stat icon={Heart} label="Liked" value={String(likedIds.size)} sub="reactions" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Today's usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Progress value={pct} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {formatDuration(secondsUsed)} used · {formatDuration(Math.max(0, limitSeconds - secondsUsed))} remaining
              {extraSeconds > 0 ? ` · ${formatDuration(extraSeconds)} over limit` : ''}
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Last 7 days</CardTitle>
            </CardHeader>
            <CardContent>
              {week.length === 0 ? (
                <p className="text-sm text-muted-foreground">No history yet.</p>
              ) : (
                <div className="flex h-40 items-end gap-2">
                  {week.map((d) => (
                    <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-md bg-primary/80"
                        style={{ height: `${Math.max(4, (d.seconds_used / maxDay) * 130)}px` }}
                        title={`${formatDuration(d.seconds_used)}`}
                      />
                      <span className="text-[10px] text-muted-foreground">{d.day.slice(5)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top topics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topTopics.length === 0 ? (
                <p className="text-sm text-muted-foreground">Read a few items to see your topic mix.</p>
              ) : (
                topTopics.map(([slug, total]) => (
                  <div key={slug} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{topicLabel(slug)}</span>
                      <span className="text-muted-foreground">{total}</span>
                    </div>
                    <Progress value={(total / maxTopic) * 100} className="h-1.5" />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-4 w-4" /> Recent activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {activity.slice(0, 8).length === 0 ? (
                <p className="text-sm text-muted-foreground">Nothing yet.</p>
              ) : (
                activity.slice(0, 8).map((a, i) => (
                  <div key={a.id ?? `${a.created_at}-${i}`} className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="capitalize">{a.activity_type}</Badge>
                    <span className="line-clamp-1 flex-1">{a.title ?? '—'}</span>
                    <span className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Search className="h-4 w-4" /> Recent searches
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {searches.length === 0 ? (
                <p className="text-sm text-muted-foreground">No searches yet.</p>
              ) : (
                searches.slice(0, 10).map((s) => (
                  <Link key={s} to={`/search?q=${s}`}>
                    <Badge variant="secondary" className="cursor-pointer px-3 py-1">{s}</Badge>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}

function Stat({ icon: Icon, label, value, sub }) {
  return (
    <div className="surface-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</span>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  )
}