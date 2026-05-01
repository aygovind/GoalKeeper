import { useEffect, useMemo, useState } from 'react'
import { format, parse, parseISO } from 'date-fns'
import { Button } from '../components/ui/Button'
import { Dialog } from '../components/ui/Dialog'
import { Input } from '../components/ui/Input'
import { deleteSleepLog, getSleepLogsBetween, todayYmd, upsertSleepLog, type SleepLog } from '../lib/sleep'
import { lastNDaysRange } from '../lib/utils'

type EditState = {
  open: boolean
  log: SleepLog | null
  hours: string
  sleepTime: string
  wakeTime: string
}

export function SleepHistory() {
  const { startYmd, endYmd } = useMemo(() => lastNDaysRange(365), [])
  const [logs, setLogs] = useState<SleepLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [edit, setEdit] = useState<EditState>({
    open: false,
    log: null,
    hours: '',
    sleepTime: '',
    wakeTime: '',
  })

  async function refresh() {
    setError(null)
    setLoading(true)
    try {
      const l = await getSleepLogsBetween(startYmd, endYmd)
      setLogs(l.slice().reverse())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startYmd, endYmd])

  async function onDelete(date: string) {
    setError(null)
    try {
      await deleteSleepLog(date)
      await refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete')
    }
  }

  async function onSaveEdit() {
    if (!edit.log) return
    setError(null)
    try {
      const hoursNum = edit.hours.trim() ? Number(edit.hours) : null
      if (hoursNum != null && (!Number.isFinite(hoursNum) || hoursNum <= 0)) {
        throw new Error('Hours must be a positive number.')
      }
      await upsertSleepLog({
        date: edit.log.date,
        hours_slept: hoursNum,
        sleep_time: edit.sleepTime.trim() || null,
        wake_time: edit.wakeTime.trim() || null,
      })
      setEdit({ open: false, log: null, hours: '', sleepTime: '', wakeTime: '' })
      await refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center text-lg font-semibold text-[color:var(--color-text)]">
        History
      </div>

      {error ? (
        <div className="rounded-md border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {loading ? null : logs.length === 0 ? (
        <div className="text-center text-sm text-[color:var(--color-muted)]">—</div>
      ) : (
        <div className="space-y-2">
          {logs.map((l) => (
            <div
              key={l.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2"
            >
              <div className="min-w-0">
                <div className="text-sm font-semibold text-[color:var(--color-text)]">
                  {format(parseISO(l.date), 'MMMM do')}
                </div>
                <div className="text-xs text-[color:var(--color-muted)]">
                  {[
                    l.hours_slept == null ? null : `${Number(l.hours_slept).toFixed(1)}h`,
                    formatAmPm(l.sleep_time),
                    formatAmPm(l.wake_time),
                  ]
                    .filter(Boolean)
                    .join(' · ') || '—'}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    setEdit({
                      open: true,
                      log: l,
                      hours: l.hours_slept == null ? '' : String(l.hours_slept),
                      sleepTime: l.sleep_time ?? '',
                      wakeTime: l.wake_time ?? '',
                    })
                  }
                >
                  Edit
                </Button>
                <Button type="button" variant="ghost" onClick={() => onDelete(l.date)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={edit.open}
        onOpenChange={(v) =>
          setEdit((s) => (v ? s : { open: false, log: null, hours: '', sleepTime: '', wakeTime: '' }))
        }
        title={edit.log ? format(parseISO(edit.log.date), 'MMMM do') : todayYmd()}
      >
        <div className="space-y-3">
          <Input
            type="number"
            inputMode="decimal"
            step="0.1"
            min="0"
            value={edit.hours}
            onChange={(e) => setEdit((s) => ({ ...s, hours: e.target.value }))}
            placeholder="Hours"
            autoFocus
          />
          <Input
            type="time"
            value={edit.sleepTime}
            onChange={(e) => setEdit((s) => ({ ...s, sleepTime: e.target.value }))}
          />
          <Input
            type="time"
            value={edit.wakeTime}
            onChange={(e) => setEdit((s) => ({ ...s, wakeTime: e.target.value }))}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setEdit({ open: false, log: null, hours: '', sleepTime: '', wakeTime: '' })}>
              Cancel
            </Button>
            <Button type="button" onClick={onSaveEdit}>
              Save
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

function formatAmPm(hhmm: string | null) {
  if (!hhmm) return null
  const d = parse(hhmm, 'HH:mm', new Date())
  return format(d, 'h:mm a')
}

