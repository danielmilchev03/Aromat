import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

// ── Label maps ──────────────────────────────────────────────

const SILLAGE_LABELS = { 1: 'Intimate', 2: 'Moderate', 3: 'Strong', 4: 'Very Strong', 5: 'Enormous' };
const LONGEVITY_LABELS = { 1: 'Very Weak', 2: 'Weak', 3: 'Moderate', 4: 'Long Lasting', 5: 'Eternal' };
const PRICE_LABELS = { 1: 'Way Overpriced', 2: 'Overpriced', 3: 'OK', 4: 'Good Value', 5: 'Great Value' };
const DAYNIGHT_LABELS = { 1: 'Day', 2: 'Mostly Day', 3: 'Versatile', 4: 'Mostly Night', 5: 'Night' };
const SEASON_LABELS = { 1: 'Poor', 2: 'Below Avg', 3: 'Adequate', 4: 'Good', 5: 'Perfect' };
const OVERALL_LABELS = { 1: 'Poor', 2: 'Below Avg', 3: 'Average', 4: 'Good', 5: 'Excellent' };

// ── Horizontal vote bar (for aggregates) ────────────────────

function VoteBar({ label, value, max = 5, icon }) {
  const pct = ((value || 0) / max) * 100;
  return (
    <div className="flex items-center gap-3">
      {icon && <span className="text-sm w-5 text-center flex-shrink-0">{icon}</span>}
      <span className="text-xs text-gray-500 font-medium w-24 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-accent transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-serif text-gray-700 w-7 text-right flex-shrink-0">
        {value ? value.toFixed(1) : '—'}
      </span>
    </div>
  );
}

// ── Rating selector (shows label for each end of scale) ─────

function RatingInput({ label, value, onChange, lowLabel, highLabel }) {
  return (
    <div>
      <p className="text-sm text-gray-600 font-medium mb-2">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-gray-500 w-16 text-right flex-shrink-0">{lowLabel}</span>
        <div className="flex gap-1 flex-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={`flex-1 h-8 rounded-lg text-xs font-medium transition-all duration-200 ${
                n === value
                  ? 'bg-accent review-selected shadow-sm scale-105'
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-gray-500 w-16 flex-shrink-0">{highLabel}</span>
      </div>
    </div>
  );
}

// ── Star rating input (for overall) ─────────────────────────

function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div>
      <p className="text-sm text-gray-600 font-medium mb-2">Overall Rating</p>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className="text-2xl transition-all duration-150 hover:scale-110"
          >
            <span className={n <= (hover || value || 0) ? 'text-accent' : 'review-star-empty'}>★</span>
          </button>
        ))}
          <span className="text-xs text-gray-400 ml-2 font-serif">{OVERALL_LABELS[hover || value] || ''}</span>
      </div>
    </div>
  );
}

// ── Individual review card ──────────────────────────────────

function ReviewCard({ review, isOwn, onEdit, onDelete }) {
  const dateStr = new Date(review.createdAt).toLocaleDateString('en-US', {
    month: 'short', year: 'numeric',
  });

  return (
    <div className={`p-5 rounded-2xl border transition-all ${isOwn ? 'bg-accent/5 border-gray-200' : 'bg-white border-gray-100'}`}>
      <div className="flex items-center gap-3 mb-3">
        {review.user?.image ? (
          <img src={review.user.image} alt="" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-serif">
            {review.user?.name?.[0] || '?'}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-900 font-medium truncate">{review.user?.name || 'Anonymous'}</p>
            {isOwn && <span className="text-[9px] bg-accent/10 text-accent px-1.5 py-0.5 rounded-full font-medium">You</span>}
          </div>
          <p className="text-[10px] text-gray-400">{dateStr}</p>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-xs ${i < review.rating ? 'text-accent' : 'review-star-empty'}`}>★</span>
          ))}
        </div>
      </div>

      {/* Rating pills */}
      <div className="flex flex-wrap gap-1.5 text-[10px] mb-2">
        <span className="px-2 py-0.5 rounded-full bg-gray-50 text-gray-500">🫧 {SILLAGE_LABELS[review.sillage]}</span>
        <span className="px-2 py-0.5 rounded-full bg-gray-50 text-gray-500">⏱ {LONGEVITY_LABELS[review.longevity]}</span>
        <span className="px-2 py-0.5 rounded-full bg-gray-50 text-gray-500">💰 {PRICE_LABELS[review.priceValue]}</span>
        <span className="px-2 py-0.5 rounded-full bg-gray-50 text-gray-500">{review.dayNight <= 2 ? '☀️' : review.dayNight >= 4 ? '🌙' : '🔄'} {DAYNIGHT_LABELS[review.dayNight]}</span>
      </div>

      {/* Seasons mini */}
      <div className="flex gap-3 text-[10px] text-gray-400 mb-2">
        <span>🌸 {review.spring}/5</span>
        <span>☀️ {review.summer}/5</span>
        <span>🍂 {review.fall}/5</span>
        <span>❄️ {review.winter}/5</span>
      </div>

      {review.comment && (
        <p className="text-sm text-gray-600 leading-relaxed mt-2">{review.comment}</p>
      )}

      {isOwn && (
        <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100">
          <button onClick={onEdit} className="text-xs text-accent hover:underline">Edit</button>
          <button onClick={onDelete} className="text-xs text-red-400 hover:underline">Delete</button>
        </div>
      )}
    </div>
  );
}

// ── Main export ─────────────────────────────────────────────

export default function ReviewSection({ perfumeId }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState([]);
  const [aggregates, setAggregates] = useState(null);
  const [count, setCount] = useState(0);
  const [userReview, setUserReview] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form state — always mounted (null = unselected)
  const [form, setForm] = useState({
    rating: 0, sillage: 0, longevity: 0, priceValue: 0,
    dayNight: 0, spring: 0, summer: 0, fall: 0, winter: 0, comment: '',
  });

  const allRated = form.rating && form.sillage && form.longevity && form.priceValue && form.dayNight && form.spring && form.summer && form.fall && form.winter;

  const set = (field) => (val) => setForm((prev) => ({ ...prev, [field]: val }));

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?perfumeId=${encodeURIComponent(perfumeId)}`);
      const data = await res.json();
      setReviews(data.reviews || []);
      setAggregates(data.aggregates || null);
      setCount(data.count || 0);

      if (session?.user?.id) {
        const mine = (data.reviews || []).find((r) => r.userId === session.user.id);
        setUserReview(mine || null);
        if (mine && !editing) {
          setForm({
            rating: mine.rating, sillage: mine.sillage, longevity: mine.longevity,
            priceValue: mine.priceValue, dayNight: mine.dayNight,
            spring: mine.spring, summer: mine.summer, fall: mine.fall, winter: mine.winter,
            comment: mine.comment || '',
          });
        }
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [perfumeId, session, editing]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ perfumeId, ...form }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit');
      }
      setEditing(false);
      fetchReviews();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch('/api/reviews', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ perfumeId }),
      });
      setUserReview(null);
      setForm({ rating: 0, sillage: 0, longevity: 0, priceValue: 0, dayNight: 0, spring: 0, summer: 0, fall: 0, winter: 0, comment: '' });
      fetchReviews();
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  };

  const handleEdit = () => {
    if (userReview) {
      setForm({
        rating: userReview.rating, sillage: userReview.sillage, longevity: userReview.longevity,
        priceValue: userReview.priceValue, dayNight: userReview.dayNight,
        spring: userReview.spring, summer: userReview.summer, fall: userReview.fall, winter: userReview.winter,
        comment: userReview.comment || '',
      });
    }
    setEditing(true);
  };

  if (loading) {
    return (
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-100 rounded w-48 mx-auto" />
            <div className="h-40 bg-gray-50 rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  const otherReviews = reviews.filter((r) => r.userId !== session?.user?.id);

  return (
    <section className="py-20 bg-light-bg">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col items-center mb-12">
          <p className="divider-accent text-accent text-xs font-serif tracking-[0.3em] uppercase">Community</p>
          <h2 className="font-serif text-3xl text-black mt-3 text-center">Reviews & Ratings</h2>
          {count === 0 && (
            <p className="text-gray-400 text-sm mt-3 text-center">No reviews yet — yours could be the first.</p>
          )}
        </div>

        {/* Community Snapshot (only shows when there are reviews) */}
        {aggregates && (
          <div className="rounded-3xl border border-gray-200/80 bg-white p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
              {/* Big score */}
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="27" fill="none" className="review-ring-track" strokeWidth="5" />
                    <circle
                      cx="32" cy="32" r="27" fill="none" className="review-ring-fill" strokeWidth="5"
                      strokeDasharray={`${((aggregates.rating / 5) * 169.6)} 169.6`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-serif text-lg text-gray-900">{aggregates.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div>
                  <p className="font-serif text-base text-gray-900">Community Score</p>
                  <p className="text-xs text-gray-400">{count} review{count !== 1 ? 's' : ''}</p>
                </div>
              </div>

              {/* Season badges */}
              <div className="flex gap-4 sm:ml-auto">
                {[
                  { icon: '🌸', label: 'Spring', val: aggregates.spring },
                  { icon: '☀️', label: 'Summer', val: aggregates.summer },
                  { icon: '🍂', label: 'Fall', val: aggregates.fall },
                  { icon: '❄️', label: 'Winter', val: aggregates.winter },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-base mb-0.5">{s.icon}</div>
                    <div className="text-xs font-serif text-gray-700">{s.val.toFixed(1)}</div>
                    <div className="text-[9px] text-gray-400">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bars */}
            <div className="space-y-3">
              <VoteBar icon="🫧" label="Sillage" value={aggregates.sillage} />
              <VoteBar icon="⏱" label="Longevity" value={aggregates.longevity} />
              <VoteBar icon="💰" label="Value" value={aggregates.priceValue} />
              <VoteBar icon={aggregates.dayNight <= 2.5 ? '☀️' : aggregates.dayNight >= 3.5 ? '🌙' : '🔄'} label="Day / Night" value={aggregates.dayNight} />
            </div>
          </div>
        )}

        {/* Your Rating — always visible if signed in */}
        {session ? (
          <div className="rounded-3xl border border-gray-200/80 bg-white p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-lg text-black">
                {userReview && !editing ? 'Your Rating' : 'Rate this Fragrance'}
              </h3>
              {userReview && !editing && (
                <div className="flex gap-3">
                  <button onClick={handleEdit} className="text-xs text-accent hover:underline">Edit</button>
                  <button onClick={handleDelete} className="text-xs text-red-400 hover:underline">Delete</button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              {/* Overall rating alone on top */}
              <div className="mb-6">
                <StarInput value={form.rating} onChange={set('rating')} />
              </div>

              {/* 2×2 grid: Sillage + Longevity | Value + Day/Night */}
              <div className="grid md:grid-cols-2 gap-x-10 gap-y-5 mb-6">
                <div className="space-y-5">
                  <RatingInput label="Sillage" value={form.sillage} onChange={set('sillage')} lowLabel="Intimate" highLabel="Enormous" />
                  <RatingInput label="Longevity" value={form.longevity} onChange={set('longevity')} lowLabel="Very Weak" highLabel="Eternal" />
                </div>
                <div className="space-y-5">
                  <RatingInput label="Value for Money" value={form.priceValue} onChange={set('priceValue')} lowLabel="Overpriced" highLabel="Great Value" />
                  <RatingInput label="Day / Night" value={form.dayNight} onChange={set('dayNight')} lowLabel="Day" highLabel="Night" />
                </div>
              </div>

              {/* Seasons row */}
              <div className="border-t border-gray-100 pt-6 mb-6">
                <p className="text-sm text-gray-600 font-medium mb-4">Season Suitability</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { key: 'spring', icon: '🌸', label: 'Spring' },
                    { key: 'summer', icon: '☀️', label: 'Summer' },
                    { key: 'fall', icon: '🍂', label: 'Fall' },
                    { key: 'winter', icon: '❄️', label: 'Winter' },
                  ].map((s) => (
                    <div key={s.key}>
                      <p className="text-xs text-gray-500 mb-1.5 text-center">{s.icon} {s.label}</p>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => set(s.key)(n)}
                            className={`flex-1 h-7 rounded text-[10px] font-medium transition-all duration-200 ${
                              n === form[s.key]
                                ? 'bg-accent review-selected shadow-sm'
                                : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-400 mt-0.5 px-0.5">
                        <span>Poor</span>
                        <span>Perfect</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="border-t border-gray-100 pt-6">
                <label className="block text-sm text-gray-600 font-medium mb-2">Comment (optional)</label>
                <textarea
                  value={form.comment}
                  onChange={(e) => setForm((prev) => ({ ...prev, comment: e.target.value }))}
                  maxLength={2000}
                  rows={3}
                  placeholder="Share your thoughts about this fragrance…"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 review-textarea focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 resize-none transition-all"
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-[10px] text-gray-300">{form.comment.length} / 2000</p>
                  <button
                    type="submit"
                    disabled={submitting || (!userReview && !allRated)}
                    className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Saving…' : userReview ? 'Update Rating' : 'Submit Rating'}
                  </button>
                </div>
                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
              </div>
            </form>
          </div>
        ) : (
          <div className="rounded-3xl border border-gray-200/80 bg-white p-8 mb-8 text-center">
            <p className="text-sm text-gray-400">
              <Link href="/auth/signin" className="text-accent hover:underline">Sign in</Link> to rate this fragrance
            </p>
          </div>
        )}

        {/* All Reviews */}
        {(reviews.length > 0) && (
          <div>
            <h3 className="font-serif text-lg text-black mb-5">
              All Reviews <span className="text-gray-400 font-sans text-sm font-normal">({count})</span>
            </h3>
            <div className="space-y-4">
              {/* Show user's review first if exists */}
              {userReview && (
                <ReviewCard
                  review={userReview}
                  isOwn
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
              {otherReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
      </div>
    </section>
  );
}
