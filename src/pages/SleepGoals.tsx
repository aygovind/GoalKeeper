import { useEffect, useState } from 'react'
import { format, parse } from 'date-fns'
import { Button } from '../components/ui/Button'
import { getSleepGoal, type SleepGoal } from '../lib/sleep'
import { SleepGoalWizard } from '../components/sleep/SleepGoalWizard'

export function SleepGoals() {
  const [loading, setLoading] = useState(true)
  const [goal, setGoal] = useState<SleepGoal | null>(null)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function run() {
      try {
        const g = await getSleepGoal()
        if (cancelled) return
        setGoal(g)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) return null

  if (!goal || editing) {
    return (
      <SleepGoalWizard
        initialGoal={goal}
        onDone={(g) => {
          setGoal(g)
          setEditing(false)
        }}
      />
    )
  }

  return (
    <div className="space-y-4 pb-16">
      <div className="grid grid-cols-3 gap-2">
        <div />
        <div className="text-center text-sm font-semibold text-[color:var(--color-text)]">
          Ideal
        </div>
        <div className="text-center text-sm font-semibold text-[color:var(--color-text)]">
          Minimum
        </div>

        <Row3
          label="Sleep Hours"
          ideal={goal.hours_whole_goal == null ? '—' : `${goal.hours_whole_goal}`}
          minimum={`${goal.hours_goal}`}
        />
        <Row3
          label="Sleep Time"
          ideal={formatAmPm(goal.sleep_time_whole_goal)}
          minimum={formatAmPm(goal.sleep_time_goal)}
        />
        <Row3
          label="Wake-Up Time"
          ideal={formatAmPm(goal.wake_time_whole_goal)}
          minimum={formatAmPm(goal.wake_time_goal)}
        />
      </div>

      <div className="fixed inset-x-0 bottom-20 z-20">
        <div className="mx-auto flex w-full max-w-3xl justify-center bg-[color:var(--color-bg)] px-4 py-3">
          <Button
            type="button"
            variant="secondary"
            className="rounded-full px-6"
            onClick={() => setEditing(true)}
          >
            Edit
          </Button>
        </div>
      </div>
    </div>
  )
}

function Row3({
  label,
  ideal,
  minimum,
}: {
  label: string
  ideal: string
  minimum: string
}) {
  return (
    <>
      <div className="px-1 py-2 text-center text-sm font-semibold text-[color:var(--color-text)]">
        {label}
      </div>
      <div className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-center text-sm font-semibold text-[color:var(--color-text)]">
        {ideal}
      </div>
      <div className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-center text-sm font-semibold text-[color:var(--color-text)]">
        {minimum}
      </div>
    </>
  )
}

function formatAmPm(hhmm: string | null) {
  if (!hhmm) return '—'
  const d = parse(hhmm, 'HH:mm', new Date())
  return format(d, 'h:mm a')
}

