'use client'

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

type EditableRevealProps = {
  children: ReactNode
  index?: number
  as?: ElementType
  className?: string
  delay?: number
  threshold?: number
}

export function EditableReveal({
  children,
  index = 0,
  as = 'div',
  className = '',
  delay,
  threshold = 0.12,
}: EditableRevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            io.disconnect()
            break
          }
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [mounted, threshold])

  const Tag = as as unknown as 'div'
  const stagger = typeof delay === 'number' ? delay : index * 60
  const classes = [
    'editable-reveal',
    mounted ? 'is-primed' : '',
    mounted && visible ? 'is-visible' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag
      ref={ref as never}
      className={classes}
      style={mounted ? { transitionDelay: `${stagger}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}

export default EditableReveal
