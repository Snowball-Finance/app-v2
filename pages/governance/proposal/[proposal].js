
import ProposalDetails from 'containers/Governance/ProposalDetails'
import { VoteContractProvider } from 'contexts/vote-context'

export default function VotePage() {
  return (
    <VoteContractProvider>
      <ProposalDetails />
    </VoteContractProvider>
  )
}