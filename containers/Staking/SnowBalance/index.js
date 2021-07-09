import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

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

const SnowBalance = () => {
  const classes = useStyles();
  const { snowballBalance } = useStakingContract();

  return (
    <CardWrapper title='Snowball Balance'>
      <div className={classes.content}>
        <Typography
          variant='h6'
          color='textPrimary'
        >
          {parseFloat(snowballBalance).toFixed(3)}
        </Typography>
        <CoinIcon className={classes.coin} />
      </div>
    </CardWrapper>
  )
}

export default memo(SnowBalance)
