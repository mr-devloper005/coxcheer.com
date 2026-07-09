import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'A neighborhood field guide — Places & The Journal',
      description:
        'An independent directory of places and a slow-read journal of neighborhood dispatches.',
      openGraphTitle: 'Places & The Journal — a neighborhood field guide',
      openGraphDescription:
        'Discover independent places and read neighborhood dispatches in one calm, browsable index.',
      keywords: ['neighborhood directory', 'local guide', 'independent places', 'field journal', 'community'],
    },
    hero: {
      badge: 'Field guide · Vol. 001',
      title: ['A working index of the', 'neighborhood.'],
      description:
        'A living directory of independent places and a slow-read journal of dispatches from the field. Made for wandering in.',
      primaryCta: { label: 'Wander the directory', href: '/listings' },
      secondaryCta: { label: 'Read the journal', href: '/articles' },
      searchPlaceholder: 'Search places, journal entries, makers…',
      focusLabel: 'Focus',
      featureCardBadge: 'Recently filed',
      featureCardTitle: 'The newest dispatches shape the front of the guide.',
      featureCardDescription:
        'Every arrival — a new place, a fresh essay, a scene from the block — takes its place on the cover.',
    },
    intro: {
      badge: 'About the guide',
      title: 'Made for slow discovery, not endless scrolling.',
      paragraphs: [
        'The guide is two things kept close: a working directory of independent places, and a slow-read journal of neighborhood dispatches.',
        'Both grow from the same soil — the streets, the makers, the small businesses — so a place you find in the directory often has an entry in the journal, and the other way around.',
        'You can arrive from either side. Follow a story to a storefront. Follow a storefront to a story. Wander in.',
      ],
      sideBadge: 'In this guide',
      sidePoints: [
        'A living directory of independent places, kept current by the community.',
        'A journal of long-form dispatches, filed by writers who walk the block.',
        'A gallery of scenes, briefs and shelves for the wider material.',
        'Calm navigation, generous type, no infinite scroll.',
      ],
      primaryLink: { label: 'Open the directory', href: '/listings' },
      secondaryLink: { label: 'Open the journal', href: '/articles' },
    },
    cta: {
      badge: 'Add to the guide',
      title: 'Know a place worth listing? A story worth filing?',
      description:
        'The guide is community-kept. Submit a place, propose a piece for the journal, or write in — every good addition makes the index better.',
      primaryCta: { label: 'Submit a place', href: '/create' },
      secondaryCta: { label: 'Write in', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest in {label}',
      descriptionSuffix: 'Fresh from the field.',
    },
  },
  about: {
    badge: 'About',
    title: 'A field guide, kept close.',
    description: `${slot4BrandConfig.siteName} is a working index of independent places and a slow-read journal of neighborhood dispatches — kept in one calm, browsable place.`,
    paragraphs: [
      'The guide grew from a simple frustration: places worth knowing about were scattered across search results, and stories about them were even harder to find. So we kept both in the same room.',
      'The directory is the working half — a living list of independent places, updated by the people who use them. The journal is the reading half — long-form dispatches from writers who walk the block. They talk to each other.',
    ],
    values: [
      {
        title: 'Slow, not scrollable',
        description: 'Generous type, calm rhythm and no infinite feed. The guide is meant to be wandered, not consumed.',
      },
      {
        title: 'Independent by default',
        description: 'The directory favors independent places and small businesses. No paid placements, no sponsored ranking.',
      },
      {
        title: 'Kept by the community',
        description: 'Every listing and every journal entry can be submitted, corrected and added to. The guide belongs to the block.',
      },
    ],
  },
  contact: {
    eyebrow: `Write to ${slot4BrandConfig.siteName}`,
    title: 'Notes, corrections, submissions, tips.',
    description:
      'Tell us what you want to add to the guide — a place, an essay pitch, a correction, a photograph — and we will route it to the right pair of hands.',
    formTitle: 'Send a note',
  },

  search: {
    metadata: {
      title: 'Search the guide',
      description: 'Search across the directory, the journal, the gallery and the library.',
    },
    hero: {
      badge: 'Search',
      title: 'Look up a place, a person, a piece.',
      description: 'One search across every section of the guide — places, journal entries, gallery scenes and shelved references.',
      placeholder: 'Look up a place, a title, a keyword…',
    },
    resultsTitle: 'Everything matching your search',
  },
  create: {
    metadata: {
      title: 'Submit to the guide',
      description: 'Submit a place, a journal entry, or another kind of post to the guide.',
    },
    locked: {
      badge: 'Contributor access',
      title: 'Sign in to add to the guide.',
      description: 'Bring your account to submit places, file dispatches and add to the wider index.',
    },
    hero: {
      badge: 'Submit',
      title: 'Add to the guide.',
      description: 'Choose what you are submitting — a place, an essay, an image, a shelved reference — and file it in.',
    },
    formTitle: 'Details',
    submitLabel: 'File submission',
    successTitle: 'Filed. Thank you.',
  },
  auth: {
    login: {
      metadataDescription: 'Sign in to the guide.',
      badge: 'Sign in',
      title: 'Welcome back to the guide.',
      description: 'Sign in to keep filing, editing and adding to the neighborhood index.',
      formTitle: 'Sign in',
      submitLabel: 'Sign in',
      noAccount: 'No account found with those details. Create one first.',
      success: 'Signed in. Taking you back…',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Create an account for the guide.',
      badge: 'Get started',
      title: 'Join the people who keep the guide alive.',
      description: 'Make an account to submit places, file dispatches and edit the wider index.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created. Taking you in…',
      loginCta: 'Sign in instead',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'More from the journal',
      fallbackTitle: 'Journal entry',
    },
    listing: {
      relatedTitle: 'More places nearby',
      fallbackTitle: 'A place in the guide',
    },
    image: {
      relatedTitle: 'More from the gallery',
      fallbackTitle: 'A frame from the field',
    },
    profile: {
      relatedTitle: 'Filed by the same hand',
      fallbackDescription: 'This roster entry has not been filled in yet.',
      visitButton: 'Visit the site',
    },
  },
} as const
