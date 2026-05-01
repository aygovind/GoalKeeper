import { useMemo, useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { type SleepGoal, upsertSleepGoal } from '../../lib/sleep'

type Step =
  | 'hoursWhole'
  | 'hoursGoal'
  | 'sleepWhole'
  | 'sleepGoal'
  | 'wakeWhole'
  | 'wakeGoal'
  | 'review'

type FormState = {
  hours_goal: string
  hours_whole_goal: string
  sleep_time_goal: string
  sleep_time_whole_goal: string
  wake_time_goal: string
  wake_time_whole_goal: string
}

function goalToForm(goal: SleepGoal | null): FormState {
  return {
    hours_goal: goal?.hours_goal != null ? String(goal.hours_goal) : '8',
    hours_whole_goal: goal?.hours_whole_goal != null ? String(goal.hours_whole_goal) : '',
    sleep_time_goal: goal?.sleep_time_goal ?? '',
    sleep_time_whole_goal: goal?.sleep_time_whole_goal ?? '',
    wake_time_goal: goal?.wake_time_goal ?? '',
    wake_time_whole_goal: goal?.wake_time_whole_goal ?? '',
  }
}

export function SleepGoalWizard({
  initialGoal,
  onDone,
}: {
  initialGoal: SleepGoal | null
  onDone: (goal: SleepGoal) => void
}) {
  const [step, setStep] = useState<Step>('hoursWhole')
  const [form, setForm] = useState<FormState>(() => goalToForm(initialGoal))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const parsed = useMemo(() => {
    const hoursGoal = Number(form.hours_goal)
    const hoursWhole = form.hours_whole_goal.trim() ? Number(form.hours_whole_goal) : null
    return {
      hoursGoal,
      hoursWhole,
      validHoursGoal: Number.isFinite(hoursGoal) && hoursGoal > 0,
      validHoursWhole:
        hoursWhole == null || (Number.isFinite(hoursWhole) && hoursWhole > 0),
    }
  }, [form.hours_goal, form.hours_whole_goal])

  function back() {
    setError(null)
    setStep((s) => {
      const order: Step[] = [
        'hoursWhole',
        'hoursGoal',
        'sleepWhole',
        'sleepGoal',
        'wakeWhole',
        'wakeGoal',
        'review',
      ]
      const i = order.indexOf(s)
      return i <= 0 ? s : order[i - 1]!
    })
  }

  async function next() {
    setError(null)
    if (step === 'hoursGoal' && !parsed.validHoursGoal) {
      setError('Enter a positive number.')
      return
    }
    if (step === 'hoursWhole' && !parsed.validHoursWhole) {
      setError('Enter a positive number (or leave blank).')
      return
    }

    if (step === 'review') {
      setLoading(true)
      try {
        const saved = await upsertSleepGoal({
          hours_goal: Number(form.hours_goal),
          hours_whole_goal: form.hours_whole_goal.trim() ? Number(form.hours_whole_goal) : null,
          sleep_time_goal: form.sleep_time_goal.trim() || null,
          sleep_time_whole_goal: form.sleep_time_whole_goal.trim() || null,
          wake_time_goal: form.wake_time_goal.trim() || null,
          wake_time_whole_goal: form.wake_time_whole_goal.trim() || null,
        })
        onDone(saved)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to save')
      } finally {
        setLoading(false)
      }
      return
    }

    setStep((s) => {
      const order: Step[] = [
        'hoursWhole',
        'hoursGoal',
        'sleepWhole',
        'sleepGoal',
        'wakeWhole',
        'wakeGoal',
        'review',
      ]
      const i = order.indexOf(s)
      return i === -1 || i === order.length - 1 ? 'review' : order[i + 1]!
    })
  }

  return (
    <div className="mx-auto flex w-full max-w-md min-h-[60vh] flex-col">
      {error ? (
        <div className="mb-4 rounded-md border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="flex-1">
        {step === 'hoursWhole' ? (
          <Question
            q="How many hours do you want to sleep ideally?"
            input={
              <Input
                autoFocus
                type="number"
                inputMode="decimal"
                step="0.1"
                min="0"
                value={form.hours_whole_goal}
                onChange={(e) => setForm((s) => ({ ...s, hours_whole_goal: e.target.value }))}
              />
            }
          />
        ) : null}

        {step === 'hoursGoal' ? (
          <Question
            q="How many hours do you want to sleep minimum?"
            input={
              <Input
                autoFocus
                type="number"
                inputMode="decimal"
                step="0.1"
                min="0"
                value={form.hours_goal}
                onChange={(e) => setForm((s) => ({ ...s, hours_goal: e.target.value }))}
              />
            }
          />
        ) : null}

        {step === 'sleepWhole' ? (
          <Question
            q="What time do you want to sleep ideally?"
            input={
              <Input
                autoFocus
                type="time"
                value={form.sleep_time_whole_goal}
                onChange={(e) =>
                  setForm((s) => ({ ...s, sleep_time_whole_goal: e.target.value }))
                }
              />
            }
          />
        ) : null}

        {step === 'sleepGoal' ? (
          <Question
            q="What time do you want to sleep latest?"
            input={
              <Input
                autoFocus
                type="time"
                value={form.sleep_time_goal}
                onChange={(e) => setForm((s) => ({ ...s, sleep_time_goal: e.target.value }))}
              />
            }
          />
        ) : null}

        {step === 'wakeWhole' ? (
          <Question
            q="What time do you want to wake up ideally?"
            input={
              <Input
                autoFocus
                type="time"
                value={form.wake_time_whole_goal}
                onChange={(e) =>
                  setForm((s) => ({ ...s, wake_time_whole_goal: e.target.value }))
                }
              />
            }
          />
        ) : null}

        {step === 'wakeGoal' ? (
          <Question
            q="What time do you want to wake up latest?"
            input={
              <Input
                autoFocus
                type="time"
                value={form.wake_time_goal}
                onChange={(e) => setForm((s) => ({ ...s, wake_time_goal: e.target.value }))}
              />
            }
          />
        ) : null}

        {step === 'review' ? (
          <div className="space-y-3">
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
                ideal={form.hours_whole_goal || '—'}
                minimum={form.hours_goal}
              />
              <Row3
                label="Sleep Time"
                ideal={form.sleep_time_whole_goal || '—'}
                minimum={form.sleep_time_goal || '—'}
              />
              <Row3
                label="Wake-Up Time"
                ideal={form.wake_time_whole_goal || '—'}
                minimum={form.wake_time_goal || '—'}
              />
            </div>
          </div>
        ) : null}
      </div>

      <div className="h-16" />

      <div className="fixed inset-x-0 bottom-20 z-20">
        <div className="mx-auto w-full max-w-md bg-[color:var(--color-bg)] px-2 py-3">
          <div className="flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={back}
              disabled={loading || step === 'hoursWhole'}
            >
              Previous
            </Button>
            <Button type="button" onClick={next} disabled={loading}>
              {step === 'review' ? (loading ? 'Saving…' : 'Save') : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Question({ q, input }: { q: string; input: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="text-lg font-semibold text-[color:var(--color-text)]">{q}</div>
      {input}
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

