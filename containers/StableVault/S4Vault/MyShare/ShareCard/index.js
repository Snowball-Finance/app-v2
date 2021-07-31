import { memo } from 'react'
import { Grid } from '@material-ui/core'

import { useS4dVaultContracts } from 'contexts/s4d-vault-context'
import TokenSwapIcon from 'components/Icons/TokenSwapIcon'
import CardFormWrapper from 'parts/Card/CardFormWrapper'
import StakeInformation from 'parts/Vault/StakeInformation'

const ShareCard = () => {
  const { staked } = useS4dVaultContracts();

  return (
    <CardFormWrapper
      icon={<TokenSwapIcon />}
      title='My Share'
      subTitle='StableVault stake information'
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <StakeInformation
            type='s4d'
            staked={staked}
          />
        </Grid>
      </Grid>
    </CardFormWrapper>
  )
}

export default memo(ShareCard)