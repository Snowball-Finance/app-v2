import { memo, useMemo } from 'react'
import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { formatEther } from 'ethers/lib/utils'
import { useStakingContract } from 'contexts/staking-context'
import ContainedButton from 'components/UI/Buttons/ContainedButton'
import SnowTokenIcon from 'containers/CompoundAndEarn/ListItem/SnowTokenIcon';
import CardWrapper from '../CardWrapper'
import { formatNumber } from 'utils/helpers/format'
import { useAPIContext } from 'contexts/api-context'

const useStyles = makeStyles((theme) => ({

  sherpaClaim: {
    marginTop: theme.spacing(2),
    backgroundColor: theme.custom.palette.sherpa_red
  },
  axialClaim: {
    marginTop: theme.spacing(2),
    backgroundColor: theme.custom.palette.axial_blue,
    color: theme.custom.palette.axial_gold
  }
}));

const SnowClaim = () => {
  const {
    claim,
    userClaimable,
    sherpaClaim,
    userSherpaClaimable,
    axialClaim,
    userAxialClaimable,
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

  const axialClaimable = useMemo(() =>
    userAxialClaimable ? parseFloat(formatEther(userAxialClaimable)) : null
    , [userAxialClaimable]);
    
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
            {`Claim ${formatNumber(claimable, 4)} Snowballs`}
          </ContainedButton>
          {sherpaClaimable > 0 &&
            <ContainedButton
              className={classes.sherpaClaim}
              fullWidth
              disabled={!sherpaClaimable}
              onClick={sherpaClaim}
            >
            {`Claim ${formatNumber(sherpaClaimable, 4)} SHERPA`}
            <SnowTokenIcon size={16} token='SHERPA'/>
            </ContainedButton>
          }
          {axialClaimable > 0 &&
            <ContainedButton
              className = {classes.axialClaim}
              fullWidth
              disabled={!axialClaimable}
              onClick={axialClaim}
            >
            {`Claim ${formatNumber(axialClaimable, 4)} AXIAL`}
            <SnowTokenIcon size={16} token='AXLP'/>
            </ContainedButton>
          }
        </Grid>
      </Grid>
    </CardWrapper>
  )
}

export default memo(SnowClaim)
