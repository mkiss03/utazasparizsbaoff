'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUserRole } from '@/lib/hooks/useUserRole'
import { Loader2, Plus, Trash2, Save, ArrowUp, ArrowDown, X, AlertCircle } from 'lucide-react'
import type { Flashcard } from '@/lib/types/database'

interface VendorFlashcardEditorProps {
  bundleId: string
}

export default function VendorFlashcardEditor({ bundleId }: VendorFlashcardEditorProps) {
  const { userId } = useUserRole()
  const [loading, setLoading] = useState(true)
  const [cards, setCards] = useState<Flashcard[]>([])
  const [bundleTitle, setBundleTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ question: '', answer: '', hint: '', is_demo: false })

  useEffect(() => {
    if (!userId) return
    const fetchData = async () => {
      const supabase = createClient()

      // Fetch bundle
      const { data: bundle } = await supabase
        .from('bundles')
        .select('title')
        .eq('id', bundleId)
        .eq('author_id', userId)
        .single()

      if (bundle) setBundleTitle(bundle.title)

      // Fetch cards
      const { data: cardsData } = await supabase
        .from('flashcards')
        .select('*')
        .eq('bundle_id', bundleId)
        .order('card_order', { ascending: true })

      if (cardsData) setCards(cardsData as Flashcard[])
      setLoading(false)
    }
    fetchData()
  }, [bundleId, userId])

  const handleAddCard = async () => {
    if (!form.question.trim() || !form.answer.trim()) return
    setSaving(true)
    setError(null)

    const supabase = createClient()
    const newOrder = cards.length

    if (editingId) {
      // Update
      const { error: updateError } = await supabase
        .from('flashcards')
        .update({
          question: form.question,
          answer: form.answer,
          hint: form.hint || null,
          is_demo: form.is_demo,
        })
        .eq('id', editingId)

      if (updateError) {
        setError(updateError.message)
      } else {
        setCards((prev) =>
          prev.map((c) =>
            c.id === editingId
              ? { ...c, question: form.question, answer: form.answer, hint: form.hint || undefined, is_demo: form.is_demo }
              : c
          )
        )
        setEditingId(null)
        setForm({ question: '', answer: '', hint: '', is_demo: false })
      }
    } else {
      // Insert
      const { data, error: insertError } = await supabase
        .from('flashcards')
        .insert({
          bundle_id: bundleId,
          question: form.question,
          answer: form.answer,
          hint: form.hint || null,
          is_demo: form.is_demo,
          card_order: newOrder,
        })
        .select()
        .single()

      if (insertError) {
        setError(insertError.message)
      } else if (data) {
        setCards((prev) => [...prev, data as Flashcard])
        setForm({ question: '', answer: '', hint: '', is_demo: false })

        // Advance onboarding if at step 3 and now has 5+ cards
        if (cards.length + 1 >= 5) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('onboarding_step')
            .eq('id', userId!)
            .single()

          if (profile?.onboarding_step === 3) {
            // Don't advance automatically, let them submit manually
          }
        }
      }
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('flashcards').delete().eq('id', id)
    if (!error) {
      setCards((prev) => prev.filter((c) => c.id !== id))
    }
  }

  const handleMoveUp = async (index: number) => {
    if (index === 0) return
    const supabase = createClient()
    const updated = [...cards]
    ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
    setCards(updated)

    // Update orders in DB
    await supabase.from('flashcards').update({ card_order: index - 1 }).eq('id', updated[index - 1].id)
    await supabase.from('flashcards').update({ card_order: index }).eq('id', updated[index].id)
  }

  const handleMoveDown = async (index: number) => {
    if (index === cards.length - 1) return
    const supabase = createClient()
    const updated = [...cards]
    ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
    setCards(updated)

    await supabase.from('flashcards').update({ card_order: index }).eq('id', updated[index].id)
    await supabase.from('flashcards').update({ card_order: index + 1 }).eq('id', updated[index + 1].id)
  }

  const startEditing = (card: Flashcard) => {
    setEditingId(card.id)
    setForm({
      question: card.question,
      answer: card.answer,
      hint: card.hint || '',
      is_demo: card.is_demo,
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl font-bold text-slate-900">Kártyák szerkesztése</h1>
      <p className="mt-1 text-sm text-slate-500 mb-6">
        {bundleTitle} — {cards.length} kártya
      </p>

      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 mb-4">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Card list */}
      <div className="space-y-2 mb-6">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`rounded-lg border bg-white px-4 py-3 ${
              editingId === card.id ? 'border-slate-400 ring-1 ring-slate-400' : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0" onClick={() => startEditing(card)} role="button">
                <p className="text-sm font-medium text-slate-800 truncate">{card.question}</p>
                <p className="text-xs text-slate-500 truncate mt-0.5">{card.answer}</p>
                {card.is_demo && (
                  <span className="inline-block mt-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                    Demo
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === cards.length - 1}
                  className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(card.id)}
                  className="p-1 text-red-400 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit form */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
        <p className="text-sm font-semibold text-slate-700">
          {editingId ? 'Kártya szerkesztése' : 'Új kártya hozzáadása'}
        </p>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Kérdés</label>
          <input
            type="text"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none"
            placeholder="Mi a kérdés?"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Válasz</label>
          <textarea
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
            rows={2}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none resize-none"
            placeholder="Mi a válasz?"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Tipp (opcionális)</label>
          <input
            type="text"
            value={form.hint}
            onChange={(e) => setForm({ ...form, hint: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none"
            placeholder="Segítség a válaszhoz..."
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={form.is_demo}
            onChange={(e) => setForm({ ...form, is_demo: e.target.checked })}
            className="rounded border-slate-300"
          />
          Demo kártya (mindenki láthatja)
        </label>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddCard}
            disabled={saving || !form.question.trim() || !form.answer.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60 transition-colors"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : editingId ? (
              <Save className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {editingId ? 'Mentés' : 'Hozzáadás'}
          </button>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null)
                setForm({ question: '', answer: '', hint: '', is_demo: false })
              }}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <X className="h-4 w-4" />
              Mégse
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
