import { useState, useCallback, useRef } from 'react'
import { getArticles, type Article } from '@/lib/api'

const PAGE_SIZE = 20

interface Params {
  language?: string
  category?: string
}

export function usePaginatedFeed(params: Params) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState(false)

  const page = useRef(1)
  const fetching = useRef(false)
  // Keep latest params in a ref so load() always uses current values
  const paramsRef = useRef(params)
  paramsRef.current = params

  const load = useCallback(async (reset = false) => {
    if (fetching.current) return
    fetching.current = true

    const currentPage = reset ? 1 : page.current

    try {
      setError(false)
      const data = await getArticles({
        ...paramsRef.current,
        limit: PAGE_SIZE,
        page: currentPage,
      })

      if (reset) {
        setArticles(data.docs)
      } else {
        setArticles((prev) => {
          // deduplicate by id in case of race conditions
          const ids = new Set(prev.map((a) => a.id))
          return [...prev, ...data.docs.filter((a) => !ids.has(a.id))]
        })
      }

      page.current = currentPage + 1
      setHasMore(currentPage < data.totalPages)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
      setRefreshing(false)
      setLoadingMore(false)
      fetching.current = false
    }
  }, []) // stable — params accessed via ref

  function refresh() {
    page.current = 1
    setHasMore(true)
    setRefreshing(true)
    load(true)
  }

  function loadMore() {
    if (!hasMore || loadingMore || loading || refreshing) return
    setLoadingMore(true)
    load(false)
  }

  return {
    articles,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    error,
    load,
    refresh,
    loadMore,
  }
}
