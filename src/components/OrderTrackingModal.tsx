import { useEffect, useState, type FormEvent } from 'react';
import { Check, MapPin, Package, Search, Truck, X } from 'lucide-react';
import { formatInr } from '../data/catalog';
import type { OrderReceipt } from '../types/store';

interface OrderTrackingModalProps {
  isOpen: boolean;
  lastOrder: OrderReceipt | null;
  onClose: () => void;
}

interface TrackingRecord {
  orderId: string;
  customerName: string;
  destination: string;
  carrier: string;
  etaText: string;
  paymentLabel: string;
  totalInr?: number;
  currentStepIndex: number; // 0..3
  updates: {
    step: string;
    detail: string;
    timestamp: string;
  }[];
}

const SAMPLE_TRACKING: Record<string, TrackingRecord> = {
  'STY-1042': {
    orderId: 'STY-1042',
    customerName: 'Rohan Kulkarni',
    destination: 'Indiranagar, Bengaluru — 560038',
    carrier: 'Bluedart Express Surface',
    etaText: 'Arriving tomorrow by 7:00 PM',
    paymentLabel: 'UPI Instant (Paid)',
    totalInr: 2998,
    currentStepIndex: 2,
    updates: [
      {
        step: 'Order Confirmed',
        detail: 'AeroWeave Everyday Dry-Fit & Pace 7" Shorts verified',
        timestamp: '12 Nov, 10:14 AM',
      },
      {
        step: 'Packed in Collector Box',
        detail: 'Quality checked & sealed in rigid matte kit',
        timestamp: '12 Nov, 03:40 PM',
      },
      {
        step: 'In Transit',
        detail: 'Reached Bengaluru Sort Facility',
        timestamp: '13 Nov, 11:25 PM',
      },
      {
        step: 'Delivered',
        detail: 'Awaiting final courier dispatch',
        timestamp: 'Estimated 15 Nov',
      },
    ],
  },
  'STY-2089': {
    orderId: 'STY-2089',
    customerName: 'Meera Nair',
    destination: 'Bandra West, Mumbai — 400050',
    carrier: 'Delhivery Priority Air',
    etaText: 'Out for delivery today',
    paymentLabel: 'Cash on Delivery (₹2,799)',
    totalInr: 2799,
    currentStepIndex: 3,
    updates: [
      {
        step: 'Order Confirmed',
        detail: 'Transit Tapered Trackpants (Midnight Navy · Size S)',
        timestamp: '11 Nov, 09:05 AM',
      },
      {
        step: 'Packed in Collector Box',
        detail: 'Dispatched from warehouse',
        timestamp: '11 Nov, 04:15 PM',
      },
      {
        step: 'In Transit',
        detail: 'Cleared Mumbai Western Hub',
        timestamp: '13 Nov, 06:50 AM',
      },
      {
        step: 'Out for Delivery',
        detail: 'Courier assigned · Bandra West',
        timestamp: '14 Nov, 08:30 AM',
      },
    ],
  },
};

export function OrderTrackingModal({
  isOpen,
  lastOrder,
  onClose,
}: OrderTrackingModalProps) {
  const [orderInput, setOrderInput] = useState('');
  const [activeRecord, setActiveRecord] = useState<TrackingRecord | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (lastOrder && !orderInput) {
      setOrderInput(lastOrder.orderId);
      setActiveRecord(buildRecordFromOrder(lastOrder));
      setErrorMsg('');
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, lastOrder, onClose, orderInput]);

  if (!isOpen) return null;

  function buildRecordFromOrder(order: OrderReceipt): TrackingRecord {
    return {
      orderId: order.orderId,
      customerName: order.customerName,
      destination: `${order.city} — ${order.pinCode}`,
      carrier: 'Stylesse Express Dispatch',
      etaText: 'Estimated delivery in 2–4 business days',
      paymentLabel:
        order.paymentMethod === 'COD'
          ? `Cash on Delivery (${formatInr(order.totalInr)})`
          : `${order.paymentMethod} (Paid)`,
      totalInr: order.totalInr,
      currentStepIndex: 1,
      updates: [
        {
          step: 'Order Confirmed',
          detail: `${order.items.length} ${order.items.length === 1 ? 'item' : 'items'} verified`,
          timestamp: order.placedAt,
        },
        {
          step: 'Preparing Shipment',
          detail: 'Quality inspection & rigid collector box packing',
          timestamp: 'In Progress',
        },
        {
          step: 'In Transit',
          detail: 'Handover to express courier',
          timestamp: 'Pending',
        },
        {
          step: 'Delivered',
          detail: `To ${order.city}`,
          timestamp: 'Upcoming',
        },
      ],
    };
  }

  const lookupOrder = (rawId: string) => {
    const normalized = rawId.trim().toUpperCase();
    setErrorMsg('');

    if (!normalized) {
      setActiveRecord(null);
      setErrorMsg('Please enter an Order ID (for example, STY-1042).');
      return;
    }

    if (lastOrder && lastOrder.orderId.toUpperCase() === normalized) {
      setActiveRecord(buildRecordFromOrder(lastOrder));
      return;
    }

    if (SAMPLE_TRACKING[normalized]) {
      setActiveRecord(SAMPLE_TRACKING[normalized]);
      return;
    }

    setActiveRecord(null);
    setErrorMsg(
      `No shipment found for "${normalized}". Check your confirmation receipt or try STY-1042.`
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    lookupOrder(orderInput);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-tracking-title"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-[#F5F3EE] p-6 text-[#111317] shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#111317]/15 bg-white text-[#111317] hover:bg-[#EAE6DF]"
          aria-label="Close order tracker"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#96754A]">
          Shipment Lookup
        </p>
        <h2
          id="order-tracking-title"
          className="mt-1.5 font-display text-2xl font-semibold text-[#111317]"
        >
          Track Your Stylesse Order
        </h2>
        <p className="mt-1.5 text-sm text-[#111317]/70">
          Enter the Order ID from your confirmation receipt to view live dispatch status.
        </p>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          <label htmlFor="track-order-id" className="sr-only">
            Order ID
          </label>
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#111317]/45"
              aria-hidden="true"
            />
            <input
              id="track-order-id"
              type="text"
              value={orderInput}
              onChange={(e) => {
                setOrderInput(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Enter Order ID (e.g. STY-1042)"
              className="min-h-[44px] w-full rounded-lg border border-[#111317]/15 bg-white pr-4 pl-10 font-mono text-sm uppercase text-[#111317] placeholder:font-sans placeholder:normal-case placeholder:text-[#111317]/45 focus:border-[#B89668] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="min-h-[44px] rounded-lg bg-[#101216] px-6 py-2.5 text-sm font-semibold text-[#F5F3EE] whitespace-nowrap shrink-0 transition-colors hover:bg-[#232730]"
          >
            Track Order
          </button>
        </form>

        {/* Quick Sample IDs */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#111317]/65">
          <span>Try sample IDs:</span>
          {lastOrder && (
            <button
              type="button"
              onClick={() => {
                setOrderInput(lastOrder.orderId);
                lookupOrder(lastOrder.orderId);
              }}
              className="font-mono font-semibold text-[#96754A] underline underline-offset-2 hover:text-[#111317]"
            >
              {lastOrder.orderId} (Your Order)
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setOrderInput('STY-1042');
              lookupOrder('STY-1042');
            }}
            className="font-mono font-semibold text-[#111317]/80 underline underline-offset-2 hover:text-[#111317]"
          >
            STY-1042
          </button>
          <button
            type="button"
            onClick={() => {
              setOrderInput('STY-2089');
              lookupOrder('STY-2089');
            }}
            className="font-mono font-semibold text-[#111317]/80 underline underline-offset-2 hover:text-[#111317]"
          >
            STY-2089
          </button>
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-800/20 bg-red-50 px-4 py-3 text-xs font-medium text-red-900"
          >
            {errorMsg}
          </div>
        )}

        {/* Active Shipment Status Timeline */}
        {activeRecord && (
          <div className="mt-6 rounded-xl border border-[#111317]/10 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#111317]/10 pb-4">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[#96754A]">
                  {activeRecord.orderId} · {activeRecord.carrier}
                </p>
                <p className="mt-1 font-display text-lg font-semibold text-[#111317]">
                  {activeRecord.etaText}
                </p>
              </div>
              <div className="text-right text-xs text-[#111317]/70">
                <p className="font-semibold text-[#111317]">{activeRecord.customerName}</p>
                <p>{activeRecord.paymentLabel}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-[#111317]/75">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#96754A]" aria-hidden="true" />
              <span>Destination: {activeRecord.destination}</span>
            </div>

            {/* Step Milestones */}
            <ol className="mt-5 space-y-4">
              {activeRecord.updates.map((milestone, idx) => {
                const isCompleted = idx <= activeRecord.currentStepIndex;
                const isCurrent = idx === activeRecord.currentStepIndex;
                return (
                  <li key={milestone.step} className="flex items-start gap-3.5">
                    <div
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                        isCurrent
                          ? 'border-[#B89668] bg-[#B89668] text-[#101216]'
                          : isCompleted
                          ? 'border-[#101216] bg-[#101216] text-white'
                          : 'border-[#111317]/20 bg-[#F5F3EE] text-[#111317]/40'
                      }`}
                    >
                      {isCurrent ? (
                        <Truck className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : isCompleted ? (
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <Package className="h-3 w-3" aria-hidden="true" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p
                          className={`text-sm font-semibold ${
                            isCompleted ? 'text-[#111317]' : 'text-[#111317]/45'
                          }`}
                        >
                          {milestone.step}
                        </p>
                        <span className="font-mono text-[11px] tabular-nums text-[#111317]/55">
                          {milestone.timestamp}
                        </span>
                      </div>
                      <p
                        className={`mt-0.5 text-xs ${
                          isCompleted ? 'text-[#111317]/75' : 'text-[#111317]/45'
                        }`}
                      >
                        {milestone.detail}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
