'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { MessageSquare, Search } from 'lucide-react'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

type StoredComment = {
  id: string
  name: string
  email?: string
  comment: string
  createdAt: string
  articleTitle?: string
  articleSlug?: string
}

const COMMENTS_PER_PAGE = 8
const COMMENT_KEY_PREFIX = 'slot4:article-comments:'

const formatDate = (value: string) => {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value))
  } catch {
    return 'Just now'
  }
}

const readCommentsFromStorage = (): StoredComment[] => {
  const items: StoredComment[] = []
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index)
    if (!key?.startsWith(COMMENT_KEY_PREFIX)) continue
    const articleSlug = key.replace(COMMENT_KEY_PREFIX, '')
    try {
      const parsed = JSON.parse(window.localStorage.getItem(key) || '[]')
      if (!Array.isArray(parsed)) continue
      for (const item of parsed) {
        if (!item || typeof item !== 'object') continue
        if (typeof item.name !== 'string' || typeof item.comment !== 'string') continue
        items.push({
          id: typeof item.id === 'string' ? item.id : `${articleSlug}-${items.length}`,
          name: item.name,
          email: typeof item.email === 'string' ? item.email : undefined,
          comment: item.comment,
          createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
          articleTitle: typeof item.articleTitle === 'string' ? item.articleTitle : undefined,
          articleSlug: typeof item.articleSlug === 'string' ? item.articleSlug : articleSlug,
        })
      }
    } catch {
      // ignore corrupted local comment records
    }
  }
  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export default function CommentsPage() {
  const [comments, setComments] = useState<StoredComment[]>([])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setComments(readCommentsFromStorage())
  }, [])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return comments
    return comments.filter((item) =>
      [item.name, item.email, item.comment, item.articleTitle, item.articleSlug]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    )
  }, [comments, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / COMMENTS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const visibleComments = filtered.slice((currentPage - 1) * COMMENTS_PER_PAGE, currentPage * COMMENTS_PER_PAGE)

  const refresh = () => {
    setComments(readCommentsFromStorage())
    setPage(1)
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-white text-[#0a0a0a]">
        <section className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 lg:px-16 lg:py-24">
          <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-8 sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="editable-mono inline-flex items-center gap-2 text-[#5a5a5a]">
                  <MessageSquare className="h-4 w-4" /> Your notes
                </p>
                <h1 className="editable-display mt-6 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Comments</h1>
                <p className="mt-4 max-w-2xl text-sm leading-[1.55] text-[#5a5a5a]">
                  A local archive of everything you have commented on across the guide — kept in this browser only.
                </p>
              </div>
              <button
                type="button"
                onClick={refresh}
                className="editable-mono rounded-full border border-[#0a0a0a]/12 px-4 py-2 text-[0.7rem] text-[#0a0a0a] transition duration-500 hover:bg-[#0a0a0a] hover:text-white"
              >
                Refresh
              </button>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5a5a5a]" />
                <input
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value)
                    setPage(1)
                  }}
                  placeholder="Search your notes…"
                  className="h-11 w-full rounded-full border border-[#0a0a0a]/12 bg-white pl-9 pr-4 text-sm outline-none transition duration-500 focus:border-[#0a0a0a]"
                />
              </div>
              <p className="editable-mono text-[#5a5a5a]">{filtered.length} note{filtered.length === 1 ? '' : 's'}</p>
            </div>
          </div>

          {visibleComments.length ? (
            <section className="mt-8 grid gap-4">
              {visibleComments.map((item) => (
                <article key={`${item.articleSlug}-${item.id}`} className="rounded-[18px] border border-[#e5e7eb] bg-white p-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[0.95rem] font-medium text-[#0a0a0a]">{item.name}</p>
                      <p className="editable-mono mt-1 text-[#5a5a5a]">{formatDate(item.createdAt)}</p>
                    </div>
                    {item.articleSlug ? (
                      <Link href={`/articles/${item.articleSlug}`} className="editable-mono text-[#0a0a0a] transition duration-500 hover:text-[#ffef14]">
                        Open the entry →
                      </Link>
                    ) : null}
                  </div>
                  {item.articleTitle ? (
                    <p className="editable-display mt-4 text-lg font-medium leading-[1.2] tracking-[-0.02em] text-[#0a0a0a]">
                      {item.articleTitle}
                    </p>
                  ) : null}
                  <p className="mt-3 text-[0.95rem] leading-[1.55] text-[#0a0a0a]">{item.comment}</p>
                </article>
              ))}
            </section>
          ) : (
            <section className="mt-8 rounded-[18px] border border-dashed border-[#e5e7eb] bg-white p-10 text-center">
              <h2 className="editable-display text-xl font-semibold tracking-[-0.03em]">No notes yet</h2>
              <p className="mt-2 text-sm text-[#5a5a5a]">Comment on any Journal entry and it will show up here.</p>
            </section>
          )}

          {filtered.length > COMMENTS_PER_PAGE ? (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-[#e5e7eb] bg-white p-4">
              <span className="editable-mono text-[#5a5a5a]">Page {currentPage} of {totalPages}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  className="editable-mono rounded-full border border-[#0a0a0a]/12 px-4 py-2 text-[0.7rem] text-[#0a0a0a] transition duration-500 hover:bg-[#0a0a0a] hover:text-white disabled:opacity-40"
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                  className="editable-mono rounded-full border border-[#0a0a0a]/12 px-4 py-2 text-[0.7rem] text-[#0a0a0a] transition duration-500 hover:bg-[#0a0a0a] hover:text-white disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            </div>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}
