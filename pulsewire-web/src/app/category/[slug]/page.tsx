import React from 'react'
import Link from 'next/link'
import { getArticles } from '@/lib/api'
import { NewsCard } from '@/components/NewsCard'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const name = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')
  return {
    title: `${name} News`,
    description: `Latest ${name} news and analysis from PulseWire.`,
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam || '1', 10))
  const limit = 12
  const name = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')

  let articles = { docs: [] as any[], totalDocs: 0, totalPages: 1 }
  try {
    articles = await getArticles({ category: slug, limit, page })
  } catch {}

  const hasPrev = page > 1
  const hasNext = page < articles.totalPages

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* Ad */}
      <div className="w-full h-[90px] bg-gray-200 flex items-center justify-center text-gray-400 text-sm rounded mb-6">
        Advertisement
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1D3557] flex items-center gap-3">
          <span className="w-1.5 h-8 bg-[#E63946] rounded inline-block" />
          {name}
        </h1>
        <p className="text-gray-500 mt-2">
          {articles.totalDocs > 0
            ? `${articles.totalDocs} articles · Page ${page} of ${articles.totalPages}`
            : 'No articles yet'}
        </p>
      </div>

      {/* Articles grid */}
      {articles.docs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.docs.map((article, i) => (
              <React.Fragment key={article.id}>
                <NewsCard article={article} variant="default" />
                {i === 7 && (
                  <div className="bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm aspect-[4/3]">
                    Advertisement
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Pagination */}
          {articles.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {hasPrev && (
                <Link
                  href={`/category/${slug}?page=${page - 1}`}
                  className="px-4 py-2 rounded border border-gray-300 text-sm text-[#1D3557] hover:bg-gray-50 transition-colors"
                >
                  ← Previous
                </Link>
              )}
              {Array.from({ length: articles.totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/category/${slug}?page=${p}`}
                  className={`px-4 py-2 rounded text-sm transition-colors ${
                    p === page
                      ? 'bg-[#E63946] text-white font-bold'
                      : 'border border-gray-300 text-[#1D3557] hover:bg-gray-50'
                  }`}
                >
                  {p}
                </Link>
              ))}
              {hasNext && (
                <Link
                  href={`/category/${slug}?page=${page + 1}`}
                  className="px-4 py-2 rounded border border-gray-300 text-sm text-[#1D3557] hover:bg-gray-50 transition-colors"
                >
                  Next →
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-48 bg-white rounded-lg text-gray-400">
          No articles in this category yet.
        </div>
      )}
    </div>
  )
}
