import { memo } from 'react'

import { useS4dVaultContracts } from 'contexts/s4d-vault-context'
import LiquidityPanel from './LiquidityPanel'
import VaultWrapper from 'containers/StableVault/Shared/VaultWrapper'

const vault = 's4D'
const S4Vault = () => {
  const { loading, pairNames } = useS4dVaultContracts();

  return (
    <VaultWrapper
      loading={loading}
      pairNames={pairNames}
      vault={vault} 
    >
      <LiquidityPanel vault={vault} />
    </VaultWrapper>
  );
}

export default memo(S4Vault)