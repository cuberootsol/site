# CLAUDE.md — Cube Root Solutions Website

## What This Is

Static landing page for **Cube Root Solutions** — a fractional CTO / IT consulting business. Single-page vanilla HTML/CSS/JS site deployed on Netlify at `cuberootsolutions.com`.

## Architecture

Zero dependencies. No build step. No framework.

- `index.html` — entire site (277 lines)
- `css/styles.css` — design system + responsive layout (912 lines)
- `js/main.js` — all interactivity (214 lines)
- `netlify.toml` — deploy config + CSP security headers

## Key Integrations

- **Calendly** — `Calendly.initPopupWidget()` on all booking CTAs. URL: `calendly.com/cuberootsolutions/discovery`
- **Formspree** — Contact form posts to `formspree.io/f/mdaloeor`
- **Google Fonts** — Inter (body), Lexend (display), JetBrains Mono (mono)

## Interactive Features (all in main.js)

| Function | What it does |
|----------|-------------|
| `initROICalculator()` | Multi-input savings calculator with slider + breakdown display |
| `initHeroCanvas()` | Particle network animation. Respects reduced-motion. Pauses off-screen. |
| `initContactForm()` | Fetch-based form submission with loading/success/error states |
| `initHamburger()` | Mobile nav toggle at ≤900px |
| `initReveal()` | IntersectionObserver scroll-triggered fade-in |
| `initNavScroll()` | Adds `.scrolled` class to nav on scroll |
| `initSmoothScroll()` | Anchor links with nav-height offset |
| `initCounters()` | Animated number counting on stat elements |
| `initStatusTicker()` | Generates scrolling metrics ticker at page top |

## Non-Public Files

- `contracts/` — Client agreement templates (CONSULTING-AGREEMENT.md, RETAINER-TEMPLATE.md)
- `workflows/` — Internal service delivery docs (CONSULTING-WORKFLOW.md, SERVICE-CATALOG.md)

These are internal business documents, not served by the site.

## Deployment

Push to `main` → Netlify auto-deploys. Publish directory is repo root (`.`).

## Editing Guidelines

- No build step — edit files directly and push
- CSS uses custom properties (`:root` variables) — change theme there
- All JS uses `var` and ES5-compatible patterns (no transpiler)
- Responsive breakpoints: 900px (tablet), 480px (mobile)
- Test Calendly popup and Formspree submission after changes to CTAs or contact form
