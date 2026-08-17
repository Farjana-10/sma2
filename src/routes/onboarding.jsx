import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'

import { AppShell } from '../components/AppShell'
import { InterestSelector } from '../components/InterestSelector'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Progress } from '../components/ui/progress'
import { useApp } from '../hooks/useApp'
import { TIME_LIMIT_OPTIONS, formatMinutes } from '../lib/topics'
import { cn } from '../lib/utils'

export default function Onboarding() {
  const { prefs, savePrefs } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [limit, setLimit] = useState(prefs.dailyLimit)
  const [custom, setCustom] = useState('')
  const [topics, setTopics] = useState(prefs.interests)
  const [busy, setBusy] = useState(false)

  const finish = async () => {
    setBusy(true)
    const value = custom ? Math.min(600, Math.max(5, Number(custom))) : limit
    await savePrefs({ dailyLimit: value, interests: topics, onboarded: true })
    setBusy(false)
    navigate('/feed')
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl py-6">
        <Progress value={step === 0 ? 50 : 100} className="mb-6 h-1.5" />
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-2xl">
              {step === 0 ? 'How much time per day?' : 'What are you interested in?'}
            </CardTitle>
            <CardDescription>
              {step === 0
                ? "We'll track your usage and let you know when you reach the limit."
                : 'Pick at least three topics. You can change these any time in settings.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {step === 0 ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {TIME_LIMIT_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => { setLimit(option); setCustom('') }}
                    className={cn(
                      'rounded-xl border p-4 text-sm font-medium transition-colors',
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
                  className="col-span-2 h-auto sm:col-span-3"
                />
              </div>
            ) : (
              <InterestSelector selected={topics} onChange={setTopics} />
            )}

            <div className="flex justify-between gap-2">
              <Button variant="ghost" onClick={() => (step === 0 ? navigate('/') : setStep(0))}>
                <ArrowLeft className="mr-1 h-4 w-4" /> Back
              </Button>
              {step === 0 ? (
                <Button onClick={() => setStep(1)}>
                  Next <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={finish} disabled={busy || topics.length < 1}>
                  <Check className="mr-1 h-4 w-4" /> {busy ? 'Saving…' : 'Finish setup'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}