import { memo } from 'react'
import { Grid } from '@material-ui/core'

import { useS3dVaultContracts } from 'contexts/s3d-vault-context'
import ShareCard from 'containers/StableVault/Shared/ShareCard'
import CurrencyReserves from 'containers/StableVault/Shared/CurrencyReserves'

const LiquidityPanel = ({
  vault
}) => {
  const {
    svToken,
    tokenArray,
    tokenValues,
    totalSupply,
    getWithdrawAmount,
    removeLiquidity,
  } = useS3dVaultContracts()

  return (
    <Grid item xs={12} md={6}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ShareCard
            vault={vault}
            staked={svToken.balance}
            tokenArray={tokenArray}
            getWithdrawAmount={getWithdrawAmount}
            removeLiquidity={removeLiquidity}
          />
        </Grid>
        <Grid item xs={12}>
          <CurrencyReserves
            tokenArray={tokenArray}
            tokenValues={tokenValues}
            totalSupply={totalSupply}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default memo(LiquidityPanel)
