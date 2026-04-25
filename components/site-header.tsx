"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { X, Menu, ChevronDown } from "lucide-react"
import { HOTEL_BOOKING_URL, NECYPAA_ADVISORY_URL } from "@/lib/constants"
import { useFocusTrap } from "@/lib/use-focus-trap"
import { SPRING_SNAPPY } from "@/components/ui/motion-primitives"

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
  { href: "/#what-is-ypaa", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/program", label: "Program" },
  { href: HOTEL_BOOKING_URL, label: "Hotel", external: true },
  { href: "/blog", label: "Blog" },
  { href: "/service", label: "Service" },
  { href: "/faq", label: "FAQ" },
  {
    label: "Resources",
    children: [
      { href: "/breakfast", label: "Breakfast" },
      { href: "/merch", label: "Merch" },
      { href: "/journey", label: "Our Journey" },
      { href: "/prayer", label: "Prayer" },
      { href: "/asl", label: "ASL Resources" },
      { href: "/states", label: "Find Your State" },
      { href: "/alanon", label: "Al-Anon / Alateen" },
      { href: "/accessibility", label: "Accessibility" },
      { href: "/bid", label: "Start a Bid" },
      { href: NECYPAA_ADVISORY_URL, label: "Advisory", external: true },
    ],
  },
]

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/" || pathname === "/en" || pathname === "/es"
  const clean = pathname.replace(/^\/(en|es)/, "")
  if (href.startsWith("/#")) return clean === "/" || clean === ""
  return clean === href || clean.startsWith(href + "/")
}

function DesktopDropdown({ item, pathname }: { item: NavDropdown; pathname: string }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const timeout = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current)
    }
  }, [])

  const enter = () => {
    if (timeout.current) clearTimeout(timeout.current)
    setOpen(true)
  }
  const leave = () => {
    timeout.current = setTimeout(() => setOpen(false), 150)
  }

  // Close on focus leaving the entire dropdown container
  const handleBlur = useCallback((e: React.FocusEvent) => {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setOpen(false)
    }
  }, [])

  // Keyboard: Escape closes, ArrowDown opens
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        // Return focus to the trigger button
        const button = containerRef.current?.querySelector("button")
        button?.focus()
      }
      if (e.key === "ArrowDown" && !open) {
        e.preventDefault()
        setOpen(true)
      }
    },
    [open],
  )

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- hover/focus/keyboard handlers delegate to the interactive button and menu items within
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={enter}
      onMouseLeave={leave}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      <button
        className="nec-nav-link inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium tracking-[0.01em] text-[var(--nec-muted)] transition-all duration-150 hover:bg-[rgba(var(--nec-purple-rgb),0.04)] hover:text-[var(--nec-text)]"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute left-0 top-full z-50 -mt-1 min-w-[200px] pt-3"
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={SPRING_SNAPPY}
          >
            <div
              role="menu"
              className="nec-dropdown-panel rounded-xl py-2"
              style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
            >
              {item.children.map((child) =>
                child.external ? (
                  <a
                    key={child.label}
                    href={child.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    role="menuitem"
                    tabIndex={open ? 0 : -1}
                    onClick={() => setOpen(false)}
                    className="nec-nav-hover block px-4 py-2.5 text-sm text-[var(--nec-muted)] transition-colors hover:text-[var(--nec-text)]"
                  >
                    {child.label}
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                ) : (
                  <Link
                    key={child.label}
                    href={child.href}
                    role="menuitem"
                    tabIndex={open ? 0 : -1}
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-2 text-sm transition-colors ${
                      isActivePath(pathname, child.href)
                        ? "nec-nav-active font-semibold text-[var(--nec-text)]"
                        : "nec-nav-hover text-[var(--nec-muted)] hover:text-[var(--nec-text)]"
                    }`}
                    {...(isActivePath(pathname, child.href) ? { "aria-current": "page" as const } : {})}
                  >
                    {child.label}
                  </Link>
                ),
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MobileDropdown({ item, onClose, pathname }: { item: NavDropdown; onClose: () => void; pathname: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        className="nec-nav-hover flex w-full items-center justify-between rounded-xl px-4 py-3 text-base font-semibold tracking-[0.01em] text-[var(--nec-text)] transition-all hover:text-[var(--nec-text)]"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {item.label}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="space-y-0.5 pb-1 pl-4">
          {item.children.map((child) =>
            child.external ? (
              <a
                key={child.label}
                href={child.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="nec-nav-hover block rounded-lg px-4 py-2.5 text-sm text-[var(--nec-muted)] transition-colors hover:text-[var(--nec-text)]"
              >
                {child.label}
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            ) : (
              <Link
                key={child.label}
                href={child.href}
                onClick={onClose}
                className={`block rounded-lg px-4 py-2.5 text-sm transition-colors ${
                  isActivePath(pathname, child.href)
                    ? "nec-nav-active border-l-2 font-semibold text-[var(--nec-text)]"
                    : "nec-nav-hover text-[var(--nec-muted)] hover:text-[var(--nec-text)]"
                }`}
                style={isActivePath(pathname, child.href) ? { borderLeftColor: "var(--nec-purple)" } : undefined}
                {...(isActivePath(pathname, child.href) ? { "aria-current": "page" as const } : {})}
              >
                {child.label}
              </Link>
            ),
          )}
        </div>
      </div>
    </div>
  )
}

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const drawerRef = useFocusTrap<HTMLElement>(menuOpen)
  const pathname = usePathname()
  const shouldReduce = useReducedMotion()

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
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  return (
    <>
      <motion.header
        role="banner"
        aria-label="Site header"
        className="nec-header fixed left-0 right-0 top-0 z-50"
        animate={{
          borderBottomColor: scrolled ? "var(--nec-border)" : "transparent",
          boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.06)" : "0 0 0 rgba(0,0,0,0)",
        }}
        transition={shouldReduce ? { duration: 0 } : { duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
        style={{
          backdropFilter: "blur(12px) saturate(1.1)",
          WebkitBackdropFilter: "blur(12px) saturate(1.1)",
          borderBottom: "1px solid",
          paddingTop: "env(safe-area-inset-top)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-[4.5rem] items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-3" onClick={close}>
              <Image
                src="/images/necypaa-xxxvi-badge.webp"
                alt="NECYPAA XXXVI — Escaping the Mad Realm"
                width={200}
                height={100}
                sizes="200px"
                className="h-11 w-auto transition-opacity group-hover:opacity-90"
                priority
              />
              <div className="min-w-0">
                <p className="hidden text-[11px] uppercase tracking-[0.18em] text-[var(--nec-muted)] sm:block">
                  Hartford, Connecticut
                </p>
                <p className="truncate text-sm font-semibold tracking-[0.01em] text-[var(--nec-text)]">NECYPAA XXXVI</p>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav aria-label="Main navigation" className="hidden items-center gap-0.5 md:flex">
              {navItems.map((item) =>
                isDropdown(item) ? (
                  <DesktopDropdown key={item.label} item={item} pathname={pathname} />
                ) : item.external ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nec-nav-hover rounded-xl px-3 py-2 text-sm font-medium tracking-[0.01em] text-[var(--nec-muted)] transition-all duration-150 hover:text-[var(--nec-text)]"
                  >
                    {item.label}
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`rounded-xl px-3 py-2 text-sm font-medium tracking-[0.01em] transition-all duration-150 ${
                      isActivePath(pathname, item.href)
                        ? "nec-nav-active text-[var(--nec-text)]"
                        : "nec-nav-hover text-[var(--nec-muted)] hover:text-[var(--nec-text)]"
                    }`}
                    {...(isActivePath(pathname, item.href) ? { "aria-current": "page" as const } : {})}
                  >
                    {item.label}
                  </Link>
                ),
              )}
              <Link href="/register" className="btn-primary ml-3 !min-h-[2.85rem] !px-5 !py-2 !text-sm">
                Register
              </Link>
            </nav>

            {/* Mobile hamburger */}
            <button
              className="nec-nav-hover rounded-xl p-2 text-[var(--nec-muted)] transition-colors hover:text-[var(--nec-text)] md:hidden"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: "rgba(0,0,0,0.3)" }}
            initial={shouldReduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
          />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            ref={drawerRef}
            aria-label="Mobile navigation"
            className="nec-mobile-drawer fixed left-0 right-0 z-50 flex flex-col gap-1 overflow-y-auto p-4 md:hidden"
            style={{
              top: "calc(4.5rem + env(safe-area-inset-top, 0px))",
              maxHeight: "calc(100dvh - 4.5rem - env(safe-area-inset-top, 0px))",
              backdropFilter: "blur(14px) saturate(1.05)",
              WebkitBackdropFilter: "blur(14px) saturate(1.05)",
            }}
            initial={shouldReduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={shouldReduce ? { duration: 0 } : SPRING_SNAPPY}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {navItems.map((item) =>
              isDropdown(item) ? (
                <MobileDropdown key={item.label} item={item} onClose={close} pathname={pathname} />
              ) : item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  className="nec-nav-hover rounded-xl px-4 py-3 text-base font-semibold tracking-[0.01em] text-[var(--nec-text)] transition-all hover:text-[var(--nec-text)]"
                >
                  {item.label}
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={close}
                  className={`rounded-xl px-4 py-3 text-base font-semibold tracking-[0.01em] transition-all ${
                    isActivePath(pathname, item.href)
                      ? "nec-nav-active border-l-2 text-[var(--nec-text)]"
                      : "nec-nav-hover text-[var(--nec-text)] hover:text-[var(--nec-text)]"
                  }`}
                  style={isActivePath(pathname, item.href) ? { borderLeftColor: "var(--nec-purple)" } : undefined}
                  {...(isActivePath(pathname, item.href) ? { "aria-current": "page" as const } : {})}
                >
                  {item.label}
                </Link>
              ),
            )}
            <div className="mt-1 space-y-2 border-t border-[var(--nec-border)] pt-2">
              <Link href="/register" onClick={close} className="btn-primary w-full !justify-center">
                Register
              </Link>
              <a
                href={HOTEL_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="btn-secondary w-full !justify-center"
              >
                Book Hotel
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
