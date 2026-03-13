# Cube Root Solutions — Corporate Website

Landing page for **Cube Root Solutions**, a fractional CTO and IT consulting practice targeting growing businesses. Live at [cuberootsolutions.com](https://cuberootsolutions.com).

## Stack

Vanilla HTML/CSS/JS. No framework, no build step, no dependencies.

- **HTML** — Single-page `index.html` (277 lines)
- **CSS** — `css/styles.css` (912 lines) — custom design system with CSS variables, fully responsive
- **JS** — `js/main.js` (214 lines) — all interactive features
- **Hosting** — Netlify (static deploy from repo root via `netlify.toml`)
- **Domain** — `cuberootsolutions.com` (CNAME file for DNS)

## Features

| Feature | Implementation |
|---------|---------------|
| **Animated hero canvas** | Particle network animation with connecting lines (`initHeroCanvas`). Respects `prefers-reduced-motion`. Pauses when off-screen via IntersectionObserver. |
| **ROI calculator** | Multi-input savings estimator with recovery rate slider. Calculates labor waste, downtime cost, software consolidation savings. |
| **Calendly booking** | Popup widget on all CTAs via `Calendly.initPopupWidget()`. Links to `cuberootsolutions/discovery`. |
| **Contact form** | Formspree integration (`formspree.io/f/mdaloeor`). Fetch-based submission with loading state, success/error messages. |
| **Pricing section** | Three tiers: The Fixer, The Partner (featured), The Architect. No prices shown — all CTAs route to Calendly. |
| **Status ticker** | Scrolling metrics bar at page top with CSS animation. |
| **Scroll reveal** | IntersectionObserver-based fade-in on all `.reveal` sections. |
| **Counter animation** | Stats bar numbers animate from 0 to target on scroll. |
| **Mobile nav** | Hamburger menu with full-screen overlay at ≤900px. |
| **Nav scroll effect** | Sticky nav gains box-shadow on scroll. |
| **Smooth scrolling** | Anchor links scroll with offset for fixed nav height. |

## SEO & Infrastructure

- Open Graph + Twitter Card meta tags
- JSON-LD structured data (`ProfessionalService`)
- `sitemap.xml` and `robots.txt`
- Security headers via `netlify.toml` (CSP, X-Frame-Options, XSS Protection, Referrer-Policy)
- `.nojekyll` for GitHub Pages compatibility
- Google Fonts: Inter, Lexend, JetBrains Mono

## Project Structure

```
solutions-site/
├── index.html            # Single-page site
├── css/styles.css        # Complete stylesheet
├── js/main.js            # All interactive JS
├── contracts/            # Client agreement templates (internal)
│   ├── CONSULTING-AGREEMENT.md
│   └── RETAINER-TEMPLATE.md
├── workflows/            # Service delivery docs (internal)
│   ├── CONSULTING-WORKFLOW.md
│   └── SERVICE-CATALOG.md
├── netlify.toml          # Deploy config + security headers
├── CNAME                 # cuberootsolutions.com
├── sitemap.xml           # SEO sitemap
├── robots.txt            # Crawler directives
└── .nojekyll             # GitHub Pages bypass
```

## Deployment

Push to `main`. Netlify auto-deploys from repo root. No build command needed.

Remotes:
- `origin` — GitHub (`cuberootsol/site`) + GitLab mirror
- `gitlab` — GitLab (`loudmumble/solutions-site`)
