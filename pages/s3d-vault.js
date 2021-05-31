
import S3dVault from 'containers/S3dVault'

import { S3dVaultContractProvider } from 'contexts/s3d-vault-context'

export default function S3fVaultPage() {
  return (
    <S3dVaultContractProvider>
      <S3dVault />
    </S3dVaultContractProvider>
  )
}