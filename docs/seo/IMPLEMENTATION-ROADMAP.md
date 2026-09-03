# Implementation Roadmap — expatsdanang.com

*Prepared 2026-09-03. Four phases over 12 months.*

Dependencies are strict: each phase assumes the prior one landed. Phase 1 in particular gates everything — without measurement in place, no later phase can be evaluated.

---

## Phase 1 — Foundation (weeks 1–4)

**Goal:** stop the bleeding, start measuring.

| # | Task | Depends on | Done when |
|---|---|---|---|
| 1.1 | Merge PR `seo/audit-fixes` | — | Production serves `wa.me/84…`, canonicals resolve to `www` |
| 1.2 | Verify a WhatsApp CTA end-to-end | 1.1 | A real message arrives from a link click |
| 1.3 | Connect Google Search Console, submit sitemap | 1.1 | Impressions data flowing |
| 1.4 | Connect GA4 | — | Organic sessions visible |
| 1.5 | Record the baseline | 1.3, 1.4 | Numbers written into the KPI table below |
| 1.6 | Add a free Google API key (PageSpeed/CrUX) | — | `claude-seo` reports field CWV, not lab |
| 1.7 | Create Google Business Profile, category "Concierge Service" | — | Profile verified |
| 1.8 | `noindex` on `/partner*`, `/motorbike-rental/demo` | — | Excluded in GSC |
| 1.9 | Decide: populate the marketplace, or `noindex` empty browse pages | — | No indexed empty commercial pages |
| 1.10 | Supply `geo`, opening hours, real review count | — | Schema fields added |

**Exit criteria:** contact funnel provably working, baseline recorded, GBP live.

**Do not start Phase 2 before 1.5.** Consolidation without GSC data is guesswork.

---

## Phase 2 — Consolidation (weeks 5–12)

**Goal:** fewer, stronger pages. Mostly editing, not writing.

| # | Task | Depends on | Done when |
|---|---|---|---|
| 2.1 | Confirm which URL in each cannibalised pair ranks | 1.5 | Redirect directions confirmed against real impressions |
| 2.2 | Motorbike consolidation — 2× 301 | 2.1 | One page ranks for "motorbike rental Da Nang" |
| 2.3 | Housing consolidation — 1× 301 + differentiate `house-for-rent` | 2.1 | No two housing guides share >40% of subtopics |
| 2.4 | `/services/housing` and `/services/motorbike-rental` → 301 to hubs | 2.1 | Duplicate commercial nodes gone |
| 2.5 | Expand remaining 4 service pages to 800w+ unique | — | No service page under 800 words |
| 2.6 | Populate empty "Sources & references" on all guides | — | Zero guides render an empty sources heading |
| 2.7 | Migrate 6 legacy static guides onto the author/sources template | — | All guides support author + sources + reviewed date |
| 2.8 | Replace "Expats Da Nang Team" with named authors + bio pages | 2.7 | Every guide has a real, linked byline |
| 2.9 | Internal linking pass per SITE-STRUCTURE rules | 2.2–2.4 | Every guide links to exactly one service page |

**Exit criteria:** 15 guides, 4 service pages, no cannibalization, real E-E-A-T signals.

---

## Phase 3 — Scale (weeks 13–24)

**Goal:** attack the weak transactional SERPs; start the first-party data engine.

| # | Task | Depends on | Done when |
|---|---|---|---|
| 3.1 | Launch the first-party data series (see CONTENT-CALENDAR) | Booking volume | First "what clients actually paid" page live and dated |
| 3.2 | Build the visa cluster — the highest-value, weakest-competition pillar | 2.9 | 4 new visa spokes live |
| 3.3 | Build the transport cluster | 2.9 | Motorbike pillar plus 2 differentiated spokes |
| 3.4 | Rewrite guide openings for passage-level citability | 2.7 | Every pillar answers its query in the first 60 words |
| 3.5 | Quarterly YMYL review pass (visa, healthcare, safety) | — | `dateModified` genuinely moves |
| 3.6 | Facebook Business Page with reviews; TripAdvisor listing | 1.7 | Both live, linked in `sameAs` |
| 3.7 | Expat-community outreach (Da Nang FB groups, Reddit, nomad blogs) | 2.5 | First referring domains earned |
| 3.8 | Per-listing `Product`/`Offer` schema; populate `itemListElement` | 1.9 | Listing pages eligible for rich results |
| 3.9 | LCP work — split `SiteChrome`/`Navbar` so the logo isn't hydration-gated | 1.6 | Field LCP under 2.5s at p75 |
| 3.10 | Content-Security-Policy, tested against Clarity + Supabase | — | CSP live with no console errors |

**Exit criteria:** ranking on page 1 for at least one commercial motorbike or visa query; first earned backlinks.

---

## Phase 4 — Authority (months 7–12)

**Goal:** become the cited source.

| # | Task | Depends on | Done when |
|---|---|---|---|
| 4.1 | YouTube channel — 5 videos (visa office walkthrough, neighbourhood tours, cost breakdown) | 3.1 | Videos live, linked in `sameAs`, embedded in pillars |
| 4.2 | Publish an annual "Da Nang Expat Cost Report" from booking data | 3.1 | First edition published and pitched |
| 4.3 | PR outreach to expat/nomad publications | 4.2 | Coverage earned |
| 4.4 | Track LLM citation rate for the pillars | 3.4 | Measurable mention rate in ChatGPT/Perplexity |
| 4.5 | Expand housing cluster to neighbourhood-level depth | 3.1 | Each major district has genuinely distinct content |
| 4.6 | Consider Vietnamese-language content | — | Decision made on `hreflang` |

**Note on 4.1:** YouTube presence is currently zero, and video mentions correlate strongly with AI citation. Cheap videos linked back to the pillars will likely move the needle more than further on-page tuning.

---

## KPI targets

**Baselines are blank because there is no measurement connected.** Fill them during Phase 1 task 1.5. Targets below are expressed as multiples of the recorded baseline — they are hypotheses to validate, not commitments, and should be revised once real numbers exist.

| Metric | Baseline | 3 months | 6 months | 12 months |
|---|---|---|---|---|
| Organic sessions | *record in 1.5* | 1.5× | 3× | 6× |
| Ranking keywords | *record in 1.5* | +40% | +150% | +400% |
| Page-1 commercial keywords | *record in 1.5* | 1 | 3 | 8 |
| Indexed pages | 31 | ~28 *(consolidation reduces this — expected)* | 40 | 60+ |
| Referring domains | unknown *(no backlink tool)* | +5 | +20 | +50 |
| LCP (field, p75) | unknown *(lab only: 1.49s)* | <2.5s | <2.0s | <2.0s |
| WhatsApp conversations from organic | 0 *(CTA was broken)* | establish | 2× | 5× |

Note the indexed-page count is expected to **fall** in the first quarter. That is the consolidation working, not a regression.

## Resource requirements

- **Engineering:** ~2 weeks total across Phases 1–3, concentrated in 1.x and 3.8–3.10.
- **Content:** the largest cost. ~4 service page expansions, ~6 new visa/transport spokes, plus ongoing first-party data pieces. Roughly 1 substantial page per week from Phase 2.
- **Operations:** GBP, Facebook, TripAdvisor setup; sourcing real review counts; supplying `geo` and hours.
- **Tools:** Google API key (free). Moz free tier (2,500 rows/month) for backlink visibility. DataForSEO only if keyword volume data becomes decision-critical.
