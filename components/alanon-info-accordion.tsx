"use client"

import * as Accordion from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

const sections = [
  {
    id: "what-is",
    title: "What Is Al-Anon and Alateen?",
    content: (
      <>
        <p className="mb-3">
          Al‑Anon is a mutual support program for people whose lives have been affected by someone
          else&apos;s drinking. By sharing common experiences and applying the Al‑Anon principles,
          families and friends of alcoholics can bring positive changes to their individual
          situations, whether or not the alcoholic admits the existence of a drinking problem or
          seeks help.
        </p>
        <p>
          Alateen, a part of the Al‑Anon Family Groups, is a fellowship of young people (mostly
          teenagers) whose lives have been affected by someone else&apos;s drinking — whether they
          are in your life drinking or not. By attending Alateen, teenagers meet other teenagers with
          similar situations. Alateen is not a religious program and there are no fees or dues to
          belong to it.
        </p>
      </>
    ),
  },
  {
    id: "who-are-members",
    title: "Who Are Al-Anon/Alateen Members?",
    content: (
      <>
        <p className="mb-3">
          Al‑Anon members are people, just like you, who are worried about someone with a drinking
          problem. Members do not give direction or advice to other members. Instead they share their
          experiences and stories. If someone else&apos;s drinking troubles you, attending Al‑Anon
          and Alateen Family Group meetings can help.
        </p>
        <p>
          Teens come together to share their experiences to find effective ways to cope with
          problems. Self-assessment quizzes are designed to help you decide whether Al‑Anon or
          Alateen might be able to help.
        </p>
      </>
    ),
  },
  {
    id: "spouse-partner",
    title: "Alcoholic Spouse or Partner — Are You Involved?",
    content: (
      <>
        <p className="mb-3">
          Are you involved with someone whose drinking is bothering you? How do you cope with an
          intimate relationship that is affected by alcoholism? Living with a spouse, partner or
          significant other who exhibits a drinking problem can have devastating effects on our
          emotional well-being, our personal relationships, our professional life and sometimes even
          our physical health.
        </p>
        <p>
          Attending Al‑Anon Family Group meetings might provide the support and tools needed to deal
          with the effects of alcoholism on very important relationships.
        </p>
      </>
    ),
  },
]

export default function AlAnonInfoAccordion() {
  return (
    <Accordion.Root type="multiple" className="space-y-3">
      {sections.map((section) => (
        <Accordion.Item
          key={section.id}
          value={section.id}
          className="nec-alanon-item rounded-xl overflow-hidden transition-all duration-200"
          style={{
            background: "var(--nec-card)",
            border: "1px solid rgba(0,147,208,0.12)",
          }}
        >
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between px-5 py-4 text-left text-base font-semibold text-[var(--nec-text)] nec-nav-hover transition-colors">
              <span className="pr-4">{section.title}</span>
              <ChevronDown
                className="w-5 h-5 flex-shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
                style={{ color: "var(--alanon-blue)" }}
                aria-hidden="true"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div
              className="px-5 pb-5 text-sm leading-relaxed"
              style={{ color: "var(--nec-text)" }}
            >
              {section.content}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
