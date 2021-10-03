
import S3dVault from 'containers/StableVault/S3dVault'
import { S3dVaultContractProvider } from 'contexts/s3d-vault-context'

export default function S3dVaultPage(): JSX.Element {
  return (
    <S3dVaultContractProvider>
      <S3dVault />
    </S3dVaultContractProvider>
  )
}