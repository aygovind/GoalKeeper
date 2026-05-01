import { useMemo, useState } from 'react'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'
import { Input } from '../ui/Input'
import { todayYmd, upsertSleepLog } from '../../lib/sleep'
import { errorMessage } from '../../lib/errorMessage'

type DialogKind = 'hours' | 'sleepTime' | 'wakeTime' | null

function nowHHMM() {
  const d = new Date()
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

export function LogPanel({
  onLogged,
}: {
  onLogged?: () => void
}) {
  const [open, setOpen] = useState<DialogKind>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const today = useMemo(() => todayYmd(), [])
  const [hours, setHours] = useState('')
  const [sleepTime, setSleepTime] = useState(nowHHMM)
  const [wakeTime, setWakeTime] = useState(nowHHMM)

  async function save(kind: Exclude<DialogKind, null>) {
    setError(null)
    setLoading(true)
    try {
      if (kind === 'hours') {
        const n = Number(hours)
        if (!Number.isFinite(n) || n <= 0) throw new Error('Enter a positive number of hours.')
        await upsertSleepLog({ date: today, hours_slept: n })
      } else if (kind === 'sleepTime') {
        if (!sleepTime) throw new Error('Enter a sleep time.')
        await upsertSleepLog({ date: today, sleep_time: sleepTime })
      } else {
        if (!wakeTime) throw new Error('Enter a wake time.')
        await upsertSleepLog({ date: today, wake_time: wakeTime })
      }
      setOpen(null)
      onLogged?.()
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error ? (
        <div className="rounded-md border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="flex justify-center">
        <div className="flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => setOpen('hours')}
            className={circleClass}
          >
            Hours
          </button>
          <button
            type="button"
            onClick={() => setOpen('sleepTime')}
            className={circleClass}
          >
            Sleep
            <br />
            Time
          </button>
          <button
            type="button"
            onClick={() => setOpen('wakeTime')}
            className={circleClass}
          >
            Wake
            <br />
            Time
          </button>
        </div>
      </div>

        <Dialog
          open={open === 'hours'}
          onOpenChange={(v) => setOpen(v ? 'hours' : null)}
          title="Log Hours Slept"
        >
          <div className="space-y-3">
            <Input
              type="number"
              inputMode="decimal"
              step="0.1"
              min="0"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="7.5"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(null)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="button" onClick={() => save('hours')} disabled={loading}>
                {loading ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </div>
        </Dialog>

        <Dialog
          open={open === 'sleepTime'}
          onOpenChange={(v) => setOpen(v ? 'sleepTime' : null)}
          title="Log Sleep Time"
        >
          <div className="space-y-3">
            <Input
              type="time"
              value={sleepTime}
              onChange={(e) => setSleepTime(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(null)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="button" onClick={() => save('sleepTime')} disabled={loading}>
                {loading ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </div>
        </Dialog>

        <Dialog
          open={open === 'wakeTime'}
          onOpenChange={(v) => setOpen(v ? 'wakeTime' : null)}
          title="Log Wake Up Time"
        >
          <div className="space-y-3">
            <Input
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(null)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="button" onClick={() => save('wakeTime')} disabled={loading}>
                {loading ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </div>
        </Dialog>
    </div>
  )
}

const circleClass =
  'flex h-24 w-24 items-center justify-center rounded-full border text-base font-semibold text-[color:var(--color-text)] transition sm:h-28 sm:w-28 sm:text-lg ' +
  'border-[color:var(--color-border)] hover:bg-[color:var(--color-surface)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-green)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]'

