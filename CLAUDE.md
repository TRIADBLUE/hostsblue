# CLAUDE.md — hostsblue.com
# Last updated: April 2, 2026

---

## READ THE UNIVERSAL RULES FIRST

Before doing ANY work, fetch and read the TRIADBLUE universal brand rules:
```
curl -s "https://linkblue-githubproxy.up.railway.app/api/github/file?repo=.github&path=CLAUDE.md"
```
Those rules govern colors, fonts, naming, payments, and ecosystem standards. They are non-negotiable.

---

## PLATFORM IDENTITY

**Name:** hostsblue.com
**Tagline:** Get site. Go live. Go Blue.
**Role:** Domains, hosting, email, SSL certificates, website builder
**Stack:** React + TypeScript + Tailwind + shadcn/ui + Express + Drizzle ORM + PostgreSQL + React Router DOM
**Deployment:** Replit
**Local path:** `/Users/deanlewis/hostsblue`

**NOTE:** This repo uses `react-router-dom` for routing, NOT `wouter` like most other TRIADBLUE platforms.

---

## ARCHITECTURE

### Products
- Domain registration and management
- WordPress hosting
- Professional email
- SSL certificates
- SiteLock security
- Website builder (AI-powered)

### Key Files
- `client/src/components/layout/footer.tsx` — footer (needs ecosystem rebuild + "Stripe" removal)
- `client/src/components/layout/header.tsx` — site header
- `client/src/components/layout/root-layout.tsx` — main layout wrapper
- `client/src/components/layout/dashboard-layout.tsx` — authenticated dashboard
- `client/src/components/ui/brandsignature.tsx` — brand rendering component

### Payment Integration
All payments through swipesblue.com. The footer currently says "Secure payments by Stripe" — this MUST be changed to "Secure payments by swipesblue.com".

### Logo Assets
Logos are stored in `public/`:
- `HostsBlue_Logo_Image.png`
- `HostsBlue_Logo_text_and_image.png`
- `HostsBlue_url.png`
- `TriadBlue_Logo_Image_Trans.png`

---

## COMPLETED

- Domain search and registration flow ✓
- Hosting plan selection ✓
- Email setup ✓
- SSL/Security page ✓
- Website builder (AI-powered) ✓
- Dashboard layout ✓
- Footer with ecosystem column (uses Brandsignature component, needs logo images + taglines) ✓

## PENDING

- Footer rebuild: replace Brandsignature text with logo images + official taglines (prompt written: ECOSYSTEM_FOOTER_3_HOSTSBLUE.md)
- Remove "Secure payments by Stripe" from footer
- Cloud hosting stub pages
- Support routes
- Plan enforcement after purchase
- Add BUILDERBLUE2.COM to ecosystem section

---

## CURRENT STATE CHANGELOG

| Date | Changes |
|------|---------|
| 2026-04-02 | Ecosystem footer prompt written. Stripe reference in footer identified for removal. |

**AGENTS: Update this section on every commit. Your work is not done until this changelog reflects it.**
