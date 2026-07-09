import Link from 'next/link'
import {
  ArrowUpRight, Bookmark, Building2, FileText, Image as ImageIcon,
  Megaphone, UserRound,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, postHref, getEditableExcerpt } from '@/editable/cards/PostCards'
import EditableReveal from '@/editable/shell/EditableReveal'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const taskIcon: Record<TaskKey, typeof FileText> = {
  article: FileText,
  listing: Building2,
  classified: Megaphone,
  image: ImageIcon,
  sbm: Bookmark,
  pdf: FileText,
  profile: UserRound,
}

// Display-label rename map for user-visible strings.
const DISPLAY_LABEL: Partial<Record<TaskKey, string>> = {
  listing: 'Places',
  article: 'The Journal',
  classified: 'Board',
  image: 'Gallery',
  sbm: 'Marked',
  pdf: 'Library',
  profile: 'Roster',
}

function taskDisplayLabel(task: TaskKey) {
  return DISPLAY_LABEL[task] || SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function categoryOf(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || ''
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

const container = 'mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-16'

/* ================================= HERO ================================= */
export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const featured = pool[0]
  const strip = pool.slice(1, 5)
  const primary = pagesContent.home.hero.primaryCta
  const secondary = pagesContent.home.hero.secondaryCta
  const badgeText = pagesContent.home.hero.badge
  const title = pagesContent.home.hero.title?.join(' ') || `A working index of the neighborhood.`

  return (
    <section className="relative overflow-hidden bg-white">
      <div className={`${container} pt-16 pb-20 sm:pt-24 sm:pb-24 lg:pt-32 lg:pb-32`}>
        <EditableReveal index={0}>
          <div className="flex flex-wrap items-center gap-3">
            <span className="editable-mono inline-flex items-center gap-2 rounded-full border border-[#0a0a0a]/12 bg-white px-3 py-1 text-[0.68rem] text-[#0a0a0a]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ffef14]" />
              {badgeText}
            </span>
            <span className="editable-mono text-[#5a5a5a]">{SITE_CONFIG.name}</span>
          </div>
        </EditableReveal>

        <EditableReveal index={1}>
          <h1 className="editable-display mt-8 max-w-[16ch] text-[clamp(2.75rem,9vw,8rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-[#0a0a0a]">
            {title}
          </h1>
        </EditableReveal>

        <EditableReveal index={2}>
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <p className="max-w-[52ch] text-lg leading-[1.5] text-[#5a5a5a] sm:text-xl">
              {pagesContent.home.hero.description}
            </p>
            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <Link
                href={primary.href}
                className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] px-6 py-3 text-[0.9rem] font-medium text-white transition duration-500 hover:bg-[#ffef14] hover:text-[#0a0a0a]"
              >
                {primary.label} <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href={secondary.href}
                className="inline-flex items-center gap-2 rounded-full border border-[#0a0a0a] px-6 py-3 text-[0.9rem] font-medium text-[#0a0a0a] transition duration-500 hover:bg-[#0a0a0a] hover:text-white"
              >
                {secondary.label}
              </Link>
            </div>
          </div>
        </EditableReveal>

        {/* Feature block: big cover + strip of thumbs */}
        {featured ? (
          <EditableReveal index={3}>
            <div className="mt-16 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <Link
                href={postHref(primaryTask, featured, primaryRoute)}
                className="group relative block overflow-hidden rounded-[24px] bg-[#f1f3f5]"
              >
                <div className="relative aspect-[16/10] w-full">
                  <img
                    src={getEditablePostImage(featured)}
                    alt={featured.title}
                    className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] group-hover:scale-[1.03]"
                  />
                  <span className="editable-mono absolute left-4 top-4 rounded-full bg-[#ffef14] px-3 py-1 text-[0.65rem] text-[#0a0a0a]">
                    On the cover
                  </span>
                </div>
                <div className="p-6 sm:p-8">
                  <p className="editable-mono text-[#5a5a5a]">{categoryOf(featured) || taskDisplayLabel(primaryTask)}</p>
                  <h3 className="editable-display mt-3 text-2xl font-semibold leading-[1.05] tracking-[-0.03em] text-[#0a0a0a] sm:text-[1.9rem]">
                    {featured.title}
                  </h3>
                  <span className="mt-4 inline-flex items-center gap-1.5 editable-mono text-[#0a0a0a] transition duration-500 group-hover:text-[#ffef14]">
                    Open <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
                {strip.map((post, i) => (
                  <Link
                    key={post.id || post.slug}
                    href={postHref(primaryTask, post, primaryRoute)}
                    className="group grid grid-cols-[80px_minmax(0,1fr)] items-start gap-3 rounded-[16px] border border-[#e5e7eb] bg-white p-3 transition duration-500 hover:-translate-y-0.5 hover:border-[#0a0a0a] lg:grid-cols-[96px_minmax(0,1fr)] lg:gap-4 lg:p-4"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-[#f1f3f5]">
                      <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    </div>
                    <div className="min-w-0">
                      <p className="editable-mono text-[#5a5a5a]">№{String(i + 2).padStart(2, '0')}</p>
                      <h4 className="mt-1 line-clamp-3 text-[0.95rem] font-medium leading-[1.25] tracking-[-0.02em] text-[#0a0a0a]">
                        {post.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </EditableReveal>
        ) : null}
      </div>
      {/* Full-bleed marquee band */}
      <div className="border-y border-[#0a0a0a] bg-[#ffef14] py-5">
        <div className="editable-marquee-track editable-display text-[clamp(1.5rem,3.5vw,3rem)] font-semibold leading-none tracking-[-0.035em] text-[#0a0a0a]">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="inline-flex items-center gap-16 pr-16">
              <span>Places</span><span aria-hidden>◆</span>
              <span>The Journal</span><span aria-hidden>◆</span>
              <span>Gallery</span><span aria-hidden>◆</span>
              <span>Board</span><span aria-hidden>◆</span>
              <span>Field Guide</span><span aria-hidden>◆</span>
              <span>Kept local</span><span aria-hidden>◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* =========================== Browse by section =========================== */
export function EditableStoryRail({ primaryRoute }: HomeSectionProps) {
  const categories = SITE_CONFIG.tasks.filter((task) => task.enabled)
  if (!categories.length) return null
  return (
    <section className="bg-white">
      <div className={`${container} py-20 sm:py-24 lg:py-32`}>
        <EditableReveal index={0}>
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <p className="editable-mono text-[#5a5a5a]">§ 01 · Sections</p>
              <h2 className="editable-display mt-4 text-4xl font-semibold leading-[0.98] tracking-[-0.035em] sm:text-5xl lg:text-[3.75rem]">
                Wander in from wherever you like.
              </h2>
            </div>
            <p className="max-w-[46ch] text-base leading-[1.55] text-[#5a5a5a] lg:justify-self-end">
              The guide is divided into sections that talk to each other. Open one and follow it wherever it leads — a place, a piece, a scene.
            </p>
          </div>
        </EditableReveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((task, i) => {
            const Icon = taskIcon[task.key] || FileText
            const label = taskDisplayLabel(task.key)
            const isAccent = i === 1
            const isDark = i === 4
            const base = isAccent
              ? 'bg-[#ffef14] border-transparent text-[#0a0a0a]'
              : isDark
              ? 'bg-[#0a0a0a] border-transparent text-white'
              : 'bg-white border-[#e5e7eb] text-[#0a0a0a]'
            return (
              <EditableReveal key={task.key} index={i}>
                <Link
                  href={task.route}
                  className={`group relative block overflow-hidden rounded-[20px] border p-6 transition duration-500 hover:-translate-y-1 ${base}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-full ${
                        isAccent ? 'bg-[#0a0a0a] text-white' : isDark ? 'bg-white text-[#0a0a0a]' : 'bg-[#f1f3f5] text-[#0a0a0a]'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <ArrowUpRight
                      className={`h-5 w-5 transition duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${
                        isAccent || isDark ? 'opacity-100' : 'opacity-60'
                      }`}
                    />
                  </div>
                  <h3 className="editable-display mt-16 text-3xl font-semibold leading-[1] tracking-[-0.035em] sm:text-4xl">
                    {label}
                  </h3>
                  <p className={`editable-mono mt-3 ${isDark ? 'text-white/60' : isAccent ? 'text-[#0a0a0a]/70' : 'text-[#5a5a5a]'}`}>
                    §{String(i + 1).padStart(2, '0')} · Section
                  </p>
                </Link>
              </EditableReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ============================ Recent activity ============================ */
function ActivityCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const category = categoryOf(post)
  const image = getEditablePostImage(post)
  return (
    <EditableReveal index={index}>
      <Link
        href={href}
        className="group editable-card-lift block overflow-hidden rounded-[18px] border border-[#e5e7eb] bg-white"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[#f1f3f5]">
          <img
            src={image}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover transition duration-[1000ms] group-hover:scale-[1.05]"
            loading="lazy"
          />
          {category ? (
            <span className="editable-mono absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[0.65rem] text-[#0a0a0a]">
              {category}
            </span>
          ) : null}
        </div>
        <div className="p-6">
          <p className="editable-mono text-[#5a5a5a]">№{String(index + 1).padStart(2, '0')} · Filed</p>
          <h3 className="mt-3 line-clamp-3 text-[1.15rem] font-medium leading-[1.25] tracking-[-0.02em] text-[#0a0a0a] sm:text-[1.25rem]">
            {post.title}
          </h3>
          <p className="mt-3 line-clamp-2 text-sm leading-[1.55] text-[#5a5a5a]">{getEditableExcerpt(post, 130)}</p>
          <span className="mt-5 inline-flex items-center gap-2 editable-mono text-[#0a0a0a] transition duration-500 group-hover:text-[#ffef14]">
            Open <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    </EditableReveal>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const activity = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)]).slice(0, 6)
  if (!activity.length) return null
  return (
    <section className="bg-[#f1f3f5]">
      <div className={`${container} py-20 sm:py-24 lg:py-32`}>
        <EditableReveal index={0}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="editable-mono text-[#5a5a5a]">§ 02 · Recently filed</p>
              <h2 className="editable-display mt-4 text-4xl font-semibold leading-[0.98] tracking-[-0.035em] sm:text-5xl lg:text-[3.75rem]">
                Fresh from the field.
              </h2>
            </div>
            <Link
              href={primaryRoute}
              className="inline-flex items-center gap-2 rounded-full border border-[#0a0a0a] px-5 py-2.5 editable-mono text-[0.7rem] text-[#0a0a0a] transition duration-500 hover:bg-[#0a0a0a] hover:text-white"
            >
              See everything <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </EditableReveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activity.map((post, i) => (
            <ActivityCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ======================== Time-based collections ========================= */
const sectionCopy: Record<string, { eyebrow: string; title: string }> = {
  spotlight: { eyebrow: '§ 03 · New this week', title: 'Just landed in the guide.' },
  browse: { eyebrow: '§ 04 · Turning heads', title: 'What people are opening.' },
  index: { eyebrow: '§ 05 · From the archive', title: 'Kept for a reason.' },
}

function CompactCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const category = categoryOf(post)
  const image = getEditablePostImage(post)
  return (
    <EditableReveal index={index}>
      <Link
        href={href}
        className="group editable-card-lift flex flex-col overflow-hidden rounded-[16px] border border-[#e5e7eb] bg-white"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[#f1f3f5]">
          <img
            src={image}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover transition duration-[1000ms] group-hover:scale-[1.05]"
            loading="lazy"
          />
          {category ? (
            <span className="editable-mono absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[0.62rem] text-[#0a0a0a]">
              {category}
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="line-clamp-3 text-[1.05rem] font-medium leading-[1.25] tracking-[-0.02em] text-[#0a0a0a]">
            {post.title}
          </h3>
          <p className="mt-3 line-clamp-2 flex-1 text-[0.85rem] leading-[1.55] text-[#5a5a5a]">
            {getEditableExcerpt(post, 110)}
          </p>
        </div>
      </Link>
    </EditableReveal>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: posts.slice(8, 16), href: primaryRoute },
          { key: 'index', posts: posts.slice(16, 24), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((section) => section.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section, index) => {
        const copy = sectionCopy[section.key] || { eyebrow: '§ · More', title: 'More to explore.' }
        const dark = index === 1
        return (
          <section
            key={section.key}
            className={dark ? 'bg-[#0a0a0a] text-white' : 'bg-white text-[#0a0a0a]'}
          >
            <div className={`${container} py-20 sm:py-24 lg:py-32`}>
              <EditableReveal index={0}>
                <div className="flex flex-wrap items-end justify-between gap-6">
                  <div>
                    <p className={`editable-mono ${dark ? 'text-white/60' : 'text-[#5a5a5a]'}`}>{copy.eyebrow}</p>
                    <h2 className="editable-display mt-4 text-4xl font-semibold leading-[0.98] tracking-[-0.035em] sm:text-5xl lg:text-[3.75rem]">
                      {copy.title}
                    </h2>
                  </div>
                  <Link
                    href={section.href || primaryRoute}
                    className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 editable-mono text-[0.7rem] transition duration-500 ${
                      dark
                        ? 'border-white text-white hover:bg-white hover:text-[#0a0a0a]'
                        : 'border-[#0a0a0a] text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white'
                    }`}
                  >
                    See more <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </EditableReveal>
              <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.posts.slice(0, 8).map((post, i) => (
                  <CompactCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={i} />
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

/* ================================= CTA ================================= */
export function EditableHomeCta() {
  return (
    <section id="get-app" className="scroll-mt-24 bg-[#ffef14]">
      <div className={`${container} py-24 sm:py-28 lg:py-36`}>
        <EditableReveal index={0}>
          <p className="editable-mono text-[#0a0a0a]/70">§ · Add to the guide</p>
        </EditableReveal>
        <EditableReveal index={1}>
          <h2 className="editable-display mt-6 max-w-[18ch] text-[clamp(2.5rem,8vw,7rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-[#0a0a0a]">
            {pagesContent.home.cta.title}
          </h2>
        </EditableReveal>
        <EditableReveal index={2}>
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <p className="max-w-[52ch] text-lg leading-[1.5] text-[#0a0a0a]/80 sm:text-xl">
              {pagesContent.home.cta.description}
            </p>
            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <Link
                href={pagesContent.home.cta.primaryCta.href}
                className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] px-7 py-3.5 text-[0.9rem] font-medium text-white transition duration-500 hover:bg-white hover:text-[#0a0a0a]"
              >
                {pagesContent.home.cta.primaryCta.label} <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href={pagesContent.home.cta.secondaryCta.href}
                className="inline-flex items-center gap-2 rounded-full border border-[#0a0a0a] px-7 py-3.5 text-[0.9rem] font-medium text-[#0a0a0a] transition duration-500 hover:bg-[#0a0a0a] hover:text-white"
              >
                {pagesContent.home.cta.secondaryCta.label}
              </Link>
            </div>
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}
