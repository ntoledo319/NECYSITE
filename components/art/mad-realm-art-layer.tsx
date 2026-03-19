"use client"

/**
 * Global Mad Realm art layer — wraps all decorative ambient elements.
 * Conditionally renders based on pathname: excluded on /alanon
 * to respect Tradition 6 and Al-Anon's distinct aesthetic.
 */

import { usePathname } from "next/navigation"
import MadRealmParticles from "./mad-realm-particles"
import MadRealmMazeBg from "./mad-realm-maze-bg"

const EXCLUDED_PATHS = ["/alanon", "/en/alanon", "/es/alanon"]

export default function MadRealmArtLayer() {
  const pathname = usePathname()

  if (EXCLUDED_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return null
  }

  return (
    <>
      <MadRealmMazeBg />
      <MadRealmParticles />
    </>
  )
}
