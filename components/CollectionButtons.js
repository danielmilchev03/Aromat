import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const STATUSES = [
  {
    key: 'HAVE',
    label: 'I Have It',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    activeClass: 'bg-emerald-50 border-emerald-300 text-emerald-700',
  },
  {
    key: 'WANT',
    label: 'I Want It',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    activeClass: 'bg-rose-50 border-rose-300 text-rose-700',
  },
  {
    key: 'HAD',
    label: "I've Had It",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    activeClass: 'bg-amber-50 border-amber-300 text-amber-700',
  },
];

export default function CollectionButtons({ perfumeId }) {
  const { data: session } = useSession();
  const [activeStatus, setActiveStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch current status on mount
  useEffect(() => {
    if (!session?.user?.id || !perfumeId) return;

    fetch(`/api/collection?perfumeId=${perfumeId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.entry) {
          setActiveStatus(data.entry.status);
        }
      })
      .catch(() => {});
  }, [session, perfumeId]);

  if (!session) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 text-center">
        <p className="text-sm text-gray-500">
          <Link href="/auth/signin" className="text-accent hover:underline font-medium">Sign in</Link> to add this fragrance to your collection
        </p>
      </div>
    );
  }

  const handleToggle = async (statusKey) => {
    if (loading) return;
    setLoading(true);

    try {
      if (activeStatus === statusKey) {
        // Remove from collection
        await fetch('/api/collection', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ perfumeId }),
        });
        setActiveStatus(null);
      } else {
        // Set / update status
        await fetch('/api/collection', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ perfumeId, status: statusKey }),
        });
        setActiveStatus(statusKey);
      }
    } catch (err) {
      console.error('Collection update failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2.5">
      <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-medium">
        My Collection
      </p>
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map((s) => {
          const isActive = activeStatus === s.key;
          return (
            <button
              key={s.key}
              onClick={() => handleToggle(s.key)}
              disabled={loading}
              className={`
                inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium
                border transition-all duration-200
                ${isActive
                  ? s.activeClass
                  : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 bg-white'
                }
                ${loading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
              `}
            >
              {s.icon}
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
