
import VoteDetail from 'containers/VoteDetail'
import { VoteContractProvider } from 'contexts/vote-context'

export default function VotePage() {
  return (
    <VoteContractProvider>
      <VoteDetail />
    </VoteContractProvider>
  )
}