import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'PulseWire - Global News, Local Insight',
    template: '%s | PulseWire',
  },
  description: 'Breaking news, tech analysis, and AI trends from around the world.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3006'),
  openGraph: {
    siteName: 'PulseWire',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen bg-[#F8F9FA]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
