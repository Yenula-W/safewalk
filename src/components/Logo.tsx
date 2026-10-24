/**
 * The SafeWalk mark: a yellow tile with a route that climbs to a destination dot.
 * Works at 16px (favicon) and 48px (header).
 */
export function LogoMark({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <rect width="32" height="32" rx="8" fill="oklch(0.9 0.19 98)" />
      <path d="M7 23 L13 15 L18 19 L24 10" stroke="#0a0a0a" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="10" r="3.2" fill="#0a0a0a" />
    </svg>
  );
}

export function Logo({ className = "", mark = 26 }: { className?: string; mark?: number }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={mark} />
      <span className="display text-xl leading-none">SafeWalk</span>
    </span>
  );
}
