import VendorBundleForm from '@/components/marketplace/vendor/VendorBundleForm'

export default function EditBundlePage({ params }: { params: { id: string } }) {
  return <VendorBundleForm bundleId={params.id} />
}
