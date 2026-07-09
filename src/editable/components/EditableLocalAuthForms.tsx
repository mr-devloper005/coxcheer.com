'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { pagesContent } from '@/editable/content/pages.content'

const USERS_KEY = 'slot4:local-auth-users'
const SESSION_KEY = 'slot4:local-auth-session'

type LocalUser = {
  name: string
  email: string
  password: string
  createdAt: string
}

const readUsers = (): LocalUser[] => {
  if (typeof window === 'undefined') return []
  try {
    const parsed = JSON.parse(window.localStorage.getItem(USERS_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const saveUsers = (users: LocalUser[]) => window.localStorage.setItem(USERS_KEY, JSON.stringify(users))

const saveSession = (user: Pick<LocalUser, 'name' | 'email'>) => {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email, loggedInAt: new Date().toISOString() }))
  window.dispatchEvent(new Event('slot4-auth-change'))
}

type Variant = 'light' | 'dark'
const inputClass = (v: Variant) =>
  v === 'dark'
    ? 'h-12 w-full rounded-[14px] border border-white/15 bg-white/5 px-4 text-[0.95rem] text-white outline-none transition duration-500 placeholder:text-white/40 focus:border-[#ffef14]'
    : 'h-12 w-full rounded-[14px] border border-[#0a0a0a]/12 bg-white px-4 text-[0.95rem] text-[#0a0a0a] outline-none transition duration-500 placeholder:text-[#9a9a9a] focus:border-[#0a0a0a]'
const buttonClass = (v: Variant) =>
  v === 'dark'
    ? 'inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#ffef14] px-6 text-[0.9rem] font-medium text-[#0a0a0a] transition duration-500 hover:bg-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60'
    : 'inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0a0a0a] px-6 text-[0.9rem] font-medium text-white transition duration-500 hover:bg-[#ffef14] hover:text-[#0a0a0a] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60'
const messageClass = (status: 'idle' | 'success' | 'error', v: Variant) => {
  if (status === 'success') return 'rounded-[12px] bg-[#ffef14] px-4 py-3 text-sm font-medium text-[#0a0a0a]'
  return v === 'dark'
    ? 'rounded-[12px] bg-red-500/15 px-4 py-3 text-sm font-medium text-red-200'
    : 'rounded-[12px] bg-red-50 px-4 py-3 text-sm font-medium text-red-700'
}

export function EditableLocalLoginForm({ variant = 'light' }: { variant?: Variant } = {}) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedEmail = email.trim().toLowerCase()
    const user = readUsers().find((item) => item.email.toLowerCase() === normalizedEmail)
    if (!user || user.password !== password) {
      setStatus('error')
      setMessage(pagesContent.auth.login.noAccount)
      return
    }
    saveSession(user)
    setStatus('success')
    setMessage(pagesContent.auth.login.success)
    window.setTimeout(() => router.push('/'), 500)
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <input className={inputClass(variant)} type="email" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} required />
      <input className={inputClass(variant)} type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      {message ? <p className={messageClass(status, variant)}>{message}</p> : null}
      <button type="submit" className={buttonClass(variant)}>{pagesContent.auth.login.submitLabel}</button>
    </form>
  )
}

export function EditableLocalSignupForm({ variant = 'light' }: { variant?: Variant } = {}) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedName = name.trim()
    const normalizedEmail = email.trim().toLowerCase()
    if (password.length < 4) {
      setStatus('error')
      setMessage(pagesContent.auth.signup.passwordShort)
      return
    }
    const users = readUsers()
    const nextUser: LocalUser = {
      name: normalizedName || normalizedEmail.split('@')[0] || 'Member',
      email: normalizedEmail,
      password,
      createdAt: new Date().toISOString(),
    }
    saveUsers([nextUser, ...users.filter((item) => item.email.toLowerCase() !== normalizedEmail)])
    saveSession(nextUser)
    setStatus('success')
    setMessage(pagesContent.auth.signup.success)
    window.setTimeout(() => router.push('/'), 500)
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <input className={inputClass(variant)} placeholder="Full name" value={name} onChange={(event) => setName(event.target.value)} required />
      <input className={inputClass(variant)} type="email" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} required />
      <input className={inputClass(variant)} type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      {message ? <p className={messageClass(status, variant)}>{message}</p> : null}
      <button type="submit" className={buttonClass(variant)}>{pagesContent.auth.signup.submitLabel}</button>
    </form>
  )
}

export function useEditableLocalAuthSession() {
  const [session, setSession] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    const load = () => {
      try {
        const parsed = JSON.parse(window.localStorage.getItem(SESSION_KEY) || 'null')
        setSession(parsed && typeof parsed.email === 'string' ? parsed : null)
      } catch {
        setSession(null)
      }
    }
    load()
    window.addEventListener('slot4-auth-change', load)
    window.addEventListener('storage', load)
    return () => {
      window.removeEventListener('slot4-auth-change', load)
      window.removeEventListener('storage', load)
    }
  }, [])

  const logout = () => {
    window.localStorage.removeItem(SESSION_KEY)
    window.dispatchEvent(new Event('slot4-auth-change'))
    setSession(null)
  }

  return { session, logout }
}
