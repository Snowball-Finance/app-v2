import { memo } from 'react'
import { Grid } from '@material-ui/core'

import { useS4dVaultContracts } from 'contexts/s4d-vault-context'
import { usePanelStyles } from 'containers/StableVault/Shared/PanelLayout'
import ShareCard from 'containers/StableVault/Shared/ShareCard'
import CurrencyReserves from 'containers/StableVault/Shared/CurrencyReserves'

const LiquidityPanel = ({
  vault
}) => {
  const classes = usePanelStyles();
  const {
    svToken,
    tokenArray,
    tokenValues,
    totalSupply,
    getWithdrawAmount,
    removeLiquidity,
  } = useS4dVaultContracts();

  return (
      <Grid item xs={12} md={6}>
        <Grid container spacing={3}>
          <Grid item xs={12} className={classes.rightCard}>
            <ShareCard
              vault={vault}
              staked={svToken.balance}
              tokenArray={tokenArray}
              getWithdrawAmount={getWithdrawAmount}
              removeLiquidity={removeLiquidity}
            />
          </Grid>
          <Grid item xs={12} className={classes.rightCard}>
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
