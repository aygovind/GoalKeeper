import { formatISO, parseISO } from 'date-fns'
import { requireSupabase, supabase } from './supabase'
import {
  localGetSleepGoal,
  localGetSleepLogsBetween,
  localDeleteSleepLog,
  localUpsertSleepGoal,
  localUpsertSleepLog,
} from './localSleep'

export type SleepGoal = {
  id: string
  hours_goal: number
  hours_whole_goal: number | null
  sleep_time_goal: string | null
  sleep_time_whole_goal: string | null
  wake_time_goal: string | null
  wake_time_whole_goal: string | null
  updated_at: string
}

export type SleepLog = {
  id: string
  date: string // YYYY-MM-DD
  hours_slept: number | null
  sleep_time: string | null // HH:mm
  wake_time: string | null // HH:mm
  logged_at: string
}

export type SleepGoalInput = Omit<SleepGoal, 'id' | 'updated_at'> & {
  id?: string
}

export type SleepLogInput = {
  id?: string
  date: string
  hours_slept?: number | null
  sleep_time?: string | null
  wake_time?: string | null
}

const GOALS_TABLE = 'sleep_goals'
const LOGS_TABLE = 'sleep_logs'

export async function getSleepGoal(): Promise<SleepGoal | null> {
  if (!supabase) return await localGetSleepGoal()
  const supa = requireSupabase()
  const { data, error } = await supa
    .from(GOALS_TABLE)
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data as SleepGoal | null
}

export async function upsertSleepGoal(input: SleepGoalInput): Promise<SleepGoal> {
  if (!supabase) return await localUpsertSleepGoal(input)
  const supa = requireSupabase()
  const existing = await getSleepGoal()

  const payload = {
    ...(existing?.id ? { id: existing.id } : input.id ? { id: input.id } : {}),
    hours_goal: input.hours_goal,
    hours_whole_goal: input.hours_whole_goal ?? null,
    sleep_time_goal: input.sleep_time_goal ?? null,
    sleep_time_whole_goal: input.sleep_time_whole_goal ?? null,
    wake_time_goal: input.wake_time_goal ?? null,
    wake_time_whole_goal: input.wake_time_whole_goal ?? null,
  }

  const { data, error } = await supa
    .from(GOALS_TABLE)
    .upsert(payload)
    .select('*')
    .single()

  if (error) throw error
  return data as SleepGoal
}

export function todayYmd(date = new Date()) {
  return formatISO(date, { representation: 'date' })
}

export async function getSleepLogsBetween(
  startYmd: string,
  endYmd: string,
): Promise<SleepLog[]> {
  if (!supabase) return await localGetSleepLogsBetween(startYmd, endYmd)
  const supa = requireSupabase()
  const { data, error } = await supa
    .from(LOGS_TABLE)
    .select('*')
    .gte('date', startYmd)
    .lte('date', endYmd)
    .order('date', { ascending: true })

  if (error) throw error
  return (data ?? []) as SleepLog[]
}

export async function upsertSleepLog(input: SleepLogInput): Promise<SleepLog> {
  if (!supabase) return await localUpsertSleepLog(input)
  const supa = requireSupabase()

  const payload = {
    ...(input.id ? { id: input.id } : {}),
    date: input.date,
    hours_slept: input.hours_slept ?? null,
    sleep_time: input.sleep_time ?? null,
    wake_time: input.wake_time ?? null,
  }

  const { data, error } = await supa
    .from(LOGS_TABLE)
    .upsert(payload, { onConflict: 'date' })
    .select('*')
    .single()

  if (error) throw error
  return data as SleepLog
}

export async function deleteSleepLog(date: string): Promise<void> {
  if (!supabase) return await localDeleteSleepLog(date)
  const supa = requireSupabase()
  const { error } = await supa.from(LOGS_TABLE).delete().eq('date', date)
  if (error) throw error
}

export function toYmd(value: string | Date) {
  if (value instanceof Date) return todayYmd(value)
  // allow either ISO timestamp or YYYY-MM-DD
  return value.length >= 10 && value[4] === '-' ? value.slice(0, 10) : todayYmd(parseISO(value))
}

