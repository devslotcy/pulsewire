import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 30, // 30 days
  },
  access: {
    read: ({ req }) => {
      // Users can only read their own data
      if (req.user) return { id: { equals: req.user.id } }
      return false
    },
    create: () => true, // allow registration
    update: ({ req }) => {
      if (req.user) return { id: { equals: req.user.id } }
      return false
    },
    delete: () => false,
  },
  fields: [
    {
      name: 'displayName',
      type: 'text',
      label: 'Display Name',
    },
    {
      name: 'bookmarks',
      type: 'array',
      label: 'Saved Articles',
      admin: { readOnly: true },
      fields: [
        {
          name: 'articleId',
          type: 'text',
          required: true,
        },
        {
          name: 'savedAt',
          type: 'date',
          required: true,
        },
      ],
    },
    {
      name: 'preferredLanguage',
      type: 'select',
      options: ['en', 'de', 'fr', 'es', 'tr', 'pt', 'ru', 'zh', 'ar'],
      defaultValue: 'en',
    },
  ],
}
