"use client"

import { Search, X } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useFocusTrap } from "@/lib/use-focus-trap"

interface FlyerWithModalProps {
  src: string
  alt: string
  title?: string
  className?: string
}

export default function FlyerWithModal({ src, alt, className = "" }: FlyerWithModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const modalRef = useFocusTrap<HTMLDivElement>(isOpen)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsOpen(false)
      }
      window.addEventListener("keydown", handleEscape)
      return () => window.removeEventListener("keydown", handleEscape)
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <>
      {/* Flyer with enlarge button */}
      <button
        type="button"
        className={`relative group cursor-pointer border-0 bg-transparent p-0 ${className}`}
        onClick={() => setIsOpen(true)}
        aria-label={`Enlarge flyer: ${alt}`}
      >
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={400}
          height={600}
          sizes="(min-width: 768px) 400px, 100vw"
          className="w-full h-full object-contain rounded-lg"
        />
        {/* Magnifying glass icon in upper right */}
        <span
          className="absolute top-2 right-2 p-2 rounded-full transition-all opacity-70 group-hover:opacity-100"
          style={{ background: "rgba(124,58,237,0.7)" }}
          aria-hidden="true"
        >
          <Search className="w-4 h-4 text-white" />
        </span>
      </button>

      {/* Modal */}
      {isOpen && (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- backdrop dismiss is supplementary to Escape key and close button
        <div 
          ref={modalRef}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged flyer image"
          onClick={() => setIsOpen(false)}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- stopPropagation prevents accidental close when clicking image */}
          <div
            className="relative w-auto max-w-[90vw] h-auto max-h-[calc(100dvh-4rem)]"
            style={{ maxHeight: "calc(100dvh - 4rem)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src || "/placeholder.svg"}
              alt={alt}
              width={1200}
              height={1600}
              sizes="90vw"
              className="w-auto h-auto max-w-full max-h-[calc(100dvh-4rem)] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  )
}
