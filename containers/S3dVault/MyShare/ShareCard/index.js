
import { memo } from 'react'
import { Grid } from '@material-ui/core'

import TokenSwapIcon from 'components/Icons/TokenSwapIcon'
import CardFormWrapper from 'parts/Card/CardFormWrapper'
import RemoveLiquidity from 'parts/Vault/RemoveLiquidity'
import StakeInformation from 'parts/Vault/StakeInformation'

const ShareCard = () => {
  return (
    <CardFormWrapper
      icon={<TokenSwapIcon />}
      title='My share'
      subTitle='Stable vault stake information'
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <RemoveLiquidity
            type='s3d'
            value='150,234.293'
            onRemove={() => { }}
          />
        </Grid>
        <Grid item xs={12}>
          <StakeInformation
            type='s3d'
            availableStake='150,234.293'
            staked='1,293'
            onWithdraw={() => { }}
            onStake={() => { }}
          />
        </Grid>
      </Grid>
    </CardFormWrapper>
  )
}

export default memo(ShareCard)