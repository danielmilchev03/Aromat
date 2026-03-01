import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Aromat</title>
        <meta name="description" content="Aromat's privacy policy — how we handle your data." />
      </Head>

      <main className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-serif text-2xl text-black hover:text-accent transition-colors">
              Aromat
            </Link>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/gallery" className="text-gray-600 hover:text-black transition-colors">Gallery</Link>
              <Link href="/search" className="text-gray-600 hover:text-black transition-colors">Search</Link>
            </div>
          </div>
        </nav>

        {/* Header */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-16 border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-accent"></div>
              <p className="text-accent text-sm font-serif tracking-widest">LEGAL</p>
              <div className="h-px w-12 bg-accent"></div>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl text-black">Privacy Policy</h1>
            <p className="text-gray-600 text-lg">Last updated: March 1, 2026</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-6 space-y-12">

            <div className="space-y-4">
              <h2 className="font-serif text-2xl text-black">Overview</h2>
              <p className="text-gray-600 leading-relaxed">
                Your privacy matters to us. Aromat is a fragrance encyclopedia designed to be explored freely.
                We are committed to transparency about the limited data we collect and how it is used.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-8 space-y-4">
              <h2 className="font-serif text-2xl text-black">Information We Collect</h2>
              <p className="text-gray-600 leading-relaxed">
                Aromat is a publicly accessible, read-only encyclopedia. We do not require account creation,
                login, or any personal identifiers to use the site. The data we may collect includes:
              </p>
              <ul className="space-y-3 text-gray-600 ml-6">
                <li className="flex gap-3">
                  <span className="text-accent mt-1">◆</span>
                  <span><strong className="text-black">Usage analytics:</strong> Anonymous page views and interactions to understand how the site is used and improve the experience.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent mt-1">◆</span>
                  <span><strong className="text-black">Search queries:</strong> Aggregated, anonymized search terms to improve search relevancy.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent mt-1">◆</span>
                  <span><strong className="text-black">Technical data:</strong> Browser type, device type, and general geographic region for performance optimization.</span>
                </li>
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-8 space-y-4">
              <h2 className="font-serif text-2xl text-black">Contact Form Data</h2>
              <p className="text-gray-600 leading-relaxed">
                If you use our contact form, the information you provide (name, email, and message) is used
                solely to respond to your inquiry. We do not share this information with third parties or use it
                for marketing purposes.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-8 space-y-4">
              <h2 className="font-serif text-2xl text-black">Cookies</h2>
              <p className="text-gray-600 leading-relaxed">
                Aromat may use minimal, essential cookies to ensure the site functions properly. We do not use
                tracking cookies, advertising cookies, or any third-party cookie-based profiling tools.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-8 space-y-4">
              <h2 className="font-serif text-2xl text-black">Third-Party Services</h2>
              <p className="text-gray-600 leading-relaxed">
                Aromat is powered by the open-source PerfumAPI database. Fragrance data is fetched from this
                public API and displayed within our interface. We do not sell, share, or transfer any user data
                to third parties.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-8 space-y-4">
              <h2 className="font-serif text-2xl text-black">Your Rights</h2>
              <p className="text-gray-600 leading-relaxed">
                Since we collect minimal data and do not maintain user accounts, there is little personal data
                to manage. However, if you have questions or concerns about your data, you are welcome to
                contact us at any time.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-8 space-y-4">
              <h2 className="font-serif text-2xl text-black">Changes to This Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this privacy policy from time to time. Any changes will be reflected on this page
                with an updated revision date.
              </p>
            </div>

            {/* Contact CTA */}
            <div className="border-t border-gray-200 pt-12">
              <div className="bg-gray-50 border border-gray-200 p-8 text-center space-y-4">
                <h3 className="font-serif text-xl text-black">Questions?</h3>
                <p className="text-gray-600 text-sm">
                  If you have any questions about this privacy policy, please reach out.
                </p>
                <Link href="/contact" className="inline-block px-8 py-3 bg-accent text-white font-serif text-sm hover:bg-yellow-600 transition-colors">
                  Contact Us
                </Link>
              </div>
            </div>

          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
