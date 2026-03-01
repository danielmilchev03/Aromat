import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl">Aromat</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Modern fragrance encyclopedia.<br />Elegant. Minimal. Pure.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium mb-5">Explore</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="text-gray-400 hover:text-accent transition-colors duration-200">Home</Link></li>
              <li><Link href="/gallery" className="text-gray-400 hover:text-accent transition-colors duration-200">Gallery</Link></li>
              <li><Link href="/search" className="text-gray-400 hover:text-accent transition-colors duration-200">Search</Link></li>
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium mb-5">Collections</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/collections/top-rated" className="text-gray-400 hover:text-accent transition-colors duration-200">Top Rated</Link></li>
              <li><Link href="/collections/most-popular" className="text-gray-400 hover:text-accent transition-colors duration-200">Most Popular</Link></li>
              <li><Link href="/collections/new-arrivals" className="text-gray-400 hover:text-accent transition-colors duration-200">New Arrivals</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium mb-5">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-gray-400 hover:text-accent transition-colors duration-200">About Aromat</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-accent transition-colors duration-200">Contact</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-accent transition-colors duration-200">Privacy</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider & Bottom */}
        <div className="border-t border-gray-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs">
            &copy; 2026 Aromat. All rights reserved.
          </p>
          <p className="text-gray-700 text-xs">
            Curated fragrance encyclopedia
          </p>
        </div>
      </div>
    </footer>
  );
}
