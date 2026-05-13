# Legacy Care Africa — Developer Go-Live Brief

**Site:** Legacy Care Africa
**Client contact:** info@legacycareafrica.com · +254 142 394 707 · WhatsApp wa.me/254142394707
**Tagline:** Rooted in Heritage. Guided by Care.
**Wordmark tag:** TWO COMPANIES. ONE LEGACY.
**Headquartered:** Dallas, USA (group HQ — Daniel Mwangi) + Nairobi, Kenya (country HQ — Peris Mwangi)
**Subsidiaries:** Uzazi Wellness Care (uzaziwellnesscare.com) · Nyumbani Support Solutions (nyumbanisupportsolutions.com)

> **Last updated:** 12 May 2026 — supersedes all previous handoff briefs.

---

## 0. The ZIP

Latest production build attached as `legacy-care-africa-website.zip` (~6 MB). Pure static — no build step, no Node, no PHP, no backend.

```
legacy-care-africa-site/
├── index.html                            (homepage — hero, partners, subsidiaries, blog cards, lead magnet, testimonials, FAQ, CTA)
├── pages/
│   ├── about.html
│   ├── our-companies.html
│   ├── blog.html
│   ├── contact.html
│   ├── privacy.html
│   ├── terms.html
│   └── blog/
│       ├── fourth-trimester.html
│       ├── home-care-myths.html
│       └── pregnancy-nutrition.html
├── css/style.css                         (~1,620 lines, brand tokens at top)
├── js/app.js                             (~150 lines — nav, theme toggle, MailerLite handler)
├── assets/
│   ├── lca-emblem.png, lca-emblem-cream.png
│   ├── favicon-32.png, favicon-64.png, favicon-180.png
│   └── photos/                           (hero, leadership, subsidiaries, blog covers, lead magnet visuals)
├── downloads/
│   └── legacy-family-care-guide.pdf      (22-page lead magnet)
├── sitemap.xml
├── robots.txt
├── MAILERLITE-SETUP.md                   (full MailerLite setup guide — read this)
├── LEGACY-AUTORESPONDER.md               (5-email autoresponder copy)
└── DEVELOPER-HANDOFF.md                  (this file)
```

**Page count:** 10 HTML pages. Fully responsive (tested at 360px, 768px, 1280px+).

---

## 1. Hosting & deployment

**Recommended:** Hostinger (client already uses it for related properties — Uzazi, Nyumbani).

### Steps
1. Unzip `legacy-care-africa-website.zip` locally.
2. Upload the **contents** of the unzipped folder (not the folder itself) to `public_html/` via Hostinger File Manager or SFTP.
3. Confirm `index.html` sits at `public_html/index.html`.
4. Confirm pretty URLs work: e.g. `/pages/about.html` loads correctly.

**Other hosts that also work zero-config:** Netlify (drag-drop), Cloudflare Pages, Vercel, GitHub Pages, S3 + CloudFront.

---

## 2. Domain & DNS

### Domain
`legacycareafrica.com` (client owns)

### Required records (after hosting is provisioned)
| Type  | Host | Value | TTL |
|-------|------|-------|-----|
| A     | @    | (your host's IP) | 3600 |
| CNAME | www  | legacycareafrica.com | 3600 |

### Email — preserve existing records
Client uses Google Workspace for `info@legacycareafrica.com`. When migrating DNS, preserve:
- **MX** records pointing to Google (aspmx.l.google.com, etc.)
- **SPF** TXT: `v=spf1 include:_spf.google.com ~all`
- **Google site verification** TXT (`google-site-verification=...`)
- **DKIM** CNAME (`google._domainkey` → `google._domainkey.<domain>.dkim.google.com.`)
- **DMARC** TXT at `_dmarc` (if present)

If migrating from Porkbun DNS to a different host's DNS, export the full zone first and re-create every TXT/MX before flipping nameservers.

### SSL
Enable free Let's Encrypt SSL in Hostinger panel. Force HTTPS redirect.

---

## 3. MailerLite forms — 5 placeholders to swap

Forms are pre-wired to MailerLite's universal subscribe endpoint. **No backend, no API key, no Formspree.** See `MAILERLITE-SETUP.md` for the full step-by-step including the conditional autoresponder split.

### The 5 placeholders

| Placeholder | File | Replace with |
|---|---|---|
| `REPLACE_WITH_MAILERLITE_ACCOUNT_ID` | `js/app.js` (line ~63) | Your numeric MailerLite account ID |
| `REPLACE_WITH_LEGACY_GUIDE_FORM_ID` | `index.html` (`data-ml-form-id`) | Form ID for "Family Care Guide" |
| `REPLACE_WITH_LEGACY_GUIDE_LEADS_GROUP_ID` | `index.html` (`data-ml-group-id`) | Group ID for "Guide Leads" (optional — blank string OK) |
| `REPLACE_WITH_LEGACY_CONTACT_FORM_ID` | `pages/contact.html` (`data-ml-form-id`) | Form ID for "Contact Inquiries" |
| `REPLACE_WITH_LEGACY_CONTACT_LEADS_GROUP_ID` | `pages/contact.html` (`data-ml-group-id`) | Group ID for "Contact Inquiries" (optional) |

### Finding the IDs in MailerLite

1. Log into MailerLite → **Forms** → **Embedded forms** → **Create new** (twice — one per form below).
2. **Form 1 — "Family Care Guide"** — fields: First name, Last name, Email, season_of_care (text).
3. **Form 2 — "Contact Inquiries"** — fields: First name, Last name, Email, Phone, service (text), location (text), message (text).
4. Open the generated embed code. You'll see a URL like:
   `https://assets.mailerlite.com/jsonp/1234567/forms/9876543/subscribe`
   - `1234567` → **Account ID**
   - `9876543` → **Form ID**
5. For group IDs: **Subscribers → Groups → click the group → check the URL** (numeric ID is in the path).

### Family Care Guide PDF — autoresponder setup

The PDF (`downloads/legacy-family-care-guide.pdf`) is served as a same-host fallback download. On form submit, the user sees "Check your inbox" plus a direct PDF link as a backup.

**To email the PDF automatically (recommended):**
1. MailerLite → **Automations** → **Create automation**.
2. Trigger: "When a subscriber joins a group" → choose **Guide Leads**.
3. Action: Send the **Welcome + Guide** email (copy in `LEGACY-AUTORESPONDER.md`) → attach the PDF (upload via MailerLite's file manager) AND include a button linking to the same PDF as backup.
4. Add the **Day-3 conditional split** based on the `season_of_care` field — Uzazi route, Nyumbani route, both-seasons route. Full email copy lives in `LEGACY-AUTORESPONDER.md`.
5. Add **Day-7 Check-In** as a final follow-up.

---

## 4. Phone + WhatsApp + Email — already pre-wired (no action)

| Element | Lives in | Behavior |
|---|---|---|
| Floating WhatsApp FAB | Bottom-right of every page | Pulsing green circle, opens `wa.me/254142394707` with prefilled "Hello Legacy Care Africa" |
| Footer block | Tagline + phone + email + social links | All 10 pages |
| Contact page action card | `pages/contact.html` | Tel + WhatsApp pill buttons, hours, urgent-need callout |
| Hours card | `pages/contact.html` | Mon–Fri 8am–5pm · Sat 9am–4pm · Sun closed · 24/7 on-call for active clients |

**Single source of truth for the number:** if `+254 142 394 707` ever changes, search the project for `254142394707` and `+254 142 394 707` and replace.

**Email:** All `mailto:` links use `info@legacycareafrica.com`.

---

## 5. Social media links

| Platform | URL | Where it appears |
|---|---|---|
| Instagram | `https://www.instagram.com/legacycareafrica` | Footer of all 10 pages |
| Facebook | `https://www.facebook.com/share/1UoLrfEtLv/?mibextid=wwXIfr` | Footer of all 10 pages |

If either handle changes, search the project for the URL string and replace globally.

---

## 6. Brand tokens (top of `css/style.css`)

```css
--color-primary:        #0f3431;   /* forest green */
--color-primary-deep:   #0a2624;
--color-accent:         #c5916a;   /* gold */
--color-accent-deep:    #a87653;
--color-bg:             #fdfcf9;   /* cream */
--color-bg-alt:         #f5f1ea;
--color-ink:            #1f2d2a;
--color-line:           #e6dfd2;
```

**Fonts:** Zodiak (serif headings) + General Sans (sans body) via Fontshare CDN — preconnects already in each page's `<head>`.

**Dark mode:** Theme toggle in the header sets `[data-theme="dark"]`; full dark palette defined in CSS. Toggle persists via `localStorage`.

---

## 7. What's on the site

### Top-level pages (10)
- Home — hero, trust strip, subsidiaries cards, blog teasers, free family-guide lead magnet, testimonials, FAQ, CTA
- About — story, leadership (Daniel & Peris), timeline, values
- Our Companies — Uzazi & Nyumbani detail cards with deep links
- Wellness Blog — 3 long-form articles (Fourth Trimester, Home Care Myths, Pregnancy Nutrition)
- Contact — care coordinator form (MailerLite-wired), phone, WhatsApp, hours
- Privacy Policy
- Terms of Service

### Lead magnet
22-page **Family's Guide to Care at Home in Kenya** PDF, gated behind the MailerLite form in the homepage `#family-guide` section.

---

## 8. Copy & tone rules (please preserve)

- **Never use the words "midwife", "midwives", "tradition", "traditional", or "healthcare"** anywhere on the site — site-wide style scrub is complete, please don't reintroduce them.
- "Limited" suffix kept ONLY at `our-companies.html` H2s, About timeline entries for 2023/2024, and Privacy/Terms preambles.
- Tagline under wordmark: **"TWO COMPANIES. ONE LEGACY."**
- Phrase is **"in-home care"** site-wide — never "home care" or "home-care".
- Leadership titles: Daniel Mwangi — **Co-Founder & Group Director** (Dallas); Peris Mwangi — **Co-Founder & Country Director** (Nairobi).
- Subsidiaries are referenced as **"Uzazi Wellness Care"** and **"Nyumbani Support Solutions"** — never the legal-name "Limited" suffix in body copy.
- Testimonials carry a disclaimer ("Composite stories…") — keep it visible until real client testimonials with written permission replace the placeholders.

---

## 9. Pre-launch test checklist

- [ ] Replace all 5 `REPLACE_WITH_*` MailerLite placeholders with real IDs
- [ ] Submit a test family-guide form on `index.html` `#family-guide` → confirm subscriber lands in "Guide Leads"
- [ ] Submit a test contact form on `/pages/contact.html` → confirm it lands in "Contact Inquiries"
- [ ] Set up the MailerLite automation that emails the PDF on guide signup; test with a real address
- [ ] Configure the Day-3 conditional autoresponder split (Uzazi / Nyumbani / Both / Learning)
- [ ] Click the floating WhatsApp button on mobile → confirms it opens WhatsApp with prefilled message
- [ ] Click `tel:+254142394707` links from mobile → phone dialer opens
- [ ] Verify the PDF downloads cleanly from `/downloads/legacy-family-care-guide.pdf`
- [ ] Verify all 10 pages load over HTTPS without mixed-content warnings
- [ ] Light mode + dark mode toggle works on every page (sun/moon icon in header)
- [ ] Mobile nav (hamburger) opens & closes; nav links work
- [ ] FAQ accordions (homepage) expand/collapse correctly
- [ ] Footer email link opens `info@legacycareafrica.com`
- [ ] Submit `sitemap.xml` to Google Search Console
- [ ] Verify Open Graph share previews on Facebook Sharing Debugger and X/Twitter Card Validator

---

## 10. SEO & post-launch (already configured)

- ✅ **`sitemap.xml`** included at site root — 10 URLs, submit to Google Search Console after go-live.
- ✅ **`robots.txt`** included at site root, references sitemap.
- ✅ **Open Graph + Twitter Card meta** on all 10 pages (title, description, image, type, site_name).
- ✅ **Favicons** at 32, 64, 180px — linked from every `<head>`.

### Nice-to-have post-launch
1. **Google Analytics 4** — add gtag snippet just before `</head>` in each HTML file (easier: use GTM and manage from there).
2. **MailerLite double opt-in** — recommended for cleaner deliverability. Toggle in MailerLite form settings.
3. **CDN / caching** — Hostinger has built-in caching. For more performance, put behind Cloudflare (free tier).
4. **Real testimonials** — replace composite testimonials on homepage once you have written permission from real families.

---

## 11. Related project sites (for reference)

If you also maintain the subsidiary sites:
- **Uzazi Wellness Care** — `uzaziwellnesscare.com` (own dev brief — `uzazi-developer-handoff.md`)
- **Nyumbani Support Solutions** — `nyumbanisupportsolutions.com` (own dev brief — `nyumbani-developer-handoff.md`)

The three sites share design tokens (forest green / gold / cream) and the same MailerLite account, but each site has its own forms, autoresponders, and lead magnet.

---

## Questions?

Reply to **info@legacycareafrica.com** or message **+254 142 394 707** (WhatsApp).
