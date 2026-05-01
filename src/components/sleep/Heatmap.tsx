import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  addDays,
  differenceInCalendarDays,
  endOfMonth,
  format,
  parseISO,
  startOfWeek,
  startOfMonth,
} from 'date-fns'
import { getSleepGoal, getSleepLogsBetween, type SleepGoal, type SleepLog } from '../../lib/sleep'
import { hhmmToMinutes } from '../../lib/utils'
import { Button } from '../ui/Button'

type HeatValue = {
  date: string
  count: 0 | 1 | 2
}

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

function classifyDay(log: SleepLog, goal: SleepGoal | null): 0 | 1 | 2 {
  const goalMet =
    metHours(log.hours_slept, goal?.hours_goal ?? null) &&
    metTimeGoal(log.sleep_time, goal?.sleep_time_goal ?? null) &&
    metTimeGoal(log.wake_time, goal?.wake_time_goal ?? null)

  const wholeMet =
    goal?.hours_whole_goal != null ||
    goal?.sleep_time_whole_goal != null ||
    goal?.wake_time_whole_goal != null
      ? metHours(log.hours_slept, goal?.hours_whole_goal ?? null) &&
        metTimeGoal(log.sleep_time, goal?.sleep_time_whole_goal ?? null) &&
        metTimeGoal(log.wake_time, goal?.wake_time_whole_goal ?? null)
      : false

  return wholeMet ? 2 : goalMet ? 1 : 0
}

export function Heatmap() {
  const [goal, setGoal] = useState<SleepGoal | null>(null)
  const [logs, setLogs] = useState<SleepLog[]>([])
  const [error, setError] = useState<string | null>(null)

  const [monthOffset, setMonthOffset] = useState(0)

  const monthStart = useMemo(() => {
    const d = new Date()
    d.setMonth(d.getMonth() + monthOffset)
    return startOfMonth(d)
  }, [monthOffset])

  const monthEnd = useMemo(() => endOfMonth(monthStart), [monthStart])

  const startYmd = useMemo(() => format(monthStart, 'yyyy-MM-dd'), [monthStart])
  const endYmd = useMemo(() => format(monthEnd, 'yyyy-MM-dd'), [monthEnd])

  useEffect(() => {
    let cancelled = false
    async function run() {
      try {
        const [g, l] = await Promise.all([getSleepGoal(), getSleepLogsBetween(startYmd, endYmd)])
        if (cancelled) return
        setGoal(g)
        setLogs(l)
      } catch (e) {
        if (cancelled) return
        setError(e instanceof Error ? e.message : 'Failed to load heatmap')
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [startYmd, endYmd])

  const values = useMemo<HeatValue[]>(() => {
    const map = new Map<string, HeatValue>()

    // ensure every day in range exists so hover always shows a date
    for (let d = monthStart; d <= monthEnd; d = addDays(d, 1)) {
      const ymd = format(d, 'yyyy-MM-dd')
      map.set(ymd, { date: ymd, count: 0 })
    }

    for (const log of logs) {
      const cls = classifyDay(log, goal)
      map.set(log.date, { date: log.date, count: cls })
    }
    return [...map.values()]
  }, [logs, goal, monthStart, monthEnd])

  const valuesByDate = useMemo(() => {
    const map = new Map<string, HeatValue>()
    for (const v of values) map.set(v.date, v)
    return map
  }, [values])

  const gridStart = useMemo(
    () => startOfWeek(monthStart, { weekStartsOn: 1 }),
    [monthStart],
  )
  const gridEnd = useMemo(() => {
    // include last week fully
    const days = differenceInCalendarDays(monthEnd, gridStart)
    const weeks = Math.ceil((days + 1) / 7)
    return addDays(gridStart, weeks * 7 - 1)
  }, [gridStart, monthEnd])

  const cells = useMemo(() => {
    const out: Array<{ ymd: string; inMonth: boolean; count: 0 | 1 | 2 }> = []
    for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) {
      const ymd = format(d, 'yyyy-MM-dd')
      const inMonth = ymd >= startYmd && ymd <= endYmd
      const v = valuesByDate.get(ymd)
      out.push({ ymd, inMonth, count: v?.count ?? 0 })
    }
    return out
  }, [gridStart, gridEnd, startYmd, endYmd, valuesByDate])

  const todayYmd = useMemo(() => format(new Date(), 'yyyy-MM-dd'), [])

  if (error) {
    return (
      <div className="rounded-md border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-200">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="secondary"
          className="rounded-full px-3"
          onClick={() => setMonthOffset((n) => n - 1)}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-center text-sm font-semibold text-[color:var(--color-text)]">
          {format(monthStart, 'MMMM yyyy')}
        </div>
        <Button
          type="button"
          variant="secondary"
          className="rounded-full px-3"
          onClick={() => setMonthOffset((n) => n + 1)}
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex justify-center">
        <div className="gk-month-grid grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <div
                key={d}
                className="text-center text-xs font-semibold text-[color:var(--color-text)]"
              >
                {d}
              </div>
            ))}

            {cells.map((c) => {
              const title = format(parseISO(c.ymd), 'MMMM do')
              const cls =
                c.count === 2
                  ? 'bg-[color:var(--color-green)]'
                  : c.count === 1
                    ? 'bg-green-800'
                    : 'bg-[color:var(--color-surface-2)]'
              const faded = c.inMonth ? '' : 'opacity-25'
              const isToday = c.ymd === todayYmd
              return (
                <div
                  key={c.ymd}
                  title={title}
                  className={[
                    'aspect-square w-full rounded-sm',
                    cls,
                    faded,
                    isToday
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-[color:var(--color-surface)]'
                      : '',
                  ].join(' ')}
                />
              )
            })}
        </div>
      </div>
    </div>
  )
}

