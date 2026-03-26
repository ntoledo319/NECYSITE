"use client"

import * as Accordion from "@radix-ui/react-accordion"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import type { FAQItem } from "@/lib/data/faq"
import { staggerContainer, staggerChild } from "@/components/ui/motion-primitives"

interface FAQAccordionProps {
  items: FAQItem[]
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  return (
    <Accordion.Root type="multiple" asChild>
      <motion.div
        className="space-y-2"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
      {items.map((item, i) => (
        <Accordion.Item
          key={i}
          value={`item-${i}`}
          asChild
        >
          <motion.div
            variants={staggerChild}
            className="nec-faq-item rounded-xl overflow-hidden transition-all duration-200"
            style={{
              background: "rgba(26,16,48,0.7)",
              border: "1px solid var(--nec-border)",
            }}
          >
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-white hover:bg-white/[0.03] transition-colors">
              <span className="pr-4">{item.question}</span>
              <ChevronDown
                className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
                style={{ color: "var(--nec-cyan)" }}
                aria-hidden="true"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div
              className="px-5 pb-4 text-sm leading-relaxed"
              style={{ color: "var(--nec-muted)" }}
            >
              {item.answer}
            </div>
          </Accordion.Content>
          </motion.div>
        </Accordion.Item>
      ))}
      </motion.div>
    </Accordion.Root>
  )
}
