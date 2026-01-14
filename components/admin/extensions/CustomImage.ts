import Image from '@tiptap/extension-image'
import { ReactNodeViewRenderer } from '@tiptap/react'
import ImageComponent from './ImageComponent'

export type ImageSize = 'normal' | 'wide' | 'full'

export interface CustomImageOptions {
  inline: boolean
  allowBase64: boolean
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customImage: {
      /**
       * Set image with size attribute
       */
      setImage: (options: { src: string; alt?: string; title?: string; size?: ImageSize }) => ReturnType
      /**
       * Update image size
       */
      setImageSize: (size: ImageSize) => ReturnType
    }
  }
}

export const CustomImage = Image.extend<CustomImageOptions>({
  name: 'customImage',

  addOptions() {
    return {
      ...this.parent?.(),
      inline: false, // Block-level images (not inline)
      allowBase64: false,
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
        parseHTML: element => element.getAttribute('src'),
        renderHTML: attributes => ({
          src: attributes.src,
        }),
      },
      alt: {
        default: null,
        parseHTML: element => element.getAttribute('alt'),
        renderHTML: attributes => ({
          alt: attributes.alt,
        }),
      },
      title: {
        default: null,
        parseHTML: element => element.getAttribute('title'),
        renderHTML: attributes => ({
          title: attributes.title,
        }),
      },
      size: {
        default: 'normal',
        parseHTML: element => element.getAttribute('data-size') || 'normal',
        renderHTML: attributes => ({
          'data-size': attributes.size,
        }),
      },
    }
  },

  addCommands() {
    return {
      setImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              src: options.src,
              alt: options.alt || '',
              title: options.title || '',
              size: options.size || 'normal',
            },
          })
        },
      setImageSize:
        (size: ImageSize) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { size })
        },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent)
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
        getAttrs: (dom) => {
          if (typeof dom === 'string') return {}
          const element = dom as HTMLElement
          return {
            src: element.getAttribute('src'),
            alt: element.getAttribute('alt'),
            title: element.getAttribute('title'),
            size: element.getAttribute('data-size') || 'normal',
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', { ...this.options.HTMLAttributes, ...HTMLAttributes }]
  },
})
