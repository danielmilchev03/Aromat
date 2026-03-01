import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl mb-2">Aromat</h3>
            <p className="text-gray-400 text-sm">
              Modern fragrance encyclopedia. Elegant. Minimal. Pure.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-accent hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/gallery" className="text-accent hover:text-white transition-colors">Gallery</Link></li>
              <li><Link href="/search" className="text-accent hover:text-white transition-colors">Search</Link></li>
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest mb-4">Collections</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/collections/top-rated" className="text-accent hover:text-white transition-colors">Top Rated</Link></li>
              <li><Link href="/collections/most-popular" className="text-accent hover:text-white transition-colors">Most Popular</Link></li>
              <li><Link href="/collections/new-arrivals" className="text-accent hover:text-white transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest mb-4">About</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-accent hover:text-white transition-colors">About Aromat</Link></li>
              <li><Link href="/contact" className="text-accent hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="text-accent hover:text-white transition-colors">Privacy</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-gray-600 text-sm">
            © 2026 Aromat. All rights reserved. Curated fragrance encyclopedia.
          </p>
        </div>
      </div>
    </footer>
  );
}
