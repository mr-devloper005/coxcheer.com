import type { CSSProperties } from 'react'

/*
  Orvn-inspired design contract.
  Monochrome ink + paper surfaces, bright yellow accent (#ffef14) used as
  full-section bands and standout CTA fill. Pill buttons. Bordered cards
  with hairline stroke. Tight negative-tracked display typography.
*/

export const editableRootStyle = {
  '--slot4-page-bg': '#ffffff',
  '--slot4-page-text': '#0a0a0a',
  '--slot4-panel-bg': '#f1f3f5',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#5a5a5a',
  '--slot4-soft-muted-text': '#9a9a9a',
  '--slot4-accent': '#0a0a0a',
  '--slot4-accent-fill': '#ffef14',
  '--slot4-accent-soft': '#fff8b3',
  '--slot4-on-accent': '#0a0a0a',
  '--slot4-dark-bg': '#0a0a0a',
  '--slot4-dark-text': '#ffffff',
  '--slot4-media-bg': '#f1f3f5',
  '--slot4-cream': '#f6f6f4',
  '--slot4-warm': '#f1f3f5',
  '--slot4-lavender': '#ffffff',
  '--slot4-gray': '#f1f3f5',
  '--slot4-body-gradient': 'none',
  '--editable-page-bg': '#ffffff',
  '--editable-page-text': '#0a0a0a',
  '--editable-container': '1440px',
  '--editable-border': '#e5e7eb',
  '--editable-nav-bg': 'rgba(255,255,255,0.72)',
  '--editable-nav-text': '#0a0a0a',
  '--editable-nav-active': '#ffef14',
  '--editable-nav-active-text': '#0a0a0a',
  '--editable-cta-bg': '#0a0a0a',
  '--editable-cta-text': '#ffffff',
  '--editable-search-bg': '#f1f3f5',
  '--editable-footer-bg': '#0a0a0a',
  '--editable-footer-text': '#ffffff',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-page-text)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-white/12',
  shadow: 'shadow-none',
  shadowStrong: 'shadow-[0_18px_60px_-30px_rgba(0,0,0,0.35)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(0,0,0,0)_10%,rgba(0,0,0,0.72))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-16',
    sectionY: 'py-16 sm:py-24 lg:py-32',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[160px] shrink-0 snap-start sm:w-[180px]',
  },
  type: {
    eyebrow:
      "font-['Geist_Mono',ui-monospace,monospace] text-[0.72rem] font-medium uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]",
    heroTitle:
      'text-[clamp(2.75rem,8vw,7.5rem)] font-semibold leading-[0.92] tracking-[-0.045em]',
    sectionTitle:
      'text-4xl font-semibold leading-[0.98] tracking-[-0.035em] sm:text-5xl lg:text-[3.75rem]',
    body: 'text-base leading-[1.55] text-[var(--slot4-page-text)]',
    emphasis:
      "font-['Geist_Mono',ui-monospace,monospace] text-[0.72rem] font-medium uppercase tracking-[0.22em]",
  },
  surface: {
    card: `rounded-[14px] border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    soft: `rounded-[14px] border ${editablePalette.border} ${editablePalette.panelBg}`,
    dark: `rounded-[14px] ${editablePalette.darkBg} ${editablePalette.darkText}`,
  },
  button: {
    primary:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[#0a0a0a] px-6 py-3 text-[0.85rem] font-medium tracking-[0.005em] text-white transition duration-500 hover:bg-[#ffef14] hover:text-[#0a0a0a] active:scale-[0.98]',
    secondary:
      'inline-flex items-center justify-center gap-2 rounded-full border border-[#0a0a0a] bg-transparent px-6 py-3 text-[0.85rem] font-medium tracking-[0.005em] text-[#0a0a0a] transition duration-500 hover:bg-[#0a0a0a] hover:text-white active:scale-[0.98]',
    accent:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[#ffef14] px-6 py-3 text-[0.85rem] font-medium tracking-[0.005em] text-[#0a0a0a] transition duration-500 hover:bg-[#0a0a0a] hover:text-white active:scale-[0.98]',
    ghost:
      'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-[0.85rem] font-medium text-[var(--slot4-muted-text)] transition duration-300 hover:text-[#0a0a0a]',
  },
  badge: {
    pill: "inline-flex items-center gap-1.5 rounded-full border border-[#0a0a0a]/12 bg-white px-3 py-1 font-['Geist_Mono',ui-monospace,monospace] text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[#0a0a0a]",
    accentPill:
      "inline-flex items-center gap-1.5 rounded-full bg-[#ffef14] px-3 py-1 font-['Geist_Mono',ui-monospace,monospace] text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[#0a0a0a]",
  },
  surfaceExtras: {
    band: `rounded-[24px] bg-[var(--slot4-accent-fill)] text-[var(--slot4-on-accent)]`,
    darkBand: `rounded-[24px] bg-[#0a0a0a] text-white`,
  },
  media: {
    frame: `relative overflow-hidden rounded-[14px] ${editablePalette.mediaBg}`,
    frameFull: `relative overflow-hidden rounded-[24px] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/3]',
    ratioWide: 'aspect-[16/9]',
    ratioTall: 'aspect-[3/4]',
  },
  motion: {
    lift: 'transition duration-500 hover:-translate-y-1',
    fade: 'transition duration-500 hover:opacity-70',
    zoom: 'transition duration-[900ms] group-hover:scale-[1.04]',
  },
} as const

export const aiLayoutRules = [
  'Change the palette in editableRootStyle first; every section consumes it via CSS vars.',
  'Preserve section rhythm in HomeSections.tsx — home is the visual keynote.',
  'Use wide fluid layouts (max 1440px) with generous horizontal padding.',
  'Cards are bordered with hairline stroke; never add shadows — hover uses lift + border darken.',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
] as const
