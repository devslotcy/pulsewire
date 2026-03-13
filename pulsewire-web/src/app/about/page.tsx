import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About PulseWire',
  description: 'Learn about PulseWire, our mission, and our AI-assisted editorial team.',
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-[#1D3557] mb-6">About PulseWire</h1>

      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
        PulseWire is a global news platform delivering technology, business, and AI trend coverage
        in English, German, and French. Our mission is to make complex, fast-moving news
        accessible, accurate, and insightful for readers worldwide.
      </p>

      <h2 className="text-2xl font-bold text-[#1D3557] mb-4">Our Editorial Approach</h2>
      <p className="text-gray-600 mb-6 leading-relaxed">
        PulseWire uses an AI-assisted editorial model. Our team combines artificial intelligence
        tools with human editorial oversight to produce original, well-researched articles.
        Every article is reviewed before publication to ensure factual accuracy and journalistic
        integrity. We always cite our original sources.
      </p>

      <h2 className="text-2xl font-bold text-[#1D3557] mb-4">What We Cover</h2>
      <ul className="space-y-2 text-gray-600 mb-8">
        <li className="flex items-start gap-2"><span className="text-[#E63946] font-bold">→</span> Technology & Innovation</li>
        <li className="flex items-start gap-2"><span className="text-[#E63946] font-bold">→</span> Business & Economy</li>
        <li className="flex items-start gap-2"><span className="text-[#E63946] font-bold">→</span> Artificial Intelligence & Machine Learning</li>
        <li className="flex items-start gap-2"><span className="text-[#E63946] font-bold">→</span> World News & Geopolitics</li>
        <li className="flex items-start gap-2"><span className="text-[#E63946] font-bold">→</span> Science & Research</li>
      </ul>

      <h2 className="text-2xl font-bold text-[#1D3557] mb-4">Our Team</h2>
      <p className="text-gray-600 mb-6 leading-relaxed">
        PulseWire is operated by an independent editorial team with a passion for technology
        journalism. Our AI-assisted editors work across multiple languages to bring you timely,
        relevant news from the most trusted sources in the world.
      </p>

      <h2 className="text-2xl font-bold text-[#1D3557] mb-4">Contact</h2>
      <p className="text-gray-600">
        For editorial inquiries, corrections, or partnerships, please visit our{' '}
        <a href="/contact" className="text-[#457B9D] hover:underline">Contact page</a>.
      </p>
    </div>
  )
}
