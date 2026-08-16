import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  // Auth state management
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Application state
  const [prefs, setPrefs] = useState({
    dailyLimit: 30,
    interests: ['technology', 'science', 'news'],
    theme: 'light',
    notificationsEnabled: true,
    sources: ['reddit', 'youtube', 'news'],
    onboarded: false,
  })
  const [secondsUsed, setSecondsUsed] = useState(0)
  const [timerPaused, setTimerPaused] = useState(false)
  const [saved, setSaved] = useState([])
  const [likedIds, setLikedIds] = useState(new Set())
  const [activity, setActivity] = useState([])
  const [searches, setSearches] = useState([])
  const [usageHistory, setUsageHistory] = useState([])
  const [limitReached, setLimitReached] = useState(false)
  const [extraSeconds, setExtraSeconds] = useState(0)

  // Listen to Supabase auth state changes
  useEffect(() => {
    // Retrieve initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Timer logic: increment seconds every second
  useEffect(() => {
    if (timerPaused) return
    const interval = setInterval(() => {
      setSecondsUsed(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [timerPaused])

  // Load user preferences from Supabase or localStorage
  useEffect(() => {
    if (user) {
      // Optionally fetch user preferences from Supabase 'profiles' table here
    } else {
      // Load guest preferences from localStorage
      const localPrefs = localStorage.getItem('prefs')
      if (localPrefs) {
        try {
          setPrefs(prev => ({ ...prev, ...JSON.parse(localPrefs) }))
        } catch (e) { console.error(e) }
      }
    }
  }, [user])

  // Monitor daily usage limit
  useEffect(() => {
    const limitInSeconds = prefs.dailyLimit * 60
    if (secondsUsed >= limitInSeconds && !timerPaused) {
      setLimitReached(true)
    } else {
      setLimitReached(false)
    }
  }, [secondsUsed, prefs.dailyLimit, timerPaused])

  // Save user preferences
  const savePrefs = async (newPrefs) => {
    const updated = { ...prefs, ...newPrefs }
    setPrefs(updated)
    localStorage.setItem('prefs', JSON.stringify(updated))
    return Promise.resolve()
  }

  // Toggle save functionality
  const toggleSave = (item) => {
    setSaved(prev => {
      const exists = prev.some(s => s.id === item.id)
      return exists
        ? prev.filter(s => s.id !== item.id)
        : [...prev, { ...item, saved_at: new Date().toISOString() }]
    })
  }

  // Toggle like functionality
  const toggleLike = (item) => {
    setLikedIds(prev => {
      const newSet = new Set(prev)
      newSet.has(item.id) ? newSet.delete(item.id) : newSet.add(item.id)
      return newSet
    })
  }

  // Register content view
  const registerView = (item) => {
    setActivity(prev => [
      { id: Date.now(), activity_type: 'view', title: item.title, category: item.category, created_at: new Date().toISOString() },
      ...prev
    ])
    setSecondsUsed(prev => prev + 30)
  }

  // Register search query
  const registerSearch = (query) => {
    setSearches(prev => [query, ...prev.filter(s => s !== query)].slice(0, 20))
  }

  const markNotInterested = (item) => console.log('Marked not interested:', item.title)
  const resetRecommendations = () => console.log('Recommendations reset')

  // Sign out user
  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  // Refresh user session
  const refresh = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setSession(session)
    setUser(session?.user ?? null)
    return session
  }

  // Override daily limit
  const overrideLimit = () => {
    setLimitReached(false)
    setExtraSeconds(prev => prev + 300)
  }

  // Derived user properties
  const isGuest = !user
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Guest'
  const email = user?.email || ''
  const avatarUrl = user?.user_metadata?.avatar_url || null
  const memberSince = user?.created_at || null

  const value = {
    prefs, savePrefs,
    secondsUsed, limitReached, overrideLimit, extraSeconds,
    isGuest, userName, email, avatarUrl, memberSince,
    signOut, registerSearch, refresh,
    savedIds: new Set(saved.map(s => s.id)), likedIds,
    toggleSave, toggleLike, registerView, markNotInterested, resetRecommendations,
    timerPaused, setTimerPaused,
    activity, usageHistory, searches, saved,
    loading: isLoading
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within an AppProvider')
  return context
}