import { redirect } from 'next/navigation'

export default function ParisFlashcardsPage() {
  redirect('/marketplace?city=Paris')
}
