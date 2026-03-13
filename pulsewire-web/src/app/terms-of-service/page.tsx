import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | PulseWire',
  description: 'PulseWire terms of service and usage conditions.',
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-[#1D3557] mb-3">Terms of Service</h1>
      <p className="text-sm text-gray-400 mb-10">Last updated: February 2026</p>

      <div className="space-y-8 text-gray-600">
        <section>
          <h2 className="text-xl font-bold text-[#1D3557] mb-3">1. Acceptance of Terms</h2>
          <p className="leading-relaxed">
            By accessing PulseWire, you agree to these Terms of Service. If you do not agree,
            please discontinue use of the website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1D3557] mb-3">2. Content Use</h2>
          <p className="leading-relaxed">
            All content on PulseWire is for informational purposes only. You may not reproduce,
            distribute, or republish our content without explicit written permission. Sharing
            links to our articles is encouraged.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1D3557] mb-3">3. Disclaimer</h2>
          <p className="leading-relaxed">
            PulseWire provides news and information for general purposes. We do not provide
            financial, legal, or medical advice. Always consult qualified professionals for
            such matters. We are not liable for decisions made based on our content.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1D3557] mb-3">4. Third-Party Links</h2>
          <p className="leading-relaxed">
            Our articles link to third-party websites. PulseWire is not responsible for the
            content or privacy practices of external sites.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1D3557] mb-3">5. Changes to Terms</h2>
          <p className="leading-relaxed">
            We reserve the right to modify these terms at any time. Continued use of the site
            after changes constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1D3557] mb-3">6. Contact</h2>
          <p className="leading-relaxed">
            For questions about these terms, contact{' '}
            <a href="mailto:legal@pulsewire.news" className="text-[#457B9D] hover:underline">
              legal@pulsewire.news
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
