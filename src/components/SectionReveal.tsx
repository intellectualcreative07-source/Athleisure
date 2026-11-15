import type { ReactNode } from 'react';
import { motion } from 'motion/react';

const SECTION_TRANSITION = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1] as const,
};

interface SectionRevealProps {
  children: ReactNode;
  slide?: boolean;
  delay?: number;
  className?: string;
}

export function SectionReveal({
  children,
  slide = true,
  delay = 0,
  className,
}: SectionRevealProps) {
  return (
    <motion.div
      initial={slide ? { opacity: 0, y: 24 } : { opacity: 0 }}
      whileInView={slide ? { opacity: 1, y: 0 } : { opacity: 1 }}
      viewport={{ once: true, amount: 'some', margin: '0px 0px -48px 0px' }}
      transition={{ ...SECTION_TRANSITION, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
