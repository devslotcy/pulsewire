'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Search } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

function setLangCookie(lang: string) {
  document.cookie = `preferred-lang=${lang};path=/;max-age=${60 * 60 * 24 * 365}`
}

const categories = [
  { label: 'Technology', labelDe: 'Technologie', labelFr: 'Technologie', href: '/category/technology' },
  { label: 'Business', labelDe: 'Wirtschaft', labelFr: 'Économie', href: '/category/business' },
  { label: 'World', labelDe: 'Welt', labelFr: 'Monde', href: '/category/world' },
  { label: 'Science', labelDe: 'Wissenschaft', labelFr: 'Science', href: '/category/science' },
  { label: 'AI Trends', labelDe: 'KI-Trends', labelFr: 'Tendances IA', href: '/category/ai-trends' },
]

const languages = [
  { label: 'EN', href: '/' },
  { label: 'DE', href: '/de' },
  { label: 'FR', href: '/fr' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()
  const router = useRouter()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const currentLang = pathname.startsWith('/de') ? 'de' : pathname.startsWith('/fr') ? 'fr' : 'en'

  function getCatLabel(cat: typeof categories[0]) {
    if (currentLang === 'de') return cat.labelDe
    if (currentLang === 'fr') return cat.labelFr
    return cat.label
  }

  function isActiveLang(href: string) {
    if (href === '/' && currentLang === 'en') return true
    if (href === '/de' && currentLang === 'de') return true
    if (href === '/fr' && currentLang === 'fr') return true
    return false
  }

  const logoHref = currentLang === 'de' ? '/de' : currentLang === 'fr' ? '/fr' : '/'

  return (
    <header className="bg-[#0A0A0A] text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href={logoHref} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#E63946] inline-block" />
            <span className="text-xl font-bold tracking-tight">PulseWire</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                {getCatLabel(cat)}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Language switcher */}
            <div className="hidden md:flex items-center gap-2 text-sm">
              {languages.map((lang, i) => (
                <span key={lang.href} className="flex items-center gap-2">
                  <Link
                    href={lang.href}
                    onClick={() => setLangCookie(lang.label.toLowerCase())}
                    className={`transition-colors ${
                      isActiveLang(lang.href)
                        ? 'text-white font-bold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {lang.label}
                  </Link>
                  {i < languages.length - 1 && <span className="text-gray-600">|</span>}
                </span>
              ))}
            </div>

            {/* Search */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="bg-gray-800 text-white text-sm px-3 py-1.5 rounded-lg w-48 focus:outline-none focus:ring-1 focus:ring-[#E63946]"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={16} />
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="text-gray-300 hover:text-white transition-colors">
                <Search size={18} />
              </button>
            )}

            {/* Mobile toggle */}
            <button
              className="md:hidden text-gray-300 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-800 py-4">
            <nav className="flex flex-col gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {getCatLabel(cat)}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-800">
              {languages.map((lang) => (
                <Link
                  key={lang.href}
                  href={lang.href}
                  className={`text-sm transition-colors ${
                    isActiveLang(lang.href) ? 'text-white font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => { setLangCookie(lang.label.toLowerCase()); setMobileOpen(false) }}
                >
                  {lang.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
