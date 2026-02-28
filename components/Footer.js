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
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link href="/gallery" className="hover:text-accent transition-colors">Gallery</Link></li>
              <li><Link href="/" className="hover:text-accent transition-colors">Search</Link></li>
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest mb-4">Collections</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-accent transition-colors">Top Rated</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Most Popular</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">New Arrivals</a></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest mb-4">About</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-accent transition-colors">About Aromat</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Privacy</a></li>
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
