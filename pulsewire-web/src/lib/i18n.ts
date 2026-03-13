export const locales = ['en', 'de', 'fr'] as const
export type Locale = (typeof locales)[number]

export const localeNames: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
}

export const translations: Record<Locale, Record<string, string>> = {
  en: {
    latestNews: 'Latest News',
    aiTrends: 'AI Trends',
    noArticles: 'No articles yet.',
    aiTrendsSoon: 'AI Trends articles coming soon.',
    readMore: 'Read more',
    relatedNews: 'Related News',
    whatThisMeans: 'What This Means',
    keyPoints: 'Key Points',
    source: 'Source',
    home: 'Home',
    advertisement: 'Advertisement',
    justNow: 'Just now',
    hoursAgo: 'h ago',
    daysAgo: 'd ago',
    technology: 'Technology',
    business: 'Business',
    world: 'World',
    science: 'Science',
  },
  de: {
    latestNews: 'Neueste Nachrichten',
    aiTrends: 'KI-Trends',
    noArticles: 'Noch keine Artikel.',
    aiTrendsSoon: 'KI-Trend-Artikel kommen bald.',
    readMore: 'Weiterlesen',
    relatedNews: 'Verwandte Nachrichten',
    whatThisMeans: 'Was das bedeutet',
    keyPoints: 'Wichtige Punkte',
    source: 'Quelle',
    home: 'Startseite',
    advertisement: 'Werbung',
    justNow: 'Gerade eben',
    hoursAgo: ' Std. zuvor',
    daysAgo: ' T. zuvor',
    technology: 'Technologie',
    business: 'Wirtschaft',
    world: 'Welt',
    science: 'Wissenschaft',
  },
  fr: {
    latestNews: 'Dernières nouvelles',
    aiTrends: 'Tendances IA',
    noArticles: 'Pas encore d\'articles.',
    aiTrendsSoon: 'Articles sur les tendances IA à venir.',
    readMore: 'Lire la suite',
    relatedNews: 'Articles connexes',
    whatThisMeans: 'Ce que cela signifie',
    keyPoints: 'Points clés',
    source: 'Source',
    home: 'Accueil',
    advertisement: 'Publicité',
    justNow: 'À l\'instant',
    hoursAgo: 'h',
    daysAgo: 'j',
    technology: 'Technologie',
    business: 'Économie',
    world: 'Monde',
    science: 'Science',
  },
}

export function t(locale: Locale, key: string): string {
  return translations[locale]?.[key] || translations['en'][key] || key
}
