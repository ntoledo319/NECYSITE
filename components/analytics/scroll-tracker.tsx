'use client'

import { useEffect, useCallback, useRef } from 'react'
import { trackScrollDepth } from '@/lib/gtag'

const SCROLL_DEPTH_MARKS = [25, 50, 75, 90, 100]

export function ScrollTracker() {
  const trackedMarks = useRef<Set<number>>(new Set())

  const calculateScrollDepth = useCallback(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
    return Math.round((scrollTop / docHeight) * 100)
  }, [])

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const depth = calculateScrollDepth()

          // Find all marks that have been passed
          SCROLL_DEPTH_MARKS.forEach((mark) => {
            if (depth >= mark && !trackedMarks.current.has(mark)) {
              trackedMarks.current.add(mark)
              trackScrollDepth(mark)
            }
          })

          ticking = false
        })

        ticking = true
      }
    }

    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [calculateScrollDepth])

  return null
}
