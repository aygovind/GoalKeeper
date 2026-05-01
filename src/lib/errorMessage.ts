export function errorMessage(e: unknown) {
  if (!e) return 'Unknown error'
  if (typeof e === 'string') return e
  if (e instanceof Error) return e.message
  if (typeof e === 'object' && 'message' in e && typeof (e as any).message === 'string') {
    return (e as any).message
  }
  try {
    return JSON.stringify(e)
  } catch {
    return 'Unknown error'
  }
}

