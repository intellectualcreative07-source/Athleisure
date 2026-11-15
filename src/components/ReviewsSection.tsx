import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Star, X } from 'lucide-react';
import { BUYER_REVIEWS, PRODUCTS } from '../data/catalog';
import type { BuyerReview, ProductCategory } from '../types/store';
import { cn } from '../lib/utils';
import { SectionReveal } from './SectionReveal';
import { BlurFade } from './magicui/blur-fade';
import { Marquee } from './magicui/marquee';
import { NumberTicker } from './magicui/number-ticker';

const REVIEWS_STORAGE_KEY = 'stylesse_custom_reviews_v1';

const REVIEW_FILTERS: ('All' | ProductCategory)[] = [
  'All',
  'Dry-Fits',
  'Trackpants',
  'Jerseys',
  'Shorts',
  'Sports T-Shirts',
];

const AVATAR_TONES = [
  'bg-[#23262B] text-[#E5C99C]',
  'bg-[#384637] text-[#F5F3EE]',
  'bg-[#222F42] text-[#F5F3EE]',
  'bg-[#543D48] text-[#F5F3EE]',
  'bg-[#9E543D] text-[#F5F3EE]',
  'bg-[#4A5D75] text-[#F5F3EE]',
];

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
}

function getToneForName(fullName: string): string {
  let hash = 0;
  for (let i = 0; i < fullName.length; i++) {
    hash = (hash * 31 + fullName.charCodeAt(i)) % AVATAR_TONES.length;
  }
  return AVATAR_TONES[Math.abs(hash) % AVATAR_TONES.length];
}

function ReviewMarqueeCard({
  review,
  compact = false,
}: {
  review: BuyerReview;
  compact?: boolean;
}) {
  const handle = `@${review.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

  return (
    <figure
      className={cn(
        'group/card relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-[#111317]/10 bg-white/90 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B89668]/50 hover:bg-white hover:shadow-lg hover:shadow-[#111317]/5',
        compact ? 'w-72 shrink-0 sm:w-80' : 'h-full w-full p-5'
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <div
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-[11px] font-semibold tracking-wider',
                getToneForName(review.name)
              )}
              aria-hidden="true"
            >
              {getInitials(review.name)}
            </div>
            <div className="min-w-0">
              <figcaption className="truncate text-sm font-semibold text-[#111317]">
                {review.name}
              </figcaption>
              <p className="truncate text-xs text-[#111317]/50">
                {handle} · {review.city}
              </p>
            </div>
          </div>

          <div
            className="flex shrink-0 items-center gap-0.5"
            aria-label={`${review.rating} out of 5 stars`}
          >
            {Array.from({ length: review.rating }).map((_, idx) => (
              <Star
                key={idx}
                className="h-3.5 w-3.5 fill-[#B89668] text-[#B89668]"
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        <blockquote className="mt-3 text-sm leading-relaxed text-[#111317]">
          &ldquo;{review.quote}&rdquo;
        </blockquote>
      </div>

      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-[#111317]/10 pt-2.5 text-[11px] text-[#111317]/65">
        <span className="font-medium text-[#96754A]">{review.fitVerdict}</span>
        <span className="truncate font-mono tabular-nums text-[#111317]/75">
          {review.heightAndSize} · {review.productName}
        </span>
      </div>
    </figure>
  );
}

export function MarqueeDemo({
  firstRow,
  secondRow,
}: {
  firstRow: BuyerReview[];
  secondRow: BuyerReview[];
}) {
  return (
    <div className="relative mt-8 flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover repeat={4} className="[--duration:22s] [--gap:1rem]">
        {firstRow.map((rev) => (
          <ReviewMarqueeCard key={rev.id} review={rev} compact />
        ))}
      </Marquee>
      <Marquee
        reverse
        pauseOnHover
        repeat={4}
        className="[--duration:22s] [--gap:1rem]"
      >
        {secondRow.map((rev) => (
          <ReviewMarqueeCard key={rev.id} review={rev} compact />
        ))}
      </Marquee>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-[#F5F3EE] to-transparent sm:w-1/4"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-[#F5F3EE] to-transparent sm:w-1/4"
      />
    </div>
  );
}

export function ReviewsSection() {
  const [filter, setFilter] = useState<'All' | ProductCategory>('All');
  const [customReviews, setCustomReviews] = useState<BuyerReview[]>(() => {
    try {
      const saved = window.localStorage.getItem(REVIEWS_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as BuyerReview[]) : [];
    } catch {
      return [];
    }
  });
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [city, setCity] = useState('');
  const [heightAndSize, setHeightAndSize] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS[2].id);
  const [fitVerdict, setFitVerdict] = useState<'True to Size' | 'Relaxed Drape'>(
    'True to Size'
  );
  const [rating, setRating] = useState(5);
  const [quote, setQuote] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    try {
      window.localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(customReviews));
    } catch {
      // Ignore storage errors
    }
  }, [customReviews]);

  const allReviews = [...customReviews, ...BUYER_REVIEWS];

  const visibleReviews =
    filter === 'All'
      ? allReviews
      : allReviews.filter((r) => r.category === filter);

  const midpoint = Math.ceil(allReviews.length / 2);
  const firstRow = allReviews.slice(0, midpoint);
  const secondRow = allReviews.slice(midpoint);

  const handleReviewSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim() || !quote.trim()) {
      setFormError('Please enter your name and review notes.');
      return;
    }

    const chosenProduct =
      PRODUCTS.find((p) => p.id === selectedProductId) ?? PRODUCTS[0];

    const newReview: BuyerReview = {
      id: `rev-user-${Date.now()}`,
      name: name.trim(),
      role: role.trim() || 'Everyday Athlete',
      city: city.trim() || 'India',
      heightAndSize: heightAndSize.trim() || 'Unisex Fit',
      category: chosenProduct.category,
      productName: chosenProduct.name,
      rating,
      fitVerdict,
      quote: quote.trim(),
      outcome: 'Submitted via verified fit log',
    };

    setCustomReviews((prev) => [newReview, ...prev]);
    setName('');
    setRole('');
    setCity('');
    setHeightAndSize('');
    setQuote('');
    setRating(5);
    setFormOpen(false);
    setFilter('All');
  };

  return (
    <section id="reviews" className="bg-[#F5F3EE] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BlurFade>
          <div className="flex flex-col gap-6 border-b border-[#111317]/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#96754A]">
                Athlete &amp; Buyer Verification
              </p>
              <h2
                className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#111317] sm:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                Trusted across tracks, studios, and daily commutes.
              </h2>
            </div>

            {/* Aggregate Quantitative Fit Confidence */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div>
                <p className="font-mono text-2xl font-semibold tabular-nums text-[#111317]">
                  <NumberTicker value={4.9} startValue={3.8} decimalPlaces={1} suffix=" / 5.0" />
                </p>
                <p className="text-xs text-[#111317]/65 tabular-nums">
                  Across{' '}
                  <NumberTicker
                    value={1420 + customReviews.length}
                    startValue={1200}
                    suffix="+"
                  />{' '}
                  verified orders
                </p>
              </div>
              <div className="hidden h-8 w-px bg-[#111317]/15 sm:block" aria-hidden="true" />
              <div>
                <p className="font-mono text-2xl font-semibold tabular-nums text-[#111317]">
                  <NumberTicker value={96} startValue={80} suffix="%" />
                </p>
                <p className="text-xs text-[#111317]/65">
                  Rated true-to-size unisex fit
                </p>
              </div>
            </div>
          </div>
        </BlurFade>

        {/* Review Category Filter & Write Review Trigger */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {REVIEW_FILTERS.map((cat) => {
              const isActive = filter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={`min-h-[38px] rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-[#101216] text-white'
                      : 'bg-[#EAE6DF] text-[#111317]/75 hover:bg-[#ded9d0] hover:text-[#111317]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setFormOpen((prev) => !prev)}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#111317]/20 bg-white px-4 py-1.5 text-xs font-semibold text-[#111317] whitespace-nowrap transition-colors hover:border-[#111317]"
          >
            {formOpen ? (
              <>
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Close Form</span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Share Your Fit Review</span>
              </>
            )}
          </button>
        </div>

        {/* Interactive Fit Review Submission Form */}
        {formOpen && (
          <form
            onSubmit={handleReviewSubmit}
            className="mt-6 rounded-xl border border-[#111317]/15 bg-white p-6"
          >
            <h3 className="font-display text-lg font-semibold text-[#111317]">
              Add Your Fit &amp; Fabric Review
            </h3>
            <p className="mt-1 text-xs text-[#111317]/65">
              Help fellow athletes pick their unisex size by sharing your height, size worn, and training feedback.
            </p>

            {formError && (
              <div
                role="alert"
                className="mt-4 rounded-lg border border-red-800/20 bg-red-50 px-3.5 py-2 text-xs font-medium text-red-900"
              >
                {formError}
              </div>
            )}

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label htmlFor="rev-name" className="block text-xs font-semibold text-[#111317]">
                  Your Name
                </label>
                <input
                  id="rev-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Siddharth Rao"
                  className="mt-1 w-full rounded-lg border border-[#111317]/15 bg-[#F5F3EE] px-3 py-2 text-sm text-[#111317] focus:border-[#B89668] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="rev-role" className="block text-xs font-semibold text-[#111317]">
                  Sport / Discipline
                </label>
                <input
                  id="rev-role"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="10K Runner & Designer"
                  className="mt-1 w-full rounded-lg border border-[#111317]/15 bg-[#F5F3EE] px-3 py-2 text-sm text-[#111317] focus:border-[#B89668] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="rev-city" className="block text-xs font-semibold text-[#111317]">
                  City
                </label>
                <input
                  id="rev-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Hyderabad"
                  className="mt-1 w-full rounded-lg border border-[#111317]/15 bg-[#F5F3EE] px-3 py-2 text-sm text-[#111317] focus:border-[#B89668] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="rev-height-size" className="block text-xs font-semibold text-[#111317]">
                  Height &amp; Size Worn
                </label>
                <input
                  id="rev-height-size"
                  type="text"
                  value={heightAndSize}
                  onChange={(e) => setHeightAndSize(e.target.value)}
                  placeholder={`5'10" · Wears Unisex M`}
                  className="mt-1 w-full rounded-lg border border-[#111317]/15 bg-[#F5F3EE] px-3 py-2 text-sm text-[#111317] focus:border-[#B89668] focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="rev-product" className="block text-xs font-semibold text-[#111317]">
                  Garment
                </label>
                <select
                  id="rev-product"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#111317]/15 bg-[#F5F3EE] px-3 py-2 text-sm text-[#111317]"
                >
                  {PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="rev-fit" className="block text-xs font-semibold text-[#111317]">
                  Fit Verdict
                </label>
                <select
                  id="rev-fit"
                  value={fitVerdict}
                  onChange={(e) =>
                    setFitVerdict(e.target.value as 'True to Size' | 'Relaxed Drape')
                  }
                  className="mt-1 w-full rounded-lg border border-[#111317]/15 bg-[#F5F3EE] px-3 py-2 text-sm text-[#111317]"
                >
                  <option value="True to Size">True to Size</option>
                  <option value="Relaxed Drape">Relaxed Drape</option>
                </select>
              </div>

              <div>
                <span className="block text-xs font-semibold text-[#111317]">Rating</span>
                <div className="mt-2 flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      aria-label={`Rate ${star} out of 5 stars`}
                      className="p-0.5"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          star <= rating
                            ? 'fill-[#B89668] text-[#B89668]'
                            : 'text-[#111317]/20'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="rev-quote" className="block text-xs font-semibold text-[#111317]">
                Your Review
              </label>
              <textarea
                id="rev-quote"
                rows={3}
                required
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="Share how the AeroWeave polyester felt during training and everyday wear..."
                className="mt-1 w-full rounded-lg border border-[#111317]/15 bg-[#F5F3EE] px-3 py-2 text-sm text-[#111317] focus:border-[#B89668] focus:outline-none"
              />
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="min-h-[40px] rounded-lg bg-[#101216] px-5 py-2 text-xs font-semibold text-[#F5F3EE] hover:bg-[#232730]"
              >
                Publish Review
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Magic UI Dual-Row Opposing MarqueeDemo wrapped in SectionReveal when showing All reviews; clean Grid when category filtered */}
      {filter === 'All' ? (
        <SectionReveal delay={0.08}>
          <MarqueeDemo firstRow={firstRow} secondRow={secondRow} />
        </SectionReveal>
      ) : (
        <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {visibleReviews.map((rev, idx) => (
              <BlurFade key={rev.id} delay={Math.min(idx * 0.05, 0.2)}>
                <ReviewMarqueeCard review={rev} />
              </BlurFade>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
