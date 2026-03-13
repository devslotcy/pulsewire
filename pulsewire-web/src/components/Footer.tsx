import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-gray-400 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-3 h-3 rounded-full bg-[#E63946] inline-block" />
              <span className="text-white font-bold text-lg">PulseWire</span>
            </div>
            <p className="text-sm">Global News, Local Insight.</p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Topics</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/category/technology" className="hover:text-white transition-colors">Technology</Link></li>
              <li><Link href="/category/business" className="hover:text-white transition-colors">Business</Link></li>
              <li><Link href="/category/world" className="hover:text-white transition-colors">World</Link></li>
              <li><Link href="/category/ai-trends" className="hover:text-white transition-colors">AI Trends</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/editorial-policy" className="hover:text-white transition-colors">Editorial Policy</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>&copy; {new Date().getFullYear()} PulseWire. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-white transition-colors">EN</Link>
            <Link href="/de" className="hover:text-white transition-colors">DE</Link>
            <Link href="/fr" className="hover:text-white transition-colors">FR</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
