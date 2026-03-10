"use client"

import Image from "next/image"
import Link from "next/link"
import { HOTEL_BOOKING_URL, NECYPAA_ADVISORY_URL, CONTACT_EMAIL } from "@/lib/constants"
import { Mail, ExternalLink } from "lucide-react"

export default function SiteFooter() {
  return (
    <footer
      className="mt-24 border-t relative overflow-hidden"
      style={{ borderColor: "var(--nec-border)", background: "var(--nec-dark)" }}
    >
      {/* Logo watermark behind footer */}
      <div className="absolute right-0 bottom-0 w-[400px] h-[280px] pointer-events-none select-none opacity-[0.03] -z-0">
        <Image
          src="/images/necypaa-logo.webp"
          alt=""
          fill
          className="object-contain object-right-bottom"
          aria-hidden="true"
        />
      </div>

      {/* Top accent bar */}
      <div
        className="h-1 w-full"
        style={{ background: "linear-gradient(90deg, var(--nec-pink) 0%, var(--nec-cyan) 50%, var(--nec-orange) 100%)" }}
      />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Identity column */}
          <div className="space-y-3">
            <h2
              className="text-xl font-black uppercase tracking-tight"
              style={{ color: "var(--nec-cyan)" }}
            >
              NECYPAA XXXVI
            </h2>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">CT Host Committee</p>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              The Northeast Convention of Young People in Alcoholics Anonymous — Hartford, Connecticut.
              Dec 31, 2026 – Jan 3, 2027.
            </p>
          </div>

          {/* Links column */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/register" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Pre-Register — $40
                </Link>
              </li>
              <li>
                <a
                  href={HOTEL_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-300 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  Book Hotel <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href={NECYPAA_ADVISORY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-300 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  NECYPAA Advisory Council <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link href="#purpose" className="text-sm text-gray-300 hover:text-white transition-colors">
                  About NECYPAA
                </Link>
              </li>
              <li>
                <Link href="#meetings" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Young People's Meetings in CT
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact column */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Contact</h3>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4 flex-shrink-0" style={{ color: "var(--nec-cyan)" }} />
              {CONTACT_EMAIL}
            </a>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs pt-1">
              Questions about registration, hotel, accessibility, or anything else — reach out any time.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500"
          style={{ borderColor: "var(--nec-border)" }}
        >
          <p>
            © {new Date().getFullYear()} NECYPAA XXXVI CT Host Committee · All rights reserved.
          </p>
          <p className="text-center">
            Northeast Convention of Young People in Alcoholics Anonymous
          </p>
        </div>
      </div>
    </footer>
  )
}
