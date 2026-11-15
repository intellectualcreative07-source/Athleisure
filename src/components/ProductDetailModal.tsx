import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Info, MessageCircle, Ruler, ShieldCheck, Star, X } from 'lucide-react';
import { formatInr, UNISEX_SIZE_CHART } from '../data/catalog';
import type { Product, UnisexSize } from '../types/store';
import { buildProductWhatsAppUrl } from '../utils/whatsapp';
import { CompleteTheLookWidget } from './CompleteTheLookWidget';
import { RecommendedForYou } from './RecommendedForYou';
import { SafeImage } from './SafeImage';

interface ProductDetailModalProps {
  product: Product | null;
  initialColorIndex: number;
  initialSize: UnisexSize;
  onClose: () => void;
  onSwitchProduct: (product: Product, colorIndex?: number) => void;
  onAddToCart: (
    product: Product,
    colorName: string,
    colorHex: string,
    image: string,
    size: UnisexSize,
    quantity: number
  ) => void;
}

export function ProductDetailModal({
  product,
  initialColorIndex,
  initialSize,
  onClose,
  onSwitchProduct,
  onAddToCart,
}: ProductDetailModalProps) {
  const [colorIndex, setColorIndex] = useState(initialColorIndex);
  const [size, setSize] = useState<UnisexSize>(initialSize);
  const [quantity, setQuantity] = useState(1);
  const [sizeGuidePinned, setSizeGuidePinned] = useState(false);
  const [sizeGuideHovered, setSizeGuideHovered] = useState(false);
  const [guideTab, setGuideTab] = useState<'table' | 'finder'>('table');
  const [heightCm, setHeightCm] = useState(173);
  const [weightKg, setWeightKg] = useState(68);
  const [drapePref, setDrapePref] = useState<'tailored' | 'balanced' | 'relaxed'>('balanced');
  const [unit, setUnit] = useState<'cm' | 'in'>('in');
  const sizeGuideRef = useRef<HTMLDivElement>(null);
  const modalScrollRef = useRef<HTMLDivElement>(null);

  const showSizeGuide = sizeGuidePinned || sizeGuideHovered;

  const recommendedSize = useMemo<UnisexSize>(() => {
    const score = (heightCm - 155) * 0.45 + (weightKg - 50) * 0.55;
    const offset = drapePref === 'tailored' ? -4 : drapePref === 'relaxed' ? 6 : 0;
    const adjusted = score + offset;
    if (adjusted < 8) return 'XS';
    if (adjusted < 16) return 'S';
    if (adjusted < 25) return 'M';
    if (adjusted < 34) return 'L';
    if (adjusted < 43) return 'XL';
    return 'XXL';
  }, [heightCm, weightKg, drapePref]);

  useEffect(() => {
    setColorIndex(initialColorIndex);
    setSize(initialSize);
    setQuantity(1);
    setSizeGuidePinned(false);
    setSizeGuideHovered(false);
    modalScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product, initialColorIndex, initialSize]);

  useEffect(() => {
    if (!product) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (sizeGuidePinned) {
          setSizeGuidePinned(false);
        } else {
          onClose();
        }
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (
        sizeGuidePinned &&
        sizeGuideRef.current &&
        !sizeGuideRef.current.contains(e.target as Node)
      ) {
        setSizeGuidePinned(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [product, onClose, sizeGuidePinned]);

  if (!product) return null;

  const activeColor = product.colors[colorIndex] ?? product.colors[0];
  const activeMeasurement =
    UNISEX_SIZE_CHART.find((row) => row.size === size) ?? UNISEX_SIZE_CHART[2];

  const handleConfirmAdd = () => {
    onAddToCart(
      product,
      activeColor.name,
      activeColor.hex,
      activeColor.image,
      size,
      quantity
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-modal-title"
      onClick={onClose}
    >
      <div
        ref={modalScrollRef}
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-[#F5F3EE] text-[#111317] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#111317]/15 bg-white text-[#111317] hover:bg-[#EAE6DF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89668]"
          aria-label="Close product details"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Sticky Gallery + Technical Telemetry */}
          <div className="bg-[#EAE6DF] p-6 lg:col-span-6">
            <div className="aspect-[4/3] overflow-hidden rounded-xl bg-white">
              <SafeImage
                src={activeColor.image}
                alt={`${product.name} in ${activeColor.name}`}
                className="h-full w-full object-cover"
                fallbackLabel={product.name}
                tintHex={activeColor.hex}
              />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 rounded-xl border border-[#111317]/10 bg-white p-4">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#111317]/55">
                  Fabric Weight
                </p>
                <p className="mt-1 font-mono text-sm font-semibold tabular-nums text-[#111317]">
                  {product.gsm} GSM
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#111317]/55">
                  Airflow
                </p>
                <p className="mt-1 font-mono text-sm font-semibold tabular-nums text-[#111317]">
                  {product.breathabilityCfm} CFM
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#111317]/55">
                  Wick Speed
                </p>
                <p className="mt-1 font-mono text-sm font-semibold tabular-nums text-[#111317]">
                  {product.wickTimeSec}s Dry
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-2 text-xs text-[#111317]/80">
              {product.highlights.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2">
                  <Check
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#96754A]"
                    aria-hidden="true"
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <CompleteTheLookWidget
              currentProduct={product}
              activeColor={activeColor}
              selectedSize={size}
              onSelectSuggestedProduct={(nextProduct, nextColorIdx) =>
                onSwitchProduct(nextProduct, nextColorIdx)
              }
              onAddToCart={onAddToCart}
            />
          </div>

          {/* Right Contiguous Purchase Module */}
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#111317]/65">
                <span className="font-semibold uppercase tracking-wider text-[#96754A]">
                  {product.category}
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                  <Star
                    className="h-3.5 w-3.5 fill-[#B89668] text-[#B89668]"
                    aria-hidden="true"
                  />
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>

              <h2
                id="pdp-modal-title"
                className="mt-2 font-display text-2xl font-semibold text-[#111317]"
              >
                {product.name}
              </h2>

              <div className="mt-2 flex items-baseline gap-2.5 font-mono tabular-nums">
                <span className="text-2xl font-semibold text-[#111317]">
                  {formatInr(product.priceInr)}
                </span>
                {product.compareAtInr && (
                  <span className="text-sm text-[#111317]/45 line-through">
                    {formatInr(product.compareAtInr)}
                  </span>
                )}
                <span className="font-sans text-xs text-[#111317]/60">
                  Inclusive of all taxes
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-[#111317]/80">
                {product.description}
              </p>

              <p className="mt-3 text-xs font-medium text-[#111317]/65">
                Composition: {product.fabricBlend}
              </p>

              {/* Color Swatches */}
              <div className="mt-5">
                <p className="text-xs font-semibold text-[#111317]">
                  Colorway: <span className="font-normal text-[#111317]/75">{activeColor.name}</span>
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2.5">
                  {product.colors.map((color, idx) => {
                    const selected = idx === colorIndex;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setColorIndex(idx)}
                        aria-label={`Select color ${color.name}`}
                        aria-pressed={selected}
                        className={`h-8 w-8 rounded-full transition-transform ${
                          selected
                            ? 'ring-2 ring-[#101216] ring-offset-2 ring-offset-[#F5F3EE] scale-105'
                            : 'ring-1 ring-black/15 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Unisex Size Selector & Size Guide Tooltip Popover */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#111317]">
                    Unisex Size ({product.fitType})
                  </span>

                  <div
                    ref={sizeGuideRef}
                    className="relative"
                    onMouseEnter={() => setSizeGuideHovered(true)}
                    onMouseLeave={() => setSizeGuideHovered(false)}
                  >
                    <button
                      type="button"
                      onClick={() => setSizeGuidePinned((prev) => !prev)}
                      aria-expanded={showSizeGuide}
                      aria-controls="pdp-size-guide-popover"
                      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-[#96754A] transition-colors hover:bg-[#EAE6DF] hover:text-[#111317] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89668]"
                    >
                      <Ruler className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Size Guide</span>
                      <Info className="h-3 w-3 opacity-75" aria-hidden="true" />
                    </button>

                    {showSizeGuide && (
                      <div
                        id="pdp-size-guide-popover"
                        role="dialog"
                        aria-label="Unisex size guide measurements"
                        className="absolute right-0 bottom-full z-30 mb-2 w-[330px] max-w-[calc(100vw-3rem)] sm:w-[410px] rounded-xl border border-[#111317]/15 bg-white p-4 text-[#111317] shadow-2xl"
                      >
                        <div className="flex items-center justify-between gap-2 border-b border-[#111317]/10 pb-2.5">
                          <div className="flex items-center gap-1 rounded-md bg-[#EAE6DF] p-0.5 text-[11px] font-semibold">
                            <button
                              type="button"
                              onClick={() => setGuideTab('table')}
                              className={`rounded px-2.5 py-1 ${
                                guideTab === 'table'
                                  ? 'bg-white text-[#111317] shadow-xs'
                                  : 'text-[#111317]/65'
                              }`}
                            >
                              Size Chart
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setGuideTab('finder');
                                setSizeGuidePinned(true);
                              }}
                              className={`rounded px-2.5 py-1 ${
                                guideTab === 'finder'
                                  ? 'bg-white text-[#111317] shadow-xs'
                                  : 'text-[#111317]/65'
                              }`}
                            >
                              Fit Finder
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            {guideTab === 'table' && (
                              <div className="flex items-center gap-0.5 rounded-md bg-[#EAE6DF] p-0.5 text-[11px] font-semibold">
                                <button
                                  type="button"
                                  onClick={() => setUnit('in')}
                                  className={`rounded px-2 py-0.5 ${
                                    unit === 'in'
                                      ? 'bg-white text-[#111317] shadow-xs'
                                      : 'text-[#111317]/60'
                                  }`}
                                >
                                  IN
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setUnit('cm')}
                                  className={`rounded px-2 py-0.5 ${
                                    unit === 'cm'
                                      ? 'bg-white text-[#111317] shadow-xs'
                                      : 'text-[#111317]/60'
                                  }`}
                                >
                                  CM
                                </button>
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setSizeGuidePinned(false);
                                setSizeGuideHovered(false);
                              }}
                              className="rounded p-1 text-[#111317]/55 hover:bg-[#EAE6DF] hover:text-[#111317]"
                              aria-label="Close size guide"
                            >
                              <X className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        </div>

                        {guideTab === 'table' ? (
                          <>
                            <div className="mt-2.5 rounded-lg bg-[#F5F3EE] px-3 py-2 text-[11px]">
                              <span className="font-semibold text-[#111317]">
                                Selected {activeMeasurement.size}:
                              </span>{' '}
                              <span className="font-mono tabular-nums text-[#111317]/80">
                                Chest {unit === 'in' ? `${activeMeasurement.chestIn}"` : `${activeMeasurement.chestCm} cm`} · Waist{' '}
                                {unit === 'in' ? `${activeMeasurement.waistIn}"` : `${activeMeasurement.waistCm} cm`} · Length{' '}
                                {unit === 'in' ? `${activeMeasurement.lengthIn}"` : `${activeMeasurement.lengthCm} cm`}
                              </span>
                            </div>

                            <div className="mt-2.5 overflow-x-auto">
                              <table className="w-full text-left font-mono text-[11px] tabular-nums">
                                <thead>
                                  <tr className="border-b border-[#111317]/10 text-[#111317]/55">
                                    <th className="py-1.5 pr-2 font-medium">Size</th>
                                    <th className="py-1.5 pr-2 font-medium">Chest</th>
                                    <th className="py-1.5 pr-2 font-medium">Waist</th>
                                    <th className="py-1.5 pr-2 font-medium">Length</th>
                                    <th className="py-1.5 font-medium">Height</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#111317]/10 text-[#111317]">
                                  {UNISEX_SIZE_CHART.map((row) => {
                                    const isCurrent = row.size === size;
                                    return (
                                      <tr
                                        key={row.size}
                                        onClick={() => setSize(row.size)}
                                        className={`cursor-pointer transition-colors ${
                                          isCurrent
                                            ? 'bg-[#B89668]/20 font-semibold'
                                            : 'hover:bg-[#F5F3EE]'
                                        }`}
                                      >
                                        <td className="py-1.5 pr-2">{row.size}</td>
                                        <td className="py-1.5 pr-2">
                                          {unit === 'in' ? row.chestIn : row.chestCm}
                                        </td>
                                        <td className="py-1.5 pr-2">
                                          {unit === 'in' ? row.waistIn : row.waistCm}
                                        </td>
                                        <td className="py-1.5 pr-2">
                                          {unit === 'in' ? row.lengthIn : row.lengthCm}
                                        </td>
                                        <td className="py-1.5 font-sans text-[#111317]/75">
                                          {row.fitNote}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </>
                        ) : (
                          <div className="mt-3 space-y-3 text-xs">
                            <div>
                              <div className="flex justify-between font-medium">
                                <label htmlFor="fit-height">Height</label>
                                <span className="font-mono tabular-nums">{heightCm} cm</span>
                              </div>
                              <input
                                id="fit-height"
                                type="range"
                                min={152}
                                max={196}
                                value={heightCm}
                                onChange={(e) => setHeightCm(Number(e.target.value))}
                                className="mt-1 w-full accent-[#101216]"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between font-medium">
                                <label htmlFor="fit-weight">Weight</label>
                                <span className="font-mono tabular-nums">{weightKg} kg</span>
                              </div>
                              <input
                                id="fit-weight"
                                type="range"
                                min={45}
                                max={110}
                                value={weightKg}
                                onChange={(e) => setWeightKg(Number(e.target.value))}
                                className="mt-1 w-full accent-[#101216]"
                              />
                            </div>

                            <div>
                              <p className="font-medium">Preferred Drape</p>
                              <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                                {(
                                  [
                                    { id: 'tailored', label: 'Tailored' },
                                    { id: 'balanced', label: 'Balanced' },
                                    { id: 'relaxed', label: 'Relaxed' },
                                  ] as const
                                ).map((opt) => (
                                  <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => setDrapePref(opt.id)}
                                    className={`rounded-md py-1.5 text-[11px] font-semibold ${
                                      drapePref === opt.id
                                        ? 'bg-[#101216] text-white'
                                        : 'border border-[#111317]/15 bg-[#F5F3EE] text-[#111317]/80'
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border border-[#B89668]/40 bg-[#F5F3EE] p-3">
                              <div>
                                <p className="text-[11px] text-[#111317]/65">
                                  Recommended Unisex Size
                                </p>
                                <p className="font-display text-lg font-semibold text-[#111317]">
                                  Unisex {recommendedSize}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setSize(recommendedSize);
                                  setSizeGuidePinned(false);
                                  setSizeGuideHovered(false);
                                }}
                                className="rounded-lg bg-[#101216] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#232730]"
                              >
                                Apply {recommendedSize}
                              </button>
                            </div>
                          </div>
                        )}

                        <p className="mt-2.5 border-t border-[#111317]/10 pt-2 text-[11px] leading-snug text-[#111317]/65">
                          Between sizes? Pick your usual size for a tailored athletic drape, or size up for a relaxed streetwear fit.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-2 grid grid-cols-6 gap-2">
                  {product.sizes.map((sz) => {
                    const selected = sz === size;
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSize(sz)}
                        aria-pressed={selected}
                        className={`min-h-[40px] rounded-lg text-xs font-semibold tabular-nums transition-colors ${
                          selected
                            ? 'bg-[#101216] text-white'
                            : 'border border-[#111317]/15 bg-white text-[#111317] hover:border-[#111317]/40'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quantity & Primary Purchase CTA */}
            <div className="mt-7 border-t border-[#111317]/10 pt-5">
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-lg border border-[#111317]/15 bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="h-11 w-10 text-base font-semibold text-[#111317] hover:bg-[#EAE6DF]"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-mono text-sm font-semibold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    className="h-11 w-10 text-base font-semibold text-[#111317] hover:bg-[#EAE6DF]"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmAdd}
                  className="min-h-[44px] flex-1 rounded-lg bg-[#101216] px-6 py-3 text-sm font-semibold text-[#F5F3EE] transition-colors hover:bg-[#232730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89668]"
                >
                  Add to Bag ·{' '}
                  <span className="font-mono tabular-nums">
                    {formatInr(product.priceInr * quantity)}
                  </span>
                </button>
              </div>

              <a
                href={buildProductWhatsAppUrl(
                  product.name,
                  activeColor.name,
                  size,
                  quantity,
                  product.priceInr * quantity
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2.5 flex min-h-[40px] w-full items-center justify-center gap-2 rounded-lg border border-[#1F6E43]/30 bg-[#1F6E43]/8 px-4 py-2 text-xs font-semibold text-[#175432] transition-colors hover:bg-[#1F6E43]/15"
              >
                <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Order or Ask on WhatsApp</span>
              </a>

              <div className="mt-3 flex items-center gap-2 text-xs text-[#111317]/65">
                <ShieldCheck className="h-4 w-4 text-[#96754A]" aria-hidden="true" />
                <span>Free delivery over ₹2,499 · Cash on Delivery · 30-day easy exchanges</span>
              </div>
            </div>
          </div>
        </div>

        <RecommendedForYou
          currentProduct={product}
          selectedSize={size}
          onSelectProduct={(nextProduct, nextColorIdx) =>
            onSwitchProduct(nextProduct, nextColorIdx)
          }
          onAddToCart={onAddToCart}
        />
      </div>
    </div>
  );
}
