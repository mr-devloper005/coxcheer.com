import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'The Journal',
    headline: 'Field notes, dispatches and quiet essays.',
    description:
      'The Journal is a slow-read companion to the directory — long-form writing about the neighborhood: the makers, the rituals, the corners worth walking to.',
    filterLabel: 'Filter by topic',
    secondaryNote: 'Read at your own pace. New dispatches land quietly.',
    chips: ['Long-read', 'Field notes', 'Neighborhood essays'],
  },
  classified: {
    eyebrow: 'Board',
    headline: 'A community pinboard, updated daily.',
    description:
      'Short, time-sensitive posts from the neighborhood — offers, calls, notices, small trades. Meant to be skimmed and acted on.',
    filterLabel: 'Filter the board',
    secondaryNote: 'Quick to scan, quicker to answer.',
    chips: ['Pinboard', 'Fast reads', 'Actionable'],
  },
  sbm: {
    eyebrow: 'Marked',
    headline: 'Links, references and quiet shelves.',
    description:
      'A shelf of resources, tools and links worth returning to — kept close to the work they support.',
    filterLabel: 'Filter shelves',
    secondaryNote: 'A reading room, not a feed.',
    chips: ['Reference', 'Shelved', 'Kept close'],
  },
  profile: {
    eyebrow: 'Roster',
    headline: 'The people behind the neighborhood.',
    description:
      'Makers, owners, writers and organizers — the individuals whose work makes the directory possible.',
    filterLabel: 'Filter the roster',
    secondaryNote: 'Real people, real work.',
    chips: ['Makers', 'Owners', 'Voices'],
  },
  pdf: {
    eyebrow: 'Library',
    headline: 'Guides, briefs and reference documents.',
    description:
      'Downloadable material — neighborhood guides, small-business briefs and quiet references. Take them with you.',
    filterLabel: 'Filter the library',
    secondaryNote: 'Print-friendly. Portable.',
    chips: ['Guides', 'Briefs', 'Downloadable'],
  },
  listing: {
    eyebrow: 'Places',
    headline: 'A living directory of independent places.',
    description:
      'Cafés, workshops, storefronts, studios and services — the working index of independent spots worth knowing about.',
    filterLabel: 'Filter by kind',
    secondaryNote: 'Kept current. Locally sourced.',
    chips: ['Independent', 'Neighborhood', 'Verified'],
  },
  image: {
    eyebrow: 'Gallery',
    headline: 'Neighborhood scenes, in frames.',
    description:
      'A slow-scroll wall of images from the field — shopfronts, hands at work, quiet corners and the light of the hour.',
    filterLabel: 'Filter by scene',
    secondaryNote: 'Look first. Read later.',
    chips: ['Scenes', 'Frames', 'Slow scroll'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
