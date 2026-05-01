import { useEffect, useMemo, useState } from 'react'
import { addDays } from 'date-fns'
import {
  getSleepGoal,
  getSleepLogsBetween,
  todayYmd,
  type SleepGoal,
  type SleepLog,
} from '../../lib/sleep'
import {
  dateToYmd,
  formatMinutesAsTime,
  hhmmToMinutes,
  lastNDaysRange,
} from '../../lib/utils'

function metTimeGoal(value: string | null, goal: string | null) {
  const v = hhmmToMinutes(value)
  const g = hhmmToMinutes(goal)
  if (g == null) return true
  if (v == null) return false
  return v <= g
}

function metHours(value: number | null, goal: number | null) {
  if (goal == null) return true
  if (value == null) return false
  return value >= goal
}

function goalMet(log: SleepLog, goal: SleepGoal | null) {
  return (
    metHours(log.hours_slept, goal?.hours_goal ?? null) &&
    metTimeGoal(log.sleep_time, goal?.sleep_time_goal ?? null) &&
    metTimeGoal(log.wake_time, goal?.wake_time_goal ?? null)
  )
}

function average(nums: Array<number | null | undefined>) {
  const xs = nums.filter((n): n is number => typeof n === 'number' && Number.isFinite(n))
  if (xs.length === 0) return null
  return xs.reduce((a, b) => a + b, 0) / xs.length
}

function averageTime(times: Array<string | null | undefined>) {
  const mins = times
    .map((t) => hhmmToMinutes(t))
    .filter((n): n is number => typeof n === 'number' && Number.isFinite(n))
  if (mins.length === 0) return null
  return mins.reduce((a, b) => a + b, 0) / mins.length
}

export function StatsPanel() {
  const [goal, setGoal] = useState<SleepGoal | null>(null)
  const [logs365, setLogs365] = useState<SleepLog[]>([])
  const [error, setError] = useState<string | null>(null)

  const { startYmd, endYmd } = useMemo(() => lastNDaysRange(365), [])

  useEffect(() => {
    let cancelled = false
    async function run() {
      try {
        const [g, l] = await Promise.all([getSleepGoal(), getSleepLogsBetween(startYmd, endYmd)])
        if (cancelled) return
        setGoal(g)
        setLogs365(l)
      } catch (e) {
        if (cancelled) return
        setError(e instanceof Error ? e.message : 'Failed to load stats')
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [startYmd, endYmd])

  const logs7 = useMemo(() => {
    const start = dateToYmd(addDays(new Date(endYmd), -6))
    return logs365.filter((l) => l.date >= start && l.date <= endYmd)
  }, [logs365, endYmd])

  const logs30 = useMemo(() => {
    const start = dateToYmd(addDays(new Date(endYmd), -29))
    return logs365.filter((l) => l.date >= start && l.date <= endYmd)
  }, [logs365, endYmd])

  const currentStreak = useMemo(() => {
    const met = new Set(logs365.filter((l) => goalMet(l, goal)).map((l) => l.date))
    let streak = 0
    let d = new Date(todayYmd())
    while (true) {
      const ymd = dateToYmd(d)
      if (!met.has(ymd)) break
      streak += 1
      d = addDays(d, -1)
    }
    return streak
  }, [logs365, goal])

  const weekly = useMemo(() => {
    return {
      hours: average(logs7.map((l) => (l.hours_slept == null ? null : Number(l.hours_slept)))),
      sleep: averageTime(logs7.map((l) => l.sleep_time)),
      wake: averageTime(logs7.map((l) => l.wake_time)),
    }
  }, [logs7])

  const monthly = useMemo(() => {
    return {
      hours: average(logs30.map((l) => (l.hours_slept == null ? null : Number(l.hours_slept)))),
      sleep: averageTime(logs30.map((l) => l.sleep_time)),
      wake: averageTime(logs30.map((l) => l.wake_time)),
    }
  }, [logs30])

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="text-base font-semibold text-[color:var(--color-text)]">Stats</div>
        <div className="text-right text-xs text-[color:var(--color-muted)]">
          <div>Current streak</div>
          <div className="text-lg font-semibold text-[color:var(--color-text)]">
            {currentStreak}
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
        <div className="grid grid-cols-3 gap-2">
          <div />
          <div className="text-center text-sm font-semibold text-[color:var(--color-text)]">
            Weekly avg
          </div>
          <div className="text-center text-sm font-semibold text-[color:var(--color-text)]">
            Monthly avg
          </div>

          <Row3
            label="Sleep Hours"
            weekly={weekly.hours != null ? weekly.hours.toFixed(1) : '—'}
            monthly={monthly.hours != null ? monthly.hours.toFixed(1) : '—'}
          />
          <Row3
            label="Sleep Time"
            weekly={formatMinutesAsTime(weekly.sleep == null ? null : Math.round(weekly.sleep))}
            monthly={formatMinutesAsTime(monthly.sleep == null ? null : Math.round(monthly.sleep))}
          />
          <Row3
            label="Wake-Up Time"
            weekly={formatMinutesAsTime(weekly.wake == null ? null : Math.round(weekly.wake))}
            monthly={formatMinutesAsTime(monthly.wake == null ? null : Math.round(monthly.wake))}
          />
        </div>
      </div>
    </div>
  )
}

function Row3({
  label,
  weekly,
  monthly,
}: {
  label: string
  weekly: string
  monthly: string
}) {
  return (
    <>
      <div className="py-2 text-center text-sm font-semibold text-[color:var(--color-text)]">
        {label}
      </div>
      <div className="py-2 text-center text-sm font-semibold text-[color:var(--color-text)]">
        {weekly}
      </div>
      <div className="py-2 text-center text-sm font-semibold text-[color:var(--color-text)]">
        {monthly}
      </div>
    </>
  )
}

