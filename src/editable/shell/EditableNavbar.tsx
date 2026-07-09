'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, X, ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const NAV_ITEMS: { label: string; href: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-[background,border-color,backdrop-filter] duration-500 ${
        scrolled
          ? 'border-b border-black/10 bg-white/85 backdrop-blur-md'
          : 'border-b border-transparent bg-white/60 backdrop-blur-sm'
      }`}
    >
      <nav className="mx-auto flex min-h-[68px] w-full max-w-[1440px] items-center gap-6 px-5 py-3 sm:px-8 lg:min-h-[76px] lg:px-16">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0a0a0a] transition group-hover:bg-[#ffef14]">
            <img src="/favicon.png" alt="Logo" className="h-9 w-9" />
          </span>
          {SITE_CONFIG.name}
        </Link>

        <div className="ml-8 hidden items-center gap-8 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`editable-mono relative text-[0.72rem] transition duration-500 ${
                  active ? 'text-[#0a0a0a]' : 'text-[#5a5a5a] hover:text-[#0a0a0a]'
                }`}
              >
                {item.label}
                {active ? (
                  <span className="absolute -bottom-1 left-0 h-[2px] w-full bg-[#ffef14]" />
                ) : null}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0a0a0a]/12 text-[#0a0a0a] transition duration-500 hover:border-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white"
          >
            <Search className="h-4 w-4" />
          </Link>
          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-2 rounded-full bg-[#ffef14] px-4 py-2 editable-mono text-[0.7rem] text-[#0a0a0a] transition duration-500 hover:bg-[#0a0a0a] hover:text-white sm:inline-flex"
              >
                Submit <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden items-center gap-2 rounded-full px-3 py-2 editable-mono text-[0.7rem] text-[#5a5a5a] transition duration-500 hover:text-[#0a0a0a] sm:inline-flex"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center gap-2 rounded-full border border-[#0a0a0a]/12 px-4 py-2 editable-mono text-[0.7rem] text-[#0a0a0a] transition duration-500 hover:border-[#0a0a0a] sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-2 rounded-full bg-[#0a0a0a] px-4 py-2 editable-mono text-[0.7rem] text-white transition duration-500 hover:bg-[#ffef14] hover:text-[#0a0a0a] sm:inline-flex"
              >
                Get started <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0a0a0a]/12 lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[#0a0a0a]/8 bg-white px-5 py-6 lg:hidden">
          <div className="grid gap-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`editable-mono block rounded-full border px-5 py-3 text-[0.72rem] transition duration-500 ${
                    active
                      ? 'border-[#0a0a0a] bg-[#ffef14] text-[#0a0a0a]'
                      : 'border-transparent text-[#5a5a5a] hover:border-[#0a0a0a]/12 hover:text-[#0a0a0a]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="editable-mono block rounded-full border border-transparent px-5 py-3 text-[0.72rem] text-[#5a5a5a] transition hover:border-[#0a0a0a]/12 hover:text-[#0a0a0a]"
            >
              Search
            </Link>
            {session ? (
              <>
                <Link
                  href="/create"
                  onClick={() => setOpen(false)}
                  className="editable-mono mt-2 block rounded-full bg-[#ffef14] px-5 py-3 text-[0.72rem] text-[#0a0a0a]"
                >
                  Submit
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    logout()
                  }}
                  className="editable-mono mt-1 block w-full rounded-full border border-[#0a0a0a]/12 px-5 py-3 text-left text-[0.72rem] text-[#0a0a0a]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="editable-mono mt-2 block rounded-full border border-[#0a0a0a]/12 px-5 py-3 text-[0.72rem] text-[#0a0a0a]"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="editable-mono mt-1 block rounded-full bg-[#0a0a0a] px-5 py-3 text-[0.72rem] text-white"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
