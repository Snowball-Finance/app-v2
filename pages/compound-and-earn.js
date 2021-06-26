
import CompoundAndEarn from 'containers/CompoundAndEarn'
import { CompoundAndEarnProvider } from 'contexts/compound-and-earn-context'

export default function CompoundAndEarnPage() {
  return (
    <CompoundAndEarnProvider>
      <CompoundAndEarn />
    </CompoundAndEarnProvider>
  )
}