'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useUserRole } from '@/lib/hooks/useUserRole'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import FlipCard from '@/components/FlipCard'
import {
  Plus,
  Save,
  X,
  Trash2,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Eye,
  Sparkles
} from 'lucide-react'
import type { Bundle, Flashcard } from '@/lib/types/database'
import Link from 'next/link'

interface FlashcardEditorProps {
  params: { id: string }
}

export default function FlashcardEditor({ params }: FlashcardEditorProps) {
  const bundleId = params.id
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { userId, isSuperAdmin } = useUserRole()
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [previewCard, setPreviewCard] = useState<Flashcard | null>(null)
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    hint: '',
    image_url: '',
    is_demo: false,
  })

  // Fetch bundle details
  const { data: bundle } = useQuery({
    queryKey: ['bundle', bundleId],
    queryFn: async () => {
      const { data } = await supabase
        .from('bundles')
        .select('*')
        .eq('id', bundleId)
        .single()
      return data as Bundle
    },
  })

  // Fetch flashcards
  const { data: flashcards, isLoading } = useQuery({
    queryKey: ['flashcards', bundleId],
    queryFn: async () => {
      const { data } = await supabase
        .from('flashcards')
        .select('*')
        .eq('bundle_id', bundleId)
        .order('card_order', { ascending: true })
      return data as Flashcard[]
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('flashcards').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards', bundleId] })
    },
  })

  const saveMutation = useMutation({
    mutationFn: async ({ id, data }: { id?: string; data: typeof formData }) => {
      // Prepare data - only send non-empty fields and ensure is_demo is boolean
      const preparedData = {
        question: data.question,
        answer: data.answer,
        hint: data.hint || null,
        image_url: data.image_url || null,
        is_demo: Boolean(data.is_demo),
      }

      if (id) {
        // Update existing
        const { error } = await supabase
          .from('flashcards')
          .update(preparedData)
          .eq('id', id)
        if (error) throw error
      } else {
        // Create new - set card_order to max + 1
        const maxOrder = flashcards?.reduce((max, card) => Math.max(max, card.card_order), -1) ?? -1
        const { error } = await supabase
          .from('flashcards')
          .insert({
            ...preparedData,
            bundle_id: bundleId,
            card_order: maxOrder + 1,
          })
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards', bundleId] })
      setIsCreating(false)
      setEditingId(null)
      resetForm()
    },
  })

  const reorderMutation = useMutation({
    mutationFn: async ({ id, newOrder }: { id: string; newOrder: number }) => {
      const { error } = await supabase
        .from('flashcards')
        .update({ card_order: newOrder })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards', bundleId] })
    },
  })

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      hint: '',
      image_url: '',
      is_demo: false,
    })
  }

  const handleEdit = (card: Flashcard) => {
    setEditingId(card.id)
    setFormData({
      question: card.question,
      answer: card.answer,
      hint: card.hint || '',
      image_url: card.image_url || '',
      is_demo: card.is_demo || false,
    })
  }

  const handleSave = (id?: string) => {
    saveMutation.mutate({ id, data: formData })
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingId(null)
    resetForm()
  }

  const handleMoveUp = (card: Flashcard, index: number) => {
    if (index === 0 || !flashcards) return
    const prevCard = flashcards[index - 1]
    reorderMutation.mutate({ id: card.id, newOrder: prevCard.card_order })
    reorderMutation.mutate({ id: prevCard.id, newOrder: card.card_order })
  }

  const handleMoveDown = (card: Flashcard, index: number) => {
    if (!flashcards || index === flashcards.length - 1) return
    const nextCard = flashcards[index + 1]
    reorderMutation.mutate({ id: card.id, newOrder: nextCard.card_order })
    reorderMutation.mutate({ id: nextCard.id, newOrder: card.card_order })
  }

  const handlePreview = (card: Flashcard) => {
    setPreviewCard(card)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('discover-images')
      .upload(filePath, file)

    if (uploadError) {
      alert('Error uploading image')
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('discover-images')
      .getPublicUrl(filePath)

    setFormData(prev => ({ ...prev, image_url: publicUrl }))
  }

  // Check if user is authorized
  const isAuthorized = isSuperAdmin || (bundle && bundle.author_id === userId)

  if (!isAuthorized && bundle) {
    return (
      <div className="p-8">
        <Card className="border-french-red-200">
          <CardContent className="p-12 text-center">
            <h2 className="text-xl font-bold text-french-red-500">Hozzáférés megtagadva</h2>
            <p className="mt-2 text-slate-600">Nincs jogosultságod ennek a csomagnak a szerkesztéséhez.</p>
            <Link href="/admin/bundles">
              <Button className="mt-4 bg-french-blue-500 hover:bg-french-blue-600">
                Vissza a csomagokhoz
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/bundles">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Vissza a csomagokhoz
          </Button>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-playfair text-3xl font-bold text-french-blue-500">
              {bundle?.title}
            </h1>
            <p className="mt-2 text-slate-600">
              Flashcard kártyák kezelése ({flashcards?.length || 0} kártya)
            </p>
          </div>
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-french-red-500 hover:bg-french-red-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Új kártya
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Card List & Form */}
        <div className="space-y-6">
          {/* Create/Edit Form */}
          {(isCreating || editingId) && (
            <Card className="border-french-blue-200">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-french-blue-500">
                    {editingId ? 'Kártya szerkesztése' : 'Új kártya'}
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSave(editingId || undefined)}
                      disabled={saveMutation.isPending}
                      className="bg-french-red-500 hover:bg-french-red-600"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Mentés
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel}>
                      <X className="mr-2 h-4 w-4" />
                      Mégse
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Kérdés *
                    </label>
                    <Textarea
                      value={formData.question}
                      onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                      rows={3}
                      placeholder="Mi a fővárosa Franciaországnak?"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Válasz *
                    </label>
                    <Textarea
                      value={formData.answer}
                      onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                      rows={3}
                      placeholder="Párizs Franciaország fővárosa..."
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Tipp (opcionális)
                    </label>
                    <Input
                      value={formData.hint}
                      onChange={(e) => setFormData(prev => ({ ...prev, hint: e.target.value }))}
                      placeholder="Gondolj az Eiffel-toronyra..."
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Kép feltöltés (opcionális)
                    </label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_demo"
                      checked={formData.is_demo}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_demo: e.target.checked }))}
                      className="h-4 w-4 rounded border-slate-300 text-french-red-500"
                    />
                    <label htmlFor="is_demo" className="text-sm font-medium text-slate-700">
                      Ez egy demo kártya (publikusan megjeleníthető)
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cards List */}
          {flashcards && flashcards.length > 0 ? (
            <div className="space-y-3">
              {flashcards.map((card, index) => (
                <Card key={card.id} className="border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Order Controls */}
                      <div className="flex flex-col gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMoveUp(card, index)}
                          disabled={index === 0}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <span className="text-center text-xs font-semibold text-slate-500">
                          {index + 1}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMoveDown(card, index)}
                          disabled={index === flashcards.length - 1}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="mb-2">
                          <p className="text-sm font-semibold text-french-blue-500">
                            Q: {card.question}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            A: {card.answer}
                          </p>
                          {card.hint && (
                            <p className="mt-1 text-xs italic text-slate-400">
                              Tipp: {card.hint}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePreview(card)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleEdit(card)}
                          className="bg-french-blue-500 hover:bg-french-blue-600"
                        >
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            if (confirm('Biztosan törli ezt a kártyát?')) {
                              deleteMutation.mutate(card.id)
                            }
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Sparkles className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="mt-4 font-semibold text-slate-500">
                  Még nincs kártya
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Hozz létre az első flashcard kártyát!
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Live Preview */}
        <div className="sticky top-8">
          <Card className="border-french-blue-200">
            <CardContent className="p-6">
              <h3 className="mb-4 font-semibold text-french-blue-500">
                <Eye className="mr-2 inline h-4 w-4" />
                Előnézet
              </h3>

              {previewCard ? (
                <FlipCard flashcard={previewCard} isLocked={false} />
              ) : flashcards && flashcards.length > 0 ? (
                <FlipCard flashcard={flashcards[0]} isLocked={false} />
              ) : (
                <div className="flex h-96 items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50">
                  <p className="text-slate-400">Nincs megjeleníthető kártya</p>
                </div>
              )}

              {previewCard && (
                <Button
                  onClick={() => setPreviewCard(null)}
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full"
                >
                  Első kártya visszaállítása
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
