
import Staking from 'containers/Staking'

import { StakingContractProvider } from 'contexts/staking-context'

export default function StakingPage() {
  return (
    <StakingContractProvider>
      <Staking />
    </StakingContractProvider>
  )
}