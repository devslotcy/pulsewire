import React from 'react'
import Link from 'next/link'
import { searchArticles } from '@/lib/api'
import { NewsCard } from '@/components/NewsCard'
import type { Metadata } from 'next'

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `Search: ${q} — PulseWire` : 'Search — PulseWire',
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = '', page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam || '1', 10))

  let results = { docs: [] as any[], totalDocs: 0, totalPages: 1 }
  if (q.trim().length > 0) {
    try {
      results = await searchArticles(q.trim(), page)
    } catch {}
  }

  const hasPrev = page > 1
  const hasNext = page < results.totalPages

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search bar */}
      <form action="/search" method="GET" className="mb-8">
        <div className="flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search articles..."
            autoFocus
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946]"
          />
          <button
            type="submit"
            className="bg-[#E63946] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Results header */}
      {q && (
        <p className="text-gray-500 text-sm mb-6">
          {results.totalDocs > 0
            ? `${results.totalDocs} results for "${q}"`
            : `No results for "${q}"`}
        </p>
      )}

      {/* Results grid */}
      {results.docs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.docs.map((article) => (
              <NewsCard key={article.id} article={article} variant="default" />
            ))}
          </div>

          {/* Pagination */}
          {results.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {hasPrev && (
                <Link
                  href={`/search?q=${encodeURIComponent(q)}&page=${page - 1}`}
                  className="px-4 py-2 rounded border border-gray-300 text-sm text-[#1D3557] hover:bg-gray-50 transition-colors"
                >
                  ← Previous
                </Link>
              )}
              {Array.from({ length: results.totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/search?q=${encodeURIComponent(q)}&page=${p}`}
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
                  href={`/search?q=${encodeURIComponent(q)}&page=${page + 1}`}
                  className="px-4 py-2 rounded border border-gray-300 text-sm text-[#1D3557] hover:bg-gray-50 transition-colors"
                >
                  Next →
                </Link>
              )}
            </div>
          )}
        </>
      ) : q ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
          <p>No articles found.</p>
          <Link href="/" className="text-sm text-[#E63946] hover:underline">Back to Home</Link>
        </div>
      ) : (
        <div className="flex items-center justify-center h-48 text-gray-400">
          Enter a keyword to search articles.
        </div>
      )}
    </div>
  )
}
