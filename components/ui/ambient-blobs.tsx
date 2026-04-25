/**
 * Ambient background glow blobs — pure CSS, zero JS animation overhead.
 * Uses soft radial gradients (no filter: blur) for GPU-friendly rendering.
 * CSS keyframe drift replaces framer-motion FloatingElement.
 */
export default function AmbientBlobs() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
      style={{ contain: "strict", contentVisibility: "auto" }}
    >
      <div
        className="ambient-blob absolute -left-40 -top-40 h-[900px] w-[900px] rounded-full opacity-[0.06]"
        style={{
          background: "radial-gradient(circle, var(--nec-purple) 0%, transparent 50%)",
          animationDuration: "24s",
        }}
      />
      <div
        className="ambient-blob absolute -right-20 top-[30%] h-[700px] w-[700px] rounded-full opacity-[0.05]"
        style={{
          background: "radial-gradient(circle, var(--nec-pink) 0%, transparent 50%)",
          animationDuration: "28s",
          animationDelay: "-8s",
        }}
      />
      <div
        className="ambient-blob absolute bottom-[10%] left-[20%] h-[600px] w-[600px] rounded-full opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, var(--nec-gold) 0%, transparent 50%)",
          animationDuration: "32s",
          animationDelay: "-16s",
        }}
      />
    </div>
  )
}
