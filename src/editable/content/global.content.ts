import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'A neighborhood field guide',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Places · The Journal',
    primaryLinks: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Get started', href: '/signup' },
      secondary: { label: 'Submit a place', href: '/contact' },
    },
  },
  footer: {
    tagline: 'A working index of the neighborhood',
    description:
      'A living directory of independent places and a slow-read journal of neighborhood dispatches — collected in one calm, browsable index.',
    columns: [
      {
        title: 'Discover',
        links: [
          { label: 'Places', href: '/listings' },
          { label: 'The Journal', href: '/articles' },
          { label: 'Gallery', href: '/image-sharing' },
          { label: 'Library', href: '/pdf' },
        ],
      },
      {
        title: 'Site',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
    bottomNote: 'Made with care for slow discovery.',
  },
  commonLabels: {
    readMore: 'Keep reading',
    viewAll: 'See everything',
    explore: 'Wander in',
    latest: 'Just published',
    related: 'Nearby',
    published: 'Filed',
  },
} as const
