import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { MotionConfig } from 'motion/react';
import { CatalogSection } from './components/CatalogSection';
import { CartDrawer } from './components/CartDrawer';
import { ConciergeWidget } from './components/ConciergeWidget';
import { FabricLabSection } from './components/FabricLabSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { LookbookUnboxingSection } from './components/LookbookUnboxingSection';
import { Navbar } from './components/Navbar';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ReviewsSection } from './components/ReviewsSection';
import { SectionReveal } from './components/SectionReveal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ScrollProgress } from './components/magicui/scroll-progress';
import type {
  CartItem,
  OrderReceipt,
  Product,
  UnisexSize,
  WishlistItem,
} from './types/store';

const CART_STORAGE_KEY = 'stylesse_cart_v1';
const ORDER_STORAGE_KEY = 'stylesse_last_order_v1';
const WISHLIST_STORAGE_KEY = 'stylesse_wishlist_v1';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = window.localStorage.getItem(CART_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  const [lastOrder, setLastOrder] = useState<OrderReceipt | null>(() => {
    try {
      const saved = window.localStorage.getItem(ORDER_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as OrderReceipt) : null;
    } catch {
      return null;
    }
  });

  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() => {
    try {
      const saved = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as WishlistItem[]) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [selectedPdp, setSelectedPdp] = useState<{
    product: Product;
    colorIndex: number;
    size: UnisexSize;
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage quota errors
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      if (lastOrder) {
        window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(lastOrder));
      } else {
        window.localStorage.removeItem(ORDER_STORAGE_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  }, [lastOrder]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(wishlistItems)
      );
    } catch {
      // Ignore storage errors
    }
  }, [wishlistItems]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2600);
  };

  const handleAddToCart = (
    product: Product,
    colorName: string,
    colorHex: string,
    image: string,
    size: UnisexSize,
    quantity = 1
  ) => {
    const key = `${product.id}__${colorName}__${size}`;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          name: product.name,
          category: product.category,
          colorName,
          colorHex,
          size,
          unitPriceInr: product.priceInr,
          image,
          quantity,
        },
      ];
    });
    showToast(`Added ${product.name} (${size}) to bag`);
  };

  const handleAddLookBundle = (
    itemsToAdd: { product: Product; size: UnisexSize }[]
  ) => {
    setCartItems((prev) => {
      let next = [...prev];
      for (const entry of itemsToAdd) {
        const defaultColor = entry.product.colors[0];
        const key = `${entry.product.id}__${defaultColor.name}__${entry.size}`;
        const existing = next.find((item) => item.key === key);
        if (existing) {
          next = next.map((item) =>
            item.key === key ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          next.push({
            key,
            productId: entry.product.id,
            name: entry.product.name,
            category: entry.product.category,
            colorName: defaultColor.name,
            colorHex: defaultColor.hex,
            size: entry.size,
            unitPriceInr: entry.product.priceInr,
            image: defaultColor.image,
            quantity: 1,
          });
        }
      }
      return next;
    });
    showToast(`Added ${itemsToAdd.length}-piece look to bag`);
    setIsCartOpen(true);
  };

  const handleUpdateQty = (key: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (key: string) => {
    setCartItems((prev) => prev.filter((item) => item.key !== key));
  };

  const handlePlaceOrder = (receipt: OrderReceipt) => {
    setLastOrder(receipt);
    setCartItems([]);
  };

  const handleToggleWishlist = (
    product: Product,
    colorIndex: number,
    size: UnisexSize
  ) => {
    const exists = wishlistItems.some((item) => item.productId === product.id);
    if (exists) {
      setWishlistItems((prev) =>
        prev.filter((item) => item.productId !== product.id)
      );
      showToast(`Removed ${product.name} from wishlist`);
    } else {
      setWishlistItems((prev) => [
        ...prev,
        { productId: product.id, colorIndex, size },
      ]);
      showToast(`Saved ${product.name} to wishlist`);
    }
  };

  const handleUpdateWishlistSize = (productId: string, size: UnisexSize) => {
    setWishlistItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, size } : item
      )
    );
  };

  const handleRemoveWishlistItem = (productId: string) => {
    setWishlistItems((prev) =>
      prev.filter((item) => item.productId !== productId)
    );
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#F5F3EE] text-[#111317]">
        <ScrollProgress />
        <Navbar
          cartCount={totalCartCount}
          wishlistCount={wishlistItems.length}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenWishlist={() => setIsWishlistOpen(true)}
          onSelectProduct={(product, colorIndex, size) =>
            setSelectedPdp({ product, colorIndex, size })
          }
        />

        <main>
          <HeroSection />
          <SectionReveal slide={false}>
            <CatalogSection
              wishlistProductIds={wishlistItems.map((w) => w.productId)}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={(product, colorName, colorHex, image, size) =>
                handleAddToCart(product, colorName, colorHex, image, size, 1)
              }
              onSelectProduct={(product, colorIndex, size) =>
                setSelectedPdp({ product, colorIndex, size })
              }
            />
          </SectionReveal>
          <SectionReveal>
            <FabricLabSection />
          </SectionReveal>
          <SectionReveal>
            <LookbookUnboxingSection onAddLookBundle={handleAddLookBundle} />
          </SectionReveal>
          <SectionReveal>
            <ReviewsSection />
          </SectionReveal>
          <SectionReveal>
            <FaqSection onOpenOrderTracker={() => setIsTrackerOpen(true)} />
          </SectionReveal>
        </main>

        <SectionReveal>
          <Footer />
        </SectionReveal>

      <OrderTrackingModal
        isOpen={isTrackerOpen}
        lastOrder={lastOrder}
        onClose={() => setIsTrackerOpen(false)}
      />

      <ProductDetailModal
        product={selectedPdp?.product ?? null}
        initialColorIndex={selectedPdp?.colorIndex ?? 0}
        initialSize={selectedPdp?.size ?? 'M'}
        onClose={() => setSelectedPdp(null)}
        onSwitchProduct={(nextProduct, nextColorIndex = 0) =>
          setSelectedPdp((prev) => ({
            product: nextProduct,
            colorIndex: nextColorIndex,
            size: prev?.size ?? 'M',
          }))
        }
        onAddToCart={handleAddToCart}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        items={wishlistItems}
        onClose={() => setIsWishlistOpen(false)}
        onRemoveItem={handleRemoveWishlistItem}
        onUpdateSize={handleUpdateWishlistSize}
        onMoveToBag={(product, colorName, colorHex, image, size) =>
          handleAddToCart(product, colorName, colorHex, image, size, 1)
        }
        onInspectProduct={(product, colorIndex, size) =>
          setSelectedPdp({ product, colorIndex, size })
        }
      />

      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        lastOrder={lastOrder}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onPlaceOrder={handlePlaceOrder}
        onClearReceipt={() => setLastOrder(null)}
      />

      <ConciergeWidget />

      {/* Non-blocking Add-to-Bag Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-5 bottom-20 z-50 flex items-center gap-3 rounded-xl border border-white/15 bg-[#101216] px-4 py-3 text-sm font-medium text-[#F5F3EE] shadow-xl"
        >
          <Check className="h-4 w-4 text-[#B89668]" aria-hidden="true" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="ml-1 text-xs font-semibold text-[#B89668] underline underline-offset-4 hover:text-white"
          >
            View Bag
          </button>
        </div>
      )}
      </div>
    </MotionConfig>
  );
}
