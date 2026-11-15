import { useState } from 'react';
import { ArrowRight, Check, PackageCheck, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import {
  BRAND_ASSETS,
  formatInr,
  LOOKBOOK_ITEMS,
  PRODUCTS,
  UNISEX_SIZES,
} from '../data/catalog';
import type { LookbookItem, Product, UnisexSize } from '../types/store';
import { SafeImage } from './SafeImage';
import { BlurFade } from './magicui/blur-fade';
import { BorderBeam } from './magicui/border-beam';
import { SpotlightCard } from './magicui/spotlight-card';

interface LookbookUnboxingSectionProps {
  onAddLookBundle: (items: { product: Product; size: UnisexSize }[]) => void;
}

export function LookbookUnboxingSection({
  onAddLookBundle,
}: LookbookUnboxingSectionProps) {
  const [selectedSizes, setSelectedSizes] = useState<Record<string, UnisexSize>>({});
  const [addedLookId, setAddedLookId] = useState<string | null>(null);

  const handleShopLook = (look: LookbookItem) => {
    const size = selectedSizes[look.id] ?? 'M';
    const matchedProducts = look.productIds
      .map((id) => PRODUCTS.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));

    if (matchedProducts.length === 0) return;

    onAddLookBundle(matchedProducts.map((product) => ({ product, size })));
    setAddedLookId(look.id);
    window.setTimeout(() => {
      setAddedLookId((curr) => (curr === look.id ? null : curr));
    }, 1500);
  };

  return (
    <section id="lookbook" className="bg-[#EAE6DF] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Lookbook Header */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#96754A]">
            Athlete Lifestyle Lookbook
          </p>
          <h2
            className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#111317] sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            Discipline in motion. Confidence in every setting.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#111317]/75 sm:text-base">
            Curated unisex outfits worn from dawn intervals to everyday studio work. Pick your size to add any coordinated look directly to your bag.
          </p>
        </div>

        {/* 3-Column Shoppable Editorial Lookbook */}
        <div className="mt-10 grid grid-cols-1 gap-7 lg:grid-cols-3">
          {LOOKBOOK_ITEMS.map((look, idx) => {
            const activeSize = selectedSizes[look.id] ?? 'M';
            const isAdded = addedLookId === look.id;

            return (
              <BlurFade key={look.id} delay={idx * 0.06}>
                <article
                  className="flex h-full flex-col justify-between overflow-hidden rounded-xl border border-[#111317]/10 bg-[#F5F3EE] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B89668]/45 hover:shadow-lg hover:shadow-[#111317]/5"
                >
                <div>
                  <div className="aspect-[4/5] w-full overflow-hidden bg-[#181B21]">
                    <SafeImage
                      src={look.image}
                      alt={look.title}
                      className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-[1.03]"
                      fallbackLabel={look.context}
                    />
                  </div>

                  <div className="p-6">
                    <p className="text-xs font-medium tracking-wide uppercase text-[#96754A]">
                      {look.context} <span aria-hidden="true">·</span> {look.modelStats}
                    </p>
                    <h3 className="mt-2 font-display text-lg font-semibold text-[#111317]">
                      {look.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#111317]/75">
                      {look.athleteNote}
                    </p>
                  </div>
                </div>

                <div className="border-t border-[#111317]/10 bg-white/75 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor={`look-size-${look.id}`}
                      className="text-xs font-medium text-[#111317]/70"
                    >
                      Kit Size
                    </label>
                    <select
                      id={`look-size-${look.id}`}
                      value={activeSize}
                      onChange={(e) =>
                        setSelectedSizes((prev) => ({
                          ...prev,
                          [look.id]: e.target.value as UnisexSize,
                        }))
                      }
                      className="min-h-[36px] rounded-md border border-[#111317]/15 bg-white px-2.5 py-1 text-xs font-semibold text-[#111317]"
                    >
                      {UNISEX_SIZES.map((sz) => (
                        <option key={sz} value={sz}>
                          Unisex {sz}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleShopLook(look)}
                    className={`mt-3 inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89668] ${
                      isAdded
                        ? 'bg-[#2E523A] text-white'
                        : 'bg-[#101216] text-[#F5F3EE] hover:bg-[#232730]'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="h-4 w-4" aria-hidden="true" />
                        <span>Look Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <span>
                          Shop This Look ·{' '}
                          <span className="font-mono tabular-nums">
                            {formatInr(look.bundlePriceInr)}
                          </span>
                        </span>
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </div>
                </article>
              </BlurFade>
            );
          })}
        </div>

        {/* Luxury Unboxing & Purchase Confidence Block */}
        <SpotlightCard
          spotlightColor="rgba(229, 201, 156, 0.14)"
          className="mt-14 overflow-hidden rounded-xl border border-white/10 bg-[#101216] text-[#F5F3EE]"
        >
          <BorderBeam
            size={140}
            duration={9}
            colorFrom="#F0D8B3"
            colorTo="#96754A"
          />
          <div className="grid grid-cols-1 items-stretch lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="h-full min-h-[320px] bg-[#181B21]">
                <SafeImage
                  src={BRAND_ASSETS.unboxingKit}
                  alt="Stylesse luxury unboxing boxes, canvas gym duffel, and folded mineral dry-fit tees"
                  className="h-full w-full object-cover object-center lg:h-full"
                  fallbackLabel="STYLESSE KIT"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center p-7 sm:p-10 lg:col-span-6">
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#B89668]">
                Unboxing &amp; Buyer Guarantee
              </p>
              <h3
                className="mt-2 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl"
                style={{ textWrap: 'balance' }}
              >
                Presentation built for gifting. Backed by a 30-day sweat test.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#EAE6DF]/75">
                Every Stylesse parcel arrives in rigid matte collector boxes with woven fabric swatch cards and garment care notes—designed to inspire confidence from the moment you open it.
              </p>

              <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Truck className="mt-0.5 h-5 w-5 shrink-0 text-[#B89668]" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-white">COD &amp; Express Dispatch</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-[#EAE6DF]/70">
                      Cash on Delivery &amp; UPI supported. Free shipping over ₹2,499.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <RotateCcw className="mt-0.5 h-5 w-5 shrink-0 text-[#B89668]" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-white">30-Day Sweat-Test</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-[#EAE6DF]/70">
                      Train in it. Instant size exchange or full refund if it misses the mark.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#B89668]" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-white">Rigid Collector Boxes</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-[#EAE6DF]/70">
                      Tactile gift-ready packaging with zero single-use plastic polybags.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#B89668]" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-white">100-Wash Structure</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-[#EAE6DF]/70">
                      Color-fast mineral dyes &amp; anti-sag collars backed by quality guarantee.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}
