# Legacy Care Africa — MailerLite Setup Guide

This guide walks the dev team (or Daniel) through wiring up MailerLite for the Legacy Care Africa site. The site is fully **pre-wired** — only IDs need to be swapped.

---

## 1. What is already in place (code)

- `js/app.js` contains `window.legacyMlSubscribe()` — a no-CORS helper that posts directly to MailerLite's JSONP subscribe endpoint.
- Every form on the site that should subscribe a visitor carries the `data-ml-form` attribute, plus `data-ml-form-id` and `data-ml-group-id` placeholders.
- A honeypot field (`name="_gotcha"`) silently swallows bot submissions.
- A success state (`.form-success`) and an error state (`.form-error`) are pre-styled and live alongside every form.

## 2. Placeholders to replace

Three string placeholders appear in the codebase. Find-and-replace them with your real values:

| Placeholder | Where it lives | Replace with |
|---|---|---|
| `REPLACE_WITH_MAILERLITE_ACCOUNT_ID` | `js/app.js` (one occurrence) | Your numeric MailerLite account ID — visible in the embed snippet they generate for any form. |
| `REPLACE_WITH_LEGACY_GUIDE_FORM_ID` | `index.html` (lead-magnet form) | The numeric form ID from the **"Family Care Guide"** MailerLite form you'll create. |
| `REPLACE_WITH_LEGACY_GUIDE_LEADS_GROUP_ID` | `index.html` (lead-magnet form) | The numeric group ID for the **"Legacy — Family Guide Leads"** group. |

> Note: the Contact page form is also pre-wired the same way and uses `REPLACE_WITH_LEGACY_CONTACT_FORM_ID` / `REPLACE_WITH_LEGACY_CONTACT_LEADS_GROUP_ID` (add these the same way once the contact form is fully wired).

## 3. MailerLite setup steps (in order)

### Step 1 — Get the Account ID

1. Log into MailerLite → **Forms** → **Embedded forms** → create any form temporarily (or open an existing one).
2. Copy the embed code. You'll see a URL like:
   `https://assets.mailerlite.com/jsonp/123456/forms/...`
3. The `123456` is your account ID. Save it. Paste it into `js/app.js`.

### Step 2 — Create the Subscriber Groups

In **Subscribers → Groups**, create:

- **Legacy — Family Guide Leads** (everyone who downloads the e-book)
- **Legacy — Uzazi Interest** (segment tag, auto-applied by automation)
- **Legacy — Nyumbani Interest** (segment tag, auto-applied by automation)
- **Legacy — Both Seasons** (segment tag, auto-applied by automation)
- **Legacy — Newsletter Only** (visitors who pick "Just learning for now")

Note the **Group ID** of "Legacy — Family Guide Leads" — paste into `index.html`.

### Step 3 — Create the Embedded Form

1. **Forms → Embedded forms → Create form**
2. Form name: **Legacy — Family Care Guide**
3. Custom fields to enable on the form (Subscribers → Fields → Add field):
   - `name` (default — first name)
   - `last_name` (text)
   - `season_of_care` (text — captures which life stage)
   - `phone` (text, optional — used by contact form)
   - `city` (text, optional)
4. Set the form to assign new subscribers to the **Legacy — Family Guide Leads** group automatically.
5. **Save** — note the form's numeric ID (in the URL or embed code) → paste into `index.html`.

### Step 4 — Build the Automation (3-email welcome flow)

Go to **Automation → Create new workflow**:

- **Trigger:** "When a subscriber joins a group" → **Legacy — Family Guide Leads**

- **Step 1 — Send email immediately:** "Welcome + your guide" (see `LEGACY-AUTORESPONDER.md` for full copy)
  - Attach the PDF: `legacy-family-care-guide.pdf`
  - Or link to: `https://legacycareafrica.com/downloads/legacy-family-care-guide.pdf`

- **Step 2 — Conditional split** based on the `season_of_care` field:

  | Value | Action | Then send (Day 3) |
  |---|---|---|
  | `new_baby` | Add to "Legacy — Uzazi Interest" | "From our maternal wellness team" (Uzazi-flavored email) |
  | `aging_parent` | Add to "Legacy — Nyumbani Interest" | "From our in-home care team" (Nyumbani-flavored email) |
  | `both` | Add to "Legacy — Both Seasons" | "Two seasons of care, walking with your family" (combined email) |
  | `learning` | Add to "Legacy — Newsletter Only" | "What to expect from us in your inbox" (lower-frequency newsletter) |

- **Step 3 — Day 7 follow-up (everyone):** "Any questions? Reply to this email" — soft re-engagement.

Full email copy for all three is in `LEGACY-AUTORESPONDER.md`.

### Step 5 — Verify deliverability

1. SPF / DKIM / DMARC: confirm `legacycareafrica.com` DNS records are set up per MailerLite's "Authenticate domain" instructions.
2. Test the form yourself (sign up with a personal email) — check the welcome arrives within 60 seconds and the PDF link works.
3. Confirm the conditional split routes you correctly when you pick different `season_of_care` values.

---

## 4. The pre-wired form summary

| Form | Location | Form ID placeholder | Group ID placeholder | Fields captured |
|---|---|---|---|---|
| Family Care Guide lead magnet | `index.html` (homepage) | `REPLACE_WITH_LEGACY_GUIDE_FORM_ID` | `REPLACE_WITH_LEGACY_GUIDE_LEADS_GROUP_ID` | first_name, last_name, email, season_of_care |
| Book a Consultation (future wire-up) | `pages/contact.html` | TBD | TBD | first_name, last_name, email, phone, city, message |

---

## 5. Troubleshooting

- **Form appears to submit but no subscriber appears in MailerLite:** double-check the `ACCOUNT_ID` and `formId` are real numeric IDs (not placeholder strings). The browser console will show the network request — confirm the URL contains your account ID.
- **PDF doesn't download:** confirm `legacy-care-africa-site/downloads/legacy-family-care-guide.pdf` exists and is reachable at `/downloads/legacy-family-care-guide.pdf` from the site root.
- **Bot submissions:** the honeypot field catches most. If spam still gets through, enable MailerLite's reCAPTCHA in the form settings.

---

*Setup time: about 45 minutes once you have a MailerLite account and the domain DNS authenticated.*
