
import Governance from 'containers/Governance'
import { VoteContractProvider } from 'contexts/vote-context'

export default function GovernancePage() {
  return (
    <VoteContractProvider>
      <Governance />
    </VoteContractProvider>
  )
}