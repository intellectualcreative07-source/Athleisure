import { useMemo, useState } from 'react';
import { Check, Eye, Heart, SlidersHorizontal, Star } from 'lucide-react';
import { CATEGORIES, formatInr, PRODUCTS } from '../data/catalog';
import type { Product, ProductCategory, UnisexSize } from '../types/store';
import { SafeImage } from './SafeImage';
import { BlurFade } from './magicui/blur-fade';

interface CatalogSectionProps {
  wishlistProductIds: string[];
  onToggleWishlist: (
    product: Product,
    colorIndex: number,
    size: UnisexSize
  ) => void;
  onAddToCart: (
    product: Product,
    colorName: string,
    colorHex: string,
    image: string,
    size: UnisexSize
  ) => void;
  onSelectProduct: (product: Product, initialColorIndex: number, initialSize: UnisexSize) => void;
}

type SortMode = 'featured' | 'price-asc' | 'price-desc' | 'rating';

interface ColorFamily {
  id: string;
  label: string;
  hex: string;
  match: (colorName: string) => boolean;
}

const COLOR_FAMILIES: ColorFamily[] = [
  {
    id: 'obsidian',
    label: 'Obsidian & Charcoal',
    hex: '#23262B',
    match: (name) => {
      const lower = name.toLowerCase();
      return lower.includes('obsidian') || lower.includes('charcoal');
    },
  },
  {
    id: 'forest',
    label: 'Forest Olive',
    hex: '#384637',
    match: (name) => name.toLowerCase().includes('forest'),
  },
  {
    id: 'slate',
    label: 'Slate Blue',
    hex: '#4A5D75',
    match: (name) => {
      const lower = name.toLowerCase();
      return lower.includes('slate blue') || lower.includes('slate &') || lower.includes('slate)');
    },
  },
  {
    id: 'midnight',
    label: 'Midnight Navy',
    hex: '#222F42',
    match: (name) => name.toLowerCase().includes('midnight'),
  },
  {
    id: 'sage',
    label: 'Sage Mist',
    hex: '#768473',
    match: (name) => name.toLowerCase().includes('sage'),
  },
  {
    id: 'terracotta',
    label: 'Terracotta Clay',
    hex: '#9E543D',
    match: (name) => {
      const lower = name.toLowerCase();
      return lower.includes('terracotta') || lower.includes('clay');
    },
  },
  {
    id: 'plum',
    label: 'Plum Dusk',
    hex: '#543D48',
    match: (name) => name.toLowerCase().includes('plum'),
  },
  {
    id: 'sand',
    label: 'Warm Sand',
    hex: '#C6BBA8',
    match: (name) => name.toLowerCase().includes('sand'),
  },
];

export function CatalogSection({
  wishlistProductIds,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
}: CatalogSectionProps) {
  const [activeCategory, setActiveCategory] = useState<'All Essentials' | ProductCategory>(
    'All Essentials'
  );
  const [activeColorFilters, setActiveColorFilters] = useState<string[]>([]);
  const [mobileColorsOpen, setMobileColorsOpen] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('featured');
  const [selectedColors, setSelectedColors] = useState<Record<string, number>>({});
  const [selectedSizes, setSelectedSizes] = useState<Record<string, UnisexSize>>({});
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const categoryProducts = useMemo(() => {
    return activeCategory === 'All Essentials'
      ? PRODUCTS
      : PRODUCTS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const colorCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const family of COLOR_FAMILIES) {
      counts[family.id] = categoryProducts.filter((product) =>
        product.colors.some((c) => family.match(c.name))
      ).length;
    }
    return counts;
  }, [categoryProducts]);

  const filteredProducts = useMemo(() => {
    const base =
      activeColorFilters.length === 0
        ? categoryProducts
        : categoryProducts.filter((product) =>
            product.colors.some((color) =>
              activeColorFilters.some((filterId) => {
                const fam = COLOR_FAMILIES.find((f) => f.id === filterId);
                return fam ? fam.match(color.name) : false;
              })
            )
          );

    const copy = [...base];
    if (sortMode === 'price-asc') {
      copy.sort((a, b) => a.priceInr - b.priceInr);
    } else if (sortMode === 'price-desc') {
      copy.sort((a, b) => b.priceInr - a.priceInr);
    } else if (sortMode === 'rating') {
      copy.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    }
    return copy;
  }, [categoryProducts, activeColorFilters, sortMode]);

  const toggleColorFilter = (familyId: string) => {
    setActiveColorFilters((prev) =>
      prev.includes(familyId)
        ? prev.filter((id) => id !== familyId)
        : [...prev, familyId]
    );
  };

  const resolveActiveColorIndex = (product: Product): number => {
    if (selectedColors[product.id] !== undefined) {
      return selectedColors[product.id];
    }
    if (activeColorFilters.length > 0) {
      const matchedIdx = product.colors.findIndex((color) =>
        activeColorFilters.some((filterId) => {
          const fam = COLOR_FAMILIES.find((f) => f.id === filterId);
          return fam ? fam.match(color.name) : false;
        })
      );
      if (matchedIdx !== -1) return matchedIdx;
    }
    return 0;
  };

  const handleQuickAdd = (product: Product) => {
    const colorIdx = resolveActiveColorIndex(product);
    const color = product.colors[colorIdx] ?? product.colors[0];
    const size = selectedSizes[product.id] ?? 'M';
    onAddToCart(product, color.name, color.hex, color.image, size);
    setJustAddedId(product.id);
    window.setTimeout(() => {
      setJustAddedId((curr) => (curr === product.id ? null : curr));
    }, 1400);
  };

  return (
    <section id="shop" className="bg-[#F5F3EE] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-6 border-b border-[#111317]/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#96754A]">
              Unisex Essentials Collection
            </p>
            <h2
              className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#111317] sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Five silhouettes. Engineered in mineral shades.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#111317]/70 sm:text-base">
              Select a colorway and unisex size directly below, or open any garment for chest/waist measurements and polyester airflow benchmarks.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            <SlidersHorizontal className="h-4 w-4 text-[#111317]/60" aria-hidden="true" />
            <label htmlFor="catalog-sort" className="sr-only">
              Sort products
            </label>
            <select
              id="catalog-sort"
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="min-h-[40px] rounded-lg border border-[#111317]/15 bg-white px-3.5 py-2 text-sm font-medium text-[#111317] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89668]"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div
          id="capsules"
          className="mt-6 flex items-center gap-2 overflow-x-auto pb-2"
          role="tablist"
          aria-label="Filter garments by category"
        >
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(category)}
                className={`min-h-[40px] rounded-lg px-4 py-2 text-xs font-semibold tracking-wide whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89668] ${
                  isActive
                    ? 'bg-[#101216] text-[#F5F3EE]'
                    : 'bg-[#EAE6DF] text-[#111317]/75 hover:bg-[#e1dcd3] hover:text-[#111317]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Sidebar + Product Grid Split */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Colorway Filtering Sidebar */}
          <aside
            aria-label="Filter collection by colorway"
            className="lg:col-span-3"
          >
            {/* Mobile Color Filter Toggle */}
            <div className="flex items-center justify-between lg:hidden">
              <button
                type="button"
                onClick={() => setMobileColorsOpen((prev) => !prev)}
                aria-expanded={mobileColorsOpen}
                className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-[#111317]/15 bg-white px-4 py-2 text-xs font-semibold text-[#111317]"
              >
                <span>
                  Filter by Colorway
                  {activeColorFilters.length > 0
                    ? ` (${activeColorFilters.length})`
                    : ''}
                </span>
              </button>

              {activeColorFilters.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveColorFilters([])}
                  className="text-xs font-semibold text-[#96754A] underline-offset-2 hover:underline"
                >
                  Clear colors
                </button>
              )}
            </div>

            <div
              className={`${
                mobileColorsOpen ? 'mt-3 block' : 'hidden'
              } rounded-xl border border-[#111317]/10 bg-white p-5 lg:sticky lg:top-24 lg:block`}
            >
              <div className="flex items-center justify-between border-b border-[#111317]/10 pb-3">
                <div>
                  <h3 className="font-display text-sm font-semibold text-[#111317]">
                    Colorway Palette
                  </h3>
                  <p className="mt-0.5 text-[11px] text-[#111317]/60 tabular-nums">
                    Showing {filteredProducts.length} of {categoryProducts.length}{' '}
                    {categoryProducts.length === 1 ? 'garment' : 'garments'}
                  </p>
                </div>

                {activeColorFilters.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveColorFilters([])}
                    className="text-xs font-semibold text-[#96754A] hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="mt-3 space-y-1.5">
                {COLOR_FAMILIES.map((family) => {
                  const isActive = activeColorFilters.includes(family.id);
                  const count = colorCounts[family.id] ?? 0;
                  const disabled = count === 0 && !isActive;

                  return (
                    <button
                      key={family.id}
                      type="button"
                      disabled={disabled}
                      onClick={() => toggleColorFilter(family.id)}
                      aria-pressed={isActive}
                      className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-xs transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89668] ${
                        isActive
                          ? 'bg-[#101216] font-semibold text-[#F5F3EE]'
                          : disabled
                          ? 'cursor-not-allowed text-[#111317]/30'
                          : 'text-[#111317]/80 hover:bg-[#F5F3EE] hover:text-[#111317]'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 truncate">
                        <span
                          className={`h-4 w-4 shrink-0 rounded-full border ${
                            isActive ? 'border-white/50' : 'border-black/20'
                          }`}
                          style={{ backgroundColor: family.hex }}
                          aria-hidden="true"
                        />
                        <span className="truncate">{family.label}</span>
                      </span>

                      <span
                        className={`font-mono text-[11px] tabular-nums ${
                          isActive ? 'text-[#B89668]' : 'text-[#111317]/50'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Product Grid Column */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="rounded-xl border border-[#111317]/10 bg-white p-10 text-center">
                <p className="text-base font-medium text-[#111317]">
                  No garments matched this category and colorway combination.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('All Essentials');
                    setActiveColorFilters([]);
                  }}
                  className="mt-4 rounded-lg bg-[#101216] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product, idx) => {
                  const activeColorIdx = resolveActiveColorIndex(product);
                  const activeColor = product.colors[activeColorIdx] ?? product.colors[0];
                  const activeSize = selectedSizes[product.id] ?? 'M';
                  const isJustAdded = justAddedId === product.id;
                  const isSaved = wishlistProductIds.includes(product.id);

                  return (
                    <BlurFade key={product.id} delay={Math.min(idx * 0.04, 0.18)}>
                      <article
                        className="group flex h-full flex-col justify-between overflow-hidden rounded-xl border border-[#111317]/10 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B89668]/45 hover:shadow-xl hover:shadow-[#111317]/6"
                      >
                  <div>
                    {/* Product Image + Wishlist Button */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EAE6DF]">
                      <button
                        type="button"
                        onClick={() => onSelectProduct(product, activeColorIdx, activeSize)}
                        className="block h-full w-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89668]"
                        aria-label={`View details for ${product.name}`}
                      >
                        <SafeImage
                          src={activeColor.image}
                          alt={`${product.name} in ${activeColor.name}`}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          fallbackLabel={product.name}
                          tintHex={activeColor.hex}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleWishlist(product, activeColorIdx, activeSize)}
                        aria-pressed={isSaved}
                        aria-label={
                          isSaved
                            ? `Remove ${product.name} from wishlist`
                            : `Save ${product.name} to wishlist`
                        }
                        className={`absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-sm transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89668] ${
                          isSaved
                            ? 'border-[#9E543D]/30 bg-white text-[#9E543D] shadow-sm'
                            : 'border-black/10 bg-white/90 text-[#111317]/75 hover:bg-white hover:text-[#111317]'
                        }`}
                      >
                        <Heart
                          className={`h-4 w-4 ${isSaved ? 'fill-[#9E543D]' : ''}`}
                          aria-hidden="true"
                        />
                      </button>

                      {/* Subtle Tactile Dye Swatch Chip */}
                      <div
                        className="pointer-events-none absolute right-3 bottom-3 flex items-center gap-2 rounded-md border border-black/15 bg-white/95 px-2.5 py-1.5 backdrop-blur-sm"
                        aria-hidden="true"
                      >
                        <span
                          className="h-3.5 w-3.5 rounded-full border border-black/20"
                          style={{ backgroundColor: activeColor.hex }}
                        />
                        <span className="text-[11px] font-medium text-[#111317]">
                          {activeColor.name.split(' ')[0]}
                        </span>
                      </div>
                    </div>

                    {/* Clean Unboxed Metadata & Title */}
                    <div className="p-5 pb-3">
                      <div className="flex items-center justify-between gap-2 text-xs text-[#111317]/60">
                        <span className="font-medium tracking-wide uppercase">
                          {product.category} <span aria-hidden="true">·</span> {product.gsm} GSM
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono tabular-nums text-[#111317]/80">
                          <Star
                            className="h-3.5 w-3.5 fill-[#B89668] text-[#B89668]"
                            aria-hidden="true"
                          />
                          {product.rating.toFixed(1)} ({product.reviewCount})
                        </span>
                      </div>

                      <div className="mt-2 flex items-baseline justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => onSelectProduct(product, activeColorIdx, activeSize)}
                          className="text-left font-display text-lg font-semibold text-[#111317] transition-colors hover:text-[#96754A]"
                        >
                          {product.name}
                        </button>
                        <div className="shrink-0 text-right font-mono tabular-nums">
                          <span className="text-base font-semibold text-[#111317]">
                            {formatInr(product.priceInr)}
                          </span>
                          {product.compareAtInr && (
                            <span className="ml-1.5 text-xs text-[#111317]/45 line-through">
                              {formatInr(product.compareAtInr)}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="mt-1.5 text-sm text-[#111317]/70 line-clamp-2">
                        {product.bundleSummary ? `${product.bundleSummary} · ` : ''}
                        {product.tagline}
                      </p>

                      {/* Color Swatch Selector */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-[#111317]/65">
                          <span>Color: {activeColor.name}</span>
                          <span>{product.fitType}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {product.colors.map((color, idx) => {
                            const selected = idx === activeColorIdx;
                            return (
                              <button
                                key={color.name}
                                type="button"
                                onClick={() =>
                                  setSelectedColors((prev) => ({
                                    ...prev,
                                    [product.id]: idx,
                                  }))
                                }
                                title={color.name}
                                aria-label={`Select color ${color.name} for ${product.name}`}
                                aria-pressed={selected}
                                className={`flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89668] ${
                                  selected
                                    ? 'ring-2 ring-[#101216] ring-offset-2 ring-offset-white scale-105'
                                    : 'ring-1 ring-black/15 hover:scale-105'
                                }`}
                                style={{ backgroundColor: color.hex }}
                              >
                                {selected && (
                                  <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Unisex Size Selector */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-[#111317]/65">
                          <span>Unisex Size</span>
                          <button
                            type="button"
                            onClick={() => onSelectProduct(product, activeColorIdx, activeSize)}
                            className="font-medium text-[#96754A] underline-offset-2 hover:underline"
                          >
                            Fit &amp; Size Chart
                          </button>
                        </div>
                        <div className="mt-1.5 grid grid-cols-6 gap-1.5">
                          {product.sizes.map((size) => {
                            const selected = size === activeSize;
                            return (
                              <button
                                key={size}
                                type="button"
                                onClick={() =>
                                  setSelectedSizes((prev) => ({
                                    ...prev,
                                    [product.id]: size,
                                  }))
                                }
                                aria-pressed={selected}
                                className={`min-h-[34px] rounded-md text-xs font-semibold tabular-nums transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#B89668] ${
                                  selected
                                    ? 'bg-[#101216] text-white'
                                    : 'border border-[#111317]/15 bg-[#F5F3EE] text-[#111317]/80 hover:border-[#111317]/35'
                                }`}
                              >
                                {size}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="flex items-center gap-2.5 border-t border-[#111317]/10 px-5 py-4">
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(product)}
                      className={`inline-flex min-h-[42px] flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89668] ${
                        isJustAdded
                          ? 'bg-[#2E523A] text-white'
                          : 'bg-[#101216] text-[#F5F3EE] hover:bg-[#232730]'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="h-4 w-4" aria-hidden="true" />
                          <span>Added ({activeSize})</span>
                        </>
                      ) : (
                        <span>Add to Bag · {activeSize}</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectProduct(product, activeColorIdx, activeSize)}
                      className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-lg border border-[#111317]/15 bg-white px-3.5 py-2 text-xs font-semibold text-[#111317] whitespace-nowrap shrink-0 transition-colors hover:border-[#111317]/40 hover:bg-[#F5F3EE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89668]"
                      aria-label={`Quick view ${product.name}`}
                    >
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Quick View</span>
                    </button>
                  </div>
                      </article>
                    </BlurFade>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
