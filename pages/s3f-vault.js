
import StableVault from 'containers/StableVault'
import { S3fVaultContractProvider } from 'contexts/s3f-vault-context'

export default function S3fVaultPage() {
  return (
    <S3fVaultContractProvider>
      <StableVault vault="s3F" />
    </S3fVaultContractProvider>
  )
}