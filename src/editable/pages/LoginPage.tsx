import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import EditableReveal from '@/editable/shell/EditableReveal'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Sign in', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-white text-[#0a0a0a]">
        <section className="mx-auto grid w-full max-w-[1440px] items-center gap-16 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_0.85fr] lg:px-16 lg:py-28">
          <EditableReveal index={0}>
            <div>
              <span className="editable-mono inline-flex items-center gap-2 rounded-full border border-[#0a0a0a]/12 bg-white px-3 py-1 text-[0.68rem] text-[#0a0a0a]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ffef14]" />
                {pagesContent.auth.login.badge}
              </span>
              <h1 className="editable-display mt-8 max-w-[16ch] text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
                {pagesContent.auth.login.title}
              </h1>
              <p className="mt-8 max-w-[46ch] text-lg leading-[1.55] text-[#5a5a5a]">{pagesContent.auth.login.description}</p>
              <p className="editable-mono mt-8 text-[#5a5a5a]">
                New to the guide?{' '}
                <Link href="/signup" className="text-[#0a0a0a] underline decoration-[#ffef14] decoration-[3px] underline-offset-4 transition hover:decoration-[#0a0a0a]">
                  {pagesContent.auth.login.createCta} <ArrowUpRight className="inline h-3 w-3" />
                </Link>
              </p>
            </div>
          </EditableReveal>

          <EditableReveal index={1}>
            <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-8 sm:p-10">
              <p className="editable-mono text-[#5a5a5a]">§ 01</p>
              <h2 className="editable-display mt-3 text-3xl font-semibold tracking-[-0.03em]">{pagesContent.auth.login.formTitle}</h2>
              <div className="mt-8">
                <EditableLocalLoginForm />
              </div>
            </div>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
