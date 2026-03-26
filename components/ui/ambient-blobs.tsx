"use client"

import { FloatingElement } from "@/components/ui/motion-primitives"

export default function AmbientBlobs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <FloatingElement yOffset={30} xOffset={15} duration={12} delay={0}>
        <div
          className="absolute -top-40 -left-40 w-[900px] h-[900px] rounded-full opacity-[0.06]"
          style={{
            background: "radial-gradient(circle, var(--nec-purple) 0%, transparent 65%)",
            filter: "blur(120px)",
          }}
        />
      </FloatingElement>
      <FloatingElement yOffset={20} xOffset={-12} duration={14} delay={2}>
        <div
          className="absolute top-[30%] -right-20 w-[700px] h-[700px] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, var(--nec-pink) 0%, transparent 65%)",
            filter: "blur(120px)",
          }}
        />
      </FloatingElement>
      <FloatingElement yOffset={18} xOffset={10} duration={16} delay={4}>
        <div
          className="absolute bottom-[10%] left-[20%] w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, var(--nec-gold) 0%, transparent 65%)",
            filter: "blur(120px)",
          }}
        />
      </FloatingElement>
    </div>
  )
}
