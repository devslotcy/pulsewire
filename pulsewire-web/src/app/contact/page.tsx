import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact PulseWire',
  description: 'Get in touch with the PulseWire editorial team.',
}

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-[#1D3557] mb-6">Contact Us</h1>

      <p className="text-lg text-gray-600 mb-10 leading-relaxed">
        We welcome feedback, corrections, tip-offs, and partnership inquiries.
        Please use the appropriate contact below.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="font-bold text-[#1D3557] mb-2">Editorial Inquiries</h3>
          <p className="text-gray-500 text-sm mb-3">Corrections, tips, story suggestions</p>
          <a href="mailto:editorial@pulsewire.news" className="text-[#457B9D] hover:underline text-sm">
            editorial@pulsewire.news
          </a>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="font-bold text-[#1D3557] mb-2">Partnerships & Advertising</h3>
          <p className="text-gray-500 text-sm mb-3">Sponsored content, media partnerships</p>
          <a href="mailto:partners@pulsewire.news" className="text-[#457B9D] hover:underline text-sm">
            partners@pulsewire.news
          </a>
        </div>
      </div>

      <div className="bg-[#F8F9FA] rounded-lg p-6 border border-gray-200">
        <h3 className="font-bold text-[#1D3557] mb-3">Corrections Policy</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          PulseWire is committed to accuracy. If you believe an article contains a factual error,
          please email us with the article URL and the correction. We review all correction
          requests within 48 hours and publish corrections prominently.
        </p>
      </div>
    </div>
  )
}
