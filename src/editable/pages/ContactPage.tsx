'use client'

import { Building2, FileText, Image as ImageIcon, Mail, MapPin, Phone, Sparkles, Bookmark } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import EditableReveal from '@/editable/shell/EditableReveal'

function getLanes(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'directory') {
    return [
      { icon: Building2, title: 'Add a place', body: 'Submit a spot that belongs in the directory — a café, a workshop, a studio, a service.' },
      { icon: Phone, title: 'Correct an entry', body: 'Something wrong on a listing? Send the correction and we will update the record.' },
      { icon: MapPin, title: 'Extend coverage', body: 'Want the guide to cover a new neighborhood or category? Let us know where.' },
    ]
  }
  if (kind === 'editorial') {
    return [
      { icon: FileText, title: 'Pitch the Journal', body: 'Send us an idea for a long-read, essay, or field note. Short pitches read best.' },
      { icon: Mail, title: 'Editorial partnerships', body: 'Coordinate sponsorships, collaborations and issue-level campaigns.' },
      { icon: Sparkles, title: 'Contribute', body: 'Ask about voice, formatting or contributor onboarding.' },
    ]
  }
  if (kind === 'visual') {
    return [
      { icon: ImageIcon, title: 'Submit to the Gallery', body: 'Share frames from the field — shopfronts, hands at work, quiet corners.' },
      { icon: Sparkles, title: 'Licensing & rights', body: 'Reach out about usage rights, commercial requests, and visual partnerships.' },
      { icon: Mail, title: 'Feature requests', body: 'Ask about featured slots, series pieces, or gallery-led collaborations.' },
    ]
  }
  return [
    { icon: Bookmark, title: 'Suggest a reference', body: 'A tool, a link, a shelf worth sharing? Send it in.' },
    { icon: Mail, title: 'Curation partnerships', body: 'Coordinate curation projects, reference pages and link programs.' },
    { icon: Sparkles, title: 'Curator support', body: 'Need help organizing shelves, collections or profile-connected boards?' },
  ]
}

export default function ContactPage() {
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const lanes = getLanes(productKind)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-white text-[#0a0a0a]">
        <section className="border-b border-[#e5e7eb]">
          <div className="mx-auto w-full max-w-[1440px] px-5 pb-14 pt-16 sm:px-8 sm:pt-24 lg:px-16 lg:pb-20 lg:pt-32">
            <EditableReveal index={0}>
              <span className="editable-mono inline-flex items-center gap-2 rounded-full border border-[#0a0a0a]/12 bg-white px-3 py-1 text-[0.68rem] text-[#0a0a0a]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ffef14]" />
                {pagesContent.contact.eyebrow}
              </span>
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className="editable-display mt-8 max-w-[20ch] text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
                {pagesContent.contact.title}
              </h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className="mt-8 max-w-[54ch] text-lg leading-[1.55] text-[#5a5a5a]">{pagesContent.contact.description}</p>
            </EditableReveal>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-16 lg:py-28">
            <div>
              <p className="editable-mono text-[#5a5a5a]">§ 01 · Lanes</p>
              <h2 className="editable-display mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-4xl">
                Pick a lane.
              </h2>
              <div className="mt-10 space-y-4">
                {lanes.map((lane, i) => (
                  <EditableReveal key={lane.title} index={i}>
                    <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6 transition duration-500 hover:border-[#0a0a0a]">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffef14] text-[#0a0a0a]">
                        <lane.icon className="h-4 w-4" />
                      </span>
                      <h3 className="editable-display mt-4 text-xl font-semibold leading-[1.2] tracking-[-0.025em]">{lane.title}</h3>
                      <p className="mt-2 text-[0.95rem] leading-[1.55] text-[#5a5a5a]">{lane.body}</p>
                    </div>
                  </EditableReveal>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] bg-[#0a0a0a] p-8 text-white sm:p-10">
              <p className="editable-mono text-white/60">§ 02 · Send a note</p>
              <h2 className="editable-display mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-4xl">
                {pagesContent.contact.formTitle}
              </h2>
              <div className="mt-8">
                <EditableContactLeadForm />
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
