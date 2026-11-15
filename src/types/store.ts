export type ProductCategory =
  | 'Sports T-Shirts'
  | 'Jerseys'
  | 'Dry-Fits'
  | 'Shorts'
  | 'Trackpants'
  | 'Capsule Sets';

export type UnisexSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface ColorVariant {
  name: string;
  hex: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  priceInr: number;
  compareAtInr?: number;
  gsm: number;
  fabricBlend: string;
  fitType: string;
  tagline: string;
  description: string;
  breathabilityCfm: number;
  wickTimeSec: number;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isBundle?: boolean;
  bundleSummary?: string;
  colors: ColorVariant[];
  sizes: UnisexSize[];
  highlights: string[];
}

export interface FabricLabMetric {
  id: string;
  title: string;
  headline: string;
  summary: string;
  stylesseValue: string;
  stylessePercent: number;
  cottonValue: string;
  cottonPercent: number;
  standardPolyValue: string;
  standardPolyPercent: number;
  specNotes: { label: string; value: string }[];
}

export interface LookbookItem {
  id: string;
  title: string;
  context: string;
  athleteNote: string;
  modelStats: string;
  image: string;
  productIds: string[];
  bundlePriceInr: number;
}

export interface BuyerReview {
  id: string;
  name: string;
  role: string;
  city: string;
  heightAndSize: string;
  category: ProductCategory;
  productName: string;
  rating: number;
  fitVerdict: 'True to Size' | 'Relaxed Drape';
  quote: string;
  outcome: string;
}

export interface CartItem {
  key: string;
  productId: string;
  name: string;
  category: ProductCategory;
  colorName: string;
  colorHex: string;
  size: UnisexSize;
  unitPriceInr: number;
  image: string;
  quantity: number;
}

export type PaymentMethod = 'COD' | 'UPI' | 'CARD';

export interface OrderReceipt {
  orderId: string;
  placedAt: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  pinCode: string;
  paymentMethod: PaymentMethod;
  subtotalInr: number;
  discountInr?: number;
  promoCode?: string;
  shippingInr: number;
  totalInr: number;
  items: CartItem[];
}

export interface WishlistItem {
  productId: string;
  colorIndex: number;
  size: UnisexSize;
}
