# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Developers and technical founders who are serious about building a lasting software company — not weekend "vibe coders." They evaluate SaaS boilerplates critically, have been burned by per-MAU vendor pricing and duct-taped starter kits, and want to own every line of code they ship. Secondary audience: small agencies shipping client SaaS projects. (Captured from the owner's written brief, 2026-08-09.)

## Product Purpose

SaaSyLand is a production-grade SaaS starter: a full-stack Next.js codebase (Bun, Elysia, Better Auth, Drizzle/Neon, next-intl, Stripe, Resend) scaffolded via CLI, with 100% Vitest & Playwright test coverage, professional i18n, a built-in visual page designer/blog editor, and a full video masterclass showing how the product is built end to end. Success: a buyer goes from scaffold to a scalable, vendor-free, revenue-ready SaaS in days, and can push to production with confidence.

## Positioning

"Enterprise architecture, indie speed." The only boilerplate in its class that combines: (1) 100% test coverage — sleep-at-night reliability; (2) zero vendor lock-in — Better Auth over Clerk, your database, your users, your margins; (3) go-global-on-day-one i18n; (4) a built-in visual page designer, so buyers ship the marketing, not just the app; (5) a senior-engineer video masterclass — an education, not just a repo. Flanks free CLIs (no business logic), ShipFast-style duct-tape kits (punishing scale costs), and premium heavyweights (no test coverage story, no page builder). Built by a professional developer to production standards.

## Pricing (owner-supplied anchors)

Good/Better/Best, anchored high — cheap pricing would signal low quality:

- **Codebase** — $249 one-time (owner range $199–249): full CLI access, all standard templates, lifetime updates.
- **Masterclass** — $399 one-time (owner range $349–399), highlighted as most popular: everything in Codebase plus the full video course ("watch a professional developer build a production SaaS from scratch").
- **Agency / Unlimited** — $899 one-time (owner range $799–999): everything above plus unlimited-client commercial license, private Discord priority support, Figma design files for the page builder.

Exact figures inside owner ranges chosen by design (inferred, not user-confirmed): $249 / $399 / $899.

## Voice

Bold, confident, technical-but-benefit-led. Lead promise: "Stop duct-taping APIs. Build a scalable, vendor-free SaaS on edge-native architecture in minutes." Never list a feature without its financial or emotional benefit. No hype-bro tone; senior-engineer certainty.

## Brand commitments and constraints

- Landing page styling is restricted to the CSS custom-property tokens defined in `src/presentation/styles/globals.css`; token **values** may be changed, token **names** may not, and no new tokens may be added.
- Visual direction (owner-approved, 2026-08-12): precision-minimal dark, in the Vercel / Linear / Supabase family. The previous "factory tracking shot" concept is retired. See `DESIGN.md` for the full system.
- Hero artwork is the product itself: `public/images/admin-dashboard.webp` and `public/images/page-designer.webp` are real screenshots captured from the running admin. Regenerate them from the app rather than editing them by hand, and never substitute a drawn or div-built mockup. These two files plus `public/images/blog/` are the entire image budget of the site.
- Motion is subtractive: one one-shot scroll entrance (`Reveal`), one CSS-only hero entrance, one marquee, and 200ms state changes on real interactions. No scroll hijack, no pinning, no parallax, no smooth-scroll library and no animation dependency in the app bundle. Every device ships a reduced-motion path.
- Eight concept loops are authored in Remotion (`remotion/`, a separate project excluded from the app build) and shipped as VP9 video in `public/motion/`: the console assembling in the hero, four bands in "The line", the running terminal in "Quality control", the page designer in "Studio", and the claim audit in "Record". They are `preload="none"`, played and paused by an IntersectionObserver, never started under reduced motion, hidden below `sm`, and total ~1.2MB including posters. Every figure they show is one the page already stands behind. The hero's poster is the page's LCP image and must always be the resolved frame. See `remotion/README.md` before changing or re-rendering them.
- There are no static product screenshots left: `app-tour` and `page-designer` replaced `admin-dashboard.webp` and `page-designer.webp`, which have been deleted.
- i18n: all landing copy lives in next-intl message files (en-US and pl-PL must stay in parity — `bun run check:i18n`).
- 100% test-coverage claim, professional-developer provenance, and the stack list are real product facts and may be stated; do not invent customers, benchmarks, or testimonials as fact.
- **Never name the author's employer.** The provenance is "a professional developer", deliberately and permanently: the owner does not want this product associated with the company they work for. It was on the page once (studio, record, FAQ) and was removed on request.
