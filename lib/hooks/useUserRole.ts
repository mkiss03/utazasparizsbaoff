'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { UserRole } from '@/lib/types/database'

export function useUserRole() {
  const [role, setRole] = useState<UserRole | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserRole = async () => {
      const supabase = createClient()

      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          setRole(null)
          setUserId(null)
          setIsLoading(false)
          return
        }

        setUserId(user.id)

        // Get user profile with role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, is_approved')
          .eq('id', user.id)
          .single()

        if (profile) {
          setRole(profile.role as UserRole)
        }
      } catch (error) {
        console.error('Error fetching user role:', error)
        setRole(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserRole()
  }, [])

  return {
    role,
    userId,
    isLoading,
    isSuperAdmin: role === 'super_admin',
    isVendor: role === 'vendor',
    isCustomer: role === 'customer',
  }
}
