
import Vote from 'containers/Vote'
import { VoteContractProvider } from 'contexts/vote-context'

export default function VotePage() {
  return (
    <VoteContractProvider>
      <Vote />
    </VoteContractProvider>
  )
}