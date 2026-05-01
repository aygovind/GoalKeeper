import type { SleepGoal, SleepLog, SleepGoalInput, SleepLogInput } from './sleep'

const GOAL_KEY = 'goalkeeper.sleepGoal'
const LOGS_KEY = 'goalkeeper.sleepLogsByDate'

type LogsByDate = Record<string, SleepLog>

function uuid() {
  // good-enough for local-only usage
  return crypto.randomUUID()
}

function nowIso() {
  return new Date().toISOString()
}

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

export async function localGetSleepGoal(): Promise<SleepGoal | null> {
  return readJson<SleepGoal>(GOAL_KEY)
}

export async function localUpsertSleepGoal(input: SleepGoalInput): Promise<SleepGoal> {
  const existing = await localGetSleepGoal()
  const next: SleepGoal = {
    id: existing?.id ?? input.id ?? uuid(),
    hours_goal: input.hours_goal,
    hours_whole_goal: input.hours_whole_goal ?? null,
    sleep_time_goal: input.sleep_time_goal ?? null,
    sleep_time_whole_goal: input.sleep_time_whole_goal ?? null,
    wake_time_goal: input.wake_time_goal ?? null,
    wake_time_whole_goal: input.wake_time_whole_goal ?? null,
    updated_at: nowIso(),
  }
  writeJson(GOAL_KEY, next)
  return next
}

export async function localGetSleepLogsBetween(
  startYmd: string,
  endYmd: string,
): Promise<SleepLog[]> {
  const map = readJson<LogsByDate>(LOGS_KEY) ?? {}
  return Object.values(map)
    .filter((l) => l.date >= startYmd && l.date <= endYmd)
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
}

export async function localUpsertSleepLog(input: SleepLogInput): Promise<SleepLog> {
  const map = readJson<LogsByDate>(LOGS_KEY) ?? {}
  const existing = map[input.date]
  const next: SleepLog = {
    id: existing?.id ?? input.id ?? uuid(),
    date: input.date,
    hours_slept: input.hours_slept ?? existing?.hours_slept ?? null,
    sleep_time: input.sleep_time ?? existing?.sleep_time ?? null,
    wake_time: input.wake_time ?? existing?.wake_time ?? null,
    logged_at: nowIso(),
  }
  map[input.date] = next
  writeJson(LOGS_KEY, map)
  return next
}

export async function localDeleteSleepLog(date: string): Promise<void> {
  const map = readJson<LogsByDate>(LOGS_KEY) ?? {}
  if (map[date]) {
    delete map[date]
    writeJson(LOGS_KEY, map)
  }
}

