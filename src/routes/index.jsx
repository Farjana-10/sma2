import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Clock, Layers, Sparkles, ShieldCheck } from 'lucide-react'
import { useState } from 'react'

import { AppShell } from '../components/Appshell'
import { InterestSelector } from '../components/InterestSelector'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useApp } from '../hooks/useApp'
import { TIME_LIMIT_OPTIONS, formatMinutes, topicLabel } from '../lib/topics'
import { cn } from '../lib/utils'

export default function Index() {
  const { isGuest, userName, prefs, savePrefs } = useApp()
  const [step, setStep] = useState('idle')
  const [limit, setLimit] = useState(prefs.dailyLimit)
  const [custom, setCustom] = useState('')
  const [topics, setTopics] = useState(prefs.interests)
  const navigate = useNavigate()

  return (
    <AppShell>
      <section className="grid gap-10 py-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-12">
        <div className="flex flex-col justify-center">
          <Badge variant="outline" className="w-fit border-accent/50 text-accent-foreground">
              Aggregation · Personalization · Screen time
          </Badge>
          <h1 className="mt-4 font-display text-4xl leading-tight font-bold sm:text-5xl">
            {isGuest ? (
              <>Welcome to <span className="text-gradient-brand">SocialHub</span></>
            ) : (
              <>Welcome back, <span className="text-gradient-brand">{userName}</span></>
            )}
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            Build your personalized feed from Reddit, YouTube and news — and control exactly how much
            time you spend reading it each day.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {isGuest ? (
              <>
                <Button size="lg" onClick={() => setStep('time')}>
                  Get started <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/auth">Login</Link>
                </Button>
                <Button size="lg" variant="ghost" asChild>
                  <Link to="/feed">Continue as guest</Link>
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" asChild>
                  <Link to="/feed">Open your feed</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              </>
            )}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Feature icon={Layers} title="Multi-source" body="Reddit, YouTube and news in one place" />
            <Feature icon={Clock} title="Daily timer" body={`${formatMinutes(prefs.dailyLimit)} limit`} />
            <Feature icon={ShieldCheck} title="Yours only" body="Preferences stay private to you" />
          </div>
        </div>

        <Card className="self-center">
          <CardContent className="space-y-4 p-6">
            {step === 'idle' ? (
              <>
                <h2 className="font-display text-xl font-semibold">Your setup right now</h2>
                <div className="space-y-3 text-sm">
                  <Row label="Daily usage limit" value={formatMinutes(prefs.dailyLimit)} />
                  <Row label="Interests" value={prefs.interests.length ? `${prefs.interests.length} topics` : 'None yet'} />
                </div>
                {prefs.interests.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {prefs.interests.slice(0, 6).map((t) => (
                      <Badge key={t} variant="secondary">{topicLabel(t)}</Badge>
                    ))}
                  </div>
                ) : null}
                <Button className="w-full" variant="secondary" onClick={() => setStep('time')}>
                  {prefs.interests.length ? 'Adjust preferences' : 'Personalize now'}
                </Button>
              </>
            ) : null}

            {step === 'time' ? (
              <>
                <h2 className="font-display text-xl font-semibold">How much time per day?</h2>
                <div className="grid grid-cols-2 gap-2">
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
                  <input
                    value={custom}
                    onChange={(e) => setCustom(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    placeholder="Custom (min)"
                    inputMode="numeric"
                    className="col-span-2 rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
                  />
                </div>
                <Button className="w-full" onClick={() => {
                  const value = custom ? Math.min(600, Math.max(5, Number(custom))) : limit
                  setLimit(value)
                  setStep('interests')
                }}>
                  Continue
                </Button>
              </>
            ) : null}

            {step === 'interests' ? (
              <>
                <h2 className="font-display text-xl font-semibold">Pick your interests</h2>
                <div className="max-h-80 overflow-y-auto pr-1">
                  <InterestSelector selected={topics} onChange={setTopics} />
                </div>
                <Button className="w-full" onClick={async () => {
                  await savePrefs({ dailyLimit: limit, interests: topics, onboarded: true })
                  setStep('idle')
                  navigate('/feed')
                }}>
                  Save and open feed
                </Button>
              </>
            ) : null}
          </CardContent>
        </Card>
      </section>
    </AppShell>
  )
}

function Feature({ icon: Icon, title, body }) {
  return (
    <div className="surface-card p-4">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-2 text-sm font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground">{body}</p>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}