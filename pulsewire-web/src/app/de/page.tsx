import React from 'react'
import { getArticles } from '@/lib/api'
import { NewsCard } from '@/components/NewsCard'
import { Separator } from '@/components/ui/separator'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PulseWire - Globale Nachrichten, Lokale Einblicke',
  description: 'Aktuelle Nachrichten aus Technologie, Wirtschaft und KI-Trends auf Deutsch.',
}

export default async function DeHomePage() {
  let articles = { docs: [] as any[] }
  try {
    articles = await getArticles({ language: 'de', limit: 20 })
  } catch {}

  const hero = articles.docs[0]
  const topStories = articles.docs.slice(1, 5)
  const latest = articles.docs.slice(5, 13)
  const aiTrends = articles.docs.filter((a) => a.category?.slug === 'ai-trends').slice(0, 3)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Ad */}
      <div className="w-full h-[90px] bg-gray-200 flex items-center justify-center text-gray-400 text-sm rounded mb-6">
        Werbung
      </div>

      {/* Hero */}
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
          Noch keine Artikel. Füge welche im Admin-Panel hinzu.
        </div>
      )}

      <Separator className="mb-10" />

      {/* Latest */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-[#1D3557] mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-[#E63946] rounded inline-block" />
          Neueste Nachrichten
        </h2>
        {latest.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latest.map((article, i) => (
              <React.Fragment key={article.id}>
                <NewsCard article={article} variant="default" />
                {i === 3 && (
                  <div className="bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm aspect-[4/3]">
                    Werbung
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Noch keine Artikel.</p>
        )}
      </section>

      <Separator className="mb-10" />

      {/* AI Trends */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-[#1D3557] mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-[#0A0A0A] rounded inline-block" />
          KI-Trends
        </h2>
        {aiTrends.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {aiTrends.map((article) => (
              <NewsCard key={article.id} article={article} variant="default" />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">KI-Trend-Artikel kommen bald.</p>
        )}
      </section>
    </div>
  )
}
