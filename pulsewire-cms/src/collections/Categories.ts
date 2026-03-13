import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-safe identifier (e.g. technology, business)',
      },
    },
    {
      name: 'color',
      type: 'text',
      admin: {
        description: 'Hex color code (e.g. #E63946)',
      },
    },
  ],
}
