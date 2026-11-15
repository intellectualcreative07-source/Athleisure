import { ArrowRight } from 'lucide-react';
import { BRAND_ASSETS } from '../data/catalog';
import { SafeImage } from './SafeImage';
import { BorderBeam } from './magicui/border-beam';
import { Marquee } from './magicui/marquee';
import { NumberTicker } from './magicui/number-ticker';
import { SpotlightCard } from './magicui/spotlight-card';

const HERO_MARQUEE_ITEMS = [
  '165 GSM AeroWeave Micro-Polyester',
  '3.2s Capillary Moisture Dispersion',
  '64 CFM Pinhole Mesh Airflow',
  'Unisex Proportioned XS – XXL',
  'Cash on Delivery & UPI Across India',
  '30-Day Sweat-Test Guarantee',
];

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-white/10 bg-[#101216] text-[#F5F3EE]"
    >
      {/* Subtle CRED-style architectural hairline grid + bronze atmospheric glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_75%_65%_at_65%_35%,#000_35%,transparent_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 right-1/4 h-[420px] w-[420px] rounded-full bg-[#B89668]/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Editorial Copy Column */}
          <div className="flex flex-col justify-between lg:col-span-7 lg:py-4">
            <div>
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#B89668]">
                Unisex Performance Athleisure <span aria-hidden="true">·</span> Style with ease
              </p>

              <h1
                className="mt-5 font-display font-semibold tracking-tight text-white"
                style={{
                  fontSize: 'clamp(2.4rem, 4.4vw, 4.1rem)',
                  lineHeight: 1.06,
                  textWrap: 'balance',
                }}
              >
                Built like an athlete. Tailored for every hour.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-[#EAE6DF]/80 sm:text-lg">
                Unisex sports t-shirts, breathable mesh jerseys, everyday dry-fits, shorts, and tapered trackpants engineered in AeroWeave micro-polyester. Effortless movement from 6 AM sprints to city transit.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-5">
                <a
                  href="#shop"
                  className="cred-sheen-btn group inline-flex min-h-[44px] items-center gap-2.5 rounded-lg bg-[#B89668] px-6 py-3 text-sm font-semibold text-[#101216] whitespace-nowrap shrink-0 transition-all duration-150 hover:bg-[#caa97c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89668]"
                >
                  <span>Shop Essentials</span>
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>

                <a
                  href="#fabric-lab"
                  className="inline-flex min-h-[44px] items-center px-2 py-2 text-sm font-medium text-[#EAE6DF] underline decoration-[#B89668]/60 underline-offset-4 whitespace-nowrap shrink-0 transition-colors hover:text-white hover:decoration-[#B89668]"
                >
                  Explore AeroWeave Polyester
                </a>
              </div>
            </div>

            {/* Grounded Quantitative Proof Strip with Magic UI NumberTicker */}
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              <div>
                <p className="font-mono text-xl font-semibold tabular-nums text-white sm:text-2xl">
                  <NumberTicker value={165} startValue={110} suffix=" GSM" />
                </p>
                <p className="mt-1 text-xs leading-snug text-[#EAE6DF]/70">
                  AeroWeave micro-polyester
                </p>
              </div>
              <div>
                <p className="font-mono text-xl font-semibold tabular-nums text-white sm:text-2xl">
                  <NumberTicker
                    value={3.2}
                    startValue={0.8}
                    decimalPlaces={1}
                    suffix=" sec"
                  />
                </p>
                <p className="mt-1 text-xs leading-snug text-[#EAE6DF]/70">
                  Zero-cling sweat dispersion
                </p>
              </div>
              <div>
                <p className="font-mono text-xl font-semibold tabular-nums text-white sm:text-2xl">
                  XS - XXL
                </p>
                <p className="mt-1 text-xs leading-snug text-[#EAE6DF]/70">
                  Proportioned unisex fit
                </p>
              </div>
            </div>
          </div>

          {/* Sculptural Brand Logo & Track Visual with BorderBeam + Spotlight */}
          <div className="lg:col-span-5">
            <SpotlightCard
              spotlightColor="rgba(229, 201, 156, 0.14)"
              spotlightSize={380}
              className="relative h-full min-h-[380px] overflow-hidden rounded-xl border border-white/15 bg-[#181B21]"
            >
              <SafeImage
                src={BRAND_ASSETS.runnerHero}
                alt="Stylesse sculptural silver runner emblem sprinting from track starting blocks"
                className="h-full w-full object-cover object-center lg:h-full"
                fallbackLabel="STYLESSE"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#101216]/90 via-[#101216]/45 to-transparent p-6">
                <p className="text-xs font-medium tracking-[0.18em] uppercase text-[#B89668]">
                  Move <span aria-hidden="true">·</span> Live <span aria-hidden="true">·</span> Become
                </p>
                <p className="mt-1 text-sm text-[#F5F3EE]/90">
                  Signature sculptural runner mark inspired by track starting blocks.
                </p>
              </div>
              <BorderBeam
                size={130}
                duration={9}
                colorFrom="#F0D8B3"
                colorTo="#96754A"
              />
            </SpotlightCard>
          </div>
        </div>
      </div>

      {/* CRED-style Kinetic Specification Ticker */}
      <div className="relative border-t border-white/10 bg-[#0D0E12]/90">
        <Marquee
          pauseOnHover
          repeat={3}
          className="py-2.5 [--duration:34s] [--gap:2.5rem]"
        >
          {HERO_MARQUEE_ITEMS.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-4 text-xs font-medium tracking-[0.14em] uppercase text-[#EAE6DF]/75 whitespace-nowrap"
            >
              <span>{item}</span>
              <span aria-hidden="true" className="text-[#B89668]">
                ·
              </span>
            </span>
          ))}
        </Marquee>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#101216] to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#101216] to-transparent"
        />
      </div>
    </section>
  );
}
