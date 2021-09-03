import { memo, useMemo } from 'react'
import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { formatEther } from 'ethers/lib/utils'
import { useStakingContract } from 'contexts/staking-context'
import ContainedButton from 'components/UI/Buttons/ContainedButton'
import SnowTokenIcon from 'components/SnowTokenIcon';
import CardWrapper from '../CardWrapper'
import { formatNumber } from 'utils/helpers/format'
import { useAPIContext } from 'contexts/api-context'

const useStyles = makeStyles((theme) => ({
  sherpaClaim: {
    marginTop: theme.spacing(2),
    backgroundColor: theme.custom.palette.sherpa_red
  },
}));

const SnowClaim = () => {
  const {
    claim,
    userClaimable,
    sherpaClaim,
    userSherpaClaimable
  } = useStakingContract();

  const classes = useStyles();
  const { getCurrentDistributionPhase } = useAPIContext();
  const currentDistributionPhaseQuery = getCurrentDistributionPhase();

  const claimable = useMemo(() =>
    userClaimable ? parseFloat(formatEther(userClaimable)) : null
    , [userClaimable]);
  
  const sherpaClaimable = useMemo(() =>
    userSherpaClaimable ? parseFloat(formatEther(userSherpaClaimable)) : null
    , [userSherpaClaimable]);
  return (
    <CardWrapper title='Claim'>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography color='textPrimary' variant='body1'>
            {`Last distribution amount: ${formatNumber(currentDistributionPhaseQuery.data?.CurrentDistributionPhase.snobDistributed)}`}
          </Typography>
          <Typography color='textPrimary' variant='body1'>
            {`Last distribution date: ${new Date(currentDistributionPhaseQuery.data?.CurrentDistributionPhase.startDate).toLocaleDateString()}`}
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
          {sherpaClaimable && 
            <ContainedButton
              className = {classes.sherpaClaim}
              fullWidth
              disabled={!sherpaClaimable}
              onClick={sherpaClaim}
            >
            {`Claim ${formatNumber(sherpaClaimable, 3)} Sherpa`}
            <SnowTokenIcon size={16} token='SHERPA'/>
            </ContainedButton>
          }
        </Grid>
      </Grid>
    </CardWrapper>
  )
}

export default memo(SnowClaim)
