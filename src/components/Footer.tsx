import { useState, type FormEvent } from 'react';
import { Check, Copy, MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { BorderBeam } from './magicui/border-beam';
import { SpotlightCard } from './magicui/spotlight-card';

const NEWSLETTER_STORAGE_KEY = 'stylesse_newsletter_email_v1';
const FIRST_ORDER_CODE = 'EASE10';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribedEmail, setSubscribedEmail] = useState<string | null>(() => {
    try {
      return window.localStorage.getItem(NEWSLETTER_STORAGE_KEY);
    } catch {
      return null;
    }
  });
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setSubscribedEmail(trimmed);
    try {
      window.localStorage.setItem(NEWSLETTER_STORAGE_KEY, trimmed);
    } catch {
      // Ignore storage errors
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(FIRST_ORDER_CODE);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <footer className="bg-[#101216] text-[#EAE6DF] border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Newsletter Signup & First-Purchase Discount */}
        <SpotlightCard
          spotlightColor="rgba(184, 150, 104, 0.14)"
          className="mb-12 overflow-hidden rounded-xl border border-white/10 bg-[#181B21] p-6 sm:p-8"
        >
          <BorderBeam
            size={120}
            duration={8}
            colorFrom="#E5C99C"
            colorTo="#96754A"
          />
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6">
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#B89668]">
                First-Purchase Offer <span aria-hidden="true">·</span> Brand Dispatch
              </p>
              <h2
                className="mt-2 font-display text-2xl font-semibold tracking-tight text-white"
                style={{ textWrap: 'balance' }}
              >
                Take 10% off your first Stylesse order.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#EAE6DF]/75">
                Sign up for early access to new mineral colorways, AeroWeave drops, and athlete capsule restocks—plus an instant first-order discount code.
              </p>
            </div>

            <div className="lg:col-span-6">
              {subscribedEmail ? (
                <div className="rounded-lg border border-[#B89668]/35 bg-[#101216] p-4 sm:p-5">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#EAE6DF]/85">
                    <Check className="h-4 w-4 text-[#B89668]" aria-hidden="true" />
                    <span>Subscribed ({subscribedEmail})</span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-[#EAE6DF]/60">
                        Your 10% First-Order Code
                      </p>
                      <p className="mt-0.5 font-mono text-lg font-semibold tracking-wider text-white">
                        {FIRST_ORDER_CODE}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-white/15 bg-[#181B21] px-3.5 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:border-[#B89668] hover:text-[#B89668] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89668]"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-[#B89668]" aria-hidden="true" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-[#EAE6DF]/60">
                    Enter <span className="font-mono text-[#EAE6DF]/90">{FIRST_ORDER_CODE}</span> in your shopping bag at checkout.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} noValidate>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <label htmlFor="footer-newsletter-email" className="sr-only">
                      Email address for 10% first-purchase discount
                    </label>
                    <input
                      id="footer-newsletter-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="you@example.com"
                      className="min-h-[44px] flex-1 rounded-lg border border-white/15 bg-[#101216] px-4 py-2.5 text-sm text-white placeholder:text-[#EAE6DF]/45 focus:border-[#B89668] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="cred-sheen-btn min-h-[44px] rounded-lg bg-[#B89668] px-6 py-2.5 text-sm font-semibold text-[#101216] whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#caa97c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89668]"
                    >
                      Claim 10% Off
                    </button>
                  </div>
                  {error ? (
                    <p role="alert" className="mt-2 text-xs text-[#E5988B]">
                      {error}
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-[#EAE6DF]/55">
                      No spam. Only new drops and restock alerts. Unsubscribe anytime.
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </SpotlightCard>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-lg font-semibold tracking-[0.22em] uppercase text-white">
              Stylesse
            </p>
            <p className="mt-2 text-sm font-medium text-[#B89668]">
              Style with ease.
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#EAE6DF]/70">
              Unisex sports t-shirts, breathable mesh jerseys, everyday dry-fits, shorts, and tapered trackpants engineered in AeroWeave micro-polyester.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs font-semibold tracking-wider uppercase text-white">
              Collections
            </p>
            <ul className="mt-3 space-y-2 text-sm text-[#EAE6DF]/75">
              <li>
                <a href="#shop" className="hover:text-white">
                  Sports T-Shirts &amp; Dry-Fits
                </a>
              </li>
              <li>
                <a href="#shop" className="hover:text-white">
                  Training Jerseys
                </a>
              </li>
              <li>
                <a href="#shop" className="hover:text-white">
                  Shorts &amp; Trackpants
                </a>
              </li>
              <li>
                <a href="#capsules" className="hover:text-white">
                  Everyday Capsule Sets
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-xs font-semibold tracking-wider uppercase text-white">
              Garment Care &amp; Promise
            </p>
            <ul className="mt-3 space-y-2 text-sm text-[#EAE6DF]/75">
              <li>Machine wash cold (30°C) · Line dry in shade</li>
              <li>Cash on Delivery &amp; UPI available across India</li>
              <li>30-Day Sweat-Test &amp; instant size exchanges</li>
              <li>
                <a href="#fabric-lab" className="text-[#B89668] hover:underline">
                  Read AeroWeave Fabric Benchmarks
                </a>
              </li>
              <li>
                <a
                  href={buildWhatsAppUrl(
                    'Hi Stylesse! I would like to connect with your WhatsApp concierge.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#5FD08E] hover:underline"
                >
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>WhatsApp Style &amp; Order Concierge</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-[#EAE6DF]/55 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Stylesse Athleisure. All rights reserved.</p>
          <p>Unisex · Timeless · Yours</p>
        </div>
      </div>
    </footer>
  );
}
