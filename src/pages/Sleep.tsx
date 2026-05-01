import { Link, Outlet, useLocation } from 'react-router-dom'
import { cn } from '../lib/cn'

const items = [
  { to: '/sleep/goals', label: 'Goals' },
  { to: '/sleep/log', label: 'Log Action' },
  { to: '/sleep/activity', label: 'Activity' },
] as const

export function Sleep() {
  const location = useLocation()
  const onHub = location.pathname === '/sleep'
  const onActivity = location.pathname.startsWith('/sleep/activity')

  return (
    <div className="relative flex min-h-[60vh] flex-col">
      {onHub ? (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
          <div className="flex items-center justify-center gap-6">
            {items.map((it) => (
              <Link
                key={it.to}
                to={it.to}
                className={cn(
                  'flex h-24 w-24 items-center justify-center rounded-full border text-base font-semibold transition sm:h-28 sm:w-28 sm:text-lg',
                  'border-[color:var(--color-border)] text-[color:var(--color-text)]',
                  'hover:bg-[color:var(--color-surface)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-green)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]',
                )}
              >
                <span className="whitespace-pre-line text-center leading-tight">
                  {it.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <div className="relative mb-4 flex h-7 items-center justify-center">
            <Link
              to="/sleep"
              className={cn(
                'absolute left-0 top-0 inline-flex h-7 items-center justify-center rounded-full border px-4 text-xs font-semibold transition',
                'border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text)]',
                'hover:bg-[color:var(--color-surface-2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-green)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]',
              )}
            >
              Back
            </Link>

            {onActivity ? (
              <div className="inline-flex rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-0.5">
                <Link
                  to="#month"
                  className={cn(
                    'inline-flex h-7 items-center justify-center rounded-full px-4 text-xs font-semibold transition',
                    'bg-[color:var(--color-green)] text-black',
                  )}
                >
                  This Month
                </Link>
                <Link
                  to="#stats"
                  className={cn(
                    'inline-flex h-7 items-center justify-center rounded-full px-4 text-xs font-semibold transition',
                    'text-[color:var(--color-text)] hover:bg-[color:var(--color-surface-2)]',
                  )}
                >
                  Your Stats
                </Link>
              </div>
            ) : null}
          </div>
          <Outlet />
        </div>
      )}
    </div>
  )
}

