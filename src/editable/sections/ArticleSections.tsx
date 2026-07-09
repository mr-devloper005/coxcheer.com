import Link from 'next/link'
import { ArrowUpRight, ChevronLeft } from 'lucide-react'
import type { SitePost, SiteFeedPagination } from '@/lib/site-connector'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { pagesContent } from '@/editable/content/pages.content'
import { ArticleListCard, postHref } from '@/editable/cards/PostCards'

export function EditableArticleArchive({
  posts,
  pagination,
  category = 'all',
  basePath = '/articles',
}: {
  posts: SitePost[]
  pagination: SiteFeedPagination
  category?: string
  basePath?: string
}) {
  const voice = taskPageVoices.article
  const page = pagination.page || 1
  const pageHref = (nextPage: number) =>
    `${basePath}?${new URLSearchParams({ ...(category && category !== 'all' ? { category } : {}), page: String(nextPage) }).toString()}`

  return (
    <main className="min-h-screen bg-white text-[#0a0a0a]">
      <section className="mx-auto w-full max-w-[1440px] px-5 pt-16 sm:px-8 sm:pt-24 lg:px-16 lg:pt-32">
        <div className="rounded-[28px] bg-[#0a0a0a] p-8 text-white sm:p-12 lg:p-16">
          <p className="editable-mono text-white/60">{voice.eyebrow}</p>
          <h1 className="editable-display mt-6 max-w-[20ch] text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
            {voice.headline}
          </h1>
          <p className="mt-8 max-w-[52ch] text-lg leading-[1.55] text-white/70">{voice.description}</p>
          <form action={basePath} className="mt-10 flex max-w-xl flex-col gap-3 sm:flex-row">
            <select
              name="category"
              defaultValue={category || 'all'}
              className="editable-mono min-w-0 flex-1 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-[0.72rem] text-white outline-none"
            >
              <option value="all" className="text-[#0a0a0a]">All categories</option>
              {CATEGORY_OPTIONS.map((item) => (
                <option key={item.slug} value={item.slug} className="text-[#0a0a0a]">
                  {item.name}
                </option>
              ))}
            </select>
            <button className="rounded-full bg-[#ffef14] px-6 py-3 editable-mono text-[0.72rem] text-[#0a0a0a] transition duration-500 hover:bg-white">
              Apply
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-5 py-20 sm:px-8 lg:px-16 lg:py-28">
        {posts.length ? (
          <div className="grid gap-6">
            {posts.map((post, index) => (
              <ArticleListCard
                key={post.id}
                post={post}
                href={postHref('article', post, basePath)}
                index={index + (page - 1) * pagination.limit}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[18px] border border-dashed border-[#e5e7eb] bg-white p-10 text-center">
            <h2 className="editable-display text-3xl font-semibold tracking-[-0.035em]">Nothing filed yet</h2>
            <p className="mt-3 text-sm text-[#5a5a5a]">Try another category or return to the front.</p>
          </div>
        )}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
          {pagination.hasPrevPage ? (
            <Link href={pageHref(page - 1)} className="editable-mono rounded-full border border-[#0a0a0a]/12 px-5 py-2.5 text-[0.7rem] text-[#0a0a0a] transition duration-500 hover:bg-[#0a0a0a] hover:text-white">
              ← Previous
            </Link>
          ) : null}
          <span className="editable-mono rounded-full bg-[#f1f3f5] px-5 py-2.5 text-[0.7rem] text-[#5a5a5a]">
            Page {page} of {pagination.totalPages || 1}
          </span>
          {pagination.hasNextPage ? (
            <Link href={pageHref(page + 1)} className="editable-mono rounded-full border border-[#0a0a0a]/12 px-5 py-2.5 text-[0.7rem] text-[#0a0a0a] transition duration-500 hover:bg-[#0a0a0a] hover:text-white">
              Next →
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  )
}

export function EditableArticleDetailShell({ slug, post }: { slug: string; post: SitePost | null }) {
  const voice = taskPageVoices.article
  return (
    <main className="min-h-screen bg-white text-[#0a0a0a]">
      <section className="mx-auto w-full max-w-[1440px] px-5 pt-16 sm:px-8 lg:px-16">
        <div className="grid gap-8 rounded-[28px] border border-[#e5e7eb] bg-white p-8 sm:p-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <Link href="/articles" className="editable-mono inline-flex items-center gap-2 rounded-full border border-[#0a0a0a]/12 px-4 py-2 text-[0.7rem] text-[#0a0a0a] transition duration-500 hover:bg-[#0a0a0a] hover:text-white">
              <ChevronLeft className="h-3.5 w-3.5" /> The Journal
            </Link>
            <p className="editable-mono mt-8 text-[#5a5a5a]">{voice.eyebrow}</p>
            <h1 className="editable-display mt-4 max-w-[22ch] text-[clamp(2.5rem,7vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
              {post?.title || pagesContent.detailPages.article.fallbackTitle}
            </h1>
          </div>
          <aside className="min-w-0 rounded-[20px] bg-[#ffef14] p-6 text-[#0a0a0a]">
            <p className="editable-mono">Reading note</p>
            <p className="mt-4 text-[0.95rem] leading-[1.55]">{voice.secondaryNote}</p>
            <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] px-5 py-2.5 text-[0.85rem] font-medium text-white transition duration-500 hover:bg-white hover:text-[#0a0a0a]">
              Write in <ArrowUpRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </section>
      <section className="mx-auto w-full max-w-5xl px-5 pb-24 pt-8 sm:px-8">
        <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-8 sm:p-10">
          <p className="text-[1.05rem] leading-[1.7] text-[#0a0a0a]">
            {post?.summary || `Journal entry for ${slug} will render through the detail page.`}
          </p>
        </div>
      </section>
    </main>
  )
}
