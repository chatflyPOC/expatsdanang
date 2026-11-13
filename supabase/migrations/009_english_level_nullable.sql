-- ============================================================
-- Let english_level say "not recorded yet".
--
-- The column was NOT NULL DEFAULT 'basic', so a row nobody had asked
-- about was indistinguishable from a row someone had visited and judged
-- to have basic English. The card renders that default as the flat
-- statement "Basic English", under a hero promising "English level
-- recorded, not guessed" — so the page was guessing, on exactly the
-- attribute it claimed never to guess on.
--
-- Null now means nobody has checked, and the UI omits the chip rather
-- than inventing a level. The default is dropped so new rows start
-- unknown instead of starting at a claim.
-- ============================================================

alter table businesses alter column english_level drop default;
alter table businesses alter column english_level drop not null;

-- Clear the seeded rows that never had their English level checked.
-- The two left alone are the clinic and the school that describe
-- themselves as English-medium on their own sites; those were set
-- deliberately, not by the default.
update businesses
set english_level = null
where english_level = 'basic'
  and slug in (
    'family-medical-practice-da-nang',
      'hoan-my-da-nang-hospital',
      'tam-tri-general-hospital-da-nang',
      'xliii-specialty-coffee',
      'coworking-danang',
      'ace-coworking-space',
      'roots-plant-based-cafe',
      'namaste-omar-indian-restaurant',
      'le-comptoir-da-nang',
      'missteak-da-nang',
      'the-new-gym-da-nang',
      'spanda-yoga-cafe',
      'singapore-international-school-da-nang',
      'herbal-spa-an-thuong',
      'levenin-spa',
      'my-pet-animal-hospital-24h',
      'nobipet-pet-supermarket',
      'aeon-mall-da-nang',
      'vincom-plaza-ngo-quyen',
      'mm-mega-market-da-nang'
  );
