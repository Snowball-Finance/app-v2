import { memo } from 'react'

import { useS3dVaultContracts } from 'contexts/s3d-vault-context'
import VaultWrapper from '../Shared/VaultWrapper'
import LiquidityPanel from './LiquidityPanel'

const vault = 's3D'
const S3Vault = () => {
  const { loading, pairNames } = useS3dVaultContracts()

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

export default memo(S3Vault)