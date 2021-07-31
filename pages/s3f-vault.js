
import S3Vault from 'containers/StableVault/S3Vault'
import { S3fVaultContractProvider } from 'contexts/s3f-vault-context'

export default function S3fVaultPage() {
  return (
    <S3fVaultContractProvider>
      <S3Vault vault="s3F" />
    </S3fVaultContractProvider>
  )
}