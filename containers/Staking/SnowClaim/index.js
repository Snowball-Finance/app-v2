import { memo, useMemo } from 'react'
import { Grid, Typography } from '@material-ui/core'
import { formatEther } from 'ethers/lib/utils'

import { useStakingContract } from 'contexts/staking-context'
import ContainedButton from 'components/UI/Buttons/ContainedButton'
import CardWrapper from '../CardWrapper'
import { formatNumber } from 'utils/helpers/format'
import { useAPIContext } from 'contexts/api-context'

const SnowClaim = () => {
  const {
    claim,
    userClaimable
  } = useStakingContract();

  const { getCurrentDistributionPhase } = useAPIContext();
  const currentDistributionPhaseQuery = getCurrentDistributionPhase();

  const claimable = useMemo(() =>
    userClaimable ? parseFloat(formatEther(userClaimable)) : null
    , [userClaimable]);

  return (
    <CardWrapper title='Claim'>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography color='textPrimary' variant='body1'>
            {`Current distribution amount: ${formatNumber(currentDistributionPhaseQuery.data?.CurrentDistributionPhase.snobDistributed)}`}
          </Typography>
          <Typography color='textPrimary' variant='body1'>
            {`Current distribution date: ${new Date(currentDistributionPhaseQuery.data?.CurrentDistributionPhase.startDate).toLocaleDateString()}`}
          </Typography>
          <br />
          <Typography color='textPrimary' variant='body1'>
            {`Next distribution: ${new Date(currentDistributionPhaseQuery.data?.CurrentDistributionPhase.nextDate).toLocaleDateString()}`}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <ContainedButton
            fullWidth
            disabled={!claimable}
            onClick={claim}
          >
            {`Claim ${formatNumber(claimable, 3)} Snowballs`}
          </ContainedButton>
        </Grid>
      </Grid>
    </CardWrapper>
  )
}

export default memo(SnowClaim)
