import { useState } from 'react';
import { ArrowRight, ChevronDown, MessageCircle, PackageSearch } from 'lucide-react';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface FaqSectionProps {
  onOpenOrderTracker: () => void;
}

type FaqTopic = 'All' | 'Sizing' | 'Fabric Care' | 'Shipping & Returns';

interface FaqItem {
  id: string;
  topic: Exclude<FaqTopic, 'All'>;
  question: string;
  answer: string;
}

const FAQ_TOPICS: FaqTopic[] = ['All', 'Sizing', 'Fabric Care', 'Shipping & Returns'];

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-unisex-fit',
    topic: 'Sizing',
    question: 'How does Stylesse unisex sizing fit across different body frames?',
    answer:
      'Every silhouette is graded on a balanced unisex athletic block from XS to XXL. For a clean, tailored everyday drape, order your usual size. If you prefer an oversized streetwear fit on Sports T-Shirts or Jerseys, size up once. Full chest, waist, and height measurements in inches and centimeters are available inside every product card.',
  },
  {
    id: 'faq-exchange',
    topic: 'Sizing',
    question: 'What happens if I pick the wrong size?',
    answer:
      'You are covered by our 30-Day Sweat-Test & Easy Exchange promise. If the fit feels off—even after a light training session—request a free size swap or full refund within 30 days with complimentary doorstep pickup.',
  },
  {
    id: 'faq-polyester',
    topic: 'Fabric Care',
    question: 'Will AeroWeave micro-polyester feel shiny or trap heat?',
    answer:
      'No. Unlike glossy budget polyester, Stylesse uses custom-spun 150–220 GSM matte-brushed micro-filaments engineered for 48–64 CFM airflow and 3.2-second moisture dispersion. It feels soft like fine knitwear while staying dry and odor-resistant via a silver-ion finish.',
  },
  {
    id: 'faq-washing',
    topic: 'Fabric Care',
    question: 'How should I wash and care for my Dry-Fits, Jerseys, and Trackpants?',
    answer:
      'Machine wash cold (30°C) inside-out with mild detergent and skip fabric softeners—softeners coat technical polyester fibers and slow down moisture wicking. Hang dry in shade; garments dry completely in roughly 25 minutes with zero shrinkage (< 0.5%) and no ironing required.',
  },
  {
    id: 'faq-shipping-cod',
    topic: 'Shipping & Returns',
    question: 'How fast is delivery, and is Cash on Delivery (COD) available?',
    answer:
      'Orders placed before 2 PM IST ship the same business day and arrive in 2–4 days across metro cities (4–6 days pan-India). Express delivery is free on orders above ₹2,499, and Cash on Delivery (COD), UPI, and cards are all supported without extra COD fees.',
  },
  {
    id: 'faq-promo-bundles',
    topic: 'Shipping & Returns',
    question: 'Can I apply the EASE10 first-purchase code on Capsule Sets?',
    answer:
      'Yes. Subscribe in the footer below to unlock EASE10, then apply it inside your shopping bag for an instant 10% discount across individual essentials, Capsule Sets, and lookbook kits—including Cash on Delivery orders.',
  },
];

export function FaqSection({ onOpenOrderTracker }: FaqSectionProps) {
  const [activeTopic, setActiveTopic] = useState<FaqTopic>('All');
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  const visibleFaqs =
    activeTopic === 'All'
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((item) => item.topic === activeTopic);

  return (
    <section
      id="faq"
      className="bg-[#EAE6DF] py-16 text-[#111317] sm:py-24 border-t border-[#111317]/10"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Sticky Summary & Topic Filters */}
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#96754A]">
              Buyer Guide &amp; Care
            </p>
            <h2
              className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#111317] sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Sizing, fabric care, and delivery answered clearly.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#111317]/75 sm:text-base">
              Everything you need to know before ordering your first Stylesse rotation—from unisex fit proportions to washing AeroWeave polyester.
            </p>

            <div
              className="mt-7 flex flex-wrap gap-2"
              role="tablist"
              aria-label="Filter frequently asked questions by topic"
            >
              {FAQ_TOPICS.map((topic) => {
                const isActive = activeTopic === topic;
                return (
                  <button
                    key={topic}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => {
                      setActiveTopic(topic);
                      const firstMatch =
                        topic === 'All'
                          ? FAQ_ITEMS[0]
                          : FAQ_ITEMS.find((i) => i.topic === topic);
                      if (firstMatch) setOpenId(firstMatch.id);
                    }}
                    className={`min-h-[38px] rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89668] ${
                      isActive
                        ? 'bg-[#101216] text-[#F5F3EE]'
                        : 'bg-[#F5F3EE] text-[#111317]/75 hover:bg-white hover:text-[#111317]'
                    }`}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 space-y-3 border-t border-[#111317]/10 pt-6">
              <p className="text-xs font-medium text-[#111317]/70">
                Need live sizing help or tracking an order?
              </p>
              <div className="flex flex-col items-start gap-2.5">
                <button
                  type="button"
                  onClick={onOpenOrderTracker}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#111317] underline decoration-[#B89668] decoration-2 underline-offset-4 transition-colors hover:text-[#96754A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B89668]"
                >
                  <PackageSearch className="h-4 w-4 text-[#96754A]" aria-hidden="true" />
                  <span>Track your delivery status</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>

                <a
                  href={buildWhatsAppUrl(
                    'Hi Stylesse! I have a question about sizing, fabric care, or delivery.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#175432] underline decoration-[#1F6E43]/50 decoration-2 underline-offset-4 transition-colors hover:text-[#103c23]"
                >
                  <MessageCircle className="h-4 w-4 text-[#1F6E43]" aria-hidden="true" />
                  <span>Chat with Stylesse on WhatsApp</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Accordion List */}
          <div className="lg:col-span-7">
            <div className="divide-y divide-[#111317]/10 rounded-xl border border-[#111317]/10 bg-[#F5F3EE]">
              {visibleFaqs.map((item) => {
                const isOpen = openId === item.id;
                return (
                  <div key={item.id} className="px-6 py-5">
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : item.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${item.id}`}
                      className="flex w-full items-start justify-between gap-4 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B89668]"
                    >
                      <div>
                        <span className="block text-[11px] font-semibold tracking-wider uppercase text-[#96754A]">
                          {item.topic}
                        </span>
                        <span className="mt-1 block font-display text-base font-semibold text-[#111317] sm:text-lg">
                          {item.question}
                        </span>
                      </div>
                      <ChevronDown
                        className={`mt-2 h-5 w-5 shrink-0 text-[#111317]/60 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#111317]' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    {isOpen && (
                      <div
                        id={`faq-panel-${item.id}`}
                        className="mt-3 pr-8 text-sm leading-relaxed text-[#111317]/75"
                      >
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
