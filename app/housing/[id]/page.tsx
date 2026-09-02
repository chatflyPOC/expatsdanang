import { permanentRedirect } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

/**
 * Legacy path. Listings now live at /rentals/[id]; this stays as a permanent
 * (308) redirect so existing inbound links and any indexed URLs pass their
 * signals on rather than being treated as temporary.
 */
export default async function HousingDetailRedirect({ params }: Props) {
  const { id } = await params
  permanentRedirect(`/rentals/${id}`)
}
