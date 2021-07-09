import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { formatEther } from 'ethers/lib/utils';

import { useStakingContract } from 'contexts/staking-context'
import CoinIcon from 'components/Icons/CoinIcon'
import CardWrapper from '../CardWrapper'

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    alignItems: 'center'
  },
  coin: {
    margin: theme.spacing(0, 1)
  }
}));

const TotalLocked = () => {
  const classes = useStyles();
  const {
    snowballBalance,
    totalLocked,
    totalSnowballValue,
  } = useStakingContract();

  return (
    <CardWrapper title='Total Locked'>
      <div className={classes.content}>
        <Typography
          variant='h6'
          color='textPrimary'
        >
          {snowballBalance !== null
            ? Number(
              formatEther(totalLocked?.toString() || '0'),
            ).toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })
            : '--'}
        </Typography>
        <CoinIcon className={classes.coin} />
        <Typography
          variant='h6'
          color='textPrimary'
        >
          = $
          {snowballBalance !== null
            ? Number(
              totalSnowballValue?.toString() || '0',
            ).toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })
            : '--'}
        </Typography>
      </div>
    </CardWrapper>
  )
}

export default memo(TotalLocked)
