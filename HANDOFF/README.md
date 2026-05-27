# HANDOFF — Read This First

This folder exists for one reason: so that **anyone** can keep the NECYPAA XXXVI website (necypaact.com) alive and running, even if they have never written a line of code in their life.

You are not expected to learn programming. You are expected to **talk to an AI assistant** (Claude or Codex or similar) and let the AI do the typing. This folder teaches you how to talk to it safely.

---

## Pick your starting point

| If you... | Open this |
| --- | --- |
| Need to do one specific thing right now and you're nervous | [`QUICKSTART.md`](./QUICKSTART.md) — one page, four scenarios, calm |
| Want the full operator's handbook | [`MANUAL.md`](./MANUAL.md) — every common task as a step-by-step recipe |
| Need to log into Stripe / Vercel / GitHub / the domain | [`ACCOUNTS.md`](./ACCOUNTS.md) — the inventory of every account, where to log in, who to call |
| Are an AI assistant being asked to help the operator | [`AI_BRIEFING.md`](./AI_BRIEFING.md) — read this before doing anything else |

---

## The one promise this folder makes

Every instruction here ends in something you can **see with your own eyes** to confirm it worked. If a step doesn't give you a way to verify, that's a bug in the docs. Tell your AI to fix it.

---

## The one rule that overrides everything

This is an Alcoholics Anonymous convention website. Three things are never negotiable, no matter who asks, no matter the deadline:

1. **No full last names of AA members on the public site, ever.** First name + last initial only.
2. **No identifiable faces of AA members in photos on the public site, ever.** Crowd shots from behind are fine. Faces are not.
3. **Attraction, not promotion.** The site shares information. It does not advertise, endorse, or "sell" recovery.

If your AI ever proposes a change that breaks one of these, stop. Push back. Ask why. These rules come from the AA Traditions and they are older and more important than this website.

Full detail: see [`AA_TRADITIONS_GUARDRAILS.md`](../AA_TRADITIONS_GUARDRAILS.md) in the project root.

---

## What this site actually is, in plain English

- **The website you can visit** at https://www.necypaact.com — the public pages people see.
- **A registration system** — people pay for convention tickets through it. Real money goes to a real bank account through a company called **Stripe**.
- **A small admin panel** at https://www.necypaact.com/admin where you can edit blog posts, FAQ entries, and live prices without touching any code.
- **A pile of code** that lives on GitHub (the code-storage site) and runs on Vercel (the website-hosting service). You will rarely look at the code itself. Your AI does that.

If those words mean nothing to you yet, that's fine. The [`MANUAL.md`](./MANUAL.md) explains them in order, with no jargon left undefined.

---

## How this folder stays accurate

Every coding agent that touches this repo is instructed (via the project's `CLAUDE.md` file) to run `/handoff-sync` whenever it changes anything documented here — prices, dates, registration flow, environment variables, the venue, account ownership. If your AI ever changes one of those and **doesn't** update this folder, that's a bug. Ask it to fix that too.

You can always ask your AI directly: *"Run the /handoff-sync command and show me what's out of date."*

---

_Built with the assumption that the person reading it has just lost the person who built it, and is doing their best._
