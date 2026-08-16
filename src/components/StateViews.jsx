import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { Loader2, Inbox, AlertTriangle, LogIn } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function LoadingSpinner({ label = 'Loading your feed…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="surface-card mx-auto max-w-md p-6 text-center">
      <AlertTriangle className="mx-auto h-7 w-7 text-destructive" />
      <p className="mt-3 text-sm text-muted-foreground">{message}</p>
      {onRetry ? <Button className="mt-4" variant="secondary" onClick={onRetry}>Try again</Button> : null}
    </div>
  )
}

export function EmptyState({ title, body }) {
  return (
    <div className="surface-card mx-auto max-w-md p-8 text-center">
      <Inbox className="mx-auto h-7 w-7 text-muted-foreground" />
      <h3 className="mt-3 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  )
}

export function GuestBanner({ context }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-foreground">{context ?? 'Login to save your personalized preferences and activity.'}</p>
      <div className="flex gap-2">
        <Button asChild size="sm"><Link to="/auth" search={{ mode: 'signup' }}>Create account</Link></Button>
        <Button asChild size="sm" variant="outline"><Link to="/auth" search={{ mode: 'login' }}><LogIn className="mr-1 h-4 w-4" /> Login</Link></Button>
      </div>
    </div>
  )
}