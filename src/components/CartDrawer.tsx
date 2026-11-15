import { useEffect, useState, type FormEvent } from 'react';
import { ArrowLeft, CheckCircle2, MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { formatInr } from '../data/catalog';
import type { CartItem, OrderReceipt, PaymentMethod } from '../types/store';
import {
  buildCartWhatsAppUrl,
  buildOrderSupportWhatsAppUrl,
} from '../utils/whatsapp';
import { SafeImage } from './SafeImage';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  lastOrder: OrderReceipt | null;
  onClose: () => void;
  onUpdateQty: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onPlaceOrder: (receipt: OrderReceipt) => void;
  onClearReceipt: () => void;
}

const FREE_SHIPPING_THRESHOLD = 2499;
const STANDARD_SHIPPING = 149;

export function CartDrawer({
  isOpen,
  items,
  lastOrder,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onPlaceOrder,
  onClearReceipt,
}: CartDrawerProps) {
  const [step, setStep] = useState<'bag' | 'checkout' | 'confirmed'>('bag');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [formError, setFormError] = useState('');
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (items.length === 0 && lastOrder && step !== 'confirmed') {
      setStep('bag');
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, items.length, lastOrder, onClose, step]);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPriceInr * item.quantity,
    0
  );
  const discountInr =
    appliedPromo === 'EASE10' ? Math.round(subtotal * 0.1) : 0;
  const discountedSubtotal = Math.max(0, subtotal - discountInr);
  const shipping =
    discountedSubtotal === 0 || discountedSubtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : STANDARD_SHIPPING;
  const total = discountedSubtotal + shipping;
  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - discountedSubtotal
  );
  const shippingProgress = Math.min(
    100,
    (discountedSubtotal / FREE_SHIPPING_THRESHOLD) * 100
  );

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (code === 'EASE10') {
      setAppliedPromo('EASE10');
      setPromoError('');
      setPromoInput('');
    } else {
      setPromoError('Invalid code. Use EASE10 from our footer newsletter for 10% off.');
    }
  };

  const handleCheckoutSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customerName.trim() || customerName.trim().length < 2) {
      setFormError('Please enter your full name for delivery.');
      return;
    }
    if (!/^\d{10}$/.test(phone.replace(/\s+/g, ''))) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!address.trim() || !city.trim()) {
      setFormError('Please complete your street address and city.');
      return;
    }
    if (!/^\d{6}$/.test(pinCode.trim())) {
      setFormError('Please enter a valid 6-digit PIN code.');
      return;
    }

    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const receipt: OrderReceipt = {
      orderId: `STY-${orderNum}`,
      placedAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      pinCode: pinCode.trim(),
      paymentMethod,
      subtotalInr: subtotal,
      discountInr: discountInr > 0 ? discountInr : undefined,
      promoCode: appliedPromo ?? undefined,
      shippingInr: shipping,
      totalInr: total,
      items: [...items],
    };

    onPlaceOrder(receipt);
    setAppliedPromo(null);
    setStep('confirmed');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/65 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping bag and checkout"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-md flex-col bg-[#F5F3EE] text-[#111317] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#111317]/10 bg-white px-6 py-4">
          <div className="flex items-center gap-2.5">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('bag')}
                className="rounded-md p-1.5 text-[#111317]/75 hover:bg-[#EAE6DF] hover:text-[#111317]"
                aria-label="Back to shopping bag"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
            <h2 className="font-display text-lg font-semibold text-[#111317]">
              {step === 'bag' && 'Your Bag'}
              {step === 'checkout' && 'Express Checkout'}
              {step === 'confirmed' && 'Order Confirmed'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#111317]/70 hover:bg-[#EAE6DF] hover:text-[#111317]"
            aria-label="Close bag drawer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Free Shipping Threshold Bar (Bag Step) */}
        {step === 'bag' && items.length > 0 && (
          <div className="border-b border-[#111317]/10 bg-[#EAE6DF] px-6 py-3">
            <p className="text-xs font-medium text-[#111317]">
              {remainingForFreeShipping === 0 ? (
                <span>Unlocked: Free Express Delivery across India</span>
              ) : (
                <span>
                  Add{' '}
                  <span className="font-mono font-semibold tabular-nums">
                    {formatInr(remainingForFreeShipping)}
                  </span>{' '}
                  more for Free Express Delivery
                </span>
              )}
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-black/10">
              <div
                className="h-full rounded-full bg-[#B89668] transition-all duration-300"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 'confirmed' && lastOrder ? (
            <div className="space-y-5">
              <div className="rounded-xl border border-[#2E523A]/20 bg-white p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-6 w-6 shrink-0 text-[#2E523A]"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[#2E523A]">
                      Order {lastOrder.orderId} Confirmed
                    </p>
                    <h3 className="mt-1 font-display text-lg font-semibold text-[#111317]">
                      Preparing your Stylesse dispatch
                    </h3>
                    <p className="mt-1 text-xs text-[#111317]/70">
                      Placed on {lastOrder.placedAt} · Payment:{' '}
                      {lastOrder.paymentMethod === 'COD'
                        ? 'Cash on Delivery'
                        : lastOrder.paymentMethod}
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-[#111317]/10 pt-4 text-xs text-[#111317]/80">
                  <p className="font-semibold text-[#111317]">Delivering to:</p>
                  <p className="mt-1">
                    {lastOrder.customerName} · {lastOrder.phone}
                  </p>
                  <p>
                    {lastOrder.address}, {lastOrder.city} — {lastOrder.pinCode}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-[#111317]/10 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#111317]/60">
                  Itemized Summary
                </p>
                <ul className="mt-3 divide-y divide-[#111317]/10">
                  {lastOrder.items.map((item) => (
                    <li
                      key={item.key}
                      className="flex items-center justify-between gap-3 py-2.5 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-[#111317]">{item.name}</p>
                        <p className="text-[#111317]/65">
                          {item.colorName} · Size {item.size} · Qty {item.quantity}
                        </p>
                      </div>
                      <span className="font-mono font-semibold tabular-nums">
                        {formatInr(item.unitPriceInr * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 space-y-1 border-t border-[#111317]/10 pt-3 text-xs">
                  {lastOrder.discountInr && lastOrder.promoCode && (
                    <div className="flex justify-between text-[#2E523A]">
                      <span>Discount ({lastOrder.promoCode})</span>
                      <span className="font-mono tabular-nums">
                        -{formatInr(lastOrder.discountInr)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm font-semibold text-[#111317]">
                    <span>Total Payable</span>
                    <span className="font-mono tabular-nums">
                      {formatInr(lastOrder.totalInr)}
                    </span>
                  </div>
                </div>
              </div>

              <a
                href={buildOrderSupportWhatsAppUrl(lastOrder.orderId)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[42px] w-full items-center justify-center gap-2 rounded-lg border border-[#1F6E43]/30 bg-[#1F6E43]/8 px-5 py-2.5 text-sm font-semibold text-[#175432] transition-colors hover:bg-[#1F6E43]/15"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>Get Updates on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  onClearReceipt();
                  setStep('bag');
                  onClose();
                }}
                className="min-h-[44px] w-full rounded-lg bg-[#101216] px-5 py-3 text-sm font-semibold text-white hover:bg-[#232730]"
              >
                Continue Exploring Stylesse
              </button>
            </div>
          ) : step === 'bag' ? (
            items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EAE6DF] text-[#111317]/60">
                  <ShoppingBag className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="mt-4 font-display text-lg font-semibold text-[#111317]">
                  Your Stylesse bag is empty
                </p>
                <p className="mt-1 max-w-xs text-sm text-[#111317]/65">
                  Explore our unisex dry-fits, sports tees, jerseys, shorts, and tapered trackpants.
                </p>

                {lastOrder && (
                  <button
                    type="button"
                    onClick={() => setStep('confirmed')}
                    className="mt-5 text-xs font-semibold text-[#96754A] underline underline-offset-4"
                  >
                    View last receipt ({lastOrder.orderId})
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="mt-6 rounded-lg bg-[#101216] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#232730]"
                >
                  Browse Collection
                </button>
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={item.key}
                    className="flex gap-4 rounded-xl border border-[#111317]/10 bg-white p-3.5"
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#EAE6DF]">
                      <SafeImage
                        src={item.image}
                        alt={`${item.name} in ${item.colorName}`}
                        className="h-full w-full object-cover"
                        fallbackLabel={item.name}
                        tintHex={item.colorHex}
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-display text-sm font-semibold text-[#111317]">
                            {item.name}
                          </p>
                          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-[#111317]/65">
                            <span
                              className="inline-block h-2.5 w-2.5 rounded-full border border-black/20"
                              style={{ backgroundColor: item.colorHex }}
                              aria-hidden="true"
                            />
                            <span>
                              {item.colorName} · Size {item.size}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.key)}
                          className="rounded p-1 text-[#111317]/45 hover:bg-[#EAE6DF] hover:text-[#111317]"
                          aria-label={`Remove ${item.name} from bag`}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center rounded-md border border-[#111317]/15 bg-[#F5F3EE]">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.key, -1)}
                            className="flex h-7 w-7 items-center justify-center text-[#111317] hover:bg-[#EAE6DF]"
                            aria-label="Decrease item quantity"
                          >
                            <Minus className="h-3 w-3" aria-hidden="true" />
                          </button>
                          <span className="w-7 text-center font-mono text-xs font-semibold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.key, 1)}
                            className="flex h-7 w-7 items-center justify-center text-[#111317] hover:bg-[#EAE6DF]"
                            aria-label="Increase item quantity"
                          >
                            <Plus className="h-3 w-3" aria-hidden="true" />
                          </button>
                        </div>

                        <span className="font-mono text-sm font-semibold tabular-nums text-[#111317]">
                          {formatInr(item.unitPriceInr * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )
          ) : (
            /* Checkout Form Step */
            <form id="stylesse-checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
              {formError && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-800/20 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-900"
                >
                  {formError}
                </div>
              )}

              <div>
                <label htmlFor="checkout-name" className="block text-xs font-semibold text-[#111317]">
                  Full Name
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Aarav Sharma"
                  className="mt-1.5 w-full rounded-lg border border-[#111317]/15 bg-white px-3.5 py-2.5 text-sm text-[#111317] focus:border-[#B89668] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="checkout-phone" className="block text-xs font-semibold text-[#111317]">
                  10-Digit Mobile Number
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="mt-1.5 w-full rounded-lg border border-[#111317]/15 bg-white px-3.5 py-2.5 font-mono text-sm text-[#111317] focus:border-[#B89668] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="checkout-address" className="block text-xs font-semibold text-[#111317]">
                  Delivery Address
                </label>
                <input
                  id="checkout-address"
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat 402, Indiranagar 12th Main"
                  className="mt-1.5 w-full rounded-lg border border-[#111317]/15 bg-white px-3.5 py-2.5 text-sm text-[#111317] focus:border-[#B89668] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="checkout-city" className="block text-xs font-semibold text-[#111317]">
                    City
                  </label>
                  <input
                    id="checkout-city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bengaluru"
                    className="mt-1.5 w-full rounded-lg border border-[#111317]/15 bg-white px-3.5 py-2.5 text-sm text-[#111317] focus:border-[#B89668] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="checkout-pin" className="block text-xs font-semibold text-[#111317]">
                    PIN Code
                  </label>
                  <input
                    id="checkout-pin"
                    type="text"
                    required
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="560038"
                    className="mt-1.5 w-full rounded-lg border border-[#111317]/15 bg-white px-3.5 py-2.5 font-mono text-sm text-[#111317] focus:border-[#B89668] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs font-semibold text-[#111317]">Payment Method</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'COD', label: 'Cash on Delivery' },
                      { id: 'UPI', label: 'UPI Instant' },
                      { id: 'CARD', label: 'Debit / Credit' },
                    ] as const
                  ).map((method) => {
                    const active = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`rounded-lg border px-2.5 py-2.5 text-xs font-semibold transition-colors ${
                          active
                            ? 'border-[#101216] bg-[#101216] text-white'
                            : 'border-[#111317]/15 bg-white text-[#111317]/80 hover:border-[#111317]/40'
                        }`}
                      >
                        {method.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer Action Bar */}
        {step !== 'confirmed' && items.length > 0 && (
          <div className="border-t border-[#111317]/10 bg-white px-6 py-5">
            {step === 'bag' && (
              <div className="mb-4">
                {appliedPromo ? (
                  <div className="flex items-center justify-between rounded-lg border border-[#2E523A]/20 bg-[#2E523A]/5 px-3 py-2 text-xs">
                    <span className="font-medium text-[#2E523A]">
                      Code <span className="font-mono font-semibold">{appliedPromo}</span> applied (10% off)
                    </span>
                    <button
                      type="button"
                      onClick={() => setAppliedPromo(null)}
                      className="font-semibold text-[#111317]/65 hover:text-[#111317]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <label htmlFor="bag-promo-code" className="sr-only">
                        Promo code
                      </label>
                      <input
                        id="bag-promo-code"
                        type="text"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value);
                          if (promoError) setPromoError('');
                        }}
                        placeholder="Promo code (e.g. EASE10)"
                        className="min-h-[38px] flex-1 rounded-lg border border-[#111317]/15 bg-[#F5F3EE] px-3 py-1.5 font-mono text-xs uppercase text-[#111317] placeholder:font-sans placeholder:normal-case placeholder:text-[#111317]/50 focus:border-[#B89668] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="min-h-[38px] rounded-lg border border-[#111317]/20 px-3.5 py-1.5 text-xs font-semibold text-[#111317] whitespace-nowrap hover:bg-[#EAE6DF]"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && (
                      <p className="mt-1.5 text-[11px] text-red-700">{promoError}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-1.5 text-xs text-[#111317]/75">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono font-medium tabular-nums text-[#111317]">
                  {formatInr(subtotal)}
                </span>
              </div>
              {discountInr > 0 && (
                <div className="flex justify-between text-[#2E523A]">
                  <span>First-Order Discount ({appliedPromo})</span>
                  <span className="font-mono font-medium tabular-nums">
                    -{formatInr(discountInr)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Shipping</span>
                <span className="font-mono font-medium tabular-nums text-[#111317]">
                  {shipping === 0 ? 'Free' : formatInr(shipping)}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#111317]/10 pt-2 text-sm font-semibold text-[#111317]">
                <span>Total</span>
                <span className="font-mono tabular-nums">{formatInr(total)}</span>
              </div>
            </div>

            {step === 'bag' ? (
              <div className="mt-4 space-y-2.5">
                <button
                  type="button"
                  onClick={() => setStep('checkout')}
                  className="min-h-[44px] w-full rounded-lg bg-[#101216] px-6 py-3 text-sm font-semibold text-[#F5F3EE] transition-colors hover:bg-[#232730]"
                >
                  Proceed to Checkout
                </button>
                <a
                  href={buildCartWhatsAppUrl(
                    items,
                    appliedPromo,
                    discountInr,
                    shipping,
                    total
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[40px] w-full items-center justify-center gap-2 rounded-lg border border-[#1F6E43]/30 bg-[#1F6E43]/8 px-4 py-2 text-xs font-semibold text-[#175432] transition-colors hover:bg-[#1F6E43]/15"
                >
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Complete Order via WhatsApp</span>
                </a>
              </div>
            ) : (
              <button
                type="submit"
                form="stylesse-checkout-form"
                className="mt-4 min-h-[44px] w-full rounded-lg bg-[#B89668] px-6 py-3 text-sm font-semibold text-[#101216] transition-colors hover:bg-[#caa97c]"
              >
                Confirm Order ·{' '}
                <span className="font-mono tabular-nums">{formatInr(total)}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
