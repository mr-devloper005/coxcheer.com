import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Orvn-style task surfaces. Every task shares one visual language:
  ink + paper + hairline border + yellow accent. Only kicker/note copy varies.
*/

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY_FONT = "'Geist', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
const BODY_FONT = "'Geist', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

const base = {
  dark: false,
  fontDisplay: DISPLAY_FONT,
  fontBody: BODY_FONT,
  bg: '#ffffff',
  surface: '#ffffff',
  raised: '#f1f3f5',
  text: '#0a0a0a',
  muted: '#5a5a5a',
  line: '#e5e7eb',
  accent: '#0a0a0a',
  accentSoft: '#fff8b3',
  onAccent: '#0a0a0a',
  glow: 'rgba(255,239,20,0.35)',
  radius: '0.875rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: {
    ...base,
    kicker: 'The Journal',
    note: 'Long-form dispatches, field notes and neighborhood essays.',
  },
  listing: {
    ...base,
    kicker: 'Places',
    note: 'A living index of independent spots, makers and services near you.',
  },
  classified: {
    ...base,
    kicker: 'Board',
    note: 'Fresh offers and community listings, refreshed daily.',
  },
  image: {
    ...base,
    kicker: 'Gallery',
    note: 'A visual feed of standout images and neighborhood scenes.',
  },
  sbm: {
    ...base,
    kicker: 'Marked',
    note: 'Curated links and resources worth keeping close.',
  },
  pdf: {
    ...base,
    kicker: 'Library',
    note: 'Downloadable guides, briefs and neighborhood references.',
  },
  profile: {
    ...base,
    kicker: 'Roster',
    note: 'The people, makers and businesses behind the neighborhood.',
  },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': '#ffef14',
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
