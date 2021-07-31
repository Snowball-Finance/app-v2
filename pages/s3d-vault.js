
import S3Vault from 'containers/StableVault/S3Vault'

import { S3dVaultContractProvider } from 'contexts/s3d-vault-context'

export default function S3dVaultPage() {
  return (
    <S3dVaultContractProvider>
      <S3Vault vault="s3D" />
    </S3dVaultContractProvider>
  )
}