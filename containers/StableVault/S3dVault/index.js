import { memo, useState } from 'react'

import { useS3dVaultContracts } from 'contexts/s3d-vault-context'
import SubMenuTabs from 'parts/SubMenuTabs'
import VaultWrapper from '../Shared/VaultWrapper'
import SwapPanel from './SwapPanel'
import LiquidityPanel from './LiquidityPanel'
import { VAULT_TABS, VAULT_TABS_ARRAY } from 'utils/constants/vault-tabs'

const vault = 's3D'
const S3Vault = () => {
  const { loading, pairNames } = useS3dVaultContracts()
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

export default memo(S3Vault)