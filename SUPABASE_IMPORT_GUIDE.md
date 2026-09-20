# Supabase Import Guide: 30 Articles to Database

## Overview
This guide walks you through importing all 30 markdown articles into Supabase `guides` table so they become accessible via the Next.js routes.

**Current Status:**
- ✅ Migration file created: `supabase/migrations/002_guides_table.sql`
- ✅ Conversion script created: `scripts/convert-markdown-to-guides.ts`
- ❌ Import NOT yet executed (you are here)

**Timeline:** ~45 minutes total

---

## Step 1: Create Guides Table (5 minutes)

### 1a. Run the Migration

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Create a new query
3. Copy-paste contents of `supabase/migrations/002_guides_table.sql`
4. Click **Run**

**Verification:** Table appears in **Database** → **Tables** → `guides` with columns:
- id (UUID)
- slug (text, unique)
- title, excerpt, category (text)
- content_html, meta_title, meta_description (text)
- author_name, author_title, author_bio, author_avatar_url (text)
- read_time, status, focus_keyword (text)
- published_at, updated_at, created_at (timestamp)
- key_takeaways, sources, faqs (jsonb)

---

## Step 2: Convert Markdown to JSON (5 minutes)

### 2a. Install Dependencies

```bash
npm install marked
```

### 2b. Run Conversion Script

```bash
npx ts-node scripts/convert-markdown-to-guides.ts
```

**Expected Output:**
```
📖 Found 30 markdown files

✓ motorcycle-first-timer-checklist
✓ solo-female-rider-itineraries
... (28 more)

✅ Converted 30 guides
📁 Output: supabase/import-data/guides.json
```

**Verification:** File `supabase/import-data/guides.json` exists with 30 guide objects

---

## Step 3: Import Data to Supabase (30 minutes)

### 3a. Option 1: Bulk Insert via SQL (Recommended)

**Pros:** Fast, atomic, reversible
**Time:** 2-3 minutes

1. Go to **Supabase Dashboard** → **SQL Editor** → **New query**

2. Copy and run this query:

```sql
INSERT INTO guides (
  slug, title, excerpt, category, content_html, meta_title, meta_description,
  focus_keyword, og_image_url, read_time, status, published_at, updated_at,
  created_at, author_name, author_title, author_bio, author_avatar_url,
  reviewed_at, key_takeaways, faqs, sources
)
SELECT 
  data->>'slug', data->>'title', data->>'excerpt', data->>'category',
  data->>'content_html', data->>'meta_title', data->>'meta_description',
  data->>'focus_keyword', data->>'og_image_url', data->>'read_time',
  data->>'status', 
  CASE WHEN data->>'published_at' IS NOT NULL THEN (data->>'published_at')::timestamptz ELSE NULL END,
  CASE WHEN data->>'updated_at' IS NOT NULL THEN (data->>'updated_at')::timestamptz ELSE NULL END,
  CASE WHEN data->>'created_at' IS NOT NULL THEN (data->>'created_at')::timestamptz ELSE NULL END,
  data->>'author_name', data->>'author_title', data->>'author_bio', data->>'author_avatar_url',
  CASE WHEN data->>'reviewed_at' IS NOT NULL THEN (data->>'reviewed_at')::timestamptz ELSE NULL END,
  CASE WHEN data->'key_takeaways' IS NOT NULL THEN (data->'key_takeaways')::text[] ELSE NULL END,
  CASE WHEN data->'faqs' IS NOT NULL THEN data->'faqs' ELSE '[]'::jsonb END,
  CASE WHEN data->'sources' IS NOT NULL THEN data->'sources' ELSE '[]'::jsonb END
FROM (
  SELECT jsonb_array_elements('[PASTE JSON HERE]'::jsonb) as data
) as t
ON CONFLICT (slug) DO NOTHING;
```

3. **Replace `[PASTE JSON HERE]`** with the content of `supabase/import-data/guides.json` (just the array part)

4. Click **Run**

### 3b. Option 2: Programmatic Insert via Node.js

**Time:** 5-10 minutes

Create file `scripts/import-to-supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function importGuides() {
  const guides = JSON.parse(fs.readFileSync('supabase/import-data/guides.json', 'utf-8'))
  
  const { data, error } = await supabase
    .from('guides')
    .insert(guides)
  
  if (error) {
    console.error('❌ Import failed:', error)
    process.exit(1)
  }
  
  console.log(`✅ Imported ${data?.length || guides.length} guides`)
}

importGuides()
```

Then run:
```bash
NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx ts-node scripts/import-to-supabase.ts
```

---

## Step 4: Verify Import (5 minutes)

### 4a. Check Row Count

Go to **Supabase Dashboard** → **SQL Editor** → **New query**:

```sql
SELECT COUNT(*) as total, 
       COUNT(CASE WHEN status = 'published' THEN 1 END) as published,
       COUNT(DISTINCT category) as categories
FROM guides;
```

**Expected Result:**
```
total | published | categories
------|-----------|----------
  30  |    30     |     2
```

### 4b. Check Specific Guide

```sql
SELECT slug, title, author_name, status, published_at
FROM guides
WHERE slug = 'motorcycle-first-timer-checklist'
LIMIT 1;
```

**Expected Result:**
```
slug                          | title                           | author_name | status    | published_at
-------------------------------|--------------------------------|-------------|-----------|-------------------
motorcycle-first-timer-checklist | Motorcycle Rental Checklist... | Nam Tran    | published | 2026-09-01
```

### 4c. Test Web Route

Visit in browser:
```
https://www.expatsdanang.com/guides/motorcycle-first-timer-checklist
```

**Expected:**
- ✅ Article loads (not 404)
- ✅ Title displays
- ✅ Author byline shows "Nam Tran"
- ✅ Content renders
- ✅ Schema markup present in page source

---

## Step 5: Fix Schema Domain Mismatch (10 minutes)

### 5a. Update Guide Page Component

File: `app/guides/[slug]/page.tsx`

Find line that generates schema (around line 50-100):
```typescript
url: `${SITE.url}/#organization` // Currently using expatsdanang.com
```

Verify it uses the constant, or change to:
```typescript
url: `${SITE.url}/#organization` // Will use www.expatsdanang.com via SITE constant
```

**Verification:** View page source, search for `"@id"` — should show `https://www.expatsdanang.com/#organization`

---

## Step 6: Deploy & Go Live (5 minutes)

### 6a. Commit Migration & Scripts

```bash
git add supabase/migrations/002_guides_table.sql scripts/convert-markdown-to-guides.ts
git commit -m "feat(supabase): add guides table and import scripts for 30 articles"
```

### 6b. Deploy to Production

```bash
git push origin main
```

(Vercel auto-deploys)

### 6c. Verify Live Site

Visit 5 different articles:
1. `https://www.expatsdanang.com/guides/motorcycle-first-timer-checklist`
2. `https://www.expatsdanang.com/guides/best-neighborhoods-expats-da-nang`
3. `https://www.expatsdanang.com/guides/apartment-utilities-guide`
4. `https://www.expatsdanang.com/guides/monsoon-motorcycle-safety`
5. `https://www.expatsdanang.com/guides/short-term-vs-long-term-rental`

**Checklist:**
- ✅ All URLs return 200 (not 404)
- ✅ Article title displays
- ✅ Author byline renders with name + title
- ✅ Content renders (not blank)
- ✅ Schema markup in `<head>` (view page source, search `BlogPosting`)

---

## Troubleshooting

### "Duplicate key value" Error
→ Guides with same slug already exist. Run:
```sql
DELETE FROM guides WHERE TRUE; -- Clear table
```
Then retry insert.

### "Column does not exist" Error
→ Migration didn't run. Go to Supabase Dashboard and manually run `002_guides_table.sql`

### Routes Still Return 404
→ Check:
1. Supabase table has data: `SELECT COUNT(*) FROM guides;` should return 30
2. App cache cleared: Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)
3. Deployment complete: Check Vercel build log for errors

### Author Avatar Shows Broken Image
→ This is expected for now. Images need separate upload:
```bash
# Upload author images to public/authors/
cp public/authors/nam-tran.png ...
```

---

## What's Next?

Once import is verified ✅:

1. **Add External Citations** (2–3 hours)
   - Add 3–5 sources per article minimum
   - Format: `According to [Source], [claim]`

2. **Fix Schema Domain** (1 hour)
   - Ensure all @id URLs use `www.expatsdanang.com`

3. **Deploy & Test** (1 hour)
   - Commit → Push → Verify on live site

4. **Begin Backlink Outreach** (Ongoing)
   - Use BACKLINK_STRATEGY.md
   - Execute Tier 1 outreach
   - Track referring domains

---

## Support

**Questions?**
- Check Supabase logs: Dashboard → Logs
- Inspect network tab: Browser DevTools → Network
- Read error messages: They usually explain the issue

**Timeline Estimate:**
- Step 1: 5 min
- Step 2: 5 min
- Step 3: 30 min ← **Longest step, manual copy-paste**
- Step 4: 5 min
- Step 5: 10 min
- Step 6: 5 min

**Total: ~45 minutes**

Ready to start? Run Step 1 now! 🚀
