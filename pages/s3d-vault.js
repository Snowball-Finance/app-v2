
import StableVault from 'containers/StableVault'

import { S3dVaultContractProvider } from 'contexts/s3d-vault-context'

export default function S3dVaultPage() {
  return (
    <S3dVaultContractProvider>
      <StableVault vault="s3D" />
    </S3dVaultContractProvider>
  )
}