// Cross-party verification for the partner pool/claim system (Phase 1, §9).
// Creates disposable ZZTEST data, asserts RLS isolation + claim semantics,
// then deletes everything. Run: node scripts/verify-partner-rls.mjs
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

// --- load env from .env.local without printing secrets ---
const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split('\n').filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const URL_ = env.NEXT_PUBLIC_SUPABASE_URL
const ANON = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
const SVC = env.SUPABASE_SERVICE_ROLE_KEY

const svc = createClient(URL_, SVC, { auth: { autoRefreshToken: false, persistSession: false } })

let pass = 0, fail = 0
const ok = (name, cond, extra = '') => { (cond ? pass++ : fail++); console.log(`${cond ? '✅' : '❌'} ${name}${extra ? ' — ' + extra : ''}`) }

const PW = 'ZZtest-' + Math.random().toString(36).slice(2, 10)
const emailA = `zztest-a-${Date.now()}@example.com`
const emailB = `zztest-b-${Date.now()}@example.com`
const created = { users: [], partners: [], requests: [], listings: [] }

async function mkPartner(email, name, services) {
  const { data: u, error: ue } = await svc.auth.admin.createUser({ email, password: PW, email_confirm: true })
  if (ue) throw ue
  created.users.push(u.user.id)
  const { data: p, error: pe } = await svc.from('partners').insert({ name, contact_email: email, services }).select().single()
  if (pe) throw pe
  created.partners.push(p.id)
  const { error: pre } = await svc.from('profiles').insert({ user_id: u.user.id, role: 'partner', partner_id: p.id })
  if (pre) throw pre
  const client = createClient(URL_, ANON, { auth: { autoRefreshToken: false, persistSession: false } })
  const { error: se } = await client.auth.signInWithPassword({ email, password: PW })
  if (se) throw se
  return { client, partnerId: p.id }
}

async function main() {
  console.log('\n=== Partner pool/claim cross-party verification ===\n')

  // Setup: two partners; A=airport only, B=airport+housing
  const A = await mkPartner(emailA, 'ZZTEST Partner A', ['airport-transfer'])
  const B = await mkPartner(emailB, 'ZZTEST Partner B', ['airport-transfer', 'housing'])

  // Two pool requests with PII
  const { data: req1 } = await svc.from('service_requests').insert({
    name: 'ZZTEST Customer One', services: ['airport-transfer'], timeline: 'this week',
    details: 'ZZTEST airport pickup', contact_pref: 'whatsapp', contact_value: '+84-ZZTEST-111',
  }).select().single()
  const { data: req2 } = await svc.from('service_requests').insert({
    name: 'ZZTEST Customer Two', services: ['housing'], timeline: 'next month',
    details: 'ZZTEST apartment search', contact_pref: 'email', contact_value: 'zztest2@example.com',
  }).select().single()
  created.requests.push(req1.id, req2.id)

  // T1 — pool eligibility: A sees airport req1, not housing req2
  const { data: poolA } = await A.client.rpc('list_available_requests')
  ok('A pool includes eligible airport request', poolA.some(r => r.id === req1.id))
  ok('A pool excludes ineligible housing request', !poolA.some(r => r.id === req2.id))

  // T2 — pool is anonymized (no PII columns leaked)
  const row = poolA.find(r => r.id === req1.id) || {}
  ok('Pool row carries NO customer name', !('name' in row))
  ok('Pool row carries NO contact_value', !('contact_value' in row))
  ok('Pool row exposes only safe fields', JSON.stringify(Object.keys(row).sort()) ===
    JSON.stringify(['created_at', 'details_preview', 'id', 'services', 'timeline']))

  // T3 — pre-claim base-table isolation: A cannot read unclaimed request directly
  const { data: pre } = await A.client.from('service_requests').select('*').eq('id', req1.id)
  ok('A cannot read unclaimed request via base table (PII hidden pre-claim)', (pre || []).length === 0)

  // T4 — B eligibility on housing req2
  const { data: poolB } = await B.client.rpc('list_available_requests')
  ok('B (housing) sees housing request', poolB.some(r => r.id === req2.id))

  // T5 — claim: A claims req1, now sees full PII
  const { error: claimErr } = await A.client.rpc('claim_request', { p_request_id: req1.id })
  ok('A claim succeeds', !claimErr, claimErr?.message)
  const { data: full } = await A.client.from('service_requests').select('*').eq('id', req1.id).single()
  ok('After claim, A sees full PII (contact_value)', full?.contact_value === '+84-ZZTEST-111')

  // T6 — double-claim race: B (also airport-eligible) cannot claim the same request
  const { error: raceErr } = await B.client.rpc('claim_request', { p_request_id: req1.id })
  ok('Second claimant is rejected (no double-claim)', !!raceErr, raceErr?.message)

  // T7 — post-claim cross-partner isolation: B cannot see A's claimed request at all
  const { data: bSees } = await B.client.from('service_requests').select('*').eq('id', req1.id)
  ok('B cannot read A\'s claimed request', (bSees || []).length === 0)
  const { data: poolB2 } = await B.client.rpc('list_available_requests')
  ok('Claimed request leaves the pool', !poolB2.some(r => r.id === req1.id))

  // T8 — release returns it to the pool
  await A.client.rpc('release_request', { p_request_id: req1.id })
  const { data: poolBack } = await A.client.rpc('list_available_requests')
  ok('Released request returns to pool', poolBack.some(r => r.id === req1.id))

  // T9 — listing moderation privacy: submitted listing is NOT public
  const { data: lst } = await A.client.from('listings').insert({
    service_slug: 'airport-transfer', title: 'ZZTEST listing', price: '$10',
    partner_id: A.partnerId, status: 'submitted', active: true, verified: false,
  }).select().single()
  created.listings.push(lst.id)
  const anon = createClient(URL_, ANON, { auth: { persistSession: false } })
  const { data: pubSubmitted } = await anon.from('listings').select('*').eq('id', lst.id)
  ok('Submitted listing is hidden from public', (pubSubmitted || []).length === 0)
  await svc.from('listings').update({ status: 'approved' }).eq('id', lst.id)
  const { data: pubApproved } = await anon.from('listings').select('*').eq('id', lst.id)
  ok('Approved listing becomes public', (pubApproved || []).length === 1)

  // T10 — partner cannot read another partner's row
  const { data: bRow } = await A.client.from('partners').select('*').eq('id', B.partnerId)
  ok('A cannot read B\'s partner record', (bRow || []).length === 0)
}

async function cleanup() {
  for (const id of created.listings) await svc.from('listings').delete().eq('id', id)
  for (const id of created.requests) await svc.from('request_events').delete().eq('request_id', id)
  for (const id of created.requests) await svc.from('service_requests').delete().eq('id', id)
  for (const uid of created.users) await svc.from('profiles').delete().eq('user_id', uid)
  for (const id of created.partners) await svc.from('partners').delete().eq('id', id)
  for (const uid of created.users) await svc.auth.admin.deleteUser(uid)
}

main()
  .catch(e => { console.error('\n💥 Test run error:', e.message); fail++ })
  .finally(async () => {
    await cleanup().catch(e => console.error('cleanup error:', e.message))
    console.log(`\n=== ${pass} passed, ${fail} failed — test data cleaned up ===\n`)
    process.exit(fail ? 1 : 0)
  })
