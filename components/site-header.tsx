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
  {
    label: "Convention",
    children: [
      { href: "/events", label: "Events" },
      { href: "/register", label: "Register" },
      { href: "/program", label: "Program" },
      { href: "/merch", label: "Merch" },
      { href: "/breakfast", label: "Breakfast" },
      { href: HOTEL_BOOKING_URL, label: "Book Hotel", external: true },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    label: "Community",
    children: [
      { href: "/#what-is-ypaa", label: "What is YPAA? ↓" },
      { href: "/blog", label: "Blog" },
      { href: "/journey", label: "The Journey" },
      { href: "/prayer", label: "Prayer" },
      { href: "/asl", label: "ASL Resources" },
      { href: "/states", label: "Find Your State" },
      { href: "/alanon", label: "Al-Anon / Alateen" },
    ],
  },
  {
    label: "Get Involved",
    children: [
      { href: "/#business-meeting", label: "Business Meeting ↓" },
      { href: "/service", label: "Service Opportunities" },
      { href: "/bid", label: "Start a Bid" },
    ],
  },
  { href: "/accessibility", label: "Accessibility" },
  { href: NECYPAA_ADVISORY_URL, label: "Advisory", external: true },
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
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
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
  }, [open])

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
        className="px-3 py-1.5 text-sm font-medium text-[var(--nec-muted)] hover:text-[var(--nec-text)] rounded-lg
                   hover:bg-[rgba(0,0,0,0.04)] transition-all duration-150 uppercase tracking-wide
                   inline-flex items-center gap-1 nec-nav-link"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-full left-0 -mt-1 pt-3 min-w-[200px] z-50"
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={SPRING_SNAPPY}
          >
            <div
              role="menu"
              className="rounded-xl py-2 nec-dropdown-panel"
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
                className="block px-4 py-2 text-sm text-[var(--nec-muted)] hover:text-[var(--nec-text)] nec-nav-hover transition-colors"
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
                    ? "text-[var(--nec-text)] nec-nav-active font-semibold"
                    : "text-[var(--nec-muted)] hover:text-[var(--nec-text)] nec-nav-hover"
                }`}
                {...(isActivePath(pathname, child.href) ? { "aria-current": "page" as const } : {})}
              >
                {child.label}
              </Link>
            )
          )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MobileDropdown({
  item,
  onClose,
  pathname,
}: {
  item: NavDropdown
  onClose: () => void
  pathname: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        className="w-full px-4 py-3 text-base font-semibold text-[var(--nec-text)] hover:text-[var(--nec-text)]
                   nec-nav-hover rounded-xl transition-all uppercase tracking-wide
                   flex items-center justify-between"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {item.label}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="pl-4 space-y-0.5 pb-1">
          {item.children.map((child) =>
            child.external ? (
              <a
                key={child.label}
                href={child.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="block px-4 py-2.5 text-sm text-[var(--nec-muted)] hover:text-[var(--nec-text)]
                           nec-nav-hover rounded-lg transition-colors"
              >
                {child.label}
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            ) : (
              <Link
                key={child.label}
                href={child.href}
                onClick={onClose}
                className={`block px-4 py-2.5 text-sm rounded-lg transition-colors ${
                  isActivePath(pathname, child.href)
                    ? "text-[var(--nec-text)] nec-nav-active font-semibold border-l-2"
                    : "text-[var(--nec-muted)] hover:text-[var(--nec-text)] nec-nav-hover"
                }`}
                style={isActivePath(pathname, child.href) ? { borderLeftColor: "var(--nec-purple)" } : undefined}
                {...(isActivePath(pathname, child.href) ? { "aria-current": "page" as const } : {})}
              >
                {child.label}
              </Link>
            )
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
        className="fixed top-0 left-0 right-0 z-50 nec-header"
        animate={{
          borderBottomColor: scrolled
            ? "var(--nec-border)"
            : "transparent",
          boxShadow: scrolled
            ? "0 2px 16px rgba(0,0,0,0.06)"
            : "0 0 0 rgba(0,0,0,0)",
        }}
        transition={shouldReduce ? { duration: 0 } : { duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
        style={{
          backdropFilter: "blur(16px) saturate(1.4)",
          WebkitBackdropFilter: "blur(16px) saturate(1.4)",
          borderBottom: "1px solid",
          paddingTop: "env(safe-area-inset-top)",
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
                src="/images/necypaa-xxxvi-badge.webp"
                alt="NECYPAA XXXVI — Escaping the Mad Realm"
                width={200}
                height={100}
                sizes="200px"
                className="h-10 w-auto group-hover:opacity-90 transition-opacity"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav
              aria-label="Main navigation"
              className="hidden md:flex items-center gap-1"
            >
              {navItems.map((item) =>
                isDropdown(item) ? (
                  <DesktopDropdown key={item.label} item={item} pathname={pathname} />
                ) : item.external ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-sm font-medium text-[var(--nec-muted)] hover:text-[var(--nec-text)] rounded-lg
                               nec-nav-hover transition-all duration-150 uppercase tracking-wide"
                  >
                    {item.label}
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg
                               transition-all duration-150 uppercase tracking-wide ${
                               isActivePath(pathname, item.href)
                                 ? "text-[var(--nec-text)] nec-nav-active"
                                 : "text-[var(--nec-muted)] hover:text-[var(--nec-text)] nec-nav-hover"
                               }`}
                    {...(isActivePath(pathname, item.href) ? { "aria-current": "page" as const } : {})}
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
              className="md:hidden p-2 rounded-lg text-[var(--nec-muted)] hover:text-[var(--nec-text)] nec-nav-hover transition-colors"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {menuOpen && (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- backdrop dismiss is supplementary to Escape key
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
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- stopPropagation prevents accidental drawer close
          <motion.nav
            ref={drawerRef}
            aria-label="Mobile navigation"
            className="fixed top-16 left-0 right-0 z-40 md:hidden flex flex-col gap-1 p-4
              max-h-[calc(100dvh-4rem)] overflow-y-auto nec-mobile-drawer"
            initial={shouldReduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={shouldReduce ? { duration: 0 } : SPRING_SNAPPY}
            style={{ backdropFilter: "blur(20px) saturate(1.5)", WebkitBackdropFilter: "blur(20px) saturate(1.5)" }}
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
              className="px-4 py-3 text-base font-semibold text-[var(--nec-text)] hover:text-[var(--nec-text)]
                         nec-nav-hover rounded-xl transition-all uppercase tracking-wide"
            >
              {item.label}
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          ) : (
            <Link
              key={item.label}
              href={item.href}
              onClick={close}
              className={`px-4 py-3 text-base font-semibold rounded-xl transition-all uppercase tracking-wide ${
                isActivePath(pathname, item.href)
                  ? "text-[var(--nec-text)] nec-nav-active border-l-2"
                  : "text-[var(--nec-text)] hover:text-[var(--nec-text)] nec-nav-hover"
              }`}
              style={isActivePath(pathname, item.href) ? { borderLeftColor: "var(--nec-purple)" } : undefined}
              {...(isActivePath(pathname, item.href) ? { "aria-current": "page" as const } : {})}
            >
              {item.label}
            </Link>
          )
        )}
        <div className="pt-2 border-t border-[var(--nec-border)] mt-1 space-y-2">
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
