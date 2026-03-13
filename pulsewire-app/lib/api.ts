const API_URL = 'http://192.168.1.43:3005'

export interface Article {
  id: string
  title: string
  slug: string
  summary: string
  content: any
  what_this_means: string
  key_points: { point: string; link?: string }[]
  image: string
  image_alt: string
  language: 'en' | 'de' | 'fr'
  status: string
  published_at: string
  source_url: string
  source_name: string
  category: {
    id: string
    name: string
    slug: string
    color: string
  }
  author: {
    id: string
    name: string
    title: string
  }
}

export interface ArticlesResponse {
  docs: Article[]
  totalDocs: number
  totalPages: number
  page: number
}

export async function getArticles(params?: {
  language?: string
  category?: string
  limit?: number
  page?: number
}): Promise<ArticlesResponse> {
  const query = new URLSearchParams()
  if (params?.language) query.set('where[language][equals]', params.language)
  if (params?.category) query.set('where[category.slug][equals]', params.category)
  query.set('limit', String(params?.limit || 20))
  query.set('page', String(params?.page || 1))
  query.set('sort', '-createdAt')
  query.set('depth', '2')

  const res = await fetch(`${API_URL}/api/articles?${query.toString()}`)
  if (!res.ok) throw new Error('Failed to fetch articles')
  return res.json()
}

export async function searchArticles(q: string, lang?: string): Promise<ArticlesResponse> {
  const query = new URLSearchParams()
  query.set('where[or][0][title][like]', q)
  query.set('where[or][1][summary][like]', q)
  if (lang) query.set('where[language][equals]', lang)
  query.set('limit', '20')
  query.set('sort', '-createdAt')
  query.set('depth', '2')

  const res = await fetch(`${API_URL}/api/articles?${query.toString()}`)
  if (!res.ok) throw new Error('Search failed')
  return res.json()
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const res = await fetch(
    `${API_URL}/api/articles?where[slug][equals]=${slug}&depth=2&limit=1`
  )
  if (!res.ok) return null
  const data = await res.json()
  return data.docs[0] || null
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
