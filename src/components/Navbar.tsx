import { useEffect, useMemo, useRef, useState } from 'react';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { formatInr, PRODUCTS } from '../data/catalog';
import type { Product, UnisexSize } from '../types/store';
import { SafeImage } from './SafeImage';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onSelectProduct: (
    product: Product,
    initialColorIndex: number,
    initialSize: UnisexSize
  ) => void;
}

const NAV_LINKS = [
  { label: 'Shop', href: '#shop' },
  { label: 'Capsules', href: '#capsules' },
  { label: 'Fabric Lab', href: '#fabric-lab' },
  { label: 'Lookbook', href: '#lookbook' },
  { label: 'Reviews', href: '#reviews' },
];

const QUICK_SUGGESTIONS = ['Dry-Fits', 'Trackpants', 'Jerseys', 'Shorts', 'Sports T-Shirts'];

export function Navbar({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onSelectProduct,
}: NavbarProps) {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        item.colors.some((c) => c.name.toLowerCase().includes(q))
    );
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const inDesktop = searchContainerRef.current?.contains(target);
      const inMobile = mobileSearchRef.current?.contains(target);
      if (!inDesktop && !inMobile) {
        setDropdownOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        setMobileSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleChooseProduct = (product: Product) => {
    setDropdownOpen(false);
    setMobileSearchOpen(false);
    setQuery('');
    onSelectProduct(product, 0, 'M');
  };

  const renderDropdown = () => {
    if (!dropdownOpen || query.trim().length === 0) return null;

    return (
      <div
        role="listbox"
        aria-label="Product search results"
        className="absolute right-0 left-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-[#111317]/15 bg-white text-[#111317] shadow-2xl md:left-auto md:w-[380px]"
      >
        <div className="flex items-center justify-between border-b border-[#111317]/10 bg-[#F5F3EE] px-4 py-2 text-[11px] font-medium text-[#111317]/70">
          <span className="tabular-nums">
            {searchResults.length}{' '}
            {searchResults.length === 1 ? 'match' : 'matches'} for &ldquo;{query.trim()}&rdquo;
          </span>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setDropdownOpen(false);
            }}
            className="font-semibold text-[#96754A] hover:underline"
          >
            Clear
          </button>
        </div>

        {searchResults.length === 0 ? (
          <div className="p-5 text-center">
            <p className="text-sm font-medium text-[#111317]">
              No garments matched &ldquo;{query.trim()}&rdquo;
            </p>
            <p className="mt-1 text-xs text-[#111317]/60">
              Try searching by silhouette or category:
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              {QUICK_SUGGESTIONS.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setQuery(term);
                    setDropdownOpen(true);
                  }}
                  className="rounded-md border border-[#111317]/15 bg-[#F5F3EE] px-2.5 py-1 text-xs font-medium text-[#111317] hover:border-[#111317]/40"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <ul className="max-h-80 divide-y divide-[#111317]/10 overflow-y-auto">
            {searchResults.map((product) => {
              const primaryColor = product.colors[0];
              return (
                <li key={product.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={false}
                    onClick={() => handleChooseProduct(product)}
                    className="flex w-full items-center gap-3.5 px-4 py-3 text-left transition-colors hover:bg-[#F5F3EE]"
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#EAE6DF]">
                      <SafeImage
                        src={primaryColor.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                        fallbackLabel={product.name}
                        tintHex={primaryColor.hex}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm font-semibold text-[#111317]">
                        {product.name}
                      </p>
                      <p className="truncate text-xs text-[#111317]/60">
                        {product.category} <span aria-hidden="true">·</span> {product.gsm} GSM
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-xs font-semibold tabular-nums text-[#111317]">
                      {formatInr(product.priceInr)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  };

  return (
    <>
      {bannerVisible && (
        <div className="bg-[#181B21] text-[#EAE6DF] border-b border-white/10">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs sm:px-6 lg:px-8">
            <p className="truncate font-normal tracking-wide text-[#EAE6DF]/90">
              Free express shipping above ₹2,499 <span aria-hidden="true">·</span> Cash on Delivery across India <span aria-hidden="true">·</span> 30-Day Sweat-Test Guarantee
            </p>
            <button
              type="button"
              onClick={() => setBannerVisible(false)}
              className="shrink-0 rounded p-1 text-[#EAE6DF]/70 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89668]"
              aria-label="Dismiss shipping announcement"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#101216]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:gap-8 lg:px-8">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#top"
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B89668]"
          >
            <svg
              viewBox="0 0 28 28"
              fill="none"
              className="h-6 w-6 shrink-0"
              aria-hidden="true"
            >
              <path
                d="M17.5 4.2L20.8 2.5L19.4 6.2L16.3 7.6L17.5 4.2Z"
                fill="#B89668"
              />
              <path
                d="M21.8 8.3C17.2 8.9 13.6 11.4 11.8 14.2C10.9 15.6 11.7 16.9 14.1 17.5C16.8 18.2 17.9 19.6 16.4 21.8C14.7 24.3 10.6 25.5 6.4 25.5L8.3 22.8C11.1 22.6 13.3 21.7 13.9 20.6C14.4 19.7 13.4 19.1 11.2 18.5C7.9 17.6 6.8 15.4 8.5 12.6C10.8 8.9 15.6 6.6 22.5 6.4L21.8 8.3Z"
                fill="#F5F3EE"
              />
            </svg>
            <span className="font-display text-lg font-semibold tracking-[0.22em] uppercase">
              Stylesse
            </span>
          </a>

          {/* Zone 2: Concise Single-Line Nav Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#EAE6DF]/80"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-white after:absolute after:inset-x-0 after:bottom-0 after:h-[1.5px] after:origin-left after:scale-x-0 after:bg-[#B89668] after:transition-transform after:duration-200 hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B89668]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Global Search Bar + Shopping Bag Action */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Desktop Inline Search */}
            <div ref={searchContainerRef} className="relative hidden md:block">
              <div className="relative flex items-center">
                <Search
                  className="pointer-events-none absolute left-3 h-4 w-4 text-[#EAE6DF]/55"
                  aria-hidden="true"
                />
                <label htmlFor="navbar-global-search" className="sr-only">
                  Search Stylesse garments by name or category
                </label>
                <input
                  id="navbar-global-search"
                  type="search"
                  value={query}
                  onFocus={() => setDropdownOpen(true)}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setDropdownOpen(true);
                  }}
                  placeholder="Search tees, jerseys, shorts..."
                  className="h-10 w-52 rounded-lg border border-white/15 bg-[#181B21] pr-8 pl-9 text-xs text-white placeholder:text-[#EAE6DF]/45 transition-colors focus:border-[#B89668] focus:outline-none xl:w-64"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setDropdownOpen(false);
                    }}
                    className="absolute right-2 rounded p-1 text-[#EAE6DF]/60 hover:text-white"
                    aria-label="Clear search query"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
              {renderDropdown()}
            </div>

            {/* Mobile Search Toggle */}
            <button
              type="button"
              onClick={() => {
                setMobileSearchOpen((prev) => !prev);
                setMobileMenuOpen(false);
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-[#EAE6DF] md:hidden hover:border-white/30 hover:text-white"
              aria-label="Toggle product search"
              aria-expanded={mobileSearchOpen}
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={onOpenWishlist}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-white/15 bg-[#181B21] px-3 py-2 text-sm font-medium text-[#EAE6DF] whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[#B89668] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89668]"
              aria-label={`Open wishlist (${wishlistCount} saved)`}
            >
              <Heart
                className={`h-4 w-4 ${
                  wishlistCount > 0 ? 'fill-[#B89668] text-[#B89668]' : ''
                }`}
                aria-hidden="true"
              />
              <span className="font-mono text-xs font-semibold tabular-nums">
                {wishlistCount}
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenCart}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-[#B89668] px-4 py-2 text-sm font-semibold text-[#101216] whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#caa97c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89668]"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              <span>Bag</span>
              <span className="font-mono text-xs font-semibold tabular-nums">
                ({cartCount})
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen((prev) => !prev);
                setMobileSearchOpen(false);
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-[#EAE6DF] lg:hidden hover:border-white/30 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89668]"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Drawer */}
        {mobileSearchOpen && (
          <div
            ref={mobileSearchRef}
            className="relative border-t border-white/10 bg-[#101216] px-4 py-3 md:hidden"
          >
            <div className="relative flex items-center">
              <Search
                className="pointer-events-none absolute left-3 h-4 w-4 text-[#EAE6DF]/55"
                aria-hidden="true"
              />
              <label htmlFor="mobile-global-search" className="sr-only">
                Search Stylesse garments
              </label>
              <input
                id="mobile-global-search"
                type="search"
                autoFocus
                value={query}
                onFocus={() => setDropdownOpen(true)}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setDropdownOpen(true);
                }}
                placeholder="Search by garment name or category..."
                className="h-10 w-full rounded-lg border border-white/15 bg-[#181B21] pr-9 pl-9 text-sm text-white placeholder:text-[#EAE6DF]/45 focus:border-[#B89668] focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-2 rounded p-1 text-[#EAE6DF]/60 hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
            {renderDropdown()}
          </div>
        )}

        {mobileMenuOpen && (
          <nav
            aria-label="Mobile navigation"
            className="border-t border-white/10 bg-[#101216] px-4 py-4 lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#EAE6DF] hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
