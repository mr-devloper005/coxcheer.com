import Link from 'next/link'
import { ArrowUpRight, BriefcaseBusiness, ChevronDown, Download, FileText, Globe, MapPin, Phone, Search, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import EditableReveal from '@/editable/shell/EditableReveal'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

// Display-label rename (user-visible only).
const DISPLAY_LABEL: Partial<Record<TaskKey, string>> = {
  listing: 'Places',
  article: 'The Journal',
  classified: 'Board',
  image: 'Gallery',
  sbm: 'Marked',
  pdf: 'Library',
  profile: 'Roster',
}
const displayLabel = (task: TaskKey) => DISPLAY_LABEL[task] || getTaskConfig(task)?.label || task
const singularLabel = (task: TaskKey) => {
  const map: Partial<Record<TaskKey, string>> = {
    listing: 'place',
    article: 'entry',
    classified: 'notice',
    image: 'scene',
    sbm: 'reference',
    pdf: 'document',
    profile: 'person',
  }
  return map[task] || 'entry'
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const getSummary = (post: SitePost) => stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const cleanDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/$/, '')

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskGrid: Record<TaskKey, string> = {
  article: 'grid gap-8 md:grid-cols-2 xl:grid-cols-3',
  listing: 'grid gap-5 xl:grid-cols-2',
  classified: 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3',
  image: 'columns-1 gap-5 [column-fill:_balance] sm:columns-2 xl:columns-3',
  sbm: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
  pdf: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
  profile: 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

const cardBase =
  'group editable-card-lift block rounded-[18px] border border-[#e5e7eb] bg-white overflow-hidden'

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const page = pagination.page || 1
  const label = displayLabel(task)
  const singular = singularLabel(task)
  const categoryLabel = category === 'all' ? 'All' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-white text-[#0a0a0a]">
        {/* Editorial masthead */}
        <header className="relative overflow-hidden border-b border-[#e5e7eb] bg-white">
          <div className="mx-auto w-full max-w-[1440px] px-5 pb-16 pt-20 sm:px-8 sm:pt-24 lg:px-16 lg:pb-24 lg:pt-32">
            <EditableReveal index={0}>
              <div className="flex items-center gap-3">
                <span className="editable-mono inline-flex items-center gap-2 rounded-full bg-[#ffef14] px-3 py-1 text-[0.68rem] text-[#0a0a0a]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0a0a0a]" />
                  {theme.kicker}
                </span>
                <span className="editable-mono text-[#5a5a5a]">Section {String(1).padStart(2, '0')}</span>
              </div>
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className="editable-display mt-8 max-w-[18ch] text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
                {voice?.headline || `Browse ${label}`}
              </h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
                <p className="max-w-[54ch] text-lg leading-[1.55] text-[#5a5a5a]">
                  {voice?.description || theme.note}
                </p>
                {voice?.chips?.length ? (
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    {voice.chips.map((chip) => (
                      <span key={chip} className="editable-mono rounded-full border border-[#0a0a0a]/12 bg-white px-3 py-1 text-[0.66rem] text-[#0a0a0a]">
                        {chip}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </EditableReveal>

            {task === 'article' ? (
              <div className="mt-14">
                <Ads slot="header" size={pickRandom(getSlotSizes('header'))} showLabel />
              </div>
            ) : null}

            <EditableReveal index={3}>
              <div className="mt-14 flex flex-col gap-4 border-t border-[#e5e7eb] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="editable-mono text-[#5a5a5a]">
                  <span className="text-[#0a0a0a]">{posts.length}</span> {posts.length === 1 ? singular : `${singular}s`} · {categoryLabel}
                </p>
                <form action={basePath} className="flex items-center gap-2.5">
                  <div className="relative">
                    <select
                      name="category"
                      defaultValue={category}
                      className="editable-mono h-11 appearance-none rounded-full border border-[#0a0a0a]/12 bg-white pl-4 pr-10 text-[0.7rem] text-[#0a0a0a] outline-none transition duration-500 focus:border-[#0a0a0a]"
                      aria-label={voice?.filterLabel || 'Filter'}
                    >
                      <option value="all">All</option>
                      {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5a5a5a]" />
                  </div>
                  <button className="inline-flex h-11 items-center rounded-full bg-[#0a0a0a] px-5 editable-mono text-[0.7rem] text-white transition duration-500 hover:bg-[#ffef14] hover:text-[#0a0a0a]">
                    Apply
                  </button>
                </form>
              </div>
            </EditableReveal>
          </div>
        </header>

        <section className="mx-auto w-full max-w-[1440px] px-5 py-20 sm:px-8 lg:px-16 lg:py-28">
          {posts.length ? (
            <>
              <div className={taskGrid[task]}>
                {posts.map((post, index) => (
                  <EditableReveal key={post.id || post.slug} index={index}>
                    <ArchivePostCard post={post} task={task} basePath={basePath} index={index} />
                  </EditableReveal>
                ))}
              </div>
              {task === 'listing' ? (
                <div className="mt-16">
                  <Ads slot="in-feed" size={pickRandom(getSlotSizes('in-feed'))} showLabel />
                </div>
              ) : null}
            </>
          ) : (
            <div className="mx-auto max-w-xl rounded-[18px] border border-dashed border-[#e5e7eb] bg-white px-8 py-16 text-center">
              <Search className="mx-auto h-7 w-7 text-[#5a5a5a]" />
              <h2 className="editable-display mt-5 text-2xl font-semibold tracking-[-0.02em]">Nothing filed yet</h2>
              <p className="mt-2 text-sm leading-6 text-[#5a5a5a]">Try another filter, or check back when new {label.toLowerCase()} entries land.</p>
            </div>
          )}

          {posts.length ? (
            <nav className="mt-20 flex items-center justify-center gap-3">
              {pagination.hasPrevPage ? (
                <Link href={pageHref(basePath, category, page - 1)} className="editable-mono rounded-full border border-[#0a0a0a]/12 px-5 py-2.5 text-[0.7rem] text-[#0a0a0a] transition duration-500 hover:bg-[#0a0a0a] hover:text-white">
                  ← Previous
                </Link>
              ) : null}
              <span className="editable-mono rounded-full bg-[#f1f3f5] px-5 py-2.5 text-[0.7rem] text-[#5a5a5a]">
                Page {page} of {pagination.totalPages || 1}
              </span>
              {pagination.hasNextPage ? (
                <Link href={pageHref(basePath, category, page + 1)} className="editable-mono rounded-full border border-[#0a0a0a]/12 px-5 py-2.5 text-[0.7rem] text-[#0a0a0a] transition duration-500 hover:bg-[#0a0a0a] hover:text-white">
                  Next →
                </Link>
              ) : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} index={index} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function CardArrow({ label }: { label: string }) {
  return (
    <span className="mt-6 inline-flex items-center gap-2 editable-mono text-[#0a0a0a] transition duration-500 group-hover:text-[#ffef14]">
      {label}
      <ArrowUpRight className="h-3.5 w-3.5 transition duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </span>
  )
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Filed')
  return (
    <Link href={href} className={cardBase}>
      <div className="relative aspect-[16/10] overflow-hidden bg-[#f1f3f5]">
        <img src={image} alt="" className="h-full w-full object-cover transition duration-[900ms] group-hover:scale-[1.04]" />
      </div>
      <div className="p-6 sm:p-7">
        <div className="flex items-center gap-2">
          <span className="editable-mono rounded-full border border-[#0a0a0a]/12 px-2.5 py-1 text-[0.65rem] text-[#0a0a0a]">{category}</span>
          <span className="editable-mono text-[#5a5a5a]">№{String(index + 1).padStart(2, '0')}</span>
        </div>
        <h2 className="editable-display mt-4 line-clamp-3 text-2xl font-semibold leading-[1.05] tracking-[-0.03em]">{post.title}</h2>
        <p className="mt-4 line-clamp-2 text-[0.95rem] leading-[1.55] text-[#5a5a5a]">{getSummary(post)}</p>
        <CardArrow label="Open entry" />
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col gap-0 p-0`}>
      <div className="flex items-center gap-5 p-5 sm:p-6">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[16px] border border-[#e5e7eb] bg-[#f1f3f5]">
          {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-9 w-9 text-[#5a5a5a]" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="editable-mono rounded-full bg-[#ffef14] px-2.5 py-1 text-[0.65rem] text-[#0a0a0a]">Place</span>
            <span className="editable-mono text-[#5a5a5a]">№{String(index + 1).padStart(2, '0')}</span>
          </div>
          <h2 className="editable-display mt-2 truncate text-xl font-semibold leading-[1.2] tracking-[-0.025em]">{post.title}</h2>
          <p className="mt-2 line-clamp-1 text-sm leading-[1.5] text-[#5a5a5a]">{getSummary(post)}</p>
        </div>
        <ArrowUpRight className="h-5 w-5 shrink-0 text-[#0a0a0a] transition duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
      <div className="flex flex-wrap gap-4 border-t border-[#e5e7eb] px-5 py-3 sm:px-6">
        {location ? <span className="editable-mono inline-flex items-center gap-1.5 text-[#5a5a5a]"><MapPin className="h-3.5 w-3.5" /> {location}</span> : null}
        {phone ? <span className="editable-mono inline-flex items-center gap-1.5 text-[#5a5a5a]"><Phone className="h-3.5 w-3.5" /> {phone}</span> : null}
        {website ? <span className="editable-mono inline-flex items-center gap-1.5 text-[#5a5a5a]"><Globe className="h-3.5 w-3.5" /> {cleanDomain(website)}</span> : null}
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-6 sm:p-7`}>
      <div className="flex items-start justify-between gap-4">
        <span className="editable-display text-3xl font-semibold tracking-[-0.03em] text-[#0a0a0a]">{price || 'Open'}</span>
        {condition ? <span className="editable-mono rounded-full bg-[#ffef14] px-3 py-1 text-[0.65rem] text-[#0a0a0a]">{condition}</span> : null}
      </div>
      <h2 className="editable-display mt-5 text-xl font-semibold leading-[1.2] tracking-[-0.025em]">{post.title}</h2>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-[1.55] text-[#5a5a5a]">{getSummary(post)}</p>
      <div className="mt-6 flex items-center justify-between border-t border-[#e5e7eb] pt-4">
        <span className="editable-mono inline-flex items-center gap-1.5 text-[#5a5a5a]">
          {location ? <><MapPin className="h-3.5 w-3.5" /> {location}</> : 'Details inside'}
        </span>
        <ArrowUpRight className="h-4 w-4 text-[#0a0a0a] transition duration-500 group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link href={href} className="group mb-5 block break-inside-avoid overflow-hidden rounded-[16px] border border-[#e5e7eb] bg-white transition duration-500 hover:-translate-y-1 hover:border-[#0a0a0a]">
      <div className={`relative overflow-hidden ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <img src={image} alt="" className="h-full w-full object-cover transition duration-[900ms] group-hover:scale-[1.05]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(0,0,0,0.78))] opacity-90" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h2 className="editable-display line-clamp-2 text-lg font-semibold leading-[1.15] tracking-[-0.025em] text-white">{post.title}</h2>
          <span className="editable-mono mt-2 inline-flex items-center gap-1.5 text-white/80">Open frame <ArrowUpRight className="h-3.5 w-3.5" /></span>
        </div>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className={`${cardBase} flex gap-4 p-6`}>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[#ffef14] text-[#0a0a0a]">
        <Globe className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="editable-mono text-[#5a5a5a]">Marked · №{String(index + 1).padStart(2, '0')}</span>
        <h2 className="editable-display mt-2 text-lg font-semibold leading-[1.2] tracking-[-0.025em]">{post.title}</h2>
        <p className="mt-2 line-clamp-2 text-sm leading-[1.5] text-[#5a5a5a]">{getSummary(post)}</p>
        {website ? <p className="editable-mono mt-3 truncate text-[#0a0a0a]">{cleanDomain(website)}</p> : null}
      </div>
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'Document')
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-6 sm:p-7`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#ffef14] text-[#0a0a0a]"><FileText className="h-6 w-6" /></div>
        <span className="editable-mono rounded-full border border-[#0a0a0a]/12 px-3 py-1 text-[0.65rem] text-[#0a0a0a]">{category}</span>
      </div>
      <h2 className="editable-display mt-6 text-xl font-semibold leading-[1.2] tracking-[-0.025em]">{post.title}</h2>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-[1.55] text-[#5a5a5a]">{getSummary(post)}</p>
      <span className="mt-6 inline-flex items-center gap-2 editable-mono text-[#0a0a0a] transition duration-500 group-hover:text-[#ffef14]">Open document <Download className="h-4 w-4" /></span>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col items-center p-7 text-center`}>
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[#e5e7eb] bg-[#f1f3f5]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 text-[#5a5a5a]" />}
      </div>
      <h2 className="editable-display mt-5 text-lg font-semibold leading-[1.2] tracking-[-0.025em]">{post.title}</h2>
      {role ? <p className="editable-mono mt-2 text-[#0a0a0a]">{role}</p> : null}
      <p className="mt-3 line-clamp-2 text-sm leading-[1.5] text-[#5a5a5a]">{getSummary(post)}</p>
    </Link>
  )
}
