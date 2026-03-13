import type { CollectionConfig } from 'payload'

export const AdSlots: CollectionConfig = {
  slug: 'ad-slots',
  admin: {
    useAsTitle: 'position',
    description: 'Manage ad placements without redeployment',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'position',
      type: 'select',
      required: true,
      options: [
        { label: 'Leaderboard (728x90 - top)', value: 'leaderboard' },
        { label: 'Sidebar Top (300x250)', value: 'sidebar-top' },
        { label: 'Sidebar Bottom (300x250)', value: 'sidebar-bottom' },
        { label: 'In-Content (300x250)', value: 'in-content' },
        { label: 'In-Feed (native card)', value: 'in-feed' },
        { label: 'Footer (before related)', value: 'footer' },
      ],
    },
    {
      name: 'ad_code',
      type: 'textarea',
      admin: {
        description: 'AdSense / Ezoic / AdMob snippet',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'page_type',
      type: 'select',
      options: [
        { label: 'All Pages', value: 'all' },
        { label: 'Home', value: 'home' },
        { label: 'Article', value: 'article' },
        { label: 'Category', value: 'category' },
      ],
      defaultValue: 'all',
    },
  ],
}
