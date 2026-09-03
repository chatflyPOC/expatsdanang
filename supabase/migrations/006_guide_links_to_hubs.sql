-- Repoint in-content links away from the retired /services/ stubs.
--
-- /services/housing and /services/motorbike-rental now permanently redirect to
-- /housing and /motorbike-rental (see next.config.ts). Sixteen links across all
-- twelve database-backed guides still point at the old paths, so every one of
-- them costs readers and crawlers an extra redirect hop. Rewriting them in
-- content_html removes the hop; the redirect stays in place for external links
-- and anything already indexed.
--
-- Safe to re-run: the WHERE clause matches only rows still holding an old path,
-- and the replacements are idempotent.

update guides
set content_html = replace(
      replace(content_html, 'href="/services/housing"', 'href="/housing"'),
      'href="/services/motorbike-rental"', 'href="/motorbike-rental"'
    ),
    updated_at = now()
where content_html like '%href="/services/housing"%'
   or content_html like '%href="/services/motorbike-rental"%';

-- Verify: expect 0 rows.
-- select slug from guides
--  where content_html like '%href="/services/housing"%'
--     or content_html like '%href="/services/motorbike-rental"%';
