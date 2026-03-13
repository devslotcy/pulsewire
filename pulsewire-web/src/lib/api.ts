const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'

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
  seo_title: string
  seo_description: string
  schema_markup: any
  internal_links: { label: string; url: string }[]
  tags: { tag: string }[]
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
    avatar: string
  }
}

export interface ArticlesResponse {
  docs: Article[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
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
  query.set('limit', String(params?.limit || 12))
  query.set('page', String(params?.page || 1))
  query.set('sort', '-createdAt')
  query.set('depth', '2')

  const res = await fetch(`${API_URL}/api/articles?${query.toString()}`, {
    next: { revalidate: 300 },
  })
  if (!res.ok) throw new Error('Failed to fetch articles')
  return res.json()
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const res = await fetch(
    `${API_URL}/api/articles?where[slug][equals]=${slug}&depth=2&limit=1`,
    { next: { revalidate: 300 } }
  )
  if (!res.ok) return null
  const data = await res.json()
  return data.docs[0] || null
}

export async function getArticlesByCategory(
  categorySlug: string,
  language = 'en'
): Promise<ArticlesResponse> {
  return getArticles({ category: categorySlug, language, limit: 12 })
}

export async function searchArticles(q: string, page = 1): Promise<ArticlesResponse> {
  const query = new URLSearchParams()
  query.set('where[title][like]', q)
  query.set('limit', '12')
  query.set('page', String(page))
  query.set('sort', '-createdAt')
  query.set('depth', '2')

  const res = await fetch(`${API_URL}/api/articles?${query.toString()}`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Search failed')
  return res.json()
}
