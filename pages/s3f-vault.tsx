
import S3fVault from 'containers/StableVault/S3fVault'
import { S3fVaultContractProvider } from 'contexts/s3f-vault-context'

export default function S3fVaultPage(): JSX.Element {
  return (
    <S3fVaultContractProvider>
      <S3fVault />
    </S3fVaultContractProvider>
  )
}