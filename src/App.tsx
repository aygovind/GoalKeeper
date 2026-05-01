import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Sleep } from './pages/Sleep'
import { SleepActivity } from './pages/SleepActivity'
import { SleepGoals } from './pages/SleepGoals'
import { SleepLog } from './pages/SleepLog'
import { SleepHistory } from './pages/SleepHistory'
import { Placeholder } from './pages/Placeholder'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/sleep/log" replace />} />
        <Route path="/sleep" element={<Sleep />}>
          <Route path="goals" element={<SleepGoals />} />
          <Route path="log" element={<SleepLog />} />
          <Route path="history" element={<SleepHistory />} />
          <Route path="activity" element={<SleepActivity />} />
        </Route>
        <Route path="/diet" element={<Placeholder title="Diet" />} />
        <Route path="/gym" element={<Placeholder title="Gym" />} />
        <Route path="/work" element={<Placeholder title="Work" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
