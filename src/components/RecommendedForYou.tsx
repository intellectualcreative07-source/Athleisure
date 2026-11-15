import { useMemo, useState } from 'react';
import { ArrowRight, Check, Plus, Star } from 'lucide-react';
import { formatInr, PRODUCTS } from '../data/catalog';
import type { Product, UnisexSize } from '../types/store';
import { SafeImage } from './SafeImage';

interface RecommendedForYouProps {
  currentProduct: Product;
  selectedSize: UnisexSize;
  onSelectProduct: (product: Product, colorIndex: number) => void;
  onAddToCart: (
    product: Product,
    colorName: string,
    colorHex: string,
    image: string,
    size: UnisexSize,
    quantity: number
  ) => void;
}

export function RecommendedForYou({
  currentProduct,
  selectedSize,
  onSelectProduct,
  onAddToCart,
}: RecommendedForYouProps) {
  const [addedId, setAddedId] = useState<string | null>(null);

  const recommendations = useMemo(() => {
    const sameCategory = PRODUCTS.filter(
      (item) => item.category === currentProduct.category && item.id !== currentProduct.id
    );

    // If a category has multiple alternatives, show up to 3 same-category peers
    if (sameCategory.length >= 2) {
      return sameCategory.slice(0, 3);
    }

    // Fallback to top-rated items only if fewer than 2 same-category peers exist
    const fallback = PRODUCTS.filter(
      (item) =>
        item.id !== currentProduct.id &&
        !sameCategory.some((matched) => matched.id === item.id)
    ).slice(0, 2 - sameCategory.length);

    return [...sameCategory, ...fallback];
  }, [currentProduct.category, currentProduct.id]);

  if (recommendations.length === 0) return null;

  const handleQuickAdd = (item: Product) => {
    const primaryColor = item.colors[0];
    onAddToCart(
      item,
      primaryColor.name,
      primaryColor.hex,
      primaryColor.image,
      selectedSize,
      1
    );
    setAddedId(item.id);
    window.setTimeout(() => {
      setAddedId((curr) => (curr === item.id ? null : curr));
    }, 1400);
  };

  return (
    <section
      aria-label={`Recommended products in ${currentProduct.category}`}
      className="border-t border-[#111317]/10 bg-white px-6 py-6 sm:px-8"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#96754A]">
            Recommended for You
          </p>
          <h3 className="mt-0.5 font-display text-base font-semibold text-[#111317]">
            More silhouettes in {currentProduct.category}
          </h3>
        </div>
        <p className="text-xs text-[#111317]/60">
          Compare GSM weight &amp; drape before checking out
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((item) => {
          const primaryColor = item.colors[0];
          const isAdded = addedId === item.id;

          return (
            <div
              key={item.id}
              className="group flex items-center justify-between gap-3 rounded-xl border border-[#111317]/10 bg-[#F5F3EE]/70 p-3 transition-all duration-150 hover:border-[#B89668]/55 hover:bg-white"
            >
              <button
                type="button"
                onClick={() => onSelectProduct(item, 0)}
                className="flex min-w-0 flex-1 items-center gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89668]"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#EAE6DF]">
                  <SafeImage
                    src={primaryColor.image}
                    alt={`${item.name} in ${primaryColor.name}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    fallbackLabel={item.name}
                    tintHex={primaryColor.hex}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 text-[11px] text-[#111317]/60">
                    <span className="truncate font-mono tabular-nums">
                      {item.gsm} GSM
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-0.5 font-mono tabular-nums text-[#111317]/75">
                      <Star
                        className="h-3 w-3 fill-[#B89668] text-[#B89668]"
                        aria-hidden="true"
                      />
                      {item.rating.toFixed(1)}
                    </span>
                  </div>

                  <p className="mt-0.5 flex items-center gap-1 truncate font-display text-xs font-semibold text-[#111317] group-hover:text-[#96754A]">
                    <span className="truncate">{item.name}</span>
                    <ArrowRight
                      className="h-3 w-3 shrink-0 opacity-50 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </p>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold tabular-nums text-[#111317]">
                      {formatInr(item.priceInr)}
                    </span>
                    <span className="flex items-center gap-1" aria-hidden="true">
                      {item.colors.slice(0, 3).map((c) => (
                        <span
                          key={c.name}
                          className="h-2.5 w-2.5 rounded-full border border-black/15"
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </span>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickAdd(item)}
                aria-label={`Add ${item.name} size ${selectedSize} to bag`}
                className={`inline-flex min-h-[34px] shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  isAdded
                    ? 'bg-[#2E523A] text-white'
                    : 'border border-[#111317]/15 bg-white text-[#111317] hover:bg-[#101216] hover:text-white'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="h-3 w-3" aria-hidden="true" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-3 w-3" aria-hidden="true" />
                    <span>Add {selectedSize}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
