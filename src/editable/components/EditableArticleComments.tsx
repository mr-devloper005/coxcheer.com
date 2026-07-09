'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { MessageCircle, Send } from 'lucide-react'

type Comment = { id: string; name: string; comment: string; createdAt: string }

const storageKey = (slug: string) => `editable:article-comments:${slug}`

function timeAgo(value?: string) {
  if (!value) return ''
  const then = new Date(value).getTime()
  if (Number.isNaN(then)) return ''
  const mins = Math.max(1, Math.floor((Date.now() - then) / 60000))
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d`
  return new Date(then).toLocaleDateString()
}

function initial(name: string) {
  return (name.trim()[0] || 'G').toUpperCase()
}

export function EditableArticleComments({ slug, comments = [] }: { slug: string; comments?: Comment[] }) {
  const [stored, setStored] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey(slug))
      setStored(raw ? (JSON.parse(raw) as Comment[]) : [])
    } catch {
      setStored([])
    }
  }, [slug])

  const persist = (next: Comment[]) => {
    setStored(next)
    try {
      window.localStorage.setItem(storageKey(slug), JSON.stringify(next))
    } catch {
      /* storage unavailable */
    }
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = text.trim()
    if (!body) return
    const entry: Comment = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim() || 'Guest',
      comment: body,
      createdAt: new Date().toISOString(),
    }
    persist([entry, ...stored])
    setText('')
  }

  const all = useMemo(() => [...stored, ...comments], [stored, comments])

  return (
    <section className="mt-16 border-t border-[#e5e7eb] pt-12">
      <div className="flex items-center gap-3">
        <MessageCircle className="h-5 w-5 text-[#0a0a0a]" />
        <p className="editable-mono text-[#0a0a0a]">Comments · {all.length}</p>
      </div>

      <form onSubmit={submit} className="mt-6 rounded-[18px] border border-[#e5e7eb] bg-white p-6">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name (optional)"
          maxLength={60}
          className="h-11 w-full rounded-[12px] border border-[#0a0a0a]/12 bg-white px-4 text-sm text-[#0a0a0a] outline-none transition duration-500 focus:border-[#0a0a0a]"
        />
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Share a thought…"
          rows={3}
          maxLength={1500}
          className="mt-3 w-full resize-y rounded-[12px] border border-[#0a0a0a]/12 bg-white px-4 py-3 text-sm leading-[1.55] text-[#0a0a0a] outline-none transition duration-500 focus:border-[#0a0a0a]"
        />
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={!text.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] px-6 py-2.5 text-[0.85rem] font-medium text-white transition duration-500 hover:bg-[#ffef14] hover:text-[#0a0a0a] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-4 w-4" /> Post
          </button>
        </div>
      </form>

      <div className="mt-8 grid gap-3">
        {all.map((comment) => (
          <div key={comment.id} className="rounded-[16px] border border-[#e5e7eb] bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ffef14] text-sm font-semibold text-[#0a0a0a]">
                {initial(comment.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#0a0a0a]">{comment.name || 'Guest'}</p>
                {comment.createdAt ? <p className="editable-mono text-[#5a5a5a]">{timeAgo(comment.createdAt)}</p> : null}
              </div>
            </div>
            <p className="mt-3 whitespace-pre-line text-[0.95rem] leading-[1.55] text-[#0a0a0a]">{comment.comment}</p>
          </div>
        ))}
        {!all.length ? <p className="editable-mono text-[#5a5a5a]">Be the first to write in.</p> : null}
      </div>
    </section>
  )
}
