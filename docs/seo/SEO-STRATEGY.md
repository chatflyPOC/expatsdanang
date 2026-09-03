# SEO Strategy — expatsdanang.com

*Prepared 2026-09-03. Supersedes nothing; complements the audit of 2026-09-02.*

## Business context

**Type:** Service-area business (SAB) — concierge/relocation services for expats in Da Nang, Vietnam. Not brick-and-mortar; the registered PvcomBank address is a legal address, not a storefront.

**Services:** visa documents · housing rental · motorbike rental · airport transfer · bank account setup · translation.

**Model:** hybrid — publisher (20 guides) + service provider (6 service pages) + marketplace (housing and motorbike inventory).

Note the standard local-service SEO playbook (per-city location pages, map-pack optimisation, citation building) is a **poor fit** here and following it would waste most of the budget. This plan blends the local-service and publisher templates accordingly, and says explicitly where the local-service playbook does not apply.

## The two audiences, and why it matters

**Segment A — pre-arrival, searching from abroad.** "cost of living Da Nang", "visa options Vietnam", "is Da Nang safe", "best neighborhoods Da Nang". Proximity ranking factors are structurally irrelevant — there is no "near me" to be near, and Google will not return a local pack. This is almost certainly the majority of current traffic and it is where our content already exists.

**Segment B — already in Da Nang, transactional.** "motorbike rental Da Nang", "visa extension Da Nang", "airport pickup". Smaller volume, far higher intent, closest to revenue. Google Business Profile and map pack genuinely matter here, and **we currently have no GBP at all**.

The strategic error to avoid is treating this as a standard local SEO project (all effort to Segment B) or as a pure content play (all effort to Segment A). It is roughly 70/30.

## Strategic thesis

> Publishers can't fulfil. Operators can't publish. Aggregators can't do either. Own the middle by pairing genuinely useful content with actual service delivery, and defend it with first-party transaction data no competitor can copy.

Three consequences follow.

### 1. Stop competing where we structurally cannot win

Cost-of-living queries are owned by Numbeo, Expatistan and Nomads.com — crowd-sourced datasets with enormous authority. Our `cost-of-living-da-nang` page is our **thinnest** guide (649 words) aimed at our **hardest** SERP. Reframe it from "what does Da Nang cost" to "what our clients actually paid" — a question aggregators cannot answer.

### 2. Attack the transactional SERPs, which are weak

The visa and motorbike SERPs are contested by small operators with poor web presence — one top result is a **Facebook page**. These are winnable within two quarters with competent execution. They are also where revenue is.

### 3. Make first-party data the moat

Every completed booking produces data: real rent by neighbourhood, real agent fees, real monthly bike rates. Publishing it dated and attributed is the single highest-leverage content activity available, because it is simultaneously the most citable by LLMs and the least copyable by competitors.

## Priorities in order

1. **Fix what's broken.** (Largely shipped — see the 2026-09-02 audit and PR `seo/audit-fixes`.) Dead WhatsApp CTAs and misdirected canonicals made every other investment worthless.
2. **Resolve cannibalization.** Four pages fighting for one motorbike intent, five for housing. Consolidating multiplies the strength of what remains without writing anything new.
3. **Deepen the commercial pages.** Six service pages currently carry ~35 words each. These are the money pages and they are doorway-thin.
4. **Establish measurement.** No GSC, no GA4, no baseline. We are flying blind and cannot prove any of this works.
5. **Build E-E-A-T substance.** Empty "Sources & references" headings and a generic "Expats Da Nang Team" byline are hollow trust signals.
6. **Claim Segment B.** Google Business Profile, primary category "Concierge Service".
7. **Then scale content** against the gaps identified in the competitor analysis.

## Content pillars

Five clusters, hub-and-spoke, each terminating in a service we sell.

| Pillar | Hub | Commercial value | Competition |
|---|---|---|---|
| Visa & legal | `/guides/visa-options-da-nang` | Highest | Weak — beatable |
| Housing | `/housing` | High | Moderate — `rentdanang.app` |
| Transport | `/guides/getting-around-da-nang` | High | Moderate — `motorvina` |
| Money & banking | `/guides/opening-bank-account-da-nang` | Medium | Hard on cost-of-living, easy on banking |
| Settling & life | `/guides/living-in-da-nang` | Low (top-of-funnel) | Hard — established publishers |

Effort should follow commercial value and competitive weakness — meaning **visa and transport first**, settling/life last.

## What we are deliberately not doing

- **No location pages.** Single-city business. The template's `/locations/city-N` pattern would be pure doorway-page risk with zero upside.
- **No Yelp or BBB citations.** Wrong ecosystem entirely for a Vietnam-based business serving expats. Facebook, TripAdvisor and expat-group presence are this niche's real citations.
- **No map-pack proximity chasing for Segment A.** Structurally irrelevant to searchers who aren't in the country yet.
- **No new FAQPage schema for SERP benefit.** Google retired FAQ rich results for all sites on 2026-05-07. Existing markup stays; it just isn't a growth lever.
- **No HowTo schema.** Deprecated since 2023.
- **No llms.txt as a priority.** Unofficial, unhonoured by Google Search, no confirmed effect anywhere. Cheap to add, but it must not displace real work.

## Risks

| Risk | Mitigation |
|---|---|
| Consolidation 301s temporarily drop rankings | Redirect to the strongest page, not a new URL; keep the merged content on the surviving page |
| First-party data reveals commercially sensitive pricing | Publish ranges and medians, not per-client figures |
| No baseline means we can't attribute results | Connect GSC and GA4 **before** shipping content changes, not after |
| Marketplace stays empty, making inventory pages thin | Either populate listings or `noindex` the empty browse pages until stocked |
| Guides give visa/health advice that goes stale | Quarterly review cadence on YMYL pages; real `dateModified` now ships |

## Falsifiability

This strategy is wrong if, six weeks after the audit fixes land and GSC is connected, impressions on the **service** pages remain flat while guide impressions grow. That would indicate the bottleneck is commercial-intent competitiveness rather than technical health or content depth, and the plan should pivot to paid acquisition for Segment B instead of organic.
