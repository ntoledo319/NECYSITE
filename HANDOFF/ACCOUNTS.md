# ACCOUNTS — The Inventory Map

> A list of every external service the website depends on, where to log in, and who to call if you can't.
> **This file contains zero passwords.** Those live in a password manager. This file is a map, not a key.

If you are seeing this for the first time, your job is to **fill in every `[FILL ME IN]` below** with the help of whoever is handing the project to you. Do that **today**, before you need any of it in an emergency.

---

## How to use this file

Each section below is one account. For each, you need to know:

- **Login URL** — where to go to sign in.
- **Account owner** — the email address the account is registered to.
- **Where the password lives** — a password manager vault (1Password, Bitwarden, etc.), NOT this file.
- **Where the 2FA / recovery codes live** — same vault.
- **Recovery contacts** — humans who can vouch for you / reset your access.

After every committee handoff, update the **Account owner** and **Recovery contacts** columns. Out-of-date contacts here are how organizations get locked out of their own infrastructure.

---

## 🚨 Emergency Escalation

When everything is broken and you are over your head, call/text these people **in this order**:

| Order | Name | Phone | Email | What they help with |
| --- | --- | --- | --- | --- |
| 1 | [FILL ME IN — primary technical handoff contact] | [FILL ME IN] | [FILL ME IN] | First call. Built or has worked on the site. |
| 2 | [FILL ME IN — current committee chair or co-chair] | [FILL ME IN] | [FILL ME IN] | Authority decisions: pricing, refunds, scholarships, anything legal-adjacent. |
| 3 | [FILL ME IN — committee treasurer] | [FILL ME IN] | [FILL ME IN] | Financial decisions: Stripe access, bank account, refunds over $500. |
| 4 | NECYPAA Advisory | — | (via https://necypaa.org/) | Continuity body for NECYPAA conventions; not the convention committee but they have institutional memory. |

If none of these are reachable and the site is actively harming people (charging wrong amounts, leaking data, displaying offensive content), use the **kill switch** in QUICKSTART section 4 to lock the public out, then keep calling.

---

## GitHub — the code

| Field | Value |
| --- | --- |
| Login URL | https://github.com/login |
| Repo URL | https://github.com/ntoledo319/NECYPASITE |
| Account owner | ntoledo319 (Nicholas Toledo) — `toledonick98@gmail.com` |
| Recovery contact | [FILL ME IN — second admin on the repo, if any] |
| 2FA method | [FILL ME IN — authenticator app / SMS] |
| Password vault | [FILL ME IN — e.g. 1Password entry "GitHub - NECYPAA"] |

**On handoff:** add the new owner as a Collaborator/Admin in repo Settings → Collaborators. Verify they have full access before removing or transferring ownership. Do **not** delete the original account immediately — keep it as a recovery path for at least 30 days.

---

## Vercel — the hosting

| Field | Value |
| --- | --- |
| Login URL | https://vercel.com/login |
| Project name | `necypaa-ct` |
| Connected GitHub account | `ntoledo319` |
| Account owner | [FILL ME IN] |
| Plan tier | [FILL ME IN — Hobby / Pro] |
| Billing card on file | [FILL ME IN — last 4 only] |
| Recovery contact | [FILL ME IN] |
| Password vault | [FILL ME IN] |

**On handoff:** Vercel access transfers via the team/organization. New owner is invited via Settings → Members. Old owner shouldn't be removed until new owner has demonstrated they can deploy.

---

## Stripe — the payments

| Field | Value |
| --- | --- |
| Login URL | https://dashboard.stripe.com/login |
| Account name | [FILL ME IN] |
| Account owner | [FILL ME IN] |
| Linked bank account (last 4 only) | [FILL ME IN] |
| Tax info on file | [FILL ME IN — EIN of the NECYPAA committee 501(c)?] |
| Webhook endpoint URL | `https://www.necypaact.com/api/webhooks/stripe` |
| Webhook signing secret stored in | Vercel env var `STRIPE_WEBHOOK_SECRET` |
| Recovery contact | [FILL ME IN] |
| Password vault | [FILL ME IN] |

**On handoff:** Stripe handoff is the trickiest one — the bank account belongs to a specific committee entity. **Do not change the bank account without the treasurer's written approval.** Stripe support is reachable via the dashboard chat and is responsive.

---

## Domain — necypaact.com

| Field | Value |
| --- | --- |
| Registrar (where the domain is bought) | [FILL ME IN — likely Namecheap, GoDaddy, Google Domains/Squarespace, Porkbun] |
| Login URL | [FILL ME IN] |
| Account owner | [FILL ME IN] |
| Auto-renew enabled? | [FILL ME IN — confirm YES] |
| Expiration date | [FILL ME IN] |
| DNS hosted at | Vercel (the domain is delegated to Vercel's nameservers) |
| Recovery contact | [FILL ME IN] |
| Password vault | [FILL ME IN] |

> 🚨 **A domain that lapses costs you the site, the email, and possibly your search-engine rankings for years.** Verify auto-renew is on every January. If the card on file expires, update it immediately.

---

## Email — info@necypaa.org

| Field | Value |
| --- | --- |
| Provider | [FILL ME IN — Google Workspace / Microsoft 365 / forwarding only] |
| Login URL | [FILL ME IN] |
| Account owner | [FILL ME IN] |
| Recovery contact | [FILL ME IN] |
| Password vault | [FILL ME IN] |

**Inbox monitoring expectation:** at least daily during registration season (3 months before convention through 1 month after). The site directs people here.

---

## Payload CMS Admin (the in-site editor)

| Field | Value |
| --- | --- |
| Admin URL | https://www.necypaact.com/admin |
| Admin user(s) | [FILL ME IN — list every active admin user email] |
| Account owner | [FILL ME IN] |
| Password vault | [FILL ME IN] |

**Adding a new admin:** log in, go to **Users** in the sidebar, **Create new user**, role = admin. Email them the credentials through a secure channel (not plain email).

**If no admin user exists** (or all are locked out), the **first person to create an account at /admin becomes the admin.** This is why /admin should never be linked from the public site or shared in public.

---

## Upstash Redis — production rate limiting (optional)

| Field | Value |
| --- | --- |
| Login URL | https://console.upstash.com/login |
| Account owner | [FILL ME IN] |
| Used for | Rate limiting registration form submissions to prevent abuse |
| Env vars in Vercel | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` |
| Recovery contact | [FILL ME IN] |

**If this account is lost, the site still works** — rate limiting silently degrades. Don't panic; do schedule a rebuild.

---

## Google — calendar + (possibly) email

| Field | Value |
| --- | --- |
| Login URL | https://accounts.google.com |
| Account that owns the convention calendar | [FILL ME IN] |
| Calendar name | [FILL ME IN — the calendar the website reads from] |
| API key in Vercel env | `GOOGLE_CALENDAR_API_KEY` |
| Recovery contact | [FILL ME IN] |

---

## Social media (if any, and if they touch the site)

| Platform | Handle | Account owner | Vault |
| --- | --- | --- | --- |
| Instagram | [FILL ME IN] | [FILL ME IN] | [FILL ME IN] |
| Facebook | [FILL ME IN] | [FILL ME IN] | [FILL ME IN] |
| TikTok | [FILL ME IN] | [FILL ME IN] | [FILL ME IN] |
| Other | [FILL ME IN] | [FILL ME IN] | [FILL ME IN] |

If the website doesn't directly integrate with a platform, you don't need to track it here. List only the ones that share login flows or link campaigns with the site.

---

## Environment variables — what each one is

The site needs these to run. They live in Vercel → Settings → Environment Variables. **Never commit them to GitHub. Never email them. Never paste them into chat.**

| Variable | Required? | What it does | Where the value comes from |
| --- | --- | --- | --- |
| `PAYLOAD_SECRET` | yes | Encrypts CMS sessions and tokens | Generate once with `openssl rand -base64 32`. Don't change unless you've planned for it — changing logs everyone out and invalidates pending tokens. |
| `STRIPE_SECRET_KEY` | yes | Authenticates the site to Stripe | Stripe Dashboard → Developers → API keys. Use **live** key in production, **test** key in development. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | yes | Identifies the site to Stripe on the browser side (not secret, but pair it with the matching secret key) | Same Stripe page as above |
| `STRIPE_WEBHOOK_SECRET` | yes | Verifies that incoming webhooks really came from Stripe | Stripe Dashboard → Developers → Webhooks → your endpoint → Signing secret |
| `NEXT_PUBLIC_BASE_URL` | yes | The site's own URL, used for redirects | `https://www.necypaact.com` in production, `http://localhost:3000` locally |
| `DATABASE_URI` | optional | Points to the SQLite database file (defaults to local file) | Usually `file:./payload.db` |
| `GOOGLE_CALENDAR_API_KEY` | optional | Lets the site read the Google Calendar | Google Cloud Console → APIs → Credentials |
| `UPSTASH_REDIS_REST_URL` | optional | Rate limiting | Upstash console |
| `UPSTASH_REDIS_REST_TOKEN` | optional | Rate limiting | Upstash console |
| `ISSUER_SERVICE_BASE_URL` | optional | URL of an external scholarship-code issuer service | Set if you have one; otherwise leave unset |
| `ISSUER_SERVICE_API_KEY` | optional | Auth for that service | Same |

**The rule for changing any of these:** add the new value as a separate env var first, deploy, verify, *then* remove the old. Don't overwrite a live secret in place.

---

## Password manager

Pick one — the committee should agree. Recommended: **1Password** or **Bitwarden** (free for individuals). Whichever you pick:

- Create a shared vault called **"NECYPAA Website"**.
- Add every account above as an item with: login URL, username, password, 2FA recovery codes.
- Give access to at least **two** humans. Bus factor ≥ 2.
- Add a "Break Glass" item: written instructions on how to recover the master password if both humans are unavailable. (Family contact, sealed envelope in a deposit box, etc.)

Without a password manager, this whole file is useless in an emergency. Set it up before you need it.

---

_Update this file every time an account changes hands. The pre-commit hook will flag commits that change ownership, recovery contacts, or login URLs — do not let those slip through silently._
