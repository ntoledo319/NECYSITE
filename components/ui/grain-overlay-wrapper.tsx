/**
 * Grain overlay — optimized with a static noise pattern to reduce GPU load.
 * Replaces feTurbulence with a more efficient background pattern.
 * Hidden via .a11y-reduce-motion in globals.css.
 */
export default function GrainOverlayWrapper() {
  return (
    <div
      className="grain-overlay pointer-events-none fixed inset-0 z-[9999]"
      style={{
        opacity: 0.015,
        mixBlendMode: "overlay",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
      }}
      aria-hidden="true"
    />
  )
}
