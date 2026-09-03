# Site Structure — expatsdanang.com

*Prepared 2026-09-03.*

## Current state

31 URLs in the sitemap: 7 static, 6 service, 18 guides. Zero listing detail pages (the marketplace is unpopulated). Two structural problems.

### Problem 1 — duplicate commercial nodes

Both of these are live 200s with separate canonicals and overlapping purpose:

```
/housing              vs  /services/housing
/motorbike-rental     vs  /services/motorbike-rental
```

Google has no way to tell which should rank for "housing Da Nang". The service pages carry ~35 words of unique copy, so they will lose — while still consuming crawl budget and splitting internal link equity.

### Problem 2 — cannibalization within /guides/

**Motorbike — four pages, one intent:**
```
/guides/motorbike-rental-da-nang          911w
/guides/scooter-rental-da-nang            784w
/guides/monthly-motorbike-rental-da-nang  807w
/guides/getting-around-da-nang            938w  (also covers motorbike rental)
```

**Housing — five nodes, one intent:**
```
/guides/apartment-for-rent-da-nang            975w
/guides/house-for-rent-da-nang                835w
/guides/furnished-apartment-da-nang-long-term 813w
/guides/best-neighborhoods-da-nang-expats     896w
/housing + /services/housing
```

Same template, same byline, same price tables, overlapping subtopics. Each page's unique angle lasts one or two paragraphs before reverting to shared boilerplate.

## Target structure

```
/
├── /get-help                        ← primary conversion page
├── /services
│   ├── /visa-documents              ← expand to 800w+
│   ├── /airport-transfer            ← expand to 800w+
│   ├── /bank-account                ← expand to 800w+
│   ├── /translation                 ← expand to 800w+
│   ├── /housing          → 301 → /housing
│   └── /motorbike-rental → 301 → /motorbike-rental
├── /housing                         ← HUB: service pitch + live inventory
│   └── /rentals/[id]                ← listing detail (note: not /housing/[id])
├── /motorbike-rental                ← HUB: service pitch + live inventory
│   └── /motorbike-rental/[id]
├── /guides                          ← index
│   ├── visa-options-da-nang         ← PILLAR (visa cluster)
│   ├── getting-around-da-nang       ← PILLAR (transport cluster)
│   ├── apartment-for-rent-da-nang   ← PILLAR (housing cluster)
│   ├── opening-bank-account-da-nang ← PILLAR (money cluster)
│   ├── living-in-da-nang            ← PILLAR (settling cluster)
│   └── … surviving spokes
├── /about                           ← E-E-A-T anchor; needs real named people
├── /faq
└── /reviews                         ← NEW: consolidate social proof
```

## Consolidation plan

Merge the losing page's unique content into the survivor, then 301. Never delete outright — the value is in the merged content, not the redirect.

| Action | From | To |
|---|---|---|
| 301 | `/guides/scooter-rental-da-nang` | `/guides/motorbike-rental-da-nang` |
| 301 | `/guides/monthly-motorbike-rental-da-nang` | `/guides/motorbike-rental-da-nang` |
| 301 | `/services/motorbike-rental` | `/motorbike-rental` |
| 301 | `/services/housing` | `/housing` |
| 301 | `/guides/furnished-apartment-da-nang-long-term` | `/guides/apartment-for-rent-da-nang` |
| Differentiate | `/guides/house-for-rent-da-nang` | Keep — narrow to whole-house concerns only (garden, parking, whole-building leases) |
| Differentiate | `/guides/getting-around-da-nang` | Keep — strip motorbike-rental overlap, narrow to Grab/taxi/walkability |

Net: 18 guides → 15, and 6 service pages → 4. Fewer, stronger, non-competing pages.

**Before redirecting**, confirm in GSC which URL in each pair already receives impressions. If the page slated for redirect is the one ranking, reverse the direction. Without GSC data this consolidation is guesswork — connect it first.

## Internal linking rules

1. Every guide links to its cluster pillar.
2. Every pillar links down to its spokes.
3. Every guide links to exactly **one** service page — the one matching its `service` field. No scattering.
4. Service pages link to their pillar guide, not to every guide.
5. Listing detail pages link up to the browse hub and across to the relevant guide.

The current `GuideLayout` sidebar CTA already implements rule 3. Keep it.

## Crawl and index rules

- `/admin`, `/api/` — disallowed. Correct as-is.
- `/partner`, `/partner/login` — should be `noindex`. Not customer-facing.
- `/motorbike-rental/demo` — demo route, currently indexable. `noindex` or remove.
- Empty browse pages — if `/housing` and `/motorbike-rental` remain unpopulated, `noindex` them until inventory exists. An indexed empty commercial page is a quality liability, and both currently sit at priority 0.8 with `changefreq: daily`.
- Listing detail pages — enter the sitemap automatically once listings exist (the `status` filter bug that prevented this is fixed in PR `seo/audit-fixes`).

## Schema per page type

| Page type | Schema |
|---|---|
| Home | Organization, WebSite, LocalBusiness *(sitewide)* |
| Service | Service + Offer, BreadcrumbList |
| Guide | BlogPosting + real dates, BreadcrumbList, Person author |
| Housing hub | ItemList *(populate `itemListElement`)*, BreadcrumbList |
| Listing detail | Product + Offer |
| About | BreadcrumbList, Person entities for the team |
| Reviews | LocalBusiness + AggregateRating |

Still missing and requiring **your** real data before they can be added: `geo` coordinates, `openingHoursSpecification`, and business-level `aggregateRating`. These were deliberately omitted from the audit fixes rather than invented.
