// frontend/src/routeTree.gen.js
import { createRoute, createRootRoute } from '@tanstack/react-router'

// Import all routes
import { Route as RootRoute } from './routes/__root'
import { Route as IndexRoute } from './routes/index'
import { Route as AuthRoute } from './routes/auth'
import { Route as FeedRoute } from './routes/feed'
import { Route as ExploreRoute } from './routes/explore'
import { Route as SavedRoute } from './routes/saved'
import { Route as DashboardRoute } from './routes/dashboard'
import { Route as ProfileRoute } from './routes/profile'
import { Route as SettingsRoute } from './routes/settings'
import { Route as SearchRoute } from './routes/search'
import { Route as OnboardingRoute } from './routes/onboarding'
import { Route as ForgotPasswordRoute } from './routes/forgot-password'
import { Route as ResetPasswordRoute } from './routes/reset-password'

// Create route tree
export const routeTree = {
  '/': IndexRoute,
  '/auth': AuthRoute,
  '/feed': FeedRoute,
  '/explore': ExploreRoute,
  '/saved': SavedRoute,
  '/dashboard': DashboardRoute,
  '/profile': ProfileRoute,
  '/settings': SettingsRoute,
  '/search': SearchRoute,
  '/onboarding': OnboardingRoute,
  '/forgot-password': ForgotPasswordRoute,
  '/reset-password': ResetPasswordRoute,
}