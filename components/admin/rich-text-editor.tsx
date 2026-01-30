'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { CustomImage } from './extensions/CustomImage'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  ImageIcon,
  Link as LinkIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Kezdj el írni...',
}: RichTextEditorProps) {
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      CustomImage,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-gold-500 underline hover:text-gold-600',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[300px] px-4 py-3',
      },
    },
  })

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  const handleImageUpload = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        setUploading(true)
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `blog/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const {
          data: { publicUrl },
        } = supabase.storage.from('blog-images').getPublicUrl(filePath)

        editor?.chain().focus().setImage({ src: publicUrl }).run()
      } catch (error) {
        console.error('Error uploading image:', error)
        alert('Hiba történt a kép feltöltése során')
      } finally {
        setUploading(false)
      }
    }

    input.click()
  }

  const addLink = () => {
    const url = window.prompt('URL')
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run()
    }
  }

  if (!editor) {
    return null
  }

  return (
    <div className="rounded-lg border-2 border-champagne-400 bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b border-champagne-300 p-2">
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <div className="mx-1 w-px bg-champagne-300" />
        <Button
          type="button"
          size="sm"
          variant={
            editor.isActive('heading', { level: 2 }) ? 'secondary' : 'ghost'
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={
            editor.isActive('heading', { level: 3 }) ? 'secondary' : 'ghost'
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <div className="mx-1 w-px bg-champagne-300" />
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('blockquote') ? 'secondary' : 'ghost'}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <div className="mx-1 w-px bg-champagne-300" />
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={handleImageUpload}
          disabled={uploading}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('link') ? 'secondary' : 'ghost'}
          onClick={addLink}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <div className="mx-1 w-px bg-champagne-300" />
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  )
}
