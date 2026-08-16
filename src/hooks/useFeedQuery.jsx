import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function useFeedQuery({ topic, sources, sort }) {
  return useQuery({
    queryKey: ['feed', topic, sources.join(','), sort],
    staleTime: 2 * 60 * 1000,
    queryFn: async () => {
      const params = {
        sources: sources.join(','),
        sort,
        ...(topic ? { topic } : {}),
      }
      const response = await api.feed.get(params)
      return response.json()
    },
  })
}