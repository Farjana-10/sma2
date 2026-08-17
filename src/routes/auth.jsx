import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs'
import { supabase } from '../integrations/supabase/client'
import { useApp } from '../hooks/useApp'

export default function Auth() {
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') || 'login'
  const navigate = useNavigate()
  const { prefs, refresh } = useApp()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const isSignup = mode === 'signup'

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      if (isSignup) {
        if (password !== confirm) return void toast.error('Passwords do not match')
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/onboarding`,
            data: { name: name.trim() },
          },
        })
        if (error) throw error
        
        // Allow time for session creation before refreshing
        setTimeout(async () => {
          await refresh()
          navigate('/onboarding')
        }, 1000)
        
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        
        // Refresh session and redirect
        await refresh()
        navigate(prefs.onboarded ? '/dashboard' : '/onboarding')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed')
    } finally {
      setBusy(false)
    }
  }

  const google = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/onboarding` },
    })
    if (error) toast.error('Google sign-in failed')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-display text-sm font-bold">S</span>
          <span className="font-display text-lg font-bold">SocialHub</span>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-2xl">
              {isSignup ? 'Create your account' : 'Welcome back'}
            </CardTitle>
            <CardDescription>
              {isSignup ? 'Set up a personalized feed and your daily usage limit.' : 'Your interests and remaining time load automatically.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={mode} onValueChange={(value) => navigate(`/auth?mode=${value}`)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign up</TabsTrigger>
              </TabsList>
            </Tabs>

            <Button type="button" variant="outline" className="w-full" onClick={google}>
              Continue with Google
            </Button>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> or use email <span className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={submit} className="space-y-3">
              {isSignup ? (
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              ) : null}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              {isSignup ? (
                <div className="space-y-1.5">
                  <Label htmlFor="confirm">Confirm password</Label>
                  <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
                </div>
              ) : null}

              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? 'Please wait…' : isSignup ? 'Create account' : 'Login'}
              </Button>
            </form>

            <div className="flex justify-between text-sm">
              <Link to="/forgot-password" className="text-muted-foreground hover:text-primary">
                Forgot password?
              </Link>
              <Link to="/feed" className="text-muted-foreground hover:text-primary">
                Continue as guest
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}