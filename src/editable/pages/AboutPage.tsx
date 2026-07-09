import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import EditableReveal from '@/editable/shell/EditableReveal'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-white text-[#0a0a0a]">
        {/* Masthead */}
        <section className="border-b border-[#e5e7eb]">
          <div className="mx-auto w-full max-w-[1440px] px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-24 lg:px-16 lg:pb-24 lg:pt-32">
            <EditableReveal index={0}>
              <span className="editable-mono inline-flex items-center gap-2 rounded-full border border-[#0a0a0a]/12 bg-white px-3 py-1 text-[0.68rem] text-[#0a0a0a]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ffef14]" />
                {pagesContent.about.badge}
              </span>
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className="editable-display mt-8 max-w-[18ch] text-[clamp(2.75rem,8vw,7.5rem)] font-semibold leading-[0.92] tracking-[-0.045em]">
                {pagesContent.about.title}
              </h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className="mt-10 max-w-[54ch] text-xl leading-[1.5] text-[#5a5a5a] sm:text-2xl">
                {pagesContent.about.description}
              </p>
            </EditableReveal>
          </div>
        </section>

        {/* Body */}
        <section className="bg-white">
          <div className="mx-auto grid w-full max-w-[1440px] gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-16 lg:py-28">
            <EditableReveal index={0}>
              <div className="max-w-[68ch] space-y-6 text-[1.05rem] leading-[1.7] text-[#0a0a0a]">
                {pagesContent.about.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <div className="pt-4">
                  <Link href="/listings" className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] px-6 py-3 text-[0.9rem] font-medium text-white transition duration-500 hover:bg-[#ffef14] hover:text-[#0a0a0a]">
                    Open the directory <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </EditableReveal>
            <div className="grid gap-4">
              {pagesContent.about.values.map((value, i) => {
                const accent = i === 0
                return (
                  <EditableReveal key={value.title} index={i}>
                    <div
                      className={`rounded-[18px] border p-6 ${
                        accent ? 'border-transparent bg-[#ffef14] text-[#0a0a0a]' : 'border-[#e5e7eb] bg-white text-[#0a0a0a]'
                      }`}
                    >
                      <p className="editable-mono">§{String(i + 1).padStart(2, '0')}</p>
                      <h2 className="editable-display mt-4 text-2xl font-semibold leading-[1.15] tracking-[-0.025em]">{value.title}</h2>
                      <p className="mt-3 text-[0.95rem] leading-[1.55] opacity-80">{value.description}</p>
                    </div>
                  </EditableReveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* Closing band */}
        <section className="border-t border-[#e5e7eb] bg-[#0a0a0a] text-white">
          <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-8 px-5 py-16 sm:px-8 lg:px-16 lg:py-24">
            <EditableReveal index={0}>
              <h2 className="editable-display max-w-[24ch] text-3xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-4xl lg:text-[3rem]">
                Made in the neighborhood, for the neighborhood.
              </h2>
            </EditableReveal>
            <EditableReveal index={1}>
              <div className="flex flex-wrap gap-3">
                <Link href="/articles" className="inline-flex items-center gap-2 rounded-full bg-[#ffef14] px-6 py-3 text-[0.9rem] font-medium text-[#0a0a0a] transition duration-500 hover:bg-white">
                  Read the Journal <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-white px-6 py-3 text-[0.9rem] font-medium text-white transition duration-500 hover:bg-white hover:text-[#0a0a0a]">
                  Write in
                </Link>
              </div>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
