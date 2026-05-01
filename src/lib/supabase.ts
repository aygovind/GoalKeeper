import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

function isValidHttpUrl(value: string) {
  try {
    const u = new URL(value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export const supabase =
  supabaseUrl && supabaseAnonKey && isValidHttpUrl(supabaseUrl)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

if (import.meta.env.DEV && supabaseUrl && !isValidHttpUrl(supabaseUrl)) {
  // eslint-disable-next-line no-console
  console.warn(
    `Invalid VITE_SUPABASE_URL (expected https://...supabase.co). Falling back to localStorage mode.`,
  )
}

export function requireSupabase() {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL to the Project URL (https://...supabase.co) and VITE_SUPABASE_ANON_KEY in .env (see .env.example).',
    )
  }
  return supabase
}

