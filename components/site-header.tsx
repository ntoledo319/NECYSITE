"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { X, Menu, ChevronDown } from "lucide-react"
import { HOTEL_BOOKING_URL, NECYPAA_ADVISORY_URL } from "@/lib/constants"
import { useFocusTrap } from "@/lib/use-focus-trap"

type NavLink = {
  href: string
  label: string
  external?: boolean
}

type NavDropdown = {
  label: string
  children: NavLink[]
}

type NavItem = NavLink | NavDropdown

function isDropdown(item: NavItem): item is NavDropdown {
  return "children" in item
}

const navItems: NavItem[] = [
  {
    label: "Convention",
    children: [
      { href: "/events", label: "Events" },
      { href: "/register", label: "Register" },
      { href: "/breakfast", label: "Breakfast" },
      { href: HOTEL_BOOKING_URL, label: "Book Hotel", external: true },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    label: "Community",
    children: [
      { href: "#what-is-ypaa", label: "What is YPAA?" },
      { href: "/blog", label: "Blog" },
      { href: "#meetings", label: "YP Meetings in CT" },
      { href: "/states", label: "Find Your State" },
      { href: "/alanon", label: "Al-Anon / Alateen" },
    ],
  },
  {
    label: "Get Involved",
    children: [
      { href: "#business-meeting", label: "Business Meeting" },
      { href: "/service", label: "Service Opportunities" },
    ],
  },
  { href: "/accessibility", label: "Accessibility" },
  { href: NECYPAA_ADVISORY_URL, label: "Advisory", external: true },
]

function DesktopDropdown({ item }: { item: NavDropdown }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const timeout = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    return () => { if (timeout.current) clearTimeout(timeout.current) }
  }, [])

  const enter = () => {
    if (timeout.current) clearTimeout(timeout.current)
    setOpen(true)
  }
  const leave = () => {
    timeout.current = setTimeout(() => setOpen(false), 150)
  }

  return (
    <div ref={ref} className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <button
        className="px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white rounded-lg
                   hover:bg-white/5 transition-all duration-150 uppercase tracking-wide
                   inline-flex items-center gap-1"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open && (
        <div
          className="absolute top-full left-0 mt-1 min-w-[200px] rounded-xl py-2 z-50"
          style={{
            background: "rgba(15,10,30,0.98)",
            border: "1px solid rgba(45,31,78,0.8)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 24px rgba(124,58,237,0.06)",
            backdropFilter: "blur(16px)",
          }}
        >
          {item.children.map((child) =>
            child.external ? (
              <a
                key={child.label}
                href={child.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                {child.label}<span className="sr-only"> (opens in new tab)</span>
              </a>
            ) : (
              <Link
                key={child.label}
                href={child.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                {child.label}
              </Link>
            )
          )}
        </div>
      )}
    </div>
  )
}

function MobileDropdown({ item, onClose }: { item: NavDropdown; onClose: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        className="w-full px-4 py-3 text-base font-semibold text-gray-200 hover:text-white
                   hover:bg-white/5 rounded-xl transition-all uppercase tracking-wide
                   flex items-center justify-between"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {item.label}
        <ChevronDown className={`w-4 h-4 transition-transform duration-150 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open && (
        <div className="pl-4 space-y-0.5 pb-1">
          {item.children.map((child) =>
            child.external ? (
              <a
                key={child.label}
                href={child.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white
                           hover:bg-white/5 rounded-lg transition-colors"
              >
                {child.label}<span className="sr-only"> (opens in new tab)</span>
              </a>
            ) : (
              <Link
                key={child.label}
                href={child.href}
                onClick={onClose}
                className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white
                           hover:bg-white/5 rounded-lg transition-colors"
              >
                {child.label}
              </Link>
            )
          )}
        </div>
      )}
    </div>
  )
}

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const drawerRef = useFocusTrap<HTMLElement>(menuOpen)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    if (menuOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") setMenuOpen(false)
      }
      window.addEventListener("keydown", handleEscape)
      return () => {
        document.body.style.overflow = ""
        window.removeEventListener("keydown", handleEscape)
      }
    }
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  return (
    <>
      <header
        role="banner"
        aria-label="Site header"
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
        style={{
          background: scrolled
            ? "rgba(15,10,30,0.97)"
            : "rgba(15,10,30,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: scrolled ? "1px solid rgba(45,31,78,0.8)" : "1px solid transparent",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center group"
              onClick={close}
            >
              <Image
                src="/images/necypaa-xxxvi-badge.jpg"
                alt="NECYPAA XXXVI — Escaping the Mad Realm"
                width={200}
                height={100}
                className="h-10 w-auto rounded-full group-hover:opacity-90 transition-opacity"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
              {navItems.map((item) =>
                isDropdown(item) ? (
                  <DesktopDropdown key={item.label} item={item} />
                ) : item.external ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white rounded-lg
                               hover:bg-white/5 transition-all duration-150 uppercase tracking-wide"
                  >
                    {item.label}<span className="sr-only"> (opens in new tab)</span>
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white rounded-lg
                               hover:bg-white/5 transition-all duration-150 uppercase tracking-wide"
                  >
                    {item.label}
                  </Link>
                )
              )}
              <Link
                href="/register"
                className="btn-primary ml-3 !py-2 !px-5 !text-sm"
              >
                Register — $40
              </Link>
            </nav>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- backdrop dismiss is supplementary to Escape key
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={close}
        >
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- stopPropagation prevents accidental drawer close */}
          <nav
            ref={drawerRef}
            aria-label="Mobile navigation"
            className="absolute top-16 left-0 right-0 flex flex-col gap-1 p-4 max-h-[calc(100vh-4rem)] overflow-y-auto"
            style={{ background: "var(--nec-dark)", borderBottom: "1px solid var(--nec-border)", boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {navItems.map((item) =>
              isDropdown(item) ? (
                <MobileDropdown key={item.label} item={item} onClose={close} />
              ) : item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  className="px-4 py-3 text-base font-semibold text-gray-200 hover:text-white
                             hover:bg-white/5 rounded-xl transition-all uppercase tracking-wide"
                >
                  {item.label}<span className="sr-only"> (opens in new tab)</span>
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={close}
                  className="px-4 py-3 text-base font-semibold text-gray-200 hover:text-white
                             hover:bg-white/5 rounded-xl transition-all uppercase tracking-wide"
                >
                  {item.label}
                </Link>
              )
            )}
            <div className="pt-2 border-t border-gray-700/50 mt-1 space-y-2">
              <Link
                href="/register"
                onClick={close}
                className="btn-primary w-full !justify-center"
              >
                Register — $40
              </Link>
              <a
                href={HOTEL_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="btn-secondary w-full !justify-center"
              >
                Book Hotel<span className="sr-only"> (opens in new tab)</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
