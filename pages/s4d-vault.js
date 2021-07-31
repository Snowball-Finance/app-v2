
import S4Vault from 'containers/StableVault/S4Vault'

import { S4dVaultContractProvider } from 'contexts/s4d-vault-context'

export default function S3dVaultPage() {
  return (
    <S4dVaultContractProvider>
      <S4Vault />
    </S4dVaultContractProvider>
  )
}