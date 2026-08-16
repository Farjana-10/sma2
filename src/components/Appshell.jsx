import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  Bell, Bookmark, Compass, Home, LayoutDashboard, LogOut, 
  Menu, Moon, Newspaper, Search, Sun, Timer, User, X 
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useApp } from '@/hooks/useApp'
import { formatDuration } from '@/lib/topics'

const NAV = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/feed', label: 'Feed', icon: Newspaper },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/saved', label: 'Saved', icon: Bookmark },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/profile', label: 'Profile', icon: User },
]

export function AppShell({ children }) {
  const { 
    prefs, 
    savePrefs, 
    secondsUsed, 
    limitReached, 
    overrideLimit, 
    extraSeconds, 
    isGuest, 
    userName, 
    signOut, 
    registerSearch 
  } = useApp()
  
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname

  // Synchronize theme with DOM
  useEffect(() => {
    if (prefs.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [prefs.theme])

  const limitSeconds = prefs.dailyLimit * 60
  const remaining = Math.max(0, limitSeconds - secondsUsed)
  const pct = Math.min(100, (secondsUsed / limitSeconds) * 100)

  const submitSearch = (e) => {
    e.preventDefault()
    const q = query.trim()
    if (q.length < 2) return
    registerSearch(q)
    setMobileOpen(false)
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  const showLimitScreen = limitReached && !(localStorage.getItem('override_active') === 'true')

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="font-display text-sm font-bold">S</span>
            </span>
            <span className="font-display text-lg font-bold tracking-tight">SocialHub</span>
          </Link>

          <nav className="ml-4 hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground',
                  pathname === item.to && 'bg-secondary text-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <form onSubmit={submitSearch} className="relative ml-auto hidden max-w-xs flex-1 md:block">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              placeholder="Search topics, posts, videos" 
              className="pl-9" 
              maxLength={80}
            />
          </form>

          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <Badge
              variant="outline"
              className={cn(
                'hidden items-center gap-1.5 px-2.5 py-1 font-mono text-xs sm:flex',
                remaining <= 300 ? 'border-destructive/40 text-destructive' : 'border-primary/40 text-primary'
              )}
            >
              <Timer className="h-3.5 w-3.5" />
              {remaining > 0 ? formatDuration(remaining) : '0:00'}
            </Badge>

            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="Toggle theme" 
              onClick={() => savePrefs({ theme: prefs.theme === 'dark' ? 'light' : 'dark' })}
            >
              {prefs.theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {isGuest ? (
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link to="/auth">Login</Link>
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                    {userName}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut().then(() => navigate('/'))}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden" 
              aria-label="Menu" 
              onClick={() => setMobileOpen(v => !v)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <Progress value={pct} className="h-0.5 rounded-none" />

        {mobileOpen && (
          <div className="border-t border-border bg-card px-4 py-3 lg:hidden">
            <form onSubmit={submitSearch} className="relative mb-3 md:hidden">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                placeholder="Search" 
                className="pl-9" 
                maxLength={80}
              />
            </form>
            <nav className="grid gap-1">
              {NAV.map((item) => (
                <Link 
                  key={item.to} 
                  to={item.to} 
                  onClick={() => setMobileOpen(false)} 
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary"
                >
                  <item.icon className="h-4 w-4" /> {item.label}
                </Link>
              ))}
              <Link 
                to="/settings" 
                onClick={() => setMobileOpen(false)} 
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary"
              >
                Settings
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {children}
      </main>

      <Dialog open={showLimitScreen}>
        <DialogContent className="max-w-md [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Daily Limit Reached</DialogTitle>
            <DialogDescription>
              You have completed your planned usage for today ({prefs.dailyLimit} minutes).
              {extraSeconds > 0 && ` Extra usage recorded: ${formatDuration(extraSeconds)}.`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 sm:grid-cols-3">
            <Button variant="secondary" onClick={() => navigate('/')}>
              Exit
            </Button>
            <Button variant="outline" onClick={() => navigate('/profile')}>
              View profile
            </Button>
            <Button onClick={overrideLimit}>
              Continue anyway
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}