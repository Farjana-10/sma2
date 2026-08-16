import { Link } from 'react-router-dom'
import { Bookmark, Clock, Heart, Mail, User } from 'lucide-react'

import { AppShell } from '@/components/AppShell'
import { GuestBanner } from '@/components/StateViews'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useApp } from '@/hooks/useApp'
import { formatDuration, formatMinutes, topicLabel } from '@/lib/topics'

export default function Profile() {
  const { userName, email, avatarUrl, memberSince, prefs, saved, likedIds, activity, secondsUsed, isGuest } = useApp()

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        {isGuest ? <GuestBanner context="You're browsing as a guest. Create an account to keep this profile." /> : null}

        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="h-20 w-20 rounded-full object-cover" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-8 w-8" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold">{userName}</h1>
              {email ? (
                <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
                  <Mail className="h-3.5 w-3.5" /> {email}
                </p>
              ) : null}
              {memberSince ? (
                <p className="text-xs text-muted-foreground">Member since {new Date(memberSince).toLocaleDateString()}</p>
              ) : null}
            </div>
            <Button asChild variant="outline">
              <Link to="/settings">Edit settings</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3">
          <Stat icon={Clock} label="Time today" value={formatDuration(secondsUsed)} />
          <Stat icon={Bookmark} label="Saved" value={String(saved.length)} />
          <Stat icon={Heart} label="Liked" value={String(likedIds.size)} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Interests</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {prefs.interests.length === 0 ? (
              <p className="text-sm text-muted-foreground">No interests yet — add some in settings.</p>
            ) : (
              prefs.interests.map((t) => (
                <Badge key={t} variant="secondary" className="px-3 py-1">{topicLabel(t)}</Badge>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Daily limit" value={formatMinutes(prefs.dailyLimit)} />
            <Row label="Theme" value={prefs.theme === 'dark' ? 'Dark' : 'Light'} />
            <Row label="Notifications" value={prefs.notificationsEnabled ? 'On' : 'Off'} />
            <Row label="Activity events" value={String(activity.length)} />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="surface-card p-4">
      <Icon className="h-4 w-4 text-primary" />
      <p className="mt-2 font-display text-xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}