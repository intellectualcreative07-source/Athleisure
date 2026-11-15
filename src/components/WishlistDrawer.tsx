import { useEffect } from 'react';
import { Heart, ShoppingBag, Trash2, X } from 'lucide-react';
import { formatInr, PRODUCTS, UNISEX_SIZES } from '../data/catalog';
import type { Product, UnisexSize, WishlistItem } from '../types/store';
import { SafeImage } from './SafeImage';

interface WishlistDrawerProps {
  isOpen: boolean;
  items: WishlistItem[];
  onClose: () => void;
  onRemoveItem: (productId: string) => void;
  onUpdateSize: (productId: string, size: UnisexSize) => void;
  onMoveToBag: (
    product: Product,
    colorName: string,
    colorHex: string,
    image: string,
    size: UnisexSize
  ) => void;
  onInspectProduct: (
    product: Product,
    colorIndex: number,
    size: UnisexSize
  ) => void;
}

export function WishlistDrawer({
  isOpen,
  items,
  onClose,
  onRemoveItem,
  onUpdateSize,
  onMoveToBag,
  onInspectProduct,
}: WishlistDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const resolvedItems = items
    .map((entry) => {
      const product = PRODUCTS.find((p) => p.id === entry.productId);
      if (!product) return null;
      const color = product.colors[entry.colorIndex] ?? product.colors[0];
      return { entry, product, color };
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/65 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Saved wishlist items"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-md flex-col bg-[#F5F3EE] text-[#111317] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#111317]/10 bg-white px-6 py-4">
          <div className="flex items-center gap-2.5">
            <Heart className="h-4 w-4 fill-[#9E543D] text-[#9E543D]" aria-hidden="true" />
            <h2 className="font-display text-lg font-semibold text-[#111317]">
              Saved Wishlist{' '}
              <span className="font-mono text-sm font-normal tabular-nums text-[#111317]/60">
                ({resolvedItems.length})
              </span>
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#111317]/70 hover:bg-[#EAE6DF] hover:text-[#111317]"
            aria-label="Close wishlist"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {resolvedItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EAE6DF] text-[#111317]/60">
                <Heart className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="mt-4 font-display text-lg font-semibold text-[#111317]">
                No saved essentials yet
              </p>
              <p className="mt-1 max-w-xs text-sm text-[#111317]/65">
                Tap the heart icon on any Stylesse garment to save your favorite colorways and unisex sizes for later.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 rounded-lg bg-[#101216] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#232730]"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {resolvedItems.map(({ entry, product, color }) => (
                <li
                  key={product.id}
                  className="rounded-xl border border-[#111317]/10 bg-white p-4"
                >
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onInspectProduct(product, entry.colorIndex, entry.size);
                      }}
                      className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#EAE6DF]"
                      aria-label={`View ${product.name}`}
                    >
                      <SafeImage
                        src={color.image}
                        alt={`${product.name} in ${color.name}`}
                        className="h-full w-full object-cover"
                        fallbackLabel={product.name}
                        tintHex={color.hex}
                      />
                    </button>

                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onInspectProduct(product, entry.colorIndex, entry.size);
                            }}
                            className="text-left font-display text-sm font-semibold text-[#111317] hover:text-[#96754A]"
                          >
                            {product.name}
                          </button>
                          <p className="mt-0.5 text-xs text-[#111317]/60">
                            {product.category} · {color.name}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(product.id)}
                          className="rounded p-1 text-[#111317]/45 hover:bg-[#EAE6DF] hover:text-[#111317]"
                          aria-label={`Remove ${product.name} from wishlist`}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <span className="font-mono text-sm font-semibold tabular-nums text-[#111317]">
                          {formatInr(product.priceInr)}
                        </span>

                        <div className="flex items-center gap-2">
                          <label
                            htmlFor={`wishlist-size-${product.id}`}
                            className="sr-only"
                          >
                            Size for {product.name}
                          </label>
                          <select
                            id={`wishlist-size-${product.id}`}
                            value={entry.size}
                            onChange={(e) =>
                              onUpdateSize(product.id, e.target.value as UnisexSize)
                            }
                            className="h-8 rounded-md border border-[#111317]/15 bg-[#F5F3EE] px-2 text-xs font-semibold text-[#111317]"
                          >
                            {UNISEX_SIZES.map((sz) => (
                              <option key={sz} value={sz}>
                                {sz}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() => {
                              onMoveToBag(
                                product,
                                color.name,
                                color.hex,
                                color.image,
                                entry.size
                              );
                              onRemoveItem(product.id);
                            }}
                            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#101216] px-3 text-xs font-semibold text-white whitespace-nowrap hover:bg-[#232730]"
                          >
                            <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Move to Bag</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
