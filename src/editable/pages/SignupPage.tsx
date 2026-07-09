import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import EditableReveal from '@/editable/shell/EditableReveal'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Get started', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-white text-[#0a0a0a]">
        <section className="mx-auto grid w-full max-w-[1440px] items-center gap-16 px-5 py-20 sm:px-8 lg:grid-cols-[0.85fr_1fr] lg:px-16 lg:py-28">
          <EditableReveal index={0}>
            <div className="rounded-[24px] bg-[#0a0a0a] p-8 text-white sm:p-10">
              <p className="editable-mono text-white/60">§ 01</p>
              <h2 className="editable-display mt-3 text-3xl font-semibold tracking-[-0.03em]">{pagesContent.auth.signup.formTitle}</h2>
              <div className="mt-8">
                <EditableLocalSignupForm variant="dark" />
              </div>
              <p className="editable-mono mt-8 text-white/60">
                Have an account?{' '}
                <Link href="/login" className="text-white underline decoration-[#ffef14] decoration-[3px] underline-offset-4 transition hover:decoration-white">
                  {pagesContent.auth.signup.loginCta} <ArrowUpRight className="inline h-3 w-3" />
                </Link>
              </p>
            </div>
          </EditableReveal>

          <EditableReveal index={1}>
            <div>
              <span className="editable-mono inline-flex items-center gap-2 rounded-full border border-[#0a0a0a]/12 bg-white px-3 py-1 text-[0.68rem] text-[#0a0a0a]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ffef14]" />
                {pagesContent.auth.signup.badge}
              </span>
              <h1 className="editable-display mt-8 max-w-[18ch] text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
                {pagesContent.auth.signup.title}
              </h1>
              <p className="mt-8 max-w-[46ch] text-lg leading-[1.55] text-[#5a5a5a]">{pagesContent.auth.signup.description}</p>
            </div>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
