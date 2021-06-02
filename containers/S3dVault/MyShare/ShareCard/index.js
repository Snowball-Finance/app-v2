
import { memo } from 'react'
import { Grid } from '@material-ui/core'

import { useS3dVaultContracts } from 'contexts/s3d-vault-context'
import TokenSwapIcon from 'components/Icons/TokenSwapIcon'
import CardFormWrapper from 'parts/Card/CardFormWrapper'
import RemoveLiquidity from 'parts/Vault/RemoveLiquidity'
import StakeInformation from 'parts/Vault/StakeInformation'

const ShareCard = () => {
  const { s3dToken, staked } = useS3dVaultContracts()

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
            value={s3dToken.balance.toLocaleString()}
            onRemove={() => { }}
          />
        </Grid>
        <Grid item xs={12}>
          <StakeInformation
            type='s3d'
            availableStake={s3dToken.balance.toLocaleString()}
            staked={staked.toLocaleString()}
            onWithdraw={() => { }}
            onStake={() => { }}
          />
        </Grid>
      </Grid>
    </CardFormWrapper>
  )
}

export default memo(ShareCard)