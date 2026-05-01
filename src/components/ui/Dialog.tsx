import { type ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

export function Dialog({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onOpenChange(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        onClick={() => onOpenChange(false)}
        aria-label="Close"
      />
      <div
        className={cn(
          'relative w-full max-w-md overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-xl',
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[color:var(--color-border)] px-4 py-3">
          <div className="text-sm font-semibold text-[color:var(--color-text)]">
            {title}
          </div>
          <button
            type="button"
            className="rounded-md p-2 text-[color:var(--color-muted)] hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-4 py-4">{children}</div>
      </div>
    </div>
  )
}

