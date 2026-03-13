import React from 'react'
import Link from 'next/link'
import { getArticles } from '@/lib/api'
import { NewsCard } from '@/components/NewsCard'
import { Separator } from '@/components/ui/separator'

export default async function HomePage() {
  let articles = { docs: [] as any[] }

  try {
    articles = await getArticles({ language: 'en', limit: 20 })
  } catch {
    // CMS henüz bağlı değilse boş göster
  }

  const hero = articles.docs[0]
  const topStories = articles.docs.slice(1, 5)
  const latest = articles.docs.slice(5, 13)
  const aiTrends = articles.docs.filter((a) => a.category?.slug === 'ai-trends').slice(0, 3)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* Ad - Leaderboard */}
      <div className="w-full h-[90px] bg-gray-200 flex items-center justify-center text-gray-400 text-sm rounded mb-6">
        Advertisement
      </div>

      {/* Hero Section */}
      {hero ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2">
            <NewsCard article={hero} variant="hero" />
          </div>
          <div className="flex flex-col gap-4">
            {topStories.map((article) => (
              <NewsCard key={article.id} article={article} variant="compact" />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg text-gray-400 mb-10">
          No articles yet. Add some from the admin panel.
        </div>
      )}

      <Separator className="mb-10" />

      {/* Latest News */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#1D3557] flex items-center gap-2">
            <span className="w-1 h-6 bg-[#E63946] rounded inline-block" />
            Latest News
          </h2>
          <Link href="/category/technology" className="text-sm text-[#E63946] hover:underline">See All →</Link>
        </div>
        {latest.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latest.map((article, i) => (
              <React.Fragment key={article.id}>
                <NewsCard article={article} variant="default" />
                {/* In-feed ad after every 4 cards */}
                {i === 3 && (
                  <div className="bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm aspect-[4/3]">
                    Advertisement
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No articles yet.</p>
        )}
      </section>

      <Separator className="mb-10" />

      {/* AI Trends */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#1D3557] flex items-center gap-2">
            <span className="w-1 h-6 bg-[#0A0A0A] rounded inline-block" />
            AI Trends
          </h2>
          <Link href="/category/ai-trends" className="text-sm text-[#E63946] hover:underline">See All →</Link>
        </div>
        {aiTrends.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {aiTrends.map((article) => (
              <NewsCard key={article.id} article={article} variant="default" />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">AI Trends articles coming soon.</p>
        )}
      </section>
    </div>
  )
}
