/**
 * Rich, expanded content for service pages (900-1000 words each)
 * Sections include: overview, why choose us, process, pricing, FAQ, etc.
 *
 * This content replaces the thin 66-88 word descriptions currently shown.
 * Used by ServiceContent component to render fuller pages.
 */

export const SERVICE_CONTENT = {
  'airport-transfer': {
    sections: [
      {
        type: 'intro',
        content: `Arriving at Da Nang International Airport for the first time can be stressful. You're jet-lagged, unfamiliar with Vietnamese, and overwhelmed by touts and taxi drivers. Our airport transfer service is designed to remove that stress—a reliable, English-speaking driver waiting for you with a nameplate, fixed pricing, and a vehicle suited to your group size.`,
      },
      {
        type: 'heading',
        level: 2,
        content: `Why Use an Airport Transfer Instead of Grab or a Taxi?`,
      },
      {
        type: 'comparison',
        items: [
          {
            name: 'Grab & Ride-Hailing',
            issues: [
              'Requires app download + Vietnamese SIM or WiFi setup (tricky for first-time arrivals)',
              'Surge pricing during peak hours (can double the base fare)',
              'Unpredictable arrival times + unknown driver reputation',
            ],
          },
          {
            name: 'Street Taxis & Touts',
            issues: [
              'No fixed pricing (driver may demand 2–3× the metered fare)',
              'Limited English communication',
              'Safety concerns (unmarked vehicles, unregistered drivers)',
              'Hidden surcharges after arrival',
            ],
          },
          {
            name: 'Our Airport Transfer',
            benefits: [
              '✅ Driver waits with your name at arrivals (no app, no waiting)',
              '✅ Fixed price—no surge pricing, no hidden charges',
              '✅ English-speaking, vetted driver',
              '✅ Clean, reliable vehicle',
              '✅ Flexible cancellation (up to 2 hours before pickup)',
            ],
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        content: `Pickup Process (Step-by-Step)`,
      },
      {
        type: 'steps',
        items: [
          { num: 1, title: 'Book ahead', desc: 'Tell us your flight time, airline, and destination. We track your flight arrival in real-time.' },
          { num: 2, title: 'Arrive & exit', desc: 'After baggage claim, proceed to arrivals hall. Look for your name on a placard.' },
          { num: 3, title: 'Meet your driver', desc: 'Confirm your name, ask any questions. Driver explains route, takes luggage to car.' },
          { num: 4, title: 'Drive to destination', desc: '20–45 min depending on location. AC vehicle, bottled water provided.' },
          { num: 5, title: 'Arrive & pay', desc: 'Fixed rate charged; no additional fees. Receipt provided for records.' },
        ],
      },
      {
        type: 'heading',
        level: 2,
        content: `Airport Transfer Pricing`,
      },
      {
        type: 'pricing-table',
        rows: [
          { type: 'Sedan (1–3 passengers)', anThuong: '$15', nguHanhSon: '$18', note: 'Red-eye or customs delay: +$5' },
          { type: 'Van (4–7 passengers)', anThuong: '$25', nguHanhSon: '$30', note: 'Side stops available: +$5' },
          { type: 'Group Minibus (8–12)', anThuong: 'Quote', nguHanhSon: 'Quote', note: 'Typically $50–80' },
        ],
        note: 'Pricing includes: driver, fuel, tolls, meet & greet. Optional tips appreciated (10–15%).',
      },
      {
        type: 'heading',
        level: 2,
        content: `FAQ`,
      },
      {
        type: 'faq',
        items: [
          { q: "What if my flight is delayed?", a: "We track your flight in real-time. If delayed, your driver waits free of charge (up to 3 hours past the original landing time)." },
          { q: "Can I request a specific driver?", a: "Yes. If you've used our service before and prefer a driver, mention it when booking. We'll do our best to arrange it." },
          { q: "What about luggage?", a: "Unlimited luggage. Sedans fit 3 large suitcases + personal bags. Vans fit 6+ suitcases. Ask when booking if you have oversized items." },
          { q: "Is tipping mandatory?", a: "No. Our pricing is all-inclusive. Tips (10–15%) are appreciated but entirely optional." },
          { q: "Do you accept card payment or only cash?", a: "Both. Pay via card (Visa/Mastercard) in advance, or cash (VND) to driver." },
          { q: "What if I want to stop for coffee before my hotel?", a: "Sure. Stops add ~$5 per 15 minutes. Let us know when booking." },
        ],
      },
      {
        type: 'heading',
        level: 2,
        content: `Why Choose Our Airport Transfer?`,
      },
      {
        type: 'benefits',
        items: [
          '200+ expats transferred — trusted by newcomers since 2023',
          '5-star reviews — "Professional, friendly, stress-free first arrival"',
          'English-speaking drivers — no language barriers',
          'Fixed pricing — no surge, no haggling',
          'Transparent — questions answered honestly',
        ],
      },
    ],
  },

  'bank-account': {
    sections: [
      {
        type: 'intro',
        content: `Opening a Vietnamese bank account as an expat is confusing. Forms are in Vietnamese, requirements change monthly, and most banks turn away foreigners. We handle the research, translation, and appointment so you get a working account in 5–7 business days.`,
      },
      {
        type: 'heading',
        level: 2,
        content: `Why You Need a Vietnamese Bank Account`,
      },
      {
        type: 'list',
        items: [
          'Receiving salary or freelance payments',
          'Paying rent (landlords expect bank transfers)',
          'Paying utilities (electricity, water require direct debit)',
          'Getting a local SIM card (requires bank verification)',
          'Renting an apartment (many require proof of funds)',
          'Renting a moto insurance policy',
          'Tax filing (if self-employed or contractor)',
        ],
      },
      {
        type: 'heading',
        level: 2,
        content: `Which Banks Accept Foreigners?`,
      },
      {
        type: 'bank-comparison',
        banks: [
          {
            name: 'BIDV (Bank for Investment and Development)',
            details: [
              'Largest bank in Vietnam',
              'Most expat-friendly',
              'Branches: An Thuong, My Khe, Han River',
              'Processing time: 3–5 business days',
              'Monthly fee: $0 (if $100+ balance)',
              '⭐ Recommended for most expats',
            ],
          },
          {
            name: 'Vietcombank (Vietnam Commercial Bank)',
            details: [
              'Government-owned, very stable',
              'More conservative on foreigner accounts',
              'Better exchange rates on USD transfers',
              'Processing time: 5–7 business days',
              'Monthly fee: $0 (if $100+ balance)',
            ],
          },
          {
            name: 'Techcombank',
            details: [
              'Expat-friendly, English support',
              'Higher monthly fees ($2–5)',
              'Good for international transfers',
              'Processing time: 2–3 business days',
              'Best digital banking app',
            ],
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        content: `Documents You'll Need`,
      },
      {
        type: 'requirements',
        sections: [
          {
            title: 'Personal ID',
            items: ['Passport (copy + original to verify)', 'Temporary Residence Card (TRC) or entry stamp'],
          },
          {
            title: 'Proof of Address',
            items: ['Rental contract (notarized)', 'OR proof of hotel booking (3+ nights)', 'OR letter from landlord'],
          },
          {
            title: 'Proof of Income (optional, but helpful)',
            items: ['Employment letter from your company', 'Freelance client invoice', 'Bank statement from home country'],
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        content: `Step-by-Step Process`,
      },
      {
        type: 'steps',
        items: [
          { num: 1, title: 'Consultation (15 min)', desc: 'We learn your situation, advise the best visa path, explain costs & timeline.' },
          { num: 2, title: 'Document Collection (1–2 days)', desc: 'We list all documents you need. You gather originals + photocopies.' },
          { num: 3, title: 'Application & Translation (2–3 days)', desc: 'We translate all forms to Vietnamese, fill out applications correctly.' },
          { num: 4, title: 'Submission (1 day)', desc: 'We submit to immigration office, get receipt + tracking number.' },
          { num: 5, title: 'Processing (3–5 business days)', desc: 'Bank verifies your background, checks with immigration, sets up online banking.' },
          { num: 6, title: 'Activation (1 day)', desc: 'Bank sends card via post (5–10 days). Temporary debit card at branch (instant).' },
        ],
      },
      {
        type: 'heading',
        level: 2,
        content: `Cost Breakdown`,
      },
      {
        type: 'costs',
        items: [
          { label: 'Our service fee', cost: '$50', desc: 'Includes: Translation, appointment scheduling, in-person support' },
          { label: 'Bank account opening', cost: 'Free', desc: '(No fee for first account)' },
          { label: 'Debit card', cost: 'Free', desc: '(Standard issue)' },
          { label: 'Wire transfer in', cost: '~$15', desc: '(USD bank fee; other currencies ~$25)' },
          { label: 'Monthly maintenance', cost: 'Free', desc: '(If $100+ balance)' },
        ],
      },
      {
        type: 'heading',
        level: 2,
        content: `FAQ`,
      },
      {
        type: 'faq',
        items: [
          { q: "Can I open a bank account on a tourist visa?", a: "Not officially. Banks want either a TRC (Temporary Residence Card, $25, 1–3 months to get) or work permit. Tourist visas are risky; we recommend getting a 1-month TRC first." },
          { q: "I don't have a rental contract yet — what do I do?", a: "Bring your hotel booking + ask the hotel for a letter stating your stay. Banks accept this temporarily." },
          { q: "I want to transfer money to a friend in Vietnam — how?", a: "Once your account is open, you can transfer to any Vietnamese account instantly (0 fee). International transfers cost ~$15 and take 3–5 days." },
          { q: "What if my account gets locked or has issues?", a: "We provide post-opening support. We'll help troubleshoot with the bank if needed." },
        ],
      },
    ],
  },

  'visa-documents': {
    sections: [
      {
        type: 'intro',
        content: `Vietnamese visa rules change frequently, and one mistake (wrong form, unsigned declaration, missing stamp) can cost weeks and hundreds of dollars. Our service handles extensions, temporary residence registration (TRC), and legal document needs so you stay compliant and stress-free.`,
      },
      {
        type: 'heading',
        level: 2,
        content: `Common Visa Scenarios & Timelines`,
      },
      {
        type: 'scenarios',
        items: [
          {
            title: 'Tourist Visa Extension (Most Common)',
            details: ['Current: 90-day tourist visa from home country', 'Need: Extend to stay 6+ months', 'Process: Apply for 1-month business visa or TRC', 'Timeline: 3–5 working days', 'Cost: $60–80 (visa) + $25 (service fee)'],
          },
          {
            title: 'Digital Nomad / Long-Term Stay',
            details: ['Current: 90-day tourist visa', 'Need: Stay 1–2 years legally', 'Process: Get 3-month business visa, renew quarterly', 'Timeline: 10–15 days (first visa), then 2–3 days (renewals)', 'Cost: $80–120/renewal + $30 (service fee)'],
          },
          {
            title: 'Business / Work Visa',
            details: ['Current: Tourist visa, hired by Vietnamese company', 'Need: Work permit + residence visa', 'Process: Company applies for work permit, then residence visa', 'Timeline: 4–6 weeks (first time), 2–3 days (renewals)', 'Cost: $150–300 + $50 (service fee)'],
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        content: `Visa Types We Handle`,
      },
      {
        type: 'visa-table',
        visas: [
          { type: 'Tourist', validity: '90 days', renewal: "Can't renew in-country", cost: '$25–40', best: 'Short trips' },
          { type: 'Business', validity: '3 months', renewal: 'Every 3 months', cost: '$80–120', best: 'Freelancers, expats' },
          { type: 'Work Permit', validity: '12 months', renewal: 'Annual renewal', cost: 'Employer pays', best: 'Employed expats' },
          { type: 'Temporary Residence Card (TRC)', validity: '1–12 months', renewal: 'Renewable', cost: '$25–50', best: 'All expats (legal residency)' },
        ],
      },
      {
        type: 'heading',
        level: 2,
        content: `Documents We Help With`,
      },
      {
        type: 'doc-categories',
        categories: [
          {
            name: 'Immigration',
            items: ['Visa extensions (tourist → business → residence)', 'Temporary Residence Card (TRC) application', 'Work permit applications', 'Re-entry permits (for short trips out of Vietnam)'],
          },
          {
            name: 'Legal Documents',
            items: ['Rental contracts (notarization + Vietnamese translation)', 'Employment contracts (translation + legal review)', 'Power of attorney (Vietnamese format)', 'Marriage certificates (translated + apostilled)'],
          },
          {
            name: 'Finance & Banking',
            items: ['Bank account opening (as an expat)', 'Loan applications (Vietnamese-language docs)', 'Tax residence certificate'],
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        content: `FAQ`,
      },
      {
        type: 'faq',
        items: [
          { q: "I overstayed my tourist visa without knowing — what now?", a: "You'll pay an overstay fine ($10/day, max $300). We help pay it + get a new visa after. It's fixable." },
          { q: "My visa says 'Work: No' — can I freelance?", a: "Technically no. Get a business visa or work permit ($80–150). We can arrange it in 5 days." },
          { q: "I lost my passport — what about my visa?", a: "Contact your embassy (they issue new passport with new visa number). We help get a re-entry permit so you can leave Vietnam and return with the same visa validity." },
          { q: "I need to leave Vietnam urgently but my visa expires in 2 days", a: "We can arrange a quick re-entry permit (48 hours). Costs $40 + $20 expedite fee." },
          { q: "Do I need a visa to go to Thailand and come back?", a: "Yes, if your Vietnam visa expires while you're away. Get a re-entry permit before leaving ($20, instant). Costs $40 at the airport without it." },
        ],
      },
    ],
  },

  'translation': {
    sections: [
      {
        type: 'intro',
        content: `Rental contracts in Vietnamese. Hospital paperwork. Legal documents. Navigating Vietnam as an expat means constantly translating. Our translation service handles contracts, visas, medical documents, and everyday needs—with certified notarized options for official documents.`,
      },
      {
        type: 'heading',
        level: 2,
        content: `Translation Services We Offer`,
      },
      {
        type: 'heading',
        level: 3,
        content: `Documents (Professional Translation)`,
      },
      {
        type: 'translation-table',
        rows: [
          { doc: 'Rental lease', length: '2–4 pages', time: '1 day', cost: '$20–40' },
          { doc: 'Employment contract', length: '1–3 pages', time: '1 day', cost: '$15–30' },
          { doc: 'Medical record', length: '1–2 pages', time: 'Same day', cost: '$10–20' },
          { doc: 'Visa extension form', length: '1 page', time: '2 hours', cost: '$5–10' },
          { doc: 'Power of attorney', length: '1–2 pages', time: '1 day', cost: '$25–35' },
          { doc: 'Property deed', length: '2–5 pages', time: '2 days', cost: '$30–50' },
        ],
      },
      {
        type: 'heading',
        level: 3,
        content: `Notarized / Certified Translation (For Official Use)`,
      },
      {
        type: 'list',
        items: [
          'Rental contracts (for visa/bank purposes)',
          'Marriage certificates (for property purchase/visa)',
          'Divorce decrees (for remarriage/visa)',
          'Educational diplomas (for employment)',
          'Police clearance (for visa applications)',
        ],
        note: 'Costs +$10–15 per document for certification.',
      },
      {
        type: 'heading',
        level: 3,
        content: `Interpretation (Spoken Translation)`,
      },
      {
        type: 'list',
        items: [
          'Doctor appointments (medical terminology explained)',
          'Bank meetings (account setup, mortgage negotiations)',
          'Landlord meetings (lease negotiations, complaints)',
          'Police / government offices',
          'Court appearances',
          'Business meetings',
        ],
        note: 'Hourly rate: $25–30/hour + transport. Minimum: 2 hours.',
      },
      {
        type: 'heading',
        level: 2,
        content: `Translation Pricing & Timeline`,
      },
      {
        type: 'pricing',
        items: [
          { service: 'Standard Translation', rate: '$0.10–0.15 per English word', min: 'Minimum $10', time: '1–3 days' },
          { service: 'Notarized / Certified', rate: '$0.15–0.20 per English word', min: 'Minimum $25', time: '2–5 days' },
          { service: 'Interpretation (Hourly)', rate: '$25–30/hour', min: 'Minimum 2 hours', time: 'On-demand' },
          { service: 'Emergency / Same-Day', rate: '+50% rush fee', min: 'Submit before 2 PM', time: 'Same day' },
        ],
      },
      {
        type: 'heading',
        level: 2,
        content: `Language Pairs Available`,
      },
      {
        type: 'list',
        items: [
          '✅ English ↔ Vietnamese (most common)',
          '✅ French ↔ Vietnamese (available)',
          '✅ German ↔ Vietnamese (available)',
          '✅ Mandarin ↔ Vietnamese (available on request)',
          '⏰ Other languages (Spanish, Japanese, Korean, Arabic) available through partner network — inquire for quotes.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        content: `Why You Need Professional Translation`,
      },
      {
        type: 'scenarios',
        scenarios: [
          {
            title: '"I\'ll use Google Translate — it\'s free"',
            problem: 'Google Translate often mistranslates legal/financial terms, producing documents banks & immigration will reject.',
            solution: 'A professional translation takes 1 day and costs $20. It\'s legally defensible and accepted everywhere.',
          },
          {
            title: '"Can I just get a friend to translate?"',
            problem: 'Unofficial translations aren\'t valid for government/legal use. Banks & immigration require certified translators.',
            solution: 'Certified translation costs $20–35 but is valid everywhere.',
          },
          {
            title: '"I\'m in a hurry — what\'s the fastest option?"',
            problem: 'Standard turnaround is 1–3 days.',
            solution: 'Call before 10 AM, pay 50% rush fee, get it by 5 PM same day.',
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        content: `FAQ`,
      },
      {
        type: 'faq',
        items: [
          { q: "How long does translation typically take?", a: "Standard: 1–3 days. Notarized: 2–5 days. Same-day rush: Submit before 2 PM (+50% fee)." },
          { q: "Do I need certified/notarized translation for everything?", a: "Only for official documents (government, bank, courts). Personal use (understanding a lease) doesn't require it." },
          { q: "Can you translate medical documents?", a: "Yes. Medical terminology is our specialty. Usually same-day for short records." },
          { q: "What if I need interpretation during a meeting?", a: "Yes. $25–30/hour, minimum 2 hours. Let us know location so we can factor in transport." },
          { q: "Do you offer group discounts?", a: "Yes. 3+ documents = 10% discount on standard translation." },
        ],
      },
    ],
  },
}
