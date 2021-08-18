import { memo } from 'react'
import { Grid } from '@material-ui/core'

import { useS3fVaultContracts } from 'contexts/s3f-vault-context'
import PanelLayout, { usePanelStyles } from 'containers/StableVault/Shared/PanelLayout'
import AddLiquidityForm from 'containers/StableVault/Shared/AddLiquidityForm'
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
    getDepositReview,
    getWithdrawAmount,
    removeLiquidity,
    addLiquidity
  } = useS3fVaultContracts();

  return (
    <PanelLayout>
      <Grid item xs={12} md={6} className={classes.leftCard}>
        <AddLiquidityForm
          vault={vault}
          tokenValues={tokenValues}
          tokenArray={tokenArray}
          getDepositReview={getDepositReview}
          addLiquidity={addLiquidity}
        />
      </Grid>
      <Grid item xs={12} md={6} >
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
    </PanelLayout>
  )
}

export default memo(LiquidityPanel)
