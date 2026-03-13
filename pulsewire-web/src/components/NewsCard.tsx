import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import type { Article } from '@/lib/api'

interface NewsCardProps {
  article: Article
  variant?: 'default' | 'hero' | 'compact'
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function NewsCard({ article, variant = 'default' }: NewsCardProps) {
  if (variant === 'hero') {
    return (
      <Link href={`/news/${article.slug}`} className="group block">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-gray-200">
          {article.image && (
            <Image
              src={article.image}
              alt={article.image_alt || article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            {article.category && (
              <Badge
                className="mb-2 text-white border-none"
                style={{ backgroundColor: article.category.color || '#E63946' }}
              >
                {article.category.name}
              </Badge>
            )}
            <h2 className="text-white text-2xl font-bold leading-tight group-hover:text-gray-200 transition-colors">
              {article.title}
            </h2>
            <p className="text-gray-300 text-sm mt-2 line-clamp-2">{article.summary}</p>
            <p className="text-gray-400 text-xs mt-3">{timeAgo(article.published_at)}</p>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link href={`/news/${article.slug}`} className="group flex gap-3 items-start">
        <div className="relative w-20 h-16 shrink-0 overflow-hidden rounded bg-gray-200">
          {article.image && (
            <Image
              src={article.image}
              alt={article.image_alt || article.title}
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[#E63946] font-medium mb-1">
            {article.category?.name}
          </p>
          <h3 className="text-sm font-semibold text-[#1D3557] leading-tight line-clamp-2 group-hover:text-[#E63946] transition-colors">
            {article.title}
          </h3>
          <p className="text-xs text-gray-400 mt-1">{timeAgo(article.published_at)}</p>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/news/${article.slug}`} className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-200">
        {article.image && (
          <Image
            src={article.image}
            alt={article.image_alt || article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>
      <div className="p-4">
        {article.category && (
          <Badge
            className="mb-2 text-white border-none text-xs"
            style={{ backgroundColor: article.category.color || '#457B9D' }}
          >
            {article.category.name}
          </Badge>
        )}
        <h3 className="font-semibold text-[#1D3557] leading-tight line-clamp-2 group-hover:text-[#E63946] transition-colors">
          {article.title}
        </h3>
        <p className="text-gray-500 text-sm mt-2 line-clamp-2">{article.summary}</p>
        <p className="text-gray-400 text-xs mt-3">{timeAgo(article.published_at)}</p>
      </div>
    </Link>
  )
}
