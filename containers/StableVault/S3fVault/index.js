import { memo } from 'react'

import { useS3fVaultContracts } from 'contexts/s3f-vault-context'
import VaultWrapper from '../Shared/VaultWrapper'
import LiquidityPanel from './LiquidityPanel'

const vault = 's3F'
const S3Vault = () => {
  const { loading, pairNames } = useS3fVaultContracts();

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