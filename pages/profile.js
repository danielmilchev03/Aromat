import { getSession } from 'next-auth/react';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TABS = [
  { key: 'HAVE', label: 'I Have It', emoji: '✓', color: 'emerald' },
  { key: 'WANT', label: 'I Want It', emoji: '♥', color: 'rose' },
  { key: 'HAD', label: "I've Had It", emoji: '◷', color: 'amber' },
  { key: 'REVIEWS', label: 'My Reviews', emoji: '★', color: 'accent' },
];

function CollectionTab({ items, status, onRemove, loading: parentLoading }) {
  if (parentLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50 animate-pulse h-24" />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    const msgs = {
      HAVE: "You haven't added any fragrances you own yet.",
      WANT: "You haven't added any fragrances to your wishlist yet.",
      HAD: "You haven't marked any past fragrances yet.",
    };
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-sm">{msgs[status]}</p>
        <Link href="/gallery" className="text-accent text-sm hover:underline mt-2 inline-block">
          Browse the gallery →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <div key={item.perfumeId} className="group relative rounded-2xl border border-gray-100 bg-white hover:shadow-card transition-all duration-300 overflow-hidden">
          <Link href={`/perfume/${item.perfumeId}`} className="flex items-center gap-4 p-4">
            <div className="w-16 h-16 rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden">
              {item.perfume?.image_url ? (
                <img src={item.perfume.image_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-accent text-sm">✦</div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-accent text-[10px] font-serif uppercase tracking-[0.15em] mb-0.5 truncate">
                {item.perfume?.brand || 'Unknown Brand'}
              </p>
              <p className="font-serif text-sm text-gray-900 truncate">
                {item.perfume?.name || 'Unknown Fragrance'}
              </p>
            </div>
          </Link>
          <button
            onClick={() => onRemove(item.perfumeId)}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 opacity-0 group-hover:opacity-100 transition-all duration-200"
            title="Remove from collection"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

const SILLAGE_LABELS = { 1: 'Intimate', 2: 'Moderate', 3: 'Strong', 4: 'Very Strong', 5: 'Enormous' };
const LONGEVITY_LABELS = { 1: 'Very Weak', 2: 'Weak', 3: 'Moderate', 4: 'Long Lasting', 5: 'Eternal' };

function ReviewsTab({ items, onDelete, loading: parentLoading }) {
  if (parentLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50 animate-pulse h-32" />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-sm">You haven&apos;t reviewed any fragrances yet.</p>
        <Link href="/gallery" className="text-accent text-sm hover:underline mt-2 inline-block">
          Browse the gallery →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <div key={item.id} className="group relative rounded-2xl border border-gray-100 bg-white hover:shadow-card transition-all duration-300 overflow-hidden">
          <Link href={`/perfume/${item.perfumeId}`} className="flex items-center gap-4 p-4">
            <div className="w-16 h-16 rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden">
              {item.perfume?.image_url ? (
                <img src={item.perfume.image_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-accent text-sm">✦</div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-accent text-[10px] font-serif uppercase tracking-[0.15em] mb-0.5 truncate">
                {item.perfume?.brand || 'Unknown Brand'}
              </p>
              <p className="font-serif text-sm text-gray-900 truncate">
                {item.perfume?.name || 'Unknown Fragrance'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-accent text-xs">★ {item.rating}/5</span>
                <span className="text-[10px] text-gray-400">{SILLAGE_LABELS[item.sillage]} · {LONGEVITY_LABELS[item.longevity]}</span>
              </div>
            </div>
          </Link>
          <button
            onClick={() => onDelete(item.perfumeId)}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 opacity-0 group-hover:opacity-100 transition-all duration-200"
            title="Delete review"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

export default function Profile() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('HAVE');
  const [collection, setCollection] = useState({ HAVE: [], WANT: [], HAD: [] });
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const fetchCollection = useCallback(async () => {
    try {
      const res = await fetch('/api/collection');
      const data = await res.json();
      const items = data.items || [];

      // Group by status
      const grouped = { HAVE: [], WANT: [], HAD: [] };
      for (const item of items) {
        if (grouped[item.status]) {
          grouped[item.status].push(item);
        }
      }

      // Fetch perfume details for each item
      const perfumeIds = items.map((i) => i.perfumeId);
      const perfumeDetails = {};

      await Promise.all(
        perfumeIds.map(async (id) => {
          try {
            const r = await fetch(`/api/fragrances?id=${id}`);
            if (r.ok) {
              const perfume = await r.json();
              perfumeDetails[id] = perfume;
            }
          } catch {
            // Skip if can't fetch
          }
        })
      );

      // Attach perfume details to collection items
      for (const status of Object.keys(grouped)) {
        grouped[status] = grouped[status].map((item) => ({
          ...item,
          perfume: perfumeDetails[item.perfumeId] || null,
        }));
      }

      setCollection(grouped);
    } catch (err) {
      console.error('Failed to fetch collection:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      fetchCollection();
      fetchReviews();
    }
  }, [session, fetchCollection]);

  const handleRemove = async (perfumeId) => {
    try {
      await fetch('/api/collection', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ perfumeId }),
      });

      // Optimistically update UI
      setCollection((prev) => {
        const updated = { ...prev };
        for (const status of Object.keys(updated)) {
          updated[status] = updated[status].filter((i) => i.perfumeId !== perfumeId);
        }
        return updated;
      });
    } catch (err) {
      console.error('Failed to remove:', err);
    }
  };

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await fetch('/api/reviews/mine');
      if (!res.ok) return;
      const data = await res.json();
      const items = data.reviews || [];

      const perfumeDetails = {};
      await Promise.all(
        items.map(async (r) => {
          try {
            const pr = await fetch(`/api/fragrances?id=${r.perfumeId}`);
            if (pr.ok) perfumeDetails[r.perfumeId] = await pr.json();
          } catch {}
        })
      );

      setReviews(items.map((r) => ({ ...r, perfume: perfumeDetails[r.perfumeId] || null })));
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleDeleteReview = async (perfumeId) => {
    try {
      await fetch('/api/reviews', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ perfumeId }),
      });
      setReviews((prev) => prev.filter((r) => r.perfumeId !== perfumeId));
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  };

  if (!session) return null;

  const user = session.user;
  const joinDate = new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const totalCount = collection.HAVE.length + collection.WANT.length + collection.HAD.length;

  return (
    <>
      <Head>
        <title>Profile — Aromat</title>
      </Head>
      <Navbar />

      <main className="min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Profile header */}
          <div className="flex items-center gap-6 mb-12">
            {user.image ? (
              <img
                src={user.image}
                alt=""
                className="w-20 h-20 rounded-full ring-4 ring-gray-100"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-accent/10 text-accent flex items-center justify-center text-2xl font-serif">
                {user.name?.[0] || user.email?.[0] || '?'}
              </div>
            )}
            <div>
              <h1 className="font-serif text-2xl text-black">{user.name}</h1>
              <p className="text-gray-400 text-sm mt-1">{user.email}</p>
            </div>
          </div>

          {/* Account info card */}
          <div className="rounded-3xl border border-gray-200/80 bg-white p-8 mb-8">
            <h2 className="font-serif text-lg text-black mb-6">Account</h2>
            <dl className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <dt className="text-sm text-gray-500">Name</dt>
                <dd className="text-sm text-gray-900">{user.name || '—'}</dd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <dt className="text-sm text-gray-500">Email</dt>
                <dd className="text-sm text-gray-900">{user.email}</dd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <dt className="text-sm text-gray-500">Sign-in method</dt>
                <dd className="text-sm text-gray-900">Google</dd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <dt className="text-sm text-gray-500">Collection</dt>
                <dd className="text-sm text-gray-900">{loading ? '…' : `${totalCount} fragrance${totalCount !== 1 ? 's' : ''}`}</dd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <dt className="text-sm text-gray-500">Reviews</dt>
                <dd className="text-sm text-gray-900">{reviewsLoading ? '…' : `${reviews.length} review${reviews.length !== 1 ? 's' : ''}`}</dd>
              </div>
              <div className="flex justify-between items-center py-2">
                <dt className="text-sm text-gray-500">Member since</dt>
                <dd className="text-sm text-gray-900">{joinDate}</dd>
              </div>
            </dl>
          </div>

          {/* Collection & Reviews section */}
          <div className="rounded-3xl border border-gray-200/80 bg-white p-8 mb-8">
            <h2 className="font-serif text-lg text-black mb-6">My Collection</h2>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-gray-50 rounded-2xl mb-6">
              {TABS.map((tab) => {
                const tabCount = tab.key === 'REVIEWS' ? reviews.length : (collection[tab.key]?.length || 0);
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`
                      flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200
                      ${isActive
                        ? 'bg-white shadow-sm text-gray-900'
                        : 'text-gray-500 hover:text-gray-700'
                      }
                    `}
                  >
                    <span>{tab.emoji}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ').pop()}</span>
                    {tabCount > 0 && (
                      <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-gray-100 text-gray-600' : 'bg-gray-200/60 text-gray-400'}`}>
                        {tabCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            {activeTab === 'REVIEWS' ? (
              <ReviewsTab items={reviews} onDelete={handleDeleteReview} loading={reviewsLoading} />
            ) : (
              <CollectionTab
                items={collection[activeTab]}
                status={activeTab}
                onRemove={handleRemove}
                loading={loading}
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-6 py-3 rounded-2xl text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200 transition-colors duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
