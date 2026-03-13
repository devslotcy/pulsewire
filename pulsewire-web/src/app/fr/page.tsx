import React from 'react'
import { getArticles } from '@/lib/api'
import { NewsCard } from '@/components/NewsCard'
import { Separator } from '@/components/ui/separator'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PulseWire - Actualités mondiales, perspectives locales',
  description: 'Dernières actualités technologie, business et tendances IA en français.',
}

export default async function FrHomePage() {
  let articles = { docs: [] as any[] }
  try {
    articles = await getArticles({ language: 'fr', limit: 20 })
  } catch {}

  const hero = articles.docs[0]
  const topStories = articles.docs.slice(1, 5)
  const latest = articles.docs.slice(5, 13)
  const aiTrends = articles.docs.filter((a) => a.category?.slug === 'ai-trends').slice(0, 3)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Ad */}
      <div className="w-full h-[90px] bg-gray-200 flex items-center justify-center text-gray-400 text-sm rounded mb-6">
        Publicité
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
          Pas encore d&apos;articles. Ajoutez-en depuis le panneau d&apos;administration.
        </div>
      )}

      <Separator className="mb-10" />

      {/* Latest */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-[#1D3557] mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-[#E63946] rounded inline-block" />
          Dernières nouvelles
        </h2>
        {latest.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latest.map((article, i) => (
              <React.Fragment key={article.id}>
                <NewsCard article={article} variant="default" />
                {i === 3 && (
                  <div className="bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm aspect-[4/3]">
                    Publicité
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Pas encore d&apos;articles.</p>
        )}
      </section>

      <Separator className="mb-10" />

      {/* AI Trends */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-[#1D3557] mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-[#0A0A0A] rounded inline-block" />
          Tendances IA
        </h2>
        {aiTrends.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {aiTrends.map((article) => (
              <NewsCard key={article.id} article={article} variant="default" />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Articles sur les tendances IA à venir.</p>
        )}
      </section>
    </div>
  )
}
