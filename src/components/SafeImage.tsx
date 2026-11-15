import { useState } from 'react';
import { Shirt } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  tintHex?: string;
}

export function SafeImage({
  src,
  alt,
  className = '',
  fallbackLabel = 'STYLESSE',
  tintHex,
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#EAE6DF] text-[#181B21] ${className}`}
        role="img"
        aria-label={alt}
      >
        <div
          className="mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-[#181B21]/15"
          style={tintHex ? { backgroundColor: `${tintHex}22` } : undefined}
        >
          <Shirt className="h-5 w-5 text-[#181B21]/70" aria-hidden="true" />
        </div>
        <span className="font-display text-xs font-semibold tracking-widest uppercase text-[#181B21]/75">
          {fallbackLabel}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
