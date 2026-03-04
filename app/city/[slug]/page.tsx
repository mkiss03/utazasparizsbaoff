import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function CityPage({ params }: Props) {
  const { slug } = await params
  const cityName = slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase()
  redirect(`/marketplace?city=${encodeURIComponent(cityName)}`)
}
