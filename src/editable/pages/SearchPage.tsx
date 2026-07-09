import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'
import EditableReveal from '@/editable/shell/EditableReveal'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

const DISPLAY_LABEL: Partial<Record<TaskKey, string>> = {
  listing: 'Places',
  article: 'The Journal',
  classified: 'Board',
  image: 'Gallery',
  sbm: 'Marked',
  pdf: 'Library',
  profile: 'Roster',
}

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const summaryOf = (post: SitePost) => {
  const raw = post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''
  return stripHtml(raw).replace(/\s+/g, ' ').trim()
}

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const label = (task && DISPLAY_LABEL[task]) || SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Filed'

  return (
    <EditableReveal index={index}>
      <Link href={href} className="group editable-card-lift block overflow-hidden rounded-[18px] border border-[#e5e7eb] bg-white">
        {image ? (
          <div className="relative aspect-[16/10] overflow-hidden bg-[#f1f3f5]">
            <img src={image} alt="" className="h-full w-full object-cover transition duration-[900ms] group-hover:scale-[1.04]" />
            <span className="editable-mono absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[0.65rem] text-[#0a0a0a]">{label}</span>
          </div>
        ) : null}
        <div className="p-6">
          {!image ? <span className="editable-mono inline-block rounded-full bg-[#ffef14] px-3 py-1 text-[0.65rem] text-[#0a0a0a]">{label}</span> : null}
          <h2 className="editable-display mt-4 line-clamp-3 text-xl font-semibold leading-[1.15] tracking-[-0.025em]">{post.title}</h2>
          {summary ? <p className="mt-3 line-clamp-3 text-sm leading-[1.55] text-[#5a5a5a]">{summary}</p> : null}
          <span className="mt-5 inline-flex items-center gap-2 editable-mono text-[#0a0a0a] transition duration-500 group-hover:text-[#ffef14]">
            Open <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    </EditableReveal>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-white text-[#0a0a0a]">
        <section className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 lg:px-16 lg:py-24">
          <EditableReveal index={0}>
            <div className="editable-mono inline-flex items-center gap-2 rounded-full border border-[#0a0a0a]/12 px-3 py-1 text-[0.68rem] text-[#0a0a0a]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ffef14]" />
              {pagesContent.search.hero.badge}
            </div>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className="editable-display mt-8 max-w-[18ch] text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
              {pagesContent.search.hero.title}
            </h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className="mt-8 max-w-[54ch] text-lg leading-[1.55] text-[#5a5a5a]">{pagesContent.search.hero.description}</p>
          </EditableReveal>

          <EditableReveal index={3}>
            <form action="/search" className="mt-12 rounded-[20px] border border-[#e5e7eb] bg-white p-5 sm:p-6">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 rounded-full border border-[#0a0a0a]/12 bg-white px-5 py-3">
                <Search className="h-4 w-4 text-[#5a5a5a]" />
                <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[#9a9a9a]" />
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <label className="flex items-center gap-2 rounded-full border border-[#0a0a0a]/12 bg-white px-4 py-2.5">
                  <Filter className="h-4 w-4 text-[#5a5a5a]" />
                  <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#9a9a9a]" />
                </label>
                <select name="task" defaultValue={task} className="editable-mono rounded-full border border-[#0a0a0a]/12 bg-white px-4 py-2.5 text-[0.72rem] text-[#0a0a0a] outline-none">
                  <option value="">All sections</option>
                  {enabledTasks.map((item) => <option key={item.key} value={item.key}>{DISPLAY_LABEL[item.key] || item.label}</option>)}
                </select>
                <button className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0a0a0a] px-6 py-2.5 editable-mono text-[0.72rem] text-white transition duration-500 hover:bg-[#ffef14] hover:text-[#0a0a0a]" type="submit">
                  Search
                </button>
              </div>
            </form>
          </EditableReveal>

          <div className="mt-16 flex flex-wrap items-end justify-between gap-4 border-t border-[#e5e7eb] pt-8">
            <div>
              <p className="editable-mono text-[#5a5a5a]">{results.length} results</p>
              <h2 className="editable-display mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                {query ? `For "${query}"` : pagesContent.search.resultsTitle}
              </h2>
            </div>
            <Link href="/articles" className="inline-flex items-center gap-2 rounded-full border border-[#0a0a0a] px-5 py-2.5 editable-mono text-[0.7rem] text-[#0a0a0a] transition duration-500 hover:bg-[#0a0a0a] hover:text-white">
              Browse the Journal <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {results.length ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mt-10 rounded-[18px] border border-dashed border-[#e5e7eb] bg-white p-12 text-center">
              <p className="editable-display text-2xl font-semibold tracking-[-0.03em]">No matches.</p>
              <p className="mt-3 text-sm text-[#5a5a5a]">Try a different keyword, section or category.</p>
            </div>
          )}

          {/* Ads slot="footer" */}
          <div className="mt-16">
            <Ads slot="footer" size={pickRandom(getSlotSizes('footer'))} showLabel />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
