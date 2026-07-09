'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const DISCOVERY_LINKS = [
  { label: 'Places', href: '/listings' },
  { label: 'The Journal', href: '/articles' },
  { label: 'Gallery', href: '/image-sharing' },
  { label: 'Board', href: '/classified' },
  { label: 'Roster', href: '/profile' },
  { label: 'Library', href: '/pdf' },
  { label: 'Marked', href: '/social-bookmarking' },
]

export function EditableFooter() {
  const enabledKeys = new Set(SITE_CONFIG.tasks.filter((task) => task.enabled).map((task) => task.key))
  const routes = new Set(SITE_CONFIG.tasks.filter((task) => task.enabled).map((task) => task.route))
  const discovery = DISCOVERY_LINKS.filter((link) => routes.has(link.href))
  const showDiscovery = discovery.length ? discovery : DISCOVERY_LINKS.filter((_, i) => i < 2)
  const { session, logout } = useEditableLocalAuthSession()
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-[#0a0a0a] text-white">
      {/* CTA strip */}
      <div className="border-b border-white/10">
        <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:px-16 lg:py-24">
          <div>
            <p className="editable-mono text-white/60">The last word</p>
            <h2 className="editable-display mt-4 text-4xl font-semibold leading-[0.98] tracking-[-0.035em] sm:text-5xl lg:text-[3.5rem]">
              Have a place, a story, or a correction? Bring it to the guide.
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 rounded-full bg-[#ffef14] px-6 py-3 text-[0.85rem] font-medium text-[#0a0a0a] transition duration-500 hover:bg-white"
            >
              Submit to the guide <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-[0.85rem] font-medium text-white transition duration-500 hover:border-white hover:bg-white/5"
            >
              Write in
            </Link>
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-16">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ffef14]">
              <img src="/favicon.png" alt="Logo" className="h-9 w-9" />
            </span>
            <span className="editable-display text-lg font-semibold tracking-[-0.02em]">{SITE_CONFIG.name}</span>
          </Link>
          <p className="mt-5 max-w-md text-sm leading-[1.6] text-white/60">
            {globalContent.footer?.description}
          </p>
          <p className="editable-mono mt-6 text-white/40">{globalContent.footer?.tagline}</p>
        </div>

        <div>
          <h3 className="editable-mono text-white/50">Discover</h3>
          <div className="mt-5 grid gap-3">
            {showDiscovery.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group inline-flex items-center justify-between gap-3 text-[0.95rem] text-white/85 transition duration-500 hover:text-[#ffef14]"
              >
                {link.label}
                <ArrowUpRight className="h-4 w-4 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="editable-mono text-white/50">Site</h3>
          <div className="mt-5 grid gap-3">
            <Link href="/about" className="text-[0.95rem] text-white/85 transition duration-500 hover:text-[#ffef14]">About</Link>
            <Link href="/contact" className="text-[0.95rem] text-white/85 transition duration-500 hover:text-[#ffef14]">Contact</Link>
            <Link href="/search" className="text-[0.95rem] text-white/85 transition duration-500 hover:text-[#ffef14]">Search</Link>
          </div>
        </div>

        <div>
          <h3 className="editable-mono text-white/50">Account</h3>
          <div className="mt-5 grid gap-3">
            {session ? (
              <>
                <Link href="/create" className="text-[0.95rem] text-white/85 transition duration-500 hover:text-[#ffef14]">Submit</Link>
                <button
                  type="button"
                  onClick={logout}
                  className="text-left text-[0.95rem] text-white/85 transition duration-500 hover:text-[#ffef14]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-[0.95rem] text-white/85 transition duration-500 hover:text-[#ffef14]">Sign in</Link>
                <Link href="/signup" className="text-[0.95rem] text-white/85 transition duration-500 hover:text-[#ffef14]">Get started</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Big wordmark */}
      <div className="mx-auto w-full max-w-[1440px] overflow-hidden px-5 pb-6 sm:px-8 lg:px-16">
        <div
          aria-hidden
          className="editable-display select-none whitespace-nowrap text-[clamp(4rem,18vw,18rem)] font-semibold leading-[0.85] tracking-[-0.055em] text-white/5"
        >
          {SITE_CONFIG.name}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-3 px-5 py-6 sm:px-8 lg:px-16">
          <p className="editable-mono text-white/50">
            © {year} {SITE_CONFIG.name} — {globalContent.footer?.bottomNote}
          </p>
          <p className="editable-mono text-white/30">
            {enabledKeys.size} sections · One index
          </p>
        </div>
      </div>
    </footer>
  )
}
