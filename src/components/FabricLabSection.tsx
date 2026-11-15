import { useState } from 'react';
import { motion } from 'motion/react';
import { BRAND_ASSETS, FABRIC_LAB_METRICS } from '../data/catalog';
import { SafeImage } from './SafeImage';
import { BlurFade } from './magicui/blur-fade';
import { BorderBeam } from './magicui/border-beam';
import { SpotlightCard } from './magicui/spotlight-card';

export function FabricLabSection() {
  const [activeTabId, setActiveTabId] = useState(FABRIC_LAB_METRICS[0].id);
  const activeMetric =
    FABRIC_LAB_METRICS.find((m) => m.id === activeTabId) ?? FABRIC_LAB_METRICS[0];

  return (
    <section
      id="fabric-lab"
      className="border-y border-white/10 bg-[#101216] py-16 text-[#F5F3EE] sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left: Moody Brand Apparel Rack Photography with Spotlight + BorderBeam */}
          <div className="lg:col-span-5">
            <SpotlightCard
              spotlightColor="rgba(184, 150, 104, 0.14)"
              className="relative h-full min-h-[420px] overflow-hidden rounded-xl border border-white/10 bg-[#181B21]"
            >
              <SafeImage
                src={BRAND_ASSETS.unisexRack}
                alt="Stylesse unisex athleisure rack with charcoal and slate garments, fabric swatches, and matte hangtags"
                className="h-full w-full object-cover object-center lg:h-full"
                fallbackLabel="STYLESSE UNISEX"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#101216]/90 via-[#101216]/40 to-transparent p-6">
                <p className="text-xs font-medium tracking-[0.18em] uppercase text-[#B89668]">
                  AeroWeave Micro-Polyester
                </p>
                <p className="mt-1 text-sm text-[#EAE6DF]/90">
                  Tested across 100+ wash cycles for zero pilling, zero sag, and matte architectural drape.
                </p>
              </div>
              <BorderBeam
                size={110}
                duration={10}
                delay={2}
                colorFrom="#E5C99C"
                colorTo="#96754A"
              />
            </SpotlightCard>
          </div>

          {/* Right: Interactive Polyester Fabric & Breathability Breakdown */}
          <div className="flex flex-col justify-between lg:col-span-7">
            <BlurFade>
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#B89668]">
                  Material Engineering Lab
                </p>
                <h2
                  className="mt-2 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl"
                  style={{ textWrap: 'balance' }}
                >
                  Why premium micro-polyester outperforms heavy cotton.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#EAE6DF]/75 sm:text-base">
                  Every Stylesse garment is milled from custom-spun micro-filament polyester—delivering soft matte handfeel without sweaty cling or post-wash shrinkage.
                </p>

                {/* Interactive Lab Feature Tabs */}
                <div
                  className="mt-7 flex flex-wrap gap-2"
                  role="tablist"
                  aria-label="Polyester performance attributes"
                >
                  {FABRIC_LAB_METRICS.map((metric) => {
                    const isActive = metric.id === activeMetric.id;
                    return (
                      <button
                        key={metric.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setActiveTabId(metric.id)}
                        className={`min-h-[40px] rounded-lg px-4 py-2 text-xs font-semibold tracking-wide whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89668] ${
                          isActive
                            ? 'bg-[#B89668] text-[#101216]'
                            : 'border border-white/15 bg-[#181B21] text-[#EAE6DF]/85 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {metric.title}
                      </button>
                    );
                  })}
                </div>

                {/* Active Metric Panel with CRED Spotlight + BorderBeam */}
                <SpotlightCard
                  spotlightColor="rgba(184, 150, 104, 0.12)"
                  className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-[#181B21] p-6"
                >
                  <BorderBeam
                    size={120}
                    duration={8}
                    colorFrom="#E5C99C"
                    colorTo="#B89668"
                  />

                  <h3 className="font-display text-xl font-semibold text-white">
                    {activeMetric.headline}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#EAE6DF]/80">
                    {activeMetric.summary}
                  </p>

                  {/* Comparative Lab Bars */}
                  <div className="mt-6 space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">
                          Stylesse AeroWeave Polyester
                        </span>
                        <span className="font-mono font-medium tabular-nums text-[#B89668]">
                          {activeMetric.stylesseValue}
                        </span>
                      </div>
                      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          initial={false}
                          animate={{ scaleX: activeMetric.stylessePercent / 100 }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full w-full origin-left rounded-full bg-gradient-to-r from-[#B89668] to-[#E5C99C]"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs text-[#EAE6DF]/75">
                        <span>Standard Athletic Poly</span>
                        <span className="font-mono tabular-nums">
                          {activeMetric.standardPolyValue}
                        </span>
                      </div>
                      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          initial={false}
                          animate={{ scaleX: activeMetric.standardPolyPercent / 100 }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full w-full origin-left rounded-full bg-[#EAE6DF]/45"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs text-[#EAE6DF]/60">
                        <span>Combed Cotton Tee</span>
                        <span className="font-mono tabular-nums">
                          {activeMetric.cottonValue}
                        </span>
                      </div>
                      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          initial={false}
                          animate={{ scaleX: activeMetric.cottonPercent / 100 }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full w-full origin-left rounded-full bg-[#EAE6DF]/25"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Spec Callouts */}
                  <div className="mt-6 grid grid-cols-1 gap-4 border-t border-white/10 pt-5 sm:grid-cols-3">
                    {activeMetric.specNotes.map((spec) => (
                      <div key={spec.label}>
                        <p className="text-[11px] uppercase tracking-wider text-[#EAE6DF]/55">
                          {spec.label}
                        </p>
                        <p className="mt-1 font-mono text-sm font-medium tabular-nums text-white">
                          {spec.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </SpotlightCard>
              </div>
            </BlurFade>
          </div>
        </div>
      </div>
    </section>
  );
}
