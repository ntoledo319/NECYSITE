# QUICKSTART — The Panic Page

> One page. Four scenarios. Save it on your phone. Print it for the fridge.
> If you only ever read one thing in this folder, read this.

---

## 1. If something is on fire

**Symptoms:** the site is down. Or registration is broken. Or someone says they paid and got nothing. Or you got a scary email from Stripe / Vercel / a lawyer.

**Do this, in order, do NOT skip steps:**

1. **Breathe.** Nothing on this website is on a one-second deadline. You have time.
2. **Check if the site is actually down** — open https://www.necypaact.com in your phone browser, not WiFi. If it loads, the site is fine and the problem is somewhere else.
3. **Open Vercel** at https://vercel.com → log in → click the project named **necypaa-ct** → click **Deployments** in the top tabs.
4. **Look at the most recent row.** If it has a red dot or says "Error," the last update broke the site. **Roll back** (see Section 3).
5. **If Vercel looks fine but the site is broken**, the issue is probably Stripe (payments) or the database. Check Stripe at https://dashboard.stripe.com → look for red banners at the top.
6. **If you cannot figure out what's wrong in 15 minutes, call the escalation contact** listed in [`ACCOUNTS.md`](./ACCOUNTS.md) under "Emergency Escalation." Do not guess at fixes.

---

## 2. If you just need to change one small thing

**Open your AI assistant** (Claude.ai or ChatGPT/Codex). Copy the matching prompt below word-for-word, fill in the `[BRACKETS]`, paste it in, and press send.

### Change text on a page (a typo, a sentence, a heading)

```
I am the operator of necypaact.com. I have zero coding experience.
The website is in a folder on this computer at:
/Users/nicholastoledo/Development/A.A/NECYPASITE

I want to change this text:
  OLD: [paste the exact text you want to change]
  NEW: [paste the new text]

It appears on this page: [paste the URL, like https://www.necypaact.com/faq]

Before changing anything, do these things in order and report back to me:
1. Find the file where that text lives. Tell me the file path.
2. Show me the line you would change. Don't change it yet.
3. Make sure the change does not break any of the rules in HANDOFF/AI_BRIEFING.md.
4. After I say "go", make the change, run `pnpm build`, and stop if it fails.
5. Then create a new git branch and open a pull request titled
   "copy: [one-sentence description]". Do not push to main.
6. Tell me the pull request URL so I can review it on GitHub.
```

### Change a price (registration, breakfast tickets)

**Most price changes don't need code.** They live in the admin panel.

1. Go to https://www.necypaact.com/admin → log in.
2. In the left sidebar, click **Globals → Pricing Settings**.
3. Change the number (prices are in **cents**, so $250 = `25000`).
4. Click **Save**.
5. Open https://www.necypaact.com/register in a private/incognito browser window. Confirm the new price shows.

If that page isn't there, or you can't log in, use the AI prompt in [`MANUAL.md`](./MANUAL.md#change-a-price).

### Change a date or the venue

These are stamped into the code (not the admin panel). Use the AI prompt in [`MANUAL.md`](./MANUAL.md#change-the-convention-dates-or-venue). **This is a high-impact change** — read the warning in the manual first.

### Add a blog post or FAQ entry

1. Go to https://www.necypaact.com/admin → log in.
2. **Blog Posts** or **FAQ** in the sidebar → **Create new**.
3. Fill in the form. Click **Save**.
4. Open the public site and confirm it shows up. Blog posts appear at `/blog`. FAQ items at `/faq`.

---

## 3. If you're scared — the rollback button

You can always undo the most recent change to the live site. This is the safest button on the whole platform.

1. Open https://vercel.com → log in → project **necypaa-ct** → **Deployments** tab.
2. Find the most recent row that has a **green checkmark** and a date from **before** things went wrong.
3. Click the **`...`** menu on that row → **Promote to Production**.
4. Confirm. Wait 30 seconds. Refresh https://www.necypaact.com.

The site is now back to how it was before the bad change. The code in GitHub is unchanged — only the live version reverted. You have not destroyed anything. You can re-deploy the broken version later if you want.

**You cannot break the site permanently with this button.** It is safe. Use it without guilt.

---

## 4. If everything is broken — the kill switch

If the site is doing something actively harmful (charging the wrong amount, showing private information, posting offensive content) and the rollback button doesn't fix it:

1. Open https://vercel.com → project **necypaa-ct** → **Settings** → **General**.
2. Scroll to **Deployment Protection**.
3. Enable **Production Deployment Protection** with the option **"Only allowed visitors."**
4. The site now shows a login wall to the public. Nobody can register. Nobody can see broken pages.
5. **Now call the escalation contact** in [`ACCOUNTS.md`](./ACCOUNTS.md).

This is the equivalent of pulling the fire alarm. Do not use it lightly — every minute the site is locked, people cannot register, and the convention loses signups. But it is **always available** and it is **always reversible** (uncheck the same box to restore).

---

## The four things to never do without calling for help

1. **Never rotate / regenerate a Stripe API key** unless an expert tells you to. This can break every payment in flight.
2. **Never delete anything in GitHub.** Branches, files, commits — anything. "Delete" buttons are not your friend right now.
3. **Never run `pnpm install` or `npm install` yourself** in a terminal. Let your AI do it. If your AI says it "needs to update dependencies," ask why first.
4. **Never share, email, or paste an environment variable** (anything starting with `STRIPE_SECRET_KEY`, `PAYLOAD_SECRET`, `UPSTASH_REDIS_REST_TOKEN`). These are passwords. Treat them like your bank PIN.

---

## You are not alone

The contacts in [`ACCOUNTS.md`](./ACCOUNTS.md) under "Emergency Escalation" exist for exactly this reason. They expect to be called. Calling them does not mean you failed.

Now go read [`MANUAL.md`](./MANUAL.md) when you have an hour. It will give you the rest of what you need.
