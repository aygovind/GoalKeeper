import { Heatmap } from '../components/sleep/Heatmap'
import { StatsPanel } from '../components/sleep/StatsPanel'

export function SleepActivity() {
  return (
    <div className="space-y-4">
      <div id="month">
        <Heatmap />
      </div>
      <div id="stats">
        <StatsPanel />
      </div>
    </div>
  )
}

