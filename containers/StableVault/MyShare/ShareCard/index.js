import { memo } from 'react'
import { Grid } from '@material-ui/core'

import { useS3dVaultContracts } from 'contexts/s3d-vault-context'
import { useS3fVaultContracts } from 'contexts/s3f-vault-context'
import TokenSwapIcon from 'components/Icons/TokenSwapIcon'
import CardFormWrapper from 'parts/Card/CardFormWrapper'
import StakeInformation from 'parts/Vault/StakeInformation'

const ShareCard = ({
  vault
}) => {
  const { staked } = (vault == 's3D') ? useS3dVaultContracts() : useS3fVaultContracts();

  return (
    <CardFormWrapper
      icon={<TokenSwapIcon />}
      title='My Share'
      subTitle='StableVault stake information'
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <StakeInformation
            type={vault}
            staked={staked}
          />
        </Grid>
      </Grid>
    </CardFormWrapper>
  )
}

export default memo(ShareCard)