/**
 * Grain overlay — pure CSS visibility, no framer-motion import.
 * Hidden via .a11y-reduce-motion in globals.css.
 */
export default function GrainOverlayWrapper() {
  return (
    <div
      className="grain-overlay fixed inset-0 pointer-events-none z-[9999]"
      style={{ opacity: 0.025, mixBlendMode: "overlay" }}
      aria-hidden="true"
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <filter id="mad-realm-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#mad-realm-grain)" />
      </svg>
    </div>
  )
}
