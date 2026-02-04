'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Save, Plus, Trash2, Check, XCircle, Map } from 'lucide-react'

interface MapFlashcardContent {
  id: string
  point_id: string
  point_title: string
  flip_front: string
  flip_back: string
  pros: string[]
  cons: string[]
  usage: string[]
  tip: string
}

export default function MapContentPage() {
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<MapFlashcardContent>>({})
  const supabase = createClient()
  const queryClient = useQueryClient()

  const { data: mapContents, isLoading } = useQuery({
    queryKey: ['map-flashcard-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('map_flashcard_content')
        .select('*')
        .order('point_id')

      if (error) throw error
      return data as MapFlashcardContent[]
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (content: Partial<MapFlashcardContent>) => {
      const { error } = await supabase
        .from('map_flashcard_content')
        .upsert({
          point_id: content.point_id,
          point_title: content.point_title,
          flip_front: content.flip_front,
          flip_back: content.flip_back,
          pros: content.pros,
          cons: content.cons,
          usage: content.usage,
          tip: content.tip,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'point_id'
        })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['map-flashcard-content'] })
      alert('✅ Sikeresen mentve!')
      setSelectedPoint(null)
      setFormData({})
    },
    onError: (error) => {
      alert('❌ Hiba történt: ' + error.message)
    }
  })

  const handleEdit = (content: MapFlashcardContent) => {
    setSelectedPoint(content.point_id)
    setFormData(content)
  }

  const handleSave = () => {
    if (!formData.point_id || !formData.point_title || !formData.flip_front ||
        !formData.flip_back || !formData.tip) {
      alert('Kérlek töltsd ki az összes kötelező mezőt!')
      return
    }

    saveMutation.mutate(formData)
  }

  const handleCancel = () => {
    setSelectedPoint(null)
    setFormData({})
  }

  const addArrayItem = (field: 'pros' | 'cons' | 'usage') => {
    const current = formData[field] || []
    setFormData({
      ...formData,
      [field]: [...current, '']
    })
  }

  const updateArrayItem = (field: 'pros' | 'cons' | 'usage', index: number, value: string) => {
    const current = [...(formData[field] || [])]
    current[index] = value
    setFormData({
      ...formData,
      [field]: current
    })
  }

  const removeArrayItem = (field: 'pros' | 'cons' | 'usage', index: number) => {
    const current = [...(formData[field] || [])]
    current.splice(index, 1)
    setFormData({
      ...formData,
      [field]: current
    })
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-lg">Betöltés...</div>
    </div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-4xl font-bold text-navy-500 flex items-center gap-3">
            <Map className="w-10 h-10 text-french-blue-500" />
            Térkép Flashcard Tartalom
          </h1>
          <p className="text-parisian-grey-600 mt-2">
            Szerkeszd a térkép modal ablakokban megjelenő 4-kártyás tartalmat
          </p>
        </div>
      </div>

      {/* Existing Points List */}
      {!selectedPoint && (
        <div className="grid gap-4 md:grid-cols-2">
          {mapContents?.map((content) => (
            <Card key={content.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{content.point_title}</span>
                  <Badge variant="secondary">{content.point_id}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-parisian-grey-600 mb-4">
                  {content.flip_front}
                </p>
                <div className="flex gap-2">
                  <Badge className="bg-green-100 text-green-700">
                    <Check className="w-3 h-3 mr-1" />
                    {content.pros?.length || 0} előny
                  </Badge>
                  <Badge className="bg-red-100 text-red-700">
                    <XCircle className="w-3 h-3 mr-1" />
                    {content.cons?.length || 0} hátrány
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-700">
                    {content.usage?.length || 0} lépés
                  </Badge>
                </div>
                <Button
                  onClick={() => handleEdit(content)}
                  className="w-full mt-4"
                  variant="secondary"
                >
                  Szerkesztés
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Form */}
      {selectedPoint && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {formData.point_title || 'Új térkép pont'} szerkesztése
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={saveMutation.isPending}
                  variant="default"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saveMutation.isPending ? 'Mentés...' : 'Mentés'}
                </Button>
                <Button onClick={handleCancel} variant="outline">
                  Mégse
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Basic Info */}
            <div className="space-y-4 p-4 rounded-lg border-2 border-french-blue-200 bg-french-blue-50">
              <h3 className="font-semibold text-lg text-french-blue-900">
                Alapadatok
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="point_id">Point ID (pl: point-1) *</Label>
                  <Input
                    id="point_id"
                    value={formData.point_id || ''}
                    onChange={(e) => setFormData({ ...formData, point_id: e.target.value })}
                    placeholder="point-1"
                    disabled={!!mapContents?.find(c => c.point_id === formData.point_id)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="point_title">Pont címe *</Label>
                  <Input
                    id="point_title"
                    value={formData.point_title || ''}
                    onChange={(e) => setFormData({ ...formData, point_title: e.target.value })}
                    placeholder="Metróvonalak"
                  />
                </div>
              </div>
            </div>

            {/* Card 1: Flip Card */}
            <div className="space-y-4 p-4 rounded-lg border-2 border-french-blue-200 bg-gradient-to-br from-french-blue-50 to-white">
              <h3 className="font-semibold text-lg text-french-blue-900">
                🔄 Kártya 1: A Koncepció (Flip Card)
              </h3>
              <div className="space-y-2">
                <Label htmlFor="flip_front">Előlap (kérdés) *</Label>
                <Input
                  id="flip_front"
                  value={formData.flip_front || ''}
                  onChange={(e) => setFormData({ ...formData, flip_front: e.target.value })}
                  placeholder="Miért olyan király a párizsi metró?"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="flip_back">Hátlap (válasz) *</Label>
                <Textarea
                  id="flip_back"
                  value={formData.flip_back || ''}
                  onChange={(e) => setFormData({ ...formData, flip_back: e.target.value })}
                  rows={4}
                  placeholder="A párizsi metró 16 vonallal..."
                />
              </div>
            </div>

            {/* Card 2: Pros */}
            <div className="space-y-4 p-4 rounded-lg border-2 border-green-200 bg-green-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-green-900">
                  ✅ Kártya 2a: Előnyök
                </h3>
                <Button
                  onClick={() => addArrayItem('pros')}
                  size="sm"
                  variant="outline"
                  className="border-green-300"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Új előny
                </Button>
              </div>
              <div className="space-y-2">
                {(formData.pros || []).map((pro, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={pro}
                      onChange={(e) => updateArrayItem('pros', idx, e.target.value)}
                      placeholder={`Előny ${idx + 1}`}
                    />
                    <Button
                      onClick={() => removeArrayItem('pros', idx)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {(!formData.pros || formData.pros.length === 0) && (
                  <p className="text-sm text-parisian-grey-500 italic">
                    Még nincs előny hozzáadva. Kattints a "Új előny" gombra!
                  </p>
                )}
              </div>
            </div>

            {/* Card 2: Cons */}
            <div className="space-y-4 p-4 rounded-lg border-2 border-red-200 bg-red-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-red-900">
                  ❌ Kártya 2b: Hátrányok / Mikor nem ajánlott
                </h3>
                <Button
                  onClick={() => addArrayItem('cons')}
                  size="sm"
                  variant="outline"
                  className="border-red-300"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Új hátrány
                </Button>
              </div>
              <div className="space-y-2">
                {(formData.cons || []).map((con, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={con}
                      onChange={(e) => updateArrayItem('cons', idx, e.target.value)}
                      placeholder={`Hátrány ${idx + 1}`}
                    />
                    <Button
                      onClick={() => removeArrayItem('cons', idx)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {(!formData.cons || formData.cons.length === 0) && (
                  <p className="text-sm text-parisian-grey-500 italic">
                    Még nincs hátrány hozzáadva. Kattints a "Új hátrány" gombra!
                  </p>
                )}
              </div>
            </div>

            {/* Card 3: Usage */}
            <div className="space-y-4 p-4 rounded-lg border-2 border-purple-200 bg-purple-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-purple-900">
                  🛠️ Kártya 3: Hogyan használd
                </h3>
                <Button
                  onClick={() => addArrayItem('usage')}
                  size="sm"
                  variant="outline"
                  className="border-purple-300"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Új lépés
                </Button>
              </div>
              <div className="space-y-2">
                {(formData.usage || []).map((step, idx) => (
                  <div key={idx} className="flex gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-200 text-purple-900 font-bold text-sm flex-shrink-0 mt-2">
                      {idx + 1}
                    </div>
                    <Input
                      value={step}
                      onChange={(e) => updateArrayItem('usage', idx, e.target.value)}
                      placeholder={`🎫 Lépés ${idx + 1} (használhatsz emoji-t!)`}
                    />
                    <Button
                      onClick={() => removeArrayItem('usage', idx)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {(!formData.usage || formData.usage.length === 0) && (
                  <p className="text-sm text-parisian-grey-500 italic">
                    Még nincs lépés hozzáadva. Kattints a "Új lépés" gombra!
                  </p>
                )}
              </div>
            </div>

            {/* Card 4: Tip */}
            <div className="space-y-4 p-4 rounded-lg border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50">
              <h3 className="font-semibold text-lg text-yellow-900">
                💡 Kártya 4: Viktória Titkos Tippje
              </h3>
              <div className="space-y-2">
                <Label htmlFor="tip">Személyes tipp / Insider információ *</Label>
                <Textarea
                  id="tip"
                  value={formData.tip || ''}
                  onChange={(e) => setFormData({ ...formData, tip: e.target.value })}
                  rows={4}
                  placeholder="Viktória titkos tippje: Töltsd le a Citymapper appot..."
                  className="italic"
                />
                <p className="text-xs text-parisian-grey-500">
                  💡 Ez jelenik meg a sárga kártyán, italic betűtípussal
                </p>
              </div>
            </div>

            {/* Save Button (bottom) */}
            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button onClick={handleCancel} variant="outline">
                Mégse
              </Button>
              <Button
                onClick={handleSave}
                disabled={saveMutation.isPending}
                size="lg"
              >
                <Save className="mr-2 h-5 w-5" />
                {saveMutation.isPending ? 'Mentés...' : 'Mentés és Bezárás'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
