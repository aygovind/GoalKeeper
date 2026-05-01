import type { ReactNode } from 'react'
import { Briefcase, Dumbbell, Moon, Utensils } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '../lib/cn'

export function Layout() {
  return (
    <div className="min-h-dvh bg-[color:var(--color-bg)] pb-20">
      <header className="sticky top-0 z-10 border-b border-[color:var(--color-border)] bg-[color:var(--color-bg)]/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-1 px-4 py-4">
          <div className="text-2xl font-extrabold tracking-tight text-[color:var(--color-text)] sm:text-3xl">
            GoalKeeper
          </div>
          <div className="text-sm italic text-[color:var(--color-muted)]">
            Consistency Is Key.
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-6">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-[color:var(--color-border)] bg-[color:var(--color-bg)]/90 backdrop-blur">
        <div className="mx-auto grid max-w-3xl grid-cols-4 gap-1 px-2 py-2">
          <Tab to="/sleep" label="Sleep" icon={<Moon className="h-4 w-4" />} />
          <Tab to="/diet" label="Diet" icon={<Utensils className="h-4 w-4" />} />
          <Tab to="/gym" label="Gym" icon={<Dumbbell className="h-4 w-4" />} />
          <Tab to="/work" label="Work" icon={<Briefcase className="h-4 w-4" />} />
        </div>
      </nav>
    </div>
  )
}

function Tab({
  to,
  label,
  icon,
}: {
  to: string
  label: string
  icon: ReactNode
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 text-center text-xs transition',
          isActive
            ? 'bg-[color:var(--color-surface)] text-[color:var(--color-text)]'
            : 'text-[color:var(--color-muted)] hover:bg-[color:var(--color-surface)] hover:text-[color:var(--color-text)]',
        )
      }
    >
      {icon}
      <span className="w-full text-center">{label}</span>
    </NavLink>
  )
}

