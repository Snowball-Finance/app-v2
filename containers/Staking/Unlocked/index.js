import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { formatEther } from 'ethers/lib/utils';

import { useStakingContract } from 'contexts/staking-context'
import CoinIcon from 'components/Icons/CoinIcon'
import CardWrapper from '../CardWrapper'
import { formatDate } from 'utils/helpers/date';

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    alignItems: 'center'
  },
  coin: {
    margin: theme.spacing(0, 1)
  }
}));

const Unlocked = () => {
  const classes = useStyles();
  const {
    snowballBalance,
    snowconeBalance,
    lockedAmount,
    unlockTime,
    isLocked,
    isExpired,
  } = useStakingContract();

  return (
    <CardWrapper
      title={isLocked ? (
        isExpired ? (
          <>Expired (since {formatDate(unlockTime)})</>
        ) : (
          <>Locked (until {formatDate(unlockTime)})</>
        )
      ) : (
        'Unlocked'
      )}
    >
      <div className={classes.content}>
        <Typography
          variant='h6'
          color='textPrimary'
        >
          {lockedAmount !== null
            ? Number(formatEther(lockedAmount?.toString() || '0'))
              .toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })
            : '--'
          }
        </Typography>
        <CoinIcon className={classes.coin} />
        <Typography
          variant='h6'
          color='textPrimary'
        >
          {'= '}
          {snowballBalance !== null
            ? Number(formatEther(snowconeBalance?.toString() || '0'))
              .toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })
            : '--'}
          {' xSNOB'}
        </Typography>
      </div>
    </CardWrapper>
  )
}

export default memo(Unlocked)
