import { getMenuSettings } from '@/app/actions/menu'
import Navigation from './Navigation'

export default async function NavigationWrapper() {
  // Fallback to all-active defaults if DB table doesn't exist yet
  const menuSettings = await getMenuSettings().catch(() => [])
  return <Navigation menuSettings={menuSettings} />
}
