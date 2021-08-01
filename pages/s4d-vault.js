
import S4dVault from 'containers/StableVault/S4dVault'
import { S4dVaultContractProvider } from 'contexts/s4d-vault-context'

export default function S3dVaultPage() {
  return (
    <S4dVaultContractProvider>
      <S4dVault />
    </S4dVaultContractProvider>
  )
}