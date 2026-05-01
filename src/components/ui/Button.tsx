import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'default' | 'secondary' | 'ghost'
type Size = 'sm' | 'md'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
}

export function Button({
  className,
  variant = 'default',
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm font-medium transition',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-green)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]',
        size === 'sm' ? 'h-9' : 'h-10',
        variant === 'default' &&
          'bg-[color:var(--color-green)] text-black hover:brightness-110',
        variant === 'secondary' &&
          'bg-[color:var(--color-surface)] text-[color:var(--color-text)] hover:bg-[color:var(--color-surface-2)]',
        variant === 'ghost' &&
          'border-transparent bg-transparent text-[color:var(--color-text)] hover:bg-[color:var(--color-surface)]',
        className,
      )}
      {...props}
    />
  )
}

