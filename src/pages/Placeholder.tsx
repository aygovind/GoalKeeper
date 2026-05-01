import { Card, CardContent, CardHeader } from '../components/ui/Card'

export function Placeholder({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="text-lg font-semibold text-[color:var(--color-text)]">{title}</div>
        <div className="text-sm text-[color:var(--color-muted)]">Coming soon.</div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-[color:var(--color-muted)]">
          This is a placeholder for V1. Sleep tracking is implemented first.
        </div>
      </CardContent>
    </Card>
  )
}

