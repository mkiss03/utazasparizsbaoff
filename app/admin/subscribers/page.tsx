'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mail, User, Calendar, Check, X, Plus, Pencil, Trash2, Save } from 'lucide-react'
import type { NewsletterSubscriber } from '@/lib/types/database'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const [newEmail, setNewEmail] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editEmail, setEditEmail] = useState('')
  const [editError, setEditError] = useState<string | null>(null)

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching subscribers:', error)
    } else {
      setSubscribers(data || [])
    }
    setIsLoading(false)
  }

  const toggleSubscriberStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ is_active: !currentStatus })
      .eq('id', id)

    if (error) {
      console.error('Error updating subscriber:', error)
      alert('Hiba történt a státusz frissítése során')
    } else {
      await fetchSubscribers()
    }
  }

  const handleAddSubscriber = async () => {
    const email = newEmail.trim().toLowerCase()
    setAddError(null)

    if (!EMAIL_REGEX.test(email)) {
      setAddError('Adj meg egy érvényes email címet.')
      return
    }

    setIsAdding(true)
    const { error } = await supabase.from('newsletter_subscribers').insert({ email, is_active: true })
    setIsAdding(false)

    if (error) {
      setAddError(error.code === '23505' ? 'Ez az email cím már szerepel a listában.' : 'Hiba történt a hozzáadás során.')
      return
    }

    setNewEmail('')
    await fetchSubscribers()
  }

  const startEdit = (subscriber: NewsletterSubscriber) => {
    setEditingId(subscriber.id)
    setEditEmail(subscriber.email)
    setEditError(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditEmail('')
    setEditError(null)
  }

  const saveEdit = async (id: string) => {
    const email = editEmail.trim().toLowerCase()
    if (!EMAIL_REGEX.test(email)) {
      setEditError('Adj meg egy érvényes email címet.')
      return
    }

    const { error } = await supabase.from('newsletter_subscribers').update({ email }).eq('id', id)

    if (error) {
      setEditError(error.code === '23505' ? 'Ez az email cím már szerepel a listában.' : 'Hiba történt a mentés során.')
      return
    }

    cancelEdit()
    await fetchSubscribers()
  }

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Biztosan törlöd ezt a feliratkozót?\n\n${email}`)) return

    const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id)

    if (error) {
      console.error('Error deleting subscriber:', error)
      alert('Hiba történt a törlés során')
    } else {
      await fetchSubscribers()
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const activeSubscribers = subscribers.filter(s => s.is_active)
  const inactiveSubscribers = subscribers.filter(s => !s.is_active)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-parisian-beige-200 border-t-parisian-beige-500" />
          <p className="mt-4 text-parisian-grey-600">Betöltés...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 font-playfair text-4xl font-bold text-parisian-grey-800">
          Hírlevél feliratkozók
        </h1>
        <p className="text-lg text-parisian-grey-600">
          {subscribers.length} feliratkozó összesen ({activeSubscribers.length} aktív, {inactiveSubscribers.length} inaktív)
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Összes feliratkozó</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscribers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktív feliratkozók</CardTitle>
            <Check className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeSubscribers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inaktív feliratkozók</CardTitle>
            <X className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{inactiveSubscribers.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Manual add */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Feliratkozó manuális hozzáadása
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-start gap-3">
            <div className="flex-1 min-w-[240px]">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => {
                  setNewEmail(e.target.value)
                  setAddError(null)
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSubscriber()}
                placeholder="pelda@email.hu"
                className="w-full rounded-lg border-2 border-parisian-beige-200 px-4 py-2.5 font-montserrat text-sm outline-none focus:border-parisian-beige-400"
              />
              {addError && <p className="mt-1.5 font-montserrat text-xs text-red-600">{addError}</p>}
            </div>
            <button
              onClick={handleAddSubscriber}
              disabled={isAdding || !newEmail.trim()}
              className="rounded-lg bg-parisian-beige-400 px-5 py-2.5 font-montserrat text-sm font-semibold text-white transition-colors hover:bg-parisian-beige-500 disabled:opacity-50"
            >
              {isAdding ? 'Hozzáadás...' : 'Hozzáadás'}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Subscribers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Feliratkozók listája</CardTitle>
        </CardHeader>
        <CardContent>
          {subscribers.length === 0 ? (
            <div className="py-12 text-center text-parisian-grey-600">
              <Mail className="mx-auto mb-4 h-12 w-12 text-parisian-grey-400" />
              <p className="text-lg">Még nincs egyetlen feliratkozó sem.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-parisian-beige-200 bg-parisian-cream-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-parisian-grey-700">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Email cím
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-parisian-grey-700">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Feliratkozás dátuma
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-parisian-grey-700">
                      Státusz
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-parisian-grey-700">
                      Műveletek
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((subscriber) => (
                    <tr
                      key={subscriber.id}
                      className="border-b border-parisian-beige-100 transition-colors hover:bg-parisian-cream-50/50"
                    >
                      <td className="px-4 py-4">
                        {editingId === subscriber.id ? (
                          <div>
                            <input
                              type="email"
                              value={editEmail}
                              onChange={(e) => {
                                setEditEmail(e.target.value)
                                setEditError(null)
                              }}
                              onKeyDown={(e) => e.key === 'Enter' && saveEdit(subscriber.id)}
                              autoFocus
                              className="w-full rounded-lg border-2 border-parisian-beige-300 px-3 py-1.5 font-montserrat text-sm outline-none focus:border-parisian-beige-400"
                            />
                            {editError && <p className="mt-1 font-montserrat text-xs text-red-600">{editError}</p>}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-parisian-grey-400" />
                            <span className="font-medium text-parisian-grey-800">
                              {subscriber.email}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-parisian-grey-600">
                        {formatDate(subscriber.created_at)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {subscriber.is_active ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <Check className="mr-1 h-3 w-3" />
                            Aktív
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
                            <X className="mr-1 h-3 w-3" />
                            Inaktív
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {editingId === subscriber.id ? (
                            <>
                              <button
                                onClick={() => saveEdit(subscriber.id)}
                                className="flex items-center gap-1 rounded-lg bg-green-100 px-3 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-200"
                              >
                                <Save className="h-3.5 w-3.5" />
                                Mentés
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="rounded-lg px-3 py-2 text-sm font-medium text-parisian-grey-500 transition-colors hover:bg-parisian-grey-100"
                              >
                                Mégse
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => toggleSubscriberStatus(subscriber.id, subscriber.is_active)}
                                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                  subscriber.is_active
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                              >
                                {subscriber.is_active ? 'Deaktiválás' : 'Aktiválás'}
                              </button>
                              <button
                                onClick={() => startEdit(subscriber)}
                                aria-label="Email cím szerkesztése"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-parisian-grey-500 transition-colors hover:bg-parisian-beige-100"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(subscriber.id, subscriber.email)}
                                aria-label="Feliratkozó törlése"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-parisian-grey-500 transition-colors hover:bg-red-100 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Email lista exportálás</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-parisian-grey-600">
            Másolja ki az aktív feliratkozók email címeit az alábbi mezőből
          </p>
          <textarea
            readOnly
            value={activeSubscribers.map(s => s.email).join(', ')}
            className="w-full rounded-lg border-2 border-parisian-beige-200 bg-parisian-cream-50 p-4 font-mono text-sm text-parisian-grey-800"
            rows={4}
          />
          <p className="mt-2 text-xs text-parisian-grey-500">
            {activeSubscribers.length} aktív email cím, vesszővel elválasztva
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
