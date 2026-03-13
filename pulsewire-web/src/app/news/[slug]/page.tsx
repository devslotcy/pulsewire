import { getArticleBySlug, getArticles } from '@/lib/api'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { RichText } from '@/components/RichText'
import { NewsCard } from '@/components/NewsCard'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return {}
  return {
    title: article.seo_title || article.title,
    description: article.seo_description || article.summary,
    openGraph: {
      title: article.seo_title || article.title,
      description: article.seo_description || article.summary,
      images: article.image ? [article.image] : [],
      type: 'article',
      publishedTime: article.published_at,
    },
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  let related = { docs: [] as any[] }
  try {
    related = await getArticles({
      language: article.language,
      category: article.category?.slug,
      limit: 4,
    })
  } catch {}

  const relatedArticles = related.docs.filter((a) => a.slug !== article.slug).slice(0, 3)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main content */}
        <article className="lg:col-span-2">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-[#E63946] transition-colors">Home</Link>
            <span>/</span>
            {article.category && (
              <>
                <Link
                  href={`/category/${article.category.slug}`}
                  className="hover:text-[#E63946] transition-colors"
                >
                  {article.category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-gray-600 line-clamp-1">{article.title}</span>
          </div>

          {/* Category badge */}
          {article.category && (
            <Badge
              className="mb-3 text-white border-none"
              style={{ backgroundColor: article.category.color || '#E63946' }}
            >
              {article.category.name}
            </Badge>
          )}

          {/* Title */}
          <h1 className="text-3xl font-bold text-[#1D3557] leading-tight mb-4">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            {article.author && (
              <span className="font-medium text-[#1D3557]">
                {article.author.name}
                {article.author.title && (
                  <span className="text-gray-400 font-normal"> · {article.author.title}</span>
                )}
              </span>
            )}
            {article.published_at && (
              <span>{formatDate(article.published_at)}</span>
            )}
            {article.source_name && (
              <span>
                Via{' '}
                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#457B9D] hover:underline"
                >
                  {article.source_name}
                </a>
              </span>
            )}
          </div>

          {/* Ad - leaderboard before content */}
          <div className="w-full h-[90px] bg-gray-200 flex items-center justify-center text-gray-400 text-sm rounded mb-6">
            Advertisement
          </div>

          {/* Hero image */}
          {article.image && (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg mb-6">
              <Image
                src={article.image}
                alt={article.image_alt || article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Summary */}
          {article.summary && (
            <p className="text-lg text-gray-600 border-l-4 border-[#E63946] pl-4 mb-6 leading-relaxed">
              {article.summary}
            </p>
          )}

          {/* Content */}
          <div className="mb-8">
            <RichText content={article.content} />
          </div>

          {/* In-content ad */}
          <div className="w-full max-w-[300px] mx-auto h-[250px] bg-gray-200 flex items-center justify-center text-gray-400 text-sm rounded mb-8">
            Advertisement
          </div>

          {/* What This Means */}
          {article.what_this_means && (
            <div className="bg-[#1D3557] text-white rounded-lg p-6 mb-6">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span>⚡</span> What This Means
              </h3>
              <p className="text-gray-200 leading-relaxed">{article.what_this_means}</p>
            </div>
          )}

          {/* Key Points */}
          {article.key_points && article.key_points.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-lg text-[#1D3557] mb-4 flex items-center gap-2">
                <span>📊</span> Key Points
              </h3>
              <ul className="space-y-3">
                {article.key_points.map((kp, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#E63946] text-white text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {kp.link ? (
                      <Link href={kp.link} className="text-[#457B9D] hover:underline">
                        {kp.point}
                      </Link>
                    ) : (
                      <span className="text-gray-700">{kp.point}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Source */}
          {article.source_url && (
            <p className="text-sm text-gray-400 mb-8">
              Source:{' '}
              <a
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#457B9D] hover:underline"
              >
                {article.source_name || article.source_url}
              </a>
            </p>
          )}

          {/* Footer ad */}
          <div className="w-full h-[90px] bg-gray-200 flex items-center justify-center text-gray-400 text-sm rounded mb-8">
            Advertisement
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {article.tags.map((t, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {t.tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Schema markup */}
          {article.schema_markup && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(article.schema_markup) }}
            />
          )}
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          {/* Sticky sidebar ads + related */}
          <div className="sticky top-20 space-y-6">

            {/* Sidebar ad top */}
            <div className="w-full h-[250px] bg-gray-200 flex items-center justify-center text-gray-400 text-sm rounded">
              Advertisement
            </div>

            {/* Related articles */}
            {relatedArticles.length > 0 && (
              <div>
                <h4 className="font-bold text-[#1D3557] mb-4 text-sm uppercase tracking-wide">
                  Related News
                </h4>
                <div className="space-y-4">
                  {relatedArticles.map((rel) => (
                    <NewsCard key={rel.id} article={rel} variant="compact" />
                  ))}
                </div>
              </div>
            )}

            {/* Sidebar ad bottom */}
            <div className="w-full h-[250px] bg-gray-200 flex items-center justify-center text-gray-400 text-sm rounded">
              Advertisement
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
