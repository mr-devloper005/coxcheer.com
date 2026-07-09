import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Filed'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

/* ------------------------- Editorial feature (hero) ----------------------- */
export function EditorialFeatureCard({ post, href, label = 'Cover story' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link
      href={href}
      className="group relative block min-h-[560px] overflow-hidden rounded-[24px] bg-[#0a0a0a] text-white lg:min-h-[680px]"
    >
      <img
        src={getEditablePostImage(post)}
        alt={post.title}
        className={`absolute inset-0 h-full w-full object-cover opacity-70 transition duration-[900ms] group-hover:opacity-90 group-hover:scale-[1.03]`}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.15)_45%,rgba(0,0,0,0.85)_100%)]" />
      <div className="relative z-10 flex h-full min-h-[560px] flex-col justify-between p-8 lg:min-h-[680px] lg:p-12">
        <div className="flex items-center gap-2">
          <span className="editable-mono rounded-full bg-[#ffef14] px-3 py-1 text-[0.68rem] text-[#0a0a0a]">
            {label}
          </span>
          <span className="editable-mono text-white/70">{getEditableCategory(post)}</span>
        </div>
        <div>
          <h3 className="editable-display max-w-4xl text-4xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-5xl lg:text-[4rem]">
            {post.title}
          </h3>
          <p className="mt-5 max-w-2xl text-[0.95rem] leading-[1.55] text-white/80">
            {getEditableExcerpt(post, 200)}
          </p>
          <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[0.85rem] font-medium text-[#0a0a0a] transition duration-500 group-hover:bg-[#ffef14]">
            Open the piece <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

/* ---------------------------- Rail (compact) ---------------------------- */
export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group ${dc.layout.minRailCard} editable-card-lift block overflow-hidden rounded-[14px] border border-[#e5e7eb] bg-white`}
    >
      <div className={`${dc.media.frame} aspect-[4/5]`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-[900ms] group-hover:scale-[1.04]"
        />
        <span className="editable-mono absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[0.62rem] text-[#0a0a0a]">
          №{String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="p-4">
        <p className="editable-mono text-[#5a5a5a]">{getEditableCategory(post)}</p>
        <h3 className="mt-2 line-clamp-3 text-[1.05rem] font-medium leading-[1.2] tracking-[-0.02em] text-[#0a0a0a]">
          {post.title}
        </h3>
      </div>
    </Link>
  )
}

/* ------------------------------ Compact index ---------------------------- */
export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className="group grid min-w-0 gap-5 border-b border-[#e5e7eb] py-6 transition duration-500 hover:bg-[#f1f3f5]/60 sm:grid-cols-[64px_minmax(0,1fr)_auto]"
    >
      <span className="editable-mono flex h-10 w-14 items-center justify-center rounded-full bg-[#0a0a0a] text-white">
        №{String(index + 1).padStart(2, '0')}
      </span>
      <div className="min-w-0">
        <p className="editable-mono text-[#5a5a5a]">{getEditableCategory(post)}</p>
        <h3 className="mt-2 line-clamp-2 text-xl font-medium leading-[1.2] tracking-[-0.025em] text-[#0a0a0a] sm:text-2xl">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-[1.55] text-[#5a5a5a]">{getEditableExcerpt(post, 130)}</p>
      </div>
      <span className="mt-1 hidden shrink-0 items-center gap-1 self-start editable-mono text-[#0a0a0a] transition duration-500 group-hover:text-[#ffef14] sm:inline-flex">
        Open <ArrowUpRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  )
}

/* --------------------------- Article list card --------------------------- */
export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className="group editable-card-lift grid min-w-0 gap-6 overflow-hidden rounded-[18px] border border-[#e5e7eb] bg-white p-4 sm:grid-cols-[280px_minmax(0,1fr)]"
    >
      <div className={`${dc.media.frame} aspect-[4/3] sm:aspect-auto sm:min-h-[220px]`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-[900ms] group-hover:scale-[1.03]"
        />
      </div>
      <div className="min-w-0 p-2 sm:py-4 sm:pr-5">
        <div className="flex items-center gap-2">
          <span className="editable-mono rounded-full border border-[#0a0a0a]/12 px-2.5 py-1 text-[0.65rem] text-[#0a0a0a]">
            {getEditableCategory(post)}
          </span>
          <span className="editable-mono text-[#5a5a5a]">№{String(index + 1).padStart(2, '0')}</span>
        </div>
        <h2 className="editable-display mt-4 line-clamp-3 text-2xl font-semibold leading-[1.02] tracking-[-0.035em] text-[#0a0a0a] sm:text-3xl">
          {post.title}
        </h2>
        <p className="mt-4 line-clamp-3 text-sm leading-[1.6] text-[#5a5a5a] sm:text-[0.95rem]">
          {getEditableExcerpt(post, 200)}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 editable-mono text-[#0a0a0a] transition duration-500 group-hover:text-[#ffef14]">
          Open the entry <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}
