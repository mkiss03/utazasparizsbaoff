'use client'

import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save } from 'lucide-react'
import type { Profile } from '@/lib/types/database'

export default function ContentPage() {
  const [profile, setProfile] = useState<Partial<Profile>>({})
  const supabase = createClient()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await supabase.from('profile').select('*').single()
      return data as Profile
    },
  })

  useEffect(() => {
    if (data) {
      setProfile(data)
    }
  }, [data])

  const saveMutation = useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      const { data: existing } = await supabase.from('profile').select('id').single()

      if (existing) {
        const { error } = await supabase
          .from('profile')
          .update(updates)
          .eq('id', existing.id)
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      alert('Tartalom sikeresen mentve!')
    },
  })

  const handleSave = () => {
    saveMutation.mutate(profile)
  }

  const handleHeroBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // File size validation (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert('A kép mérete maximum 2MB lehet')
      return
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `hero-bg-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(fileName, file)

    if (uploadError) {
      alert('Hiba a kép feltöltésekor: ' + uploadError.message)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(fileName)

    setProfile({ ...profile, hero_background_image: publicUrl })
  }

  const handleAboutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // File size validation (1MB max)
    if (file.size > 1024 * 1024) {
      alert('A kép mérete maximum 1MB lehet')
      return
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `about-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(fileName, file)

    if (uploadError) {
      alert('Hiba a kép feltöltésekor: ' + uploadError.message)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(fileName)

    setProfile({ ...profile, about_image: publicUrl })
  }

  if (isLoading) {
    return <div>Betöltés...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-playfair text-4xl font-bold text-navy-500">
          Tartalom szerkesztése
        </h1>
        <Button onClick={handleSave} variant="secondary" disabled={saveMutation.isPending}>
          <Save className="mr-2 h-4 w-4" />
          {saveMutation.isPending ? 'Mentés...' : 'Mentés'}
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Hero Szekció</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hero_title">Főcím</Label>
              <Input
                id="hero_title"
                value={profile.hero_title || ''}
                onChange={(e) =>
                  setProfile({ ...profile, hero_title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero_subtitle">Alcím</Label>
              <Textarea
                id="hero_subtitle"
                value={profile.hero_subtitle || ''}
                onChange={(e) =>
                  setProfile({ ...profile, hero_subtitle: e.target.value })
                }
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero_cta_text">Gomb szövege</Label>
              <Input
                id="hero_cta_text"
                value={profile.hero_cta_text || ''}
                onChange={(e) =>
                  setProfile({ ...profile, hero_cta_text: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero_bg_upload">Háttérkép</Label>
              {profile.hero_background_image && (
                <div className="mb-3">
                  <img
                    src={profile.hero_background_image}
                    alt="Hero háttér előnézet"
                    className="h-48 w-full rounded-lg object-cover"
                  />
                </div>
              )}
              <input
                type="file"
                id="hero_bg_upload"
                accept="image/*"
                onChange={handleHeroBackgroundUpload}
                className="w-full text-sm"
              />
              <p className="text-sm text-slate-500">
                Ajánlott méret: 1920x1080px, max. 2MB
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rólam Szekció</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="about_title">Cím</Label>
              <Input
                id="about_title"
                value={profile.about_title || ''}
                onChange={(e) =>
                  setProfile({ ...profile, about_title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="about_description">Leírás</Label>
              <Textarea
                id="about_description"
                value={profile.about_description || ''}
                onChange={(e) =>
                  setProfile({ ...profile, about_description: e.target.value })
                }
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="about_img_upload">Profilkép</Label>
              {profile.about_image && (
                <div className="mb-3">
                  <img
                    src={profile.about_image}
                    alt="Rólam kép előnézet"
                    className="h-64 w-64 rounded-lg object-cover"
                  />
                </div>
              )}
              <input
                type="file"
                id="about_img_upload"
                accept="image/*"
                onChange={handleAboutImageUpload}
                className="w-full text-sm"
              />
              <p className="text-sm text-slate-500">
                Ajánlott méret: 800x800px, max. 1MB
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kapcsolat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact_email">Email cím</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={profile.contact_email || ''}
                  onChange={(e) =>
                    setProfile({ ...profile, contact_email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Telefonszám</Label>
                <Input
                  id="contact_phone"
                  value={profile.contact_phone || ''}
                  onChange={(e) =>
                    setProfile({ ...profile, contact_phone: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_whatsapp">WhatsApp szám</Label>
              <Input
                id="contact_whatsapp"
                value={profile.contact_whatsapp || ''}
                onChange={(e) =>
                  setProfile({ ...profile, contact_whatsapp: e.target.value })
                }
                placeholder="+33612345678"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Newsletter Szekció</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newsletter_title">Főcím</Label>
              <Input
                id="newsletter_title"
                value={profile.newsletter_title || ''}
                onChange={(e) =>
                  setProfile({ ...profile, newsletter_title: e.target.value })
                }
                placeholder="Maradjon Kapcsolatban"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newsletter_description">Leírás</Label>
              <Textarea
                id="newsletter_description"
                value={profile.newsletter_description || ''}
                onChange={(e) =>
                  setProfile({ ...profile, newsletter_description: e.target.value })
                }
                rows={3}
                placeholder="Iratkozzon fel, hogy ne maradjon le..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newsletter_cta">Gomb szövege</Label>
              <Input
                id="newsletter_cta"
                value={profile.newsletter_cta || ''}
                onChange={(e) =>
                  setProfile({ ...profile, newsletter_cta: e.target.value })
                }
                placeholder="Feliratkozom"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
