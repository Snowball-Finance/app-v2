
import S3fVault from 'containers/S3fVault'
import { S3fVaultContractProvider } from 'contexts/s3f-vault-context'

export default function S3dVaultPage() {
  return (
    <S3fVaultContractProvider>
      <S3fVault />
    </S3fVaultContractProvider>
  )
}