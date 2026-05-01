import { Link } from 'react-router-dom'
import { LogPanel } from '../components/sleep/LogPanel'
import { cn } from '../lib/cn'

export function SleepLog() {
  return (
    <div className="space-y-4 pb-16">
      <LogPanel />

      <div className="fixed inset-x-0 bottom-20 z-20">
        <div className="mx-auto flex w-full max-w-3xl justify-center bg-[color:var(--color-bg)] px-4 py-3">
          <Link
            to="/sleep/history"
            className={cn(
              'inline-flex h-7 items-center justify-center rounded-full border px-4 text-xs font-semibold transition',
              'border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text)]',
              'hover:bg-[color:var(--color-surface-2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-green)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]',
            )}
          >
            History
          </Link>
        </div>
      </div>
    </div>
  )
}

