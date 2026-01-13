'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pencil, Trash2, Plus, Tag } from 'lucide-react'
import type { BlogCategory } from '@/lib/types/database'

export default function BlogCategoriesPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  })
  const supabase = createClient()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching categories:', error)
    } else {
      setCategories(data || [])
    }
    setIsLoading(false)
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData({
      name,
      slug: generateSlug(name)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.slug) {
      alert('Kérjük, töltse ki a nevet!')
      return
    }

    if (editingCategory) {
      // Update existing category
      const { error } = await supabase
        .from('blog_categories')
        .update({
          name: formData.name,
          slug: formData.slug
        })
        .eq('id', editingCategory.id)

      if (error) {
        console.error('Error updating category:', error)
        alert('Hiba történt a kategória frissítése során: ' + error.message)
        return
      }
    } else {
      // Create new category
      const { error } = await supabase
        .from('blog_categories')
        .insert({
          name: formData.name,
          slug: formData.slug
        })

      if (error) {
        console.error('Error creating category:', error)
        alert('Hiba történt a kategória létrehozása során: ' + error.message)
        return
      }
    }

    // Reset and refresh
    setFormData({ name: '', slug: '' })
    setEditingCategory(null)
    setIsModalOpen(false)
    await fetchCategories()
  }

  const handleEdit = (category: BlogCategory) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Biztosan törli a "${name}" kategóriát?`)) {
      return
    }

    const { error } = await supabase
      .from('blog_categories')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting category:', error)
      alert('Hiba történt a törlés során: ' + error.message)
      return
    }

    await fetchCategories()
  }

  const openCreateModal = () => {
    setEditingCategory(null)
    setFormData({ name: '', slug: '' })
    setIsModalOpen(true)
  }

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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 font-playfair text-4xl font-bold text-parisian-grey-800">
            Blog Kategóriák
          </h1>
          <p className="text-lg text-parisian-grey-600">
            {categories.length} kategória összesen
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-parisian-beige-400 hover:bg-parisian-beige-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          Új kategória
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-parisian-beige-500" />
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-parisian-grey-500 font-mono">
                /{category.slug}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(category)}
                  className="flex-1"
                >
                  <Pencil className="mr-2 h-3 w-3" />
                  Szerkesztés
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(category.id, category.name)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {categories.length === 0 && (
          <div className="col-span-full py-12 text-center text-parisian-grey-600">
            <Tag className="mx-auto mb-4 h-12 w-12 text-parisian-grey-400" />
            <p className="text-lg">Még nincs egyetlen kategória sem.</p>
            <Button
              onClick={openCreateModal}
              className="mt-4 bg-parisian-beige-400 hover:bg-parisian-beige-500"
            >
              Első kategória létrehozása
            </Button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>
                {editingCategory ? 'Kategória szerkesztése' : 'Új kategória'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Kategória neve</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="pl. Gasztronómia"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">URL slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="gasztronomia"
                    required
                  />
                  <p className="mt-1 text-xs text-parisian-grey-500">
                    Automatikusan generálódik a névből
                  </p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1"
                  >
                    Mégse
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-parisian-beige-400 hover:bg-parisian-beige-500"
                  >
                    {editingCategory ? 'Mentés' : 'Létrehozás'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
