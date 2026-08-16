export const TIME_LIMIT_OPTIONS = [5, 10, 15, 20, 30, 45, 60]

export function formatMinutes(minutes) {
  return `${minutes} min`
}

export function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function topicLabel(slug) {
  const topic = TOPIC_BY_SLUG.get(slug)
  return topic?.label ?? slug
}

export const TOPICS = [
  { slug: 'technology', label: 'Technology', blurb: 'Gadgets, AI, and innovation', keywords: ['tech', 'ai', 'gadget'] },
  { slug: 'science', label: 'Science', blurb: 'Research, space, and discoveries', keywords: ['research', 'space'] },
  { slug: 'news', label: 'News', blurb: 'Current events and world news', keywords: ['news', 'current'] },
  { slug: 'gaming', label: 'Gaming', blurb: 'Video games and esports', keywords: ['games', 'esports'] },
  { slug: 'movies', label: 'Movies', blurb: 'Film and cinema', keywords: ['film', 'cinema'] },
  { slug: 'music', label: 'Music', blurb: 'Artists, albums and concerts', keywords: ['music', 'artist'] },
  { slug: 'books', label: 'Books', blurb: 'Literature and reading', keywords: ['books', 'reading'] },
  { slug: 'health', label: 'Health', blurb: 'Wellness and fitness', keywords: ['health', 'fitness'] },
  { slug: 'finance', label: 'Finance', blurb: 'Money and investing', keywords: ['finance', 'invest'] },
  { slug: 'sports', label: 'Sports', blurb: 'Athletics and teams', keywords: ['sports', 'athletics'] },
  { slug: 'food', label: 'Food', blurb: 'Cooking and dining', keywords: ['food', 'cooking'] },
  { slug: 'travel', label: 'Travel', blurb: 'Destinations and adventures', keywords: ['travel', 'destinations'] },
]

export const TOPIC_BY_SLUG = new Map(TOPICS.map(t => [t.slug, t]))

export const SOURCES = [
  { id: 'reddit', label: 'Reddit' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'news', label: 'News' },
]