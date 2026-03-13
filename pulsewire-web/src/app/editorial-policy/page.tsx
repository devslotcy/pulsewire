import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Editorial Policy | PulseWire',
  description: 'PulseWire editorial standards, AI disclosure, and publishing guidelines.',
}

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-[#1D3557] mb-6">Editorial Policy</h1>

      <p className="text-lg text-gray-600 mb-10 leading-relaxed">
        PulseWire is committed to delivering accurate, fair, and original journalism.
        This page explains how we produce our content and the standards we uphold.
      </p>

      <div className="space-y-10">
        <section>
          <h2 className="text-2xl font-bold text-[#1D3557] mb-3">AI-Assisted Journalism</h2>
          <p className="text-gray-600 leading-relaxed">
            PulseWire uses artificial intelligence tools to assist in content creation, research,
            and translation. All AI-generated content is reviewed and edited by our editorial team
            before publication. We disclose the use of AI in our content production and maintain
            full editorial responsibility for every article published on this platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#1D3557] mb-3">Source Standards</h2>
          <p className="text-gray-600 leading-relaxed">
            Every article published on PulseWire cites its original source. We draw from
            established, reputable news organizations including Reuters, BBC, TechCrunch,
            Deutsche Welle, Le Monde, and other trusted outlets. We do not publish unverified
            rumors or speculation presented as fact.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#1D3557] mb-3">Accuracy & Corrections</h2>
          <p className="text-gray-600 leading-relaxed">
            We strive for factual accuracy in all our reporting. When errors are identified,
            we correct them promptly and transparently. Corrections are noted within the article.
            To report an error, please contact editorial@pulsewire.news.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#1D3557] mb-3">Independence</h2>
          <p className="text-gray-600 leading-relaxed">
            PulseWire&apos;s editorial content is independent of its advertising and commercial
            operations. Advertisers have no influence over our editorial decisions. Sponsored
            content, when published, is clearly labeled as such.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#1D3557] mb-3">Copyright & Fair Use</h2>
          <p className="text-gray-600 leading-relaxed">
            PulseWire produces original articles inspired by newsworthy events. We do not
            reproduce copyrighted material verbatim. All articles link back to original sources.
            If you believe your copyrighted content has been used improperly, please contact
            editorial@pulsewire.news and we will respond within 48 hours.
          </p>
        </section>
      </div>
    </div>
  )
}
