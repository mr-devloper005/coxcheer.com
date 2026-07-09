import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, ArrowUpRight, Bookmark, Building2, CheckCircle2, Clock3, Download,
  ExternalLink, FileText, Globe2, Mail, MapPin, Phone, Quote, Tag, UserRound,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { taskThemeStyle } from '@/editable/theme/task-themes'
import EditableReveal from '@/editable/shell/EditableReveal'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

// Display-label rename.
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

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here soon.'
}

const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'
const linkifyMarkdown = (value: string) => value.replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_m, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)
const linkifyText = (value: string) => linkifyMarkdown(value).replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_m, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)
const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_m, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})
const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))
const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value.split(/\n{2,}/).map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`).join('')
}
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback

const readingTime = (post: SitePost) => {
  const text = stripHtml(getBody(post)) + ' ' + stripHtml(summaryText(post))
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}

const extractSectionTitles = (post: SitePost) => {
  const html = getBody(post)
  if (!/<h[23]/i.test(html)) return [] as string[]
  return Array.from(html.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi))
    .map((m) => stripHtml(m[1]))
    .filter(Boolean)
    .slice(0, 6)
}

const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-white text-[#0a0a0a]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

/* ----------------------- Shared building blocks ----------------------- */
function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="editable-mono inline-flex items-center gap-2 text-[#5a5a5a] transition duration-500 hover:text-[#0a0a0a]">
      <ArrowLeft className="h-3.5 w-3.5" /> Back to {displayLabel(task)}
    </Link>
  )
}

function Chip({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      className={`editable-mono inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.65rem] ${
        accent ? 'bg-[#ffef14] text-[#0a0a0a]' : 'border border-[#0a0a0a]/12 bg-white text-[#0a0a0a]'
      }`}
    >
      {children}
    </span>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content mt-10 max-w-none text-[#0a0a0a] ${compact ? 'text-[15px] leading-[1.7]' : 'text-[1.08rem] leading-[1.75]'}`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function TagChips({ post }: { post: SitePost }) {
  const tags = post.tags?.filter(Boolean).slice(0, 8) || []
  if (!tags.length) return null
  return (
    <div className="mt-10 flex flex-wrap gap-2 border-t border-[#e5e7eb] pt-8">
      <span className="editable-mono self-center pr-2 text-[#5a5a5a]">Filed under</span>
      {tags.map((tag) => (
        <span key={tag} className="editable-mono rounded-full border border-[#0a0a0a]/12 bg-white px-3 py-1 text-[0.65rem] text-[#0a0a0a]">
          #{tag}
        </span>
      ))}
    </div>
  )
}

function StickyLabel({ children }: { children: React.ReactNode }) {
  return <p className="editable-mono text-[#5a5a5a]">{children}</p>
}

/* =========================== ARTICLE DETAIL =========================== */
function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  const hero = images[0]
  const category = categoryOf(post, 'Field notes')
  const rt = readingTime(post)
  const sections = extractSectionTitles(post)
  const lead = leadText(post)
  const author = SITE_CONFIG.name

  return (
    <>
      {/* Masthead */}
      <section className="border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-14 pt-16 sm:px-8 sm:pt-20 lg:px-16 lg:pb-20 lg:pt-28">
          <EditableReveal index={0}>
            <BackLink task="article" />
          </EditableReveal>
          <EditableReveal index={1}>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <Chip accent>The Journal</Chip>
              <Chip>{category}</Chip>
              <Chip><Clock3 className="h-3 w-3" /> {rt} min read</Chip>
            </div>
          </EditableReveal>
          <EditableReveal index={2}>
            <h1 className="editable-display mt-8 max-w-[22ch] text-[clamp(2.5rem,7.5vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
              {post.title}
            </h1>
          </EditableReveal>
          <EditableReveal index={3}>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <span className="editable-mono text-[#0a0a0a]">Filed by {author}</span>
              <span className="editable-mono text-[#5a5a5a]">·</span>
              <span className="editable-mono text-[#5a5a5a]">Section: The Journal</span>
            </div>
          </EditableReveal>
        </div>
      </section>

      {/* Hero image */}
      {hero ? (
        <EditableReveal index={0}>
          <section className="bg-white">
            <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-16">
              <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[24px] bg-[#f1f3f5]">
                <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
              </div>
            </div>
          </section>
        </EditableReveal>
      ) : null}

      {/* Body + sidebar */}
      <section className="bg-white">
        <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16 lg:px-16 lg:py-24">
          <article className="min-w-0">
            {lead ? (
              <EditableReveal index={0}>
                <div className="relative rounded-[18px] border border-[#e5e7eb] bg-[#f1f3f5] p-8 sm:p-10">
                  <Quote className="absolute -top-3 left-8 h-6 w-6 rounded-full bg-[#ffef14] p-1 text-[#0a0a0a]" />
                  <p className="editable-display text-2xl font-medium leading-[1.3] tracking-[-0.02em] text-[#0a0a0a] sm:text-[1.65rem]">
                    {lead}
                  </p>
                </div>
              </EditableReveal>
            ) : null}

            {/* Quick-facts strip (no date) */}
            <EditableReveal index={1}>
              <div className="mt-10 grid gap-4 rounded-[18px] border border-[#e5e7eb] bg-white p-6 sm:grid-cols-3">
                <div>
                  <StickyLabel>Section</StickyLabel>
                  <p className="mt-1 text-[0.95rem] font-medium text-[#0a0a0a]">The Journal</p>
                </div>
                <div>
                  <StickyLabel>Reading time</StickyLabel>
                  <p className="mt-1 text-[0.95rem] font-medium text-[#0a0a0a]">{rt} minutes</p>
                </div>
                <div>
                  <StickyLabel>Category</StickyLabel>
                  <p className="mt-1 text-[0.95rem] font-medium text-[#0a0a0a]">{category}</p>
                </div>
              </div>
            </EditableReveal>

            <BodyContent post={post} />

            {/* Repeated CTA */}
            <EditableReveal index={0}>
              <aside className="my-14 rounded-[20px] bg-[#0a0a0a] p-8 text-white sm:p-10">
                <p className="editable-mono text-white/60">Kept close</p>
                <h3 className="editable-display mt-4 text-2xl font-semibold leading-[1.1] tracking-[-0.025em] sm:text-3xl">
                  Get new dispatches from the field.
                </h3>
                <p className="mt-3 text-white/70">
                  A slow-read companion delivered when there's something worth reading.
                </p>
                <Link href="/signup" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#ffef14] px-5 py-2.5 text-[0.85rem] font-medium text-[#0a0a0a] transition duration-500 hover:bg-white">
                  Follow the Journal <ArrowUpRight className="h-4 w-4" />
                </Link>
              </aside>
            </EditableReveal>

            <TagChips post={post} />

            {/* Ads slot="article-bottom" */}
            <div className="mt-14">
              <Ads slot="article-bottom" size={pickRandom(getSlotSizes('article-bottom'))} showLabel />
            </div>

            <EditableArticleComments slug={post.slug} comments={comments} />
          </article>

          {/* Sticky sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffef14] text-[#0a0a0a]">
                  <span className="editable-display text-[1.1rem] font-semibold">{author.slice(0, 1).toUpperCase()}</span>
                </span>
                <div>
                  <StickyLabel>Filed by</StickyLabel>
                  <p className="text-[0.95rem] font-medium text-[#0a0a0a]">{author}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-[1.55] text-[#5a5a5a]">
                A neighborhood field guide of independent places and slow-read dispatches.
              </p>
            </div>
            {sections.length ? (
              <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6">
                <StickyLabel>In this piece</StickyLabel>
                <ul className="mt-4 grid gap-2.5">
                  {sections.map((title, i) => (
                    <li key={`${title}-${i}`} className="flex items-start gap-2 text-[0.9rem] leading-[1.5] text-[#0a0a0a]">
                      <span className="editable-mono mt-0.5 text-[#5a5a5a]">§{String(i + 1).padStart(2, '0')}</span>
                      <span>{title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="rounded-[18px] bg-[#ffef14] p-6">
              <StickyLabel>Subscribe</StickyLabel>
              <h3 className="editable-display mt-3 text-xl font-semibold leading-[1.15] tracking-[-0.025em] text-[#0a0a0a]">
                Follow the Journal
              </h3>
              <Link href="/signup" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0a0a0a] px-4 py-2.5 text-[0.85rem] font-medium text-white transition duration-500 hover:bg-white hover:text-[#0a0a0a]">
                Get updates <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <ArticleRelated related={related} />
    </>
  )
}

function ArticleRelated({ related }: { related: SitePost[] }) {
  if (!related.length) return null
  return (
    <section className="border-t border-[#e5e7eb] bg-[#f1f3f5]">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-20 sm:px-8 lg:px-16">
        <EditableReveal index={0}>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="editable-mono text-[#5a5a5a]">More from the Journal</p>
              <h2 className="editable-display mt-4 text-3xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-4xl lg:text-[3rem]">
                Keep reading.
              </h2>
            </div>
            <Link href="/articles" className="inline-flex items-center gap-2 rounded-full border border-[#0a0a0a] px-5 py-2.5 editable-mono text-[0.7rem] text-[#0a0a0a] transition duration-500 hover:bg-[#0a0a0a] hover:text-white">
              See all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </EditableReveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item, i) => (
            <EditableReveal key={item.id || item.slug} index={i}>
              <ArticleRelatedCard post={item} />
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function ArticleRelatedCard({ post }: { post: SitePost }) {
  const image = getImages(post)[0]
  const href = `/articles/${post.slug}`
  const rt = readingTime(post)
  return (
    <Link href={href} className="group editable-card-lift block overflow-hidden rounded-[16px] border border-[#e5e7eb] bg-white">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f1f3f5]">
        {image ? (
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-[900ms] group-hover:scale-[1.05]" />
        ) : (
          <div className="flex h-full items-center justify-center"><FileText className="h-7 w-7 text-[#5a5a5a]" /></div>
        )}
      </div>
      <div className="p-5">
        <p className="editable-mono text-[#5a5a5a]">{categoryOf(post, 'Field notes')}</p>
        <h3 className="mt-3 line-clamp-3 text-[1.05rem] font-medium leading-[1.25] tracking-[-0.02em] text-[#0a0a0a]">
          {post.title}
        </h3>
        <p className="editable-mono mt-4 text-[#5a5a5a]"><Clock3 className="mr-1 inline h-3 w-3" />{rt} min read</p>
      </div>
    </Link>
  )
}

/* =========================== LISTING DETAIL =========================== */
function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const hero = images[0]
  const gallery = images.slice(1, 7)
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const hours = getField(post, ['hours', 'openHours', 'schedule'])
  const category = getField(post, ['category']) || 'Independent place'
  const mapSrc = mapSrcFor(post)
  const lead = leadText(post)

  return (
    <>
      {/* Hero */}
      <section className="relative border-b border-[#e5e7eb]">
        <div className="mx-auto w-full max-w-[1440px] px-5 pt-16 sm:px-8 sm:pt-20 lg:px-16 lg:pt-24">
          <EditableReveal index={0}>
            <BackLink task="listing" />
          </EditableReveal>
          <EditableReveal index={1}>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <Chip accent>Places</Chip>
              <Chip>{category}</Chip>
              {address ? <Chip><MapPin className="h-3 w-3" /> {address}</Chip> : null}
            </div>
          </EditableReveal>
          <EditableReveal index={2}>
            <h1 className="editable-display mt-8 max-w-[22ch] text-[clamp(2.25rem,6.5vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.04em]">
              {post.title}
            </h1>
          </EditableReveal>
        </div>
        {hero ? (
          <EditableReveal index={3}>
            <div className="mx-auto w-full max-w-[1440px] px-5 pb-16 pt-10 sm:px-8 lg:px-16 lg:pb-20">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[24px] bg-[#f1f3f5]">
                <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
              </div>
            </div>
          </EditableReveal>
        ) : null}

        {/* Quick facts strip */}
        <EditableReveal index={0}>
          <div className="mx-auto w-full max-w-[1440px] border-t border-[#e5e7eb] px-5 py-6 sm:px-8 lg:px-16">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <QuickFact label="Location" value={address || 'On request'} Icon={MapPin} />
              <QuickFact label="Phone" value={phone || 'On request'} Icon={Phone} />
              <QuickFact label="Hours" value={hours || 'On request'} Icon={Clock3} />
              <QuickFact label="Verified" value="By the guide" Icon={CheckCircle2} />
            </div>
          </div>
        </EditableReveal>
      </section>

      {/* Body + sidebar */}
      <section className="bg-white">
        <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16 lg:px-16 lg:py-24">
          <article className="min-w-0">
            {lead ? (
              <EditableReveal index={0}>
                <p className="editable-display max-w-[52ch] text-2xl font-medium leading-[1.3] tracking-[-0.02em] text-[#0a0a0a] sm:text-[1.6rem]">
                  {lead}
                </p>
              </EditableReveal>
            ) : null}
            <EditableReveal index={1}>
              <h2 className="editable-display mt-14 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                About the place
              </h2>
            </EditableReveal>
            <BodyContent post={post} />

            {gallery.length ? (
              <div className="mt-16">
                <EditableReveal index={0}>
                  <div className="flex items-end justify-between gap-4">
                    <h2 className="editable-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Gallery</h2>
                    <span className="editable-mono text-[#5a5a5a]">{gallery.length} images</span>
                  </div>
                </EditableReveal>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {gallery.map((image, i) => (
                    <EditableReveal key={`${image}-${i}`} index={i}>
                      <figure className="relative aspect-[4/3] overflow-hidden rounded-[16px] border border-[#e5e7eb] bg-[#f1f3f5]">
                        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-[900ms] hover:scale-[1.04]" />
                      </figure>
                    </EditableReveal>
                  ))}
                </div>
              </div>
            ) : null}

            {mapSrc ? (
              <EditableReveal index={0}>
                <div className="mt-16 overflow-hidden rounded-[18px] border border-[#e5e7eb] bg-white">
                  <div className="flex items-center gap-2 border-b border-[#e5e7eb] p-5">
                    <MapPin className="h-4 w-4 text-[#0a0a0a]" />
                    <span className="editable-mono text-[#0a0a0a]">On the map</span>
                    <span className="ml-auto text-sm text-[#5a5a5a]">{address}</span>
                  </div>
                  <iframe src={mapSrc} title="Map" loading="lazy" className="h-[380px] w-full border-0" />
                </div>
              </EditableReveal>
            ) : null}

            <TagChips post={post} />
          </article>

          {/* Sticky sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6">
              <StickyLabel>Contact</StickyLabel>
              <div className="mt-5 grid gap-3">
                {address ? <ContactRow Icon={MapPin} label="Address" value={address} /> : null}
                {phone ? <ContactRow Icon={Phone} label="Phone" value={phone} href={`tel:${phone}`} /> : null}
                {email ? <ContactRow Icon={Mail} label="Email" value={email} href={`mailto:${email}`} /> : null}
                {website ? <ContactRow Icon={Globe2} label="Website" value={website.replace(/^https?:\/\//, '')} href={website} /> : null}
                {hours ? <ContactRow Icon={Clock3} label="Hours" value={hours} /> : null}
              </div>
              {website ? (
                <Link href={website} target="_blank" rel="noreferrer" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0a0a0a] px-4 py-3 text-[0.85rem] font-medium text-white transition duration-500 hover:bg-[#ffef14] hover:text-[#0a0a0a]">
                  Visit the place <ExternalLink className="h-4 w-4" />
                </Link>
              ) : (
                <Link href="/contact" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0a0a0a] px-4 py-3 text-[0.85rem] font-medium text-white transition duration-500 hover:bg-[#ffef14] hover:text-[#0a0a0a]">
                  Get in touch <ArrowUpRight className="h-4 w-4" />
                </Link>
              )}
            </div>

            <div className="rounded-[18px] bg-[#ffef14] p-6">
              <StickyLabel>Trust</StickyLabel>
              <ul className="mt-5 grid gap-3 text-[0.9rem] text-[#0a0a0a]">
                <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> Vetted by the guide.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> Independently owned.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> Currently open for visits.</li>
              </ul>
            </div>

            <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-4">
              <Ads slot="sidebar" size={pickRandom(getSlotSizes('sidebar'))} showLabel />
            </div>
          </aside>
        </div>
      </section>

      <ListingRelated related={related} />
    </>
  )
}

function QuickFact({ label, value, Icon }: { label: string; value: string; Icon: typeof MapPin }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#f1f3f5] text-[#0a0a0a]">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <StickyLabel>{label}</StickyLabel>
        <p className="mt-0.5 line-clamp-2 text-[0.95rem] font-medium text-[#0a0a0a]">{value}</p>
      </div>
    </div>
  )
}

function ContactRow({ Icon, label, value, href }: { Icon: typeof MapPin; label: string; value: string; href?: string }) {
  const Wrapper: any = href ? Link : 'div'
  const wrapperProps = href ? { href, ...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {}) } : {}
  return (
    <Wrapper {...wrapperProps} className={`group flex items-start gap-3 rounded-[12px] border border-transparent p-2 -mx-2 ${href ? 'transition duration-500 hover:border-[#0a0a0a]/12 hover:bg-[#f1f3f5]' : ''}`}>
      <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#0a0a0a] text-white">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <StickyLabel>{label}</StickyLabel>
        <p className="mt-0.5 break-words text-[0.9rem] font-medium text-[#0a0a0a]">{value}</p>
      </div>
      {href ? <ArrowUpRight className="mt-2 h-3.5 w-3.5 text-[#5a5a5a] transition group-hover:text-[#0a0a0a]" /> : null}
    </Wrapper>
  )
}

function ListingRelated({ related }: { related: SitePost[] }) {
  if (!related.length) return null
  return (
    <section className="border-t border-[#e5e7eb] bg-[#f1f3f5]">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-20 sm:px-8 lg:px-16">
        <EditableReveal index={0}>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="editable-mono text-[#5a5a5a]">More places nearby</p>
              <h2 className="editable-display mt-4 text-3xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-4xl lg:text-[3rem]">
                Wander further.
              </h2>
            </div>
            <Link href="/listings" className="inline-flex items-center gap-2 rounded-full border border-[#0a0a0a] px-5 py-2.5 editable-mono text-[0.7rem] text-[#0a0a0a] transition duration-500 hover:bg-[#0a0a0a] hover:text-white">
              Open the directory <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </EditableReveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item, i) => (
            <EditableReveal key={item.id || item.slug} index={i}>
              <ListingRelatedCard post={item} />
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function ListingRelatedCard({ post }: { post: SitePost }) {
  const image = getImages(post)[0]
  const href = `/listings/${post.slug}`
  const category = getField(post, ['category']) || 'Place'
  return (
    <Link href={href} className="group editable-card-lift block overflow-hidden rounded-[16px] border border-[#e5e7eb] bg-white">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f1f3f5]">
        {image ? <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-[900ms] group-hover:scale-[1.05]" /> : <div className="flex h-full items-center justify-center"><Building2 className="h-7 w-7 text-[#5a5a5a]" /></div>}
      </div>
      <div className="p-5">
        <p className="editable-mono text-[#5a5a5a]">{category}</p>
        <h3 className="mt-3 line-clamp-2 text-[1.05rem] font-medium leading-[1.25] tracking-[-0.02em] text-[#0a0a0a]">{post.title}</h3>
      </div>
    </Link>
  )
}

/* --------- Other task detail views (kept coherent, no ads/dates) ---------- */
function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  return (
    <>
      <section className="mx-auto grid w-full max-w-[1440px] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[380px_minmax(0,1fr)] lg:px-16 lg:py-24">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BackLink task="classified" />
          <div className="mt-8 rounded-[18px] border border-[#e5e7eb] bg-white p-7">
            <Chip accent>Board</Chip>
            <h1 className="editable-display mt-5 text-2xl font-semibold leading-[1.1] tracking-[-0.025em]">{post.title}</h1>
            <p className="editable-display mt-6 text-4xl font-semibold tracking-[-0.03em] text-[#0a0a0a]">{price || 'Open'}</p>
            <div className="mt-5 grid gap-2">
              {condition ? <ContactRow Icon={Tag} label="Condition" value={condition} /> : null}
              {location ? <ContactRow Icon={MapPin} label="Location" value={location} /> : null}
              {phone ? <ContactRow Icon={Phone} label="Phone" value={phone} href={`tel:${phone}`} /> : null}
              {email ? <ContactRow Icon={Mail} label="Email" value={email} href={`mailto:${email}`} /> : null}
            </div>
          </div>
        </aside>
        <article className="min-w-0">
          {images[0] ? (
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[20px] bg-[#f1f3f5]">
              <img src={images[0]} alt="" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          ) : null}
          <BodyContent post={post} />
          <TagChips post={post} />
        </article>
      </section>
    </>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 lg:px-16 lg:py-24">
      <BackLink task="image" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="columns-1 gap-5 [column-fill:_balance] sm:columns-2">
          {gallery.map((image, i) => (
            <figure key={`${image}-${i}`} className="mb-5 break-inside-avoid overflow-hidden rounded-[16px] border border-[#e5e7eb] bg-white">
              <img src={image} alt="" className="w-full object-cover" />
            </figure>
          ))}
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Chip accent>Gallery</Chip>
          <h1 className="editable-display mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl">{post.title}</h1>
          {leadText(post) ? <p className="mt-6 text-lg leading-[1.55] text-[#5a5a5a]">{leadText(post)}</p> : null}
          <BodyContent post={post} compact />
        </aside>
      </div>
    </section>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
      <BackLink task="sbm" />
      <div className="mt-10 flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#ffef14] text-[#0a0a0a]"><Bookmark className="h-7 w-7" /></div>
      <div className="mt-6"><Chip accent>Marked</Chip></div>
      <h1 className="editable-display mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl">{post.title}</h1>
      {leadText(post) ? <p className="mt-6 text-lg leading-[1.55] text-[#5a5a5a]">{leadText(post)}</p> : null}
      {website ? (
        <Link href={website} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] px-6 py-3 text-[0.9rem] font-medium text-white transition duration-500 hover:bg-[#ffef14] hover:text-[#0a0a0a]">
          Open the reference <ExternalLink className="h-4 w-4" />
        </Link>
      ) : null}
      <BodyContent post={post} />
      <TagChips post={post} />
    </article>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-16 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="min-w-0">
          <BackLink task="pdf" />
          <div className="mt-10 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-[16px] bg-[#ffef14] text-[#0a0a0a]"><FileText className="h-8 w-8" /></div>
            <div>
              <Chip accent>Library</Chip>
              <h1 className="editable-display mt-3 text-3xl font-semibold leading-[1.1] tracking-[-0.025em] sm:text-4xl">{post.title}</h1>
            </div>
          </div>
          <BodyContent post={post} />
          {fileUrl ? (
            <div className="mt-12 overflow-hidden rounded-[18px] border border-[#e5e7eb] bg-white">
              <div className="flex items-center justify-between gap-3 border-b border-[#e5e7eb] p-4">
                <span className="editable-mono text-[#0a0a0a]">Document preview</span>
                <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] px-4 py-2 text-[0.75rem] font-medium text-white transition duration-500 hover:bg-[#ffef14] hover:text-[#0a0a0a]">Download <Download className="h-4 w-4" /></Link>
              </div>
              <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full bg-[#f1f3f5]" />
            </div>
          ) : null}
        </article>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {fileUrl ? (
            <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6">
              <StickyLabel>Get this document</StickyLabel>
              <p className="mt-3 text-sm leading-[1.55] text-[#5a5a5a]">Open or download the full file in a new tab.</p>
              <Link href={fileUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0a0a0a] px-5 py-3 text-[0.85rem] font-medium text-white transition duration-500 hover:bg-[#ffef14] hover:text-[#0a0a0a]">Download <Download className="h-4 w-4" /></Link>
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 lg:px-16 lg:py-24">
      <BackLink task="profile" />
      <div className="mt-10 grid gap-12 lg:grid-cols-[380px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-8 text-center">
            <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-[#e5e7eb] bg-[#f1f3f5]">
              {images[0] ? <img src={images[0]} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-14 w-14 text-[#5a5a5a]" />}
            </div>
            <h1 className="editable-display mt-6 text-2xl font-semibold tracking-[-0.025em]">{post.title}</h1>
            {role ? <p className="editable-mono mt-2 text-[#0a0a0a]">{role}</p> : null}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] px-4 py-2 text-[0.75rem] font-medium text-white transition duration-500 hover:bg-[#ffef14] hover:text-[#0a0a0a]"><ExternalLink className="h-3.5 w-3.5" /> Website</Link> : null}
              {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[#0a0a0a] px-4 py-2 text-[0.75rem] font-medium text-[#0a0a0a] transition duration-500 hover:bg-[#0a0a0a] hover:text-white"><Mail className="h-3.5 w-3.5" /> Email</a> : null}
            </div>
          </div>
        </aside>
        <article className="min-w-0">
          <Chip accent>Roster</Chip>
          <BodyContent post={post} />
          <TagChips post={post} />
        </article>
      </div>
    </section>
  )
}
