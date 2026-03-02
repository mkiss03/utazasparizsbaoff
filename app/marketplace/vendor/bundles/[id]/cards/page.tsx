import VendorFlashcardEditor from '@/components/marketplace/vendor/VendorFlashcardEditor'

export default function VendorCardsPage({ params }: { params: { id: string } }) {
  return <VendorFlashcardEditor bundleId={params.id} />
}
