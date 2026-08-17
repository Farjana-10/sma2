import { useState } from 'react'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { toast } from 'sonner'

import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { supabase } from '../integrations/supabase/client'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    const parsed = z.string().trim().email().max(255).safeParse(email)
    if (!parsed.success) return void toast.error('Enter a valid email address')
    setBusy(true)
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setBusy(false)
    if (error) return void toast.error(error.message)
    setSent(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Forgot password</CardTitle>
          <CardDescription>We'll send a reset link to your email.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sent ? (
            <p className="text-sm text-muted-foreground">
              If an account exists for {email}, a reset link is on its way.
            </p>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  maxLength={255}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? 'Sending…' : 'Send reset link'}
              </Button>
            </form>
          )}
          <Link to="/auth" className="block text-sm text-muted-foreground hover:text-primary">
            Back to login
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}