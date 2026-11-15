import { useMemo, useState } from 'react';
import { ArrowRight, Check, Plus } from 'lucide-react';
import { formatInr, PRODUCTS } from '../data/catalog';
import type { ColorVariant, Product, UnisexSize } from '../types/store';
import { SafeImage } from './SafeImage';

interface CompleteTheLookWidgetProps {
  currentProduct: Product;
  activeColor: ColorVariant;
  selectedSize: UnisexSize;
  onSelectSuggestedProduct: (product: Product, colorIndex: number) => void;
  onAddToCart: (
    product: Product,
    colorName: string,
    colorHex: string,
    image: string,
    size: UnisexSize,
    quantity: number
  ) => void;
}

type ToneKey =
  | 'forest'
  | 'midnight'
  | 'slate'
  | 'sage'
  | 'terracotta'
  | 'plum'
  | 'sand'
  | 'obsidian';

function detectTone(colorName: string): ToneKey {
  const lower = colorName.toLowerCase();
  if (lower.includes('forest')) return 'forest';
  if (lower.includes('midnight')) return 'midnight';
  if (lower.includes('slate')) return 'slate';
  if (lower.includes('sage')) return 'sage';
  if (lower.includes('terracotta') || lower.includes('clay')) return 'terracotta';
  if (lower.includes('plum')) return 'plum';
  if (lower.includes('sand')) return 'sand';
  return 'obsidian';
}

const TONAL_PAIRING_PREFERENCES: Record<ToneKey, ToneKey[]> = {
  forest: ['forest', 'obsidian', 'sand'],
  midnight: ['midnight', 'obsidian', 'slate', 'sand'],
  slate: ['slate', 'midnight', 'obsidian', 'sand'],
  sage: ['obsidian', 'forest', 'sand', 'slate'],
  terracotta: ['obsidian', 'sand', 'forest'],
  plum: ['obsidian', 'sand', 'midnight'],
  sand: ['obsidian', 'forest', 'midnight', 'slate'],
  obsidian: ['obsidian', 'slate', 'forest', 'midnight'],
};

function findBestColorMatch(
  candidate: Product,
  sourceTone: ToneKey
): { colorIndex: number; color: ColorVariant; matchLabel: string } {
  const preferences = TONAL_PAIRING_PREFERENCES[sourceTone];

  for (let i = 0; i < preferences.length; i++) {
    const desiredTone = preferences[i];
    const idx = candidate.colors.findIndex(
      (c) => detectTone(c.name) === desiredTone
    );
    if (idx !== -1) {
      const matched = candidate.colors[idx];
      const matchLabel =
        i === 0 && desiredTone === sourceTone
          ? `Exact match · ${matched.name}`
          : `Tonal pair · ${matched.name}`;
      return { colorIndex: idx, color: matched, matchLabel };
    }
  }

  return {
    colorIndex: 0,
    color: candidate.colors[0],
    matchLabel: `Studio pair · ${candidate.colors[0].name}`,
  };
}

function getComplementaryIds(product: Product): string[] {
  switch (product.category) {
    case 'Jerseys':
      return ['sty-pace-shorts', 'sty-transit-trackpants'];
    case 'Sports T-Shirts':
      return ['sty-pace-shorts', 'sty-studio-trackpants'];
    case 'Dry-Fits':
      return ['sty-pace-shorts', 'sty-transit-trackpants'];
    case 'Shorts':
      return ['sty-vanguard-jersey', 'sty-aeroweave-dryfit'];
    case 'Trackpants':
      return ['sty-stride-tee', 'sty-vanguard-jersey'];
    case 'Capsule Sets':
      return ['sty-pace-shorts', 'sty-vanguard-jersey'];
  }
}

export function CompleteTheLookWidget({
  currentProduct,
  activeColor,
  selectedSize,
  onSelectSuggestedProduct,
  onAddToCart,
}: CompleteTheLookWidgetProps) {
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [bundleAdded, setBundleAdded] = useState(false);

  const suggestions = useMemo(() => {
    const sourceTone = detectTone(activeColor.name);
    const ids = getComplementaryIds(currentProduct);

    return ids
      .map((id) => PRODUCTS.find((p) => p.id === id))
      .filter((p): p is Product => p !== undefined && p.id !== currentProduct.id)
      .map((candidate) => {
        const match = findBestColorMatch(candidate, sourceTone);
        return {
          product: candidate,
          ...match,
        };
      });
  }, [currentProduct, activeColor.name]);

  if (suggestions.length === 0) return null;

  const primaryPair = suggestions[0];
  const combinedLookTotal = currentProduct.priceInr + primaryPair.product.priceInr;

  const handleQuickAddSuggested = (
    product: Product,
    color: ColorVariant
  ) => {
    onAddToCart(product, color.name, color.hex, color.image, selectedSize, 1);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    window.setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1400);
  };

  const handleAddCompleteLook = () => {
    onAddToCart(
      currentProduct,
      activeColor.name,
      activeColor.hex,
      activeColor.image,
      selectedSize,
      1
    );
    onAddToCart(
      primaryPair.product,
      primaryPair.color.name,
      primaryPair.color.hex,
      primaryPair.color.image,
      selectedSize,
      1
    );
    setBundleAdded(true);
    window.setTimeout(() => setBundleAdded(false), 1600);
  };

  return (
    <div className="mt-6 border-t border-[#111317]/10 pt-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[11px] font-semibold tracking-wider uppercase text-[#111317]/75">
          Complete the Look
        </p>
        <p className="text-[11px] text-[#96754A]">
          Styled for {activeColor.name}
        </p>
      </div>

      <div className="mt-3 space-y-2.5">
        {suggestions.map(({ product, colorIndex, color, matchLabel }) => {
          const isAdded = Boolean(addedIds[product.id]);

          return (
            <div
              key={product.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-[#111317]/10 bg-white p-2.5 transition-colors hover:border-[#111317]/25"
            >
              <button
                type="button"
                onClick={() => onSelectSuggestedProduct(product, colorIndex)}
                className="flex min-w-0 flex-1 items-center gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89668]"
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#EAE6DF]">
                  <SafeImage
                    src={color.image}
                    alt={`${product.name} in ${color.name}`}
                    className="h-full w-full object-cover"
                    fallbackLabel={product.name}
                    tintHex={color.hex}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-xs font-semibold text-[#111317]">
                      {product.name}
                    </p>
                    <ArrowRight
                      className="h-3 w-3 shrink-0 text-[#111317]/40"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[#111317]/65">
                    <span
                      className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-black/20"
                      style={{ backgroundColor: color.hex }}
                      aria-hidden="true"
                    />
                    <span className="truncate">{matchLabel}</span>
                  </div>
                  <p className="mt-0.5 font-mono text-xs font-semibold tabular-nums text-[#111317]">
                    {formatInr(product.priceInr)}
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickAddSuggested(product, color)}
                className={`inline-flex min-h-[34px] shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  isAdded
                    ? 'bg-[#2E523A] text-white'
                    : 'border border-[#111317]/15 bg-[#F5F3EE] text-[#111317] hover:bg-[#101216] hover:text-white'
                }`}
                aria-label={`Add ${product.name} in ${color.name} size ${selectedSize} to bag`}
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

      <button
        type="button"
        onClick={handleAddCompleteLook}
        className={`mt-3 flex min-h-[40px] w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
          bundleAdded
            ? 'bg-[#2E523A] text-white'
            : 'border border-[#B89668]/60 bg-[#B89668]/15 text-[#111317] hover:bg-[#B89668]/25'
        }`}
      >
        {bundleAdded ? (
          <>
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            <span>2-Piece Look Added ({selectedSize})</span>
          </>
        ) : (
          <span>
            Add 2-Piece Look ({currentProduct.category.split(' ')[0]} +{' '}
            {primaryPair.product.category}) ·{' '}
            <span className="font-mono tabular-nums">
              {formatInr(combinedLookTotal)}
            </span>
          </span>
        )}
      </button>
    </div>
  );
}
