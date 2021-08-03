import { memo, useState } from 'react'

import { useS4dVaultContracts } from 'contexts/s4d-vault-context'
import SubMenuTabs from 'parts/SubMenuTabs'
import SwapPanel from './SwapPanel'
import LiquidityPanel from './LiquidityPanel'
import VaultWrapper from 'containers/StableVault/Shared/VaultWrapper'
import { VAULT_TABS, VAULT_TABS_ARRAY } from 'utils/constants/vault-tabs'

const vault = 's4D'
const S4Vault = () => {
  const { loading, pairNames } = useS4dVaultContracts();
  const [selectedTab, setSelectedTab] = useState(VAULT_TABS.swap.VALUE)

  return (
    <VaultWrapper
      loading={loading}
      pairNames={pairNames}
      vault={vault} 
    >
      <SubMenuTabs
        tabs={VAULT_TABS_ARRAY}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      {selectedTab === VAULT_TABS.swap.VALUE && <SwapPanel vault={vault} />}
      {selectedTab === VAULT_TABS.liquidity.VALUE && <LiquidityPanel vault={vault} />}
    </VaultWrapper>
  );
}

export default memo(S4Vault)