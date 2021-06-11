
import { memo } from 'react'
import { Grid } from '@material-ui/core'

import { useS3fVaultContracts } from 'contexts/s3f-vault-context'
import TokenSwapIcon from 'components/Icons/TokenSwapIcon'
import CardFormWrapper from 'parts/Card/CardFormWrapper'
import StakeInformation from 'parts/Vault/StakeInformation'

const ShareCard = () => {
  const { s3fToken, staked, onStake, onWithdraw } = useS3fVaultContracts()

  return (
    <CardFormWrapper
      icon={<TokenSwapIcon />}
      title='My share'
      subTitle='Stable vault stake information'
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <StakeInformation
            type='s3f'
            availableStake={s3fToken.balance}
            staked={staked}
            onWithdraw={onWithdraw}
            onStake={onStake}
          />
        </Grid>
      </Grid>
    </CardFormWrapper>
  )
}

export default memo(ShareCard)