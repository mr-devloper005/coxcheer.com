import Link from 'next/link'
import { ArrowUpRight, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing filed here yet',
  description = 'New entries land as the community adds them. Come back — or wander to another section.',
  actionLabel = 'Back to the guide',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section className={cn('rounded-[18px] border border-dashed border-[#e5e7eb] bg-white p-10 text-center', className)}>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ffef14] text-[#0a0a0a]">
        <SearchX className="h-6 w-6" />
      </div>
      <h2 className="editable-display mt-6 text-2xl font-semibold tracking-[-0.03em] text-[#0a0a0a]">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-[0.95rem] leading-[1.55] text-[#5a5a5a]">{description}</p>
      <Link
        href={actionHref}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] px-5 py-2.5 editable-mono text-[0.7rem] text-white transition duration-500 hover:bg-[#ffef14] hover:text-[#0a0a0a]"
      >
        {actionLabel}
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'entries', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`New ${taskLabel} land here as they're added. The page stays open in the meantime.`}
      actionLabel="Wander the guide"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for writing in. We will route it to the right pair of hands."
      actionLabel="Back to the guide"
      actionHref="/"
    />
  )
}
