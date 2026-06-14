import { HeroSection } from '@/components/HeroSection'
import { TrustBar, TrustBarFallback } from '@/components/TrustBar'
import { ServicesGrid } from '@/components/ServicesGrid'
import { HowItWorks } from '@/components/HowItWorks'
import { ExploreDanang } from '@/components/ExploreDanang'
import { ReviewsSection } from '@/components/ReviewsSection'
import { CtaBanner } from '@/components/CtaBanner'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 86400

async function getStats() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('site_stats').select('*')
    return data || []
  } catch {
    return []
  }
}

async function getReviews() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('status', 'approved')
      .order('sort_order')
    return data || []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [stats, reviews] = await Promise.all([getStats(), getReviews()])

  return (
    <>
      <HeroSection />
      {stats.length > 0 ? <TrustBar stats={stats} /> : <TrustBarFallback />}
      <ServicesGrid />
      <HowItWorks />
      <ExploreDanang />
      <ReviewsSection reviews={reviews} />
      <CtaBanner />
    </>
  )
}
