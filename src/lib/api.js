import { supabase } from '@/integrations/supabase/client'

/**
 * A wrapper around fetch that automatically injects the Supabase session token
 * into the Authorization header for authenticated requests.
 */
export async function fetchWithAuth(endpoint, options = {}) {
  // Retrieve the current Supabase session and access token
  const session = await supabase.auth.getSession()
  const token = session.data.session?.access_token
  
  // Perform the fetch request to the Vercel Function (relative path)
  return fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // Inject Bearer token if the user is authenticated
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
}

/**
 * API client for SocialHub.
 * All endpoints proxy to the Vercel Functions located in the /api directory.
 */
export const api = {
  // ---- Authentication ----
  auth: {
    register: (data) => fetchWithAuth('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data) => fetchWithAuth('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    logout: () => fetchWithAuth('/auth/logout', { method: 'POST' }),
    me: () => fetchWithAuth('/auth/me'),
  },

  // ---- User Profile ----
  profile: {
    get: () => fetchWithAuth('/profile'),
    update: (data) => fetchWithAuth('/profile', { method: 'PUT', body: JSON.stringify(data) }),
    preferences: (data) => fetchWithAuth('/profile/preferences', { method: 'PUT', body: JSON.stringify(data) }),
  },

  // ---- Content Feed ----
  feed: {
    /**
     * Get the personalized feed based on filters.
     * @param {Object} params - { sources, sort, topic }
     */
    get: (params) => fetchWithAuth(`/feed?${new URLSearchParams(params)}`),
    
    /**
     * Get trending/explore content.
     * @param {string[]} topics - List of topics to explore.
     */
    explore: (topics) => fetchWithAuth(`/feed/explore?topics=${topics.join(',')}`),
  },

  // ---- Search ----
  search: {
    /**
     * Search across all platforms.
     * @param {string} q - The search query.
     * @param {string[]} sources - List of sources to search within.
     */
    query: (q, sources) => fetchWithAuth(`/search?q=${encodeURIComponent(q)}&sources=${sources.join(',')}`),
  },

  // ---- Saved Items ----
  saved: {
    get: () => fetchWithAuth('/saved'),
    save: (contentId) => fetchWithAuth('/saved', { method: 'POST', body: JSON.stringify({ content_id: contentId }) }),
    unsave: (contentId) => fetchWithAuth(`/saved/${contentId}`, { method: 'DELETE' }),
  },

  // ---- User Activity ----
  activity: {
    get: () => fetchWithAuth('/activity'),
    record: (data) => fetchWithAuth('/activity', { method: 'POST', body: JSON.stringify(data) }),
    search: (query) => fetchWithAuth('/activity/search', { method: 'POST', body: JSON.stringify({ query }) }),
  },

  // ---- Usage Tracking ----
  usage: {
    today: () => fetchWithAuth('/usage/today'),
    history: (days) => fetchWithAuth(`/usage/history?days=${days}`),
    record: (seconds) => fetchWithAuth('/usage/session', { 
      method: 'POST', 
      body: JSON.stringify({ 
        date: new Date().toISOString().split('T')[0], 
        seconds_used: seconds 
      }) 
    }),
  },
}