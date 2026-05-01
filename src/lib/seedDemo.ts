import { addDays, format, startOfDay } from 'date-fns'
import {
  getSleepGoal,
  getSleepLogsBetween,
  upsertSleepGoal,
  upsertSleepLog,
} from './sleep'

export async function seedDemoWeekIfEmpty() {
  if (!import.meta.env.DEV) return

  const end = startOfDay(new Date())
  const start = addDays(end, -6)
  const startYmd = format(start, 'yyyy-MM-dd')
  const endYmd = format(end, 'yyyy-MM-dd')

  const existing = await getSleepLogsBetween(startYmd, endYmd)
  if (existing.length > 0) return

  const goal = await getSleepGoal()
  if (!goal) {
    await upsertSleepGoal({
      hours_goal: 7.5,
      hours_whole_goal: 8,
      sleep_time_goal: '23:30',
      sleep_time_whole_goal: '22:45',
      wake_time_goal: '07:45',
      wake_time_whole_goal: '07:00',
    })
  }

  const samples = [
    { h: 7.2, s: '23:55', w: '07:30' },
    { h: 8.0, s: '22:50', w: '07:05' },
    { h: 6.6, s: '00:20', w: '07:15' },
    { h: 7.6, s: '23:25', w: '07:40' },
    { h: 8.3, s: '22:35', w: '06:55' },
    { h: 7.4, s: '23:40', w: '07:35' },
    { h: 7.9, s: '23:05', w: '07:10' },
  ]

  for (let i = 0; i < 7; i++) {
    const d = addDays(start, i)
    const ymd = format(d, 'yyyy-MM-dd')
    const sample = samples[i]!
    await upsertSleepLog({
      date: ymd,
      hours_slept: sample.h,
      sleep_time: sample.s,
      wake_time: sample.w,
    })
  }
}

export async function seedDemoApril2026IfEmpty() {
  if (!import.meta.env.DEV) return

  const startYmd = '2026-04-01'
  const endYmd = '2026-04-30'

  const existing = await getSleepLogsBetween(startYmd, endYmd)
  const existingDates = new Set(existing.map((l) => l.date))

  const goal = await getSleepGoal()
  if (!goal) {
    await upsertSleepGoal({
      hours_goal: 7.5,
      hours_whole_goal: 8,
      sleep_time_goal: '23:30',
      sleep_time_whole_goal: '22:45',
      wake_time_goal: '07:45',
      wake_time_whole_goal: '07:00',
    })
  }

  // realistic-ish cadence: mix of ideal, minimum, and missed days
  const logs: Array<{ date: string; h: number; s: string; w: string }> = [
    { date: '2026-04-02', h: 8.1, s: '22:40', w: '06:55' }, // ideal
    { date: '2026-04-03', h: 7.6, s: '23:20', w: '07:35' }, // minimum
    { date: '2026-04-05', h: 6.8, s: '00:10', w: '07:40' }, // missed
    { date: '2026-04-06', h: 8.0, s: '22:50', w: '07:05' }, // ideal-ish
    { date: '2026-04-08', h: 7.5, s: '23:25', w: '07:40' }, // minimum
    { date: '2026-04-10', h: 8.2, s: '22:35', w: '06:50' }, // ideal
    { date: '2026-04-12', h: 7.7, s: '23:10', w: '07:20' }, // minimum
    { date: '2026-04-14', h: 7.4, s: '23:50', w: '07:35' }, // missed (hours)
    { date: '2026-04-15', h: 8.0, s: '22:45', w: '07:00' }, // ideal
    { date: '2026-04-17', h: 7.6, s: '23:28', w: '07:42' }, // minimum
    { date: '2026-04-18', h: 8.3, s: '22:30', w: '06:55' }, // ideal
    { date: '2026-04-20', h: 7.5, s: '23:30', w: '07:45' }, // minimum
    { date: '2026-04-22', h: 8.1, s: '22:42', w: '06:58' }, // ideal
    { date: '2026-04-24', h: 7.8, s: '23:05', w: '07:15' }, // minimum
    { date: '2026-04-26', h: 6.9, s: '00:05', w: '07:50' }, // missed
    { date: '2026-04-28', h: 8.0, s: '22:48', w: '07:02' }, // ideal-ish
    { date: '2026-04-30', h: 7.6, s: '23:15', w: '07:35' }, // minimum
  ]

  for (const l of logs) {
    if (existingDates.has(l.date)) continue
    await upsertSleepLog({
      date: l.date,
      hours_slept: l.h,
      sleep_time: l.s,
      wake_time: l.w,
    })
  }
}

