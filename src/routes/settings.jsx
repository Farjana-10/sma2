import { useState } from 'react'
import { toast } from 'sonner'

import { AppShell } from '../components/AppShell'
import { InterestSelector } from '../components/InterestSelector'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Switch } from '../components/ui/switch'
import { useApp } from '../hooks/useApp'
import { SOURCES, TIME_LIMIT_OPTIONS, formatMinutes } from '../lib/topics'
import { cn } from '../lib/utils'

export default function Settings() {
  const { prefs, savePrefs, resetRecommendations, timerPaused, setTimerPaused } = useApp()
  const [limit, setLimit] = useState(prefs.dailyLimit)
  const [custom, setCustom] = useState('')
  const [topics, setTopics] = useState(prefs.interests)
  const [busy, setBusy] = useState(false)

  const save = async () => {
    setBusy(true)
    const value = custom ? Math.min(600, Math.max(5, Number(custom))) : limit
    await savePrefs({ dailyLimit: value, interests: topics })
    setBusy(false)
    toast.success('Settings saved')
  }

  const toggleSource = (id) => {
    const next = prefs.sources.includes(id)
      ? prefs.sources.filter((s) => s !== id)
      : [...prefs.sources, id]
    savePrefs({ sources: next.length ? next : [id] })
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">Personalization, screen time and appearance.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Daily time limit</CardTitle>
            <CardDescription>Currently {formatMinutes(prefs.dailyLimit)} per day.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {TIME_LIMIT_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => { setLimit(option); setCustom('') }}
                className={cn(
                  'rounded-xl border p-3 text-sm font-medium transition-colors',
                  limit === option && !custom
                    ? 'border-primary bg-primary/8 text-primary'
                    : 'border-border hover:border-primary/40'
                )}
              >
                {formatMinutes(option)}
              </button>
            ))}
            <Input
              value={custom}
              onChange={(e) => setCustom(e.target.value.replace(/\D/g, '').slice(0, 3))}
              placeholder="Custom minutes"
              inputMode="numeric"
              className="col-span-2 sm:col-span-3"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Interests</CardTitle>
            <CardDescription>Your feed is ranked from these topics.</CardDescription>
          </CardHeader>
          <CardContent>
            <InterestSelector selected={topics} onChange={setTopics} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sources & behaviour</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {SOURCES.map((s) => (
                <Button
                  key={s.id}
                  size="sm"
                  variant={prefs.sources.includes(s.id) ? 'default' : 'outline'}
                  onClick={() => toggleSource(s.id)}
                >
                  {s.label}
                </Button>
              ))}
            </div>

            <ToggleRow
              label="Dark mode"
              description="Switch the interface theme."
              checked={prefs.theme === 'dark'}
              onChange={(checked) => savePrefs({ theme: checked ? 'dark' : 'light' })}
            />
            <ToggleRow
              label="Usage notifications"
              description="Warn me as I approach my daily limit."
              checked={prefs.notificationsEnabled}
              onChange={(checked) => savePrefs({ notificationsEnabled: checked })}
            />
            <ToggleRow
              label="Pause timer"
              description="Temporarily stop counting time."
              checked={timerPaused}
              onChange={setTimerPaused}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recommendations</CardTitle>
            <CardDescription>Clear hidden items and start ranking from scratch.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={resetRecommendations}>
              Reset recommendations
            </Button>
          </CardContent>
        </Card>

        <Button className="w-full" onClick={save} disabled={busy}>
          {busy ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </AppShell>
  )
}

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border p-3">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}