
import Home from 'containers/Home'
import { CompoundAndEarnProvider } from 'contexts/compound-and-earn-context'
import { DashboardProvider } from 'contexts/dashboard-context'

export default function HomePage() {
  return (
    <CompoundAndEarnProvider>
      <DashboardProvider>
        <Home />
      </DashboardProvider>
    </CompoundAndEarnProvider>
  )
}