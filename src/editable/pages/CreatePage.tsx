'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, FileText, ImageIcon, Lock, PlusCircle, Send, Sparkles, ArrowRight } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import EditableReveal from '@/editable/shell/EditableReveal'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  article: FileText,
  listing: Sparkles,
  classified: PlusCircle,
  image: ImageIcon,
  profile: Sparkles,
  pdf: FileText,
  sbm: ArrowRight,
}

const DISPLAY_LABEL: Partial<Record<TaskKey, string>> = {
  listing: 'Places',
  article: 'The Journal',
  classified: 'Board',
  image: 'Gallery',
  sbm: 'Marked',
  pdf: 'Library',
  profile: 'Roster',
}

const fieldClass =
  'rounded-[14px] border border-[#0a0a0a]/12 bg-white px-4 py-3 text-[0.95rem] text-[#0a0a0a] outline-none transition duration-500 placeholder:text-[#9a9a9a] focus:border-[#0a0a0a]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]
  const activeLabel = (activeTask && DISPLAY_LABEL[activeTask.key]) || activeTask?.label || 'entry'

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-white text-[#0a0a0a]">
          <section className="mx-auto grid w-full max-w-[1440px] items-center gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-16">
            <EditableReveal index={0}>
              <div className="flex min-h-72 items-center justify-center rounded-[24px] bg-[#0a0a0a] p-10 text-white">
                <Lock className="h-16 w-16 text-white/80" />
              </div>
            </EditableReveal>
            <EditableReveal index={1}>
              <div>
                <span className="editable-mono inline-flex items-center gap-2 rounded-full border border-[#0a0a0a]/12 bg-white px-3 py-1 text-[0.68rem] text-[#0a0a0a]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ffef14]" />
                  {pagesContent.create.locked.badge}
                </span>
                <h1 className="editable-display mt-8 max-w-[18ch] text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
                  {pagesContent.create.locked.title}
                </h1>
                <p className="mt-8 max-w-[54ch] text-lg leading-[1.55] text-[#5a5a5a]">{pagesContent.create.locked.description}</p>
                <div className="mt-10 flex flex-wrap gap-3">
                  <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] px-6 py-3 text-[0.9rem] font-medium text-white transition duration-500 hover:bg-[#ffef14] hover:text-[#0a0a0a]">
                    Sign in <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link href="/signup" className="inline-flex items-center gap-2 rounded-full border border-[#0a0a0a] px-6 py-3 text-[0.9rem] font-medium text-[#0a0a0a] transition duration-500 hover:bg-[#0a0a0a] hover:text-white">
                    Get started
                  </Link>
                </div>
              </div>
            </EditableReveal>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-white text-[#0a0a0a]">
        <section className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 lg:px-16 lg:py-24">
          <EditableReveal index={0}>
            <div className="editable-mono inline-flex items-center gap-2 rounded-full border border-[#0a0a0a]/12 bg-white px-3 py-1 text-[0.68rem] text-[#0a0a0a]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ffef14]" />
              {pagesContent.create.hero.badge}
            </div>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className="editable-display mt-8 max-w-[16ch] text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
              {pagesContent.create.hero.title}
            </h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className="mt-8 max-w-[54ch] text-lg leading-[1.55] text-[#5a5a5a]">{pagesContent.create.hero.description}</p>
          </EditableReveal>

          <div className="mt-16 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <aside>
              <p className="editable-mono text-[#5a5a5a]">§ 01 · Pick a section</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {enabledTasks.map((item, i) => {
                  const Icon = taskIcon[item.key] || FileText
                  const active = item.key === task
                  const label = DISPLAY_LABEL[item.key] || item.label
                  return (
                    <EditableReveal key={item.key} index={i}>
                      <button
                        type="button"
                        onClick={() => setTask(item.key)}
                        className={`w-full rounded-[16px] border p-5 text-left transition duration-500 ${
                          active
                            ? 'border-transparent bg-[#0a0a0a] text-white'
                            : 'border-[#e5e7eb] bg-white text-[#0a0a0a] hover:-translate-y-0.5 hover:border-[#0a0a0a]'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="editable-display mt-4 block text-lg font-semibold tracking-[-0.025em]">{label}</span>
                        <span className={`mt-2 block text-xs leading-[1.5] ${active ? 'text-white/70' : 'text-[#5a5a5a]'}`}>
                          {item.description}
                        </span>
                      </button>
                    </EditableReveal>
                  )
                })}
              </div>
            </aside>

            <EditableReveal index={0}>
              <form onSubmit={submit} className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="editable-mono text-[#5a5a5a]">§ 02 · Add to {activeLabel}</p>
                    <h2 className="editable-display mt-3 text-2xl font-semibold tracking-[-0.03em]">{pagesContent.create.formTitle}</h2>
                  </div>
                  <span className="editable-mono rounded-full bg-[#ffef14] px-3 py-1 text-[0.65rem] text-[#0a0a0a]">{session.name}</span>
                </div>

                <div className="mt-8 grid gap-4">
                  <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title" required />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                    <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or source URL" />
                  </div>
                  <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL" />
                  <textarea className={`${fieldClass} min-h-24`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary" required />
                  <textarea className={`${fieldClass} min-h-48`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Main content, details, notes, or description" required />
                </div>

                {created ? (
                  <div className="mt-5 flex items-start gap-3 rounded-[14px] bg-[#ffef14] p-4 text-[#0a0a0a]">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                    <div>
                      <p className="editable-mono">{pagesContent.create.successTitle}</p>
                      <p className="mt-1 text-sm font-medium">{created.title}</p>
                    </div>
                  </div>
                ) : null}

                <button
                  type="submit"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0a0a0a] px-6 py-3.5 text-[0.9rem] font-medium text-white transition duration-500 hover:bg-[#ffef14] hover:text-[#0a0a0a]"
                >
                  <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
                </button>
              </form>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
