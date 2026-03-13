import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | PulseWire',
  description: 'PulseWire privacy policy - how we collect and use your data.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-[#1D3557] mb-3">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-10">Last updated: February 2026</p>

      <div className="space-y-8 text-gray-600">
        <section>
          <h2 className="text-xl font-bold text-[#1D3557] mb-3">1. Information We Collect</h2>
          <p className="leading-relaxed">
            PulseWire collects minimal data necessary to operate the service. This includes
            anonymous usage analytics (page views, session duration) via Google Analytics,
            and any information you voluntarily provide through contact forms or newsletter sign-ups.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1D3557] mb-3">2. Cookies</h2>
          <p className="leading-relaxed">
            We use cookies for analytics and advertising purposes. Analytics cookies help us
            understand how visitors use our site. Advertising cookies are used by Google AdSense
            and similar services to serve relevant advertisements. You can control cookies through
            your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1D3557] mb-3">3. Advertising</h2>
          <p className="leading-relaxed">
            PulseWire uses third-party advertising services including Google AdSense. These
            services may use cookies to serve ads based on your prior visits to our website
            or other websites. Google&apos;s use of advertising cookies enables it and its
            partners to serve ads based on your visit to our site and other sites on the Internet.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1D3557] mb-3">4. Data Sharing</h2>
          <p className="leading-relaxed">
            We do not sell your personal data to third parties. Data is shared only with
            service providers necessary to operate PulseWire (analytics, hosting, advertising).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1D3557] mb-3">5. Your Rights</h2>
          <p className="leading-relaxed">
            Under GDPR and applicable data protection laws, you have the right to access,
            correct, or delete your personal data. To exercise these rights, contact us at
            privacy@pulsewire.news.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1D3557] mb-3">6. Contact</h2>
          <p className="leading-relaxed">
            For privacy-related inquiries, email us at{' '}
            <a href="mailto:privacy@pulsewire.news" className="text-[#457B9D] hover:underline">
              privacy@pulsewire.news
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
