import { memo } from 'react'
import { Typography, Tooltip } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { usePrices } from 'contexts/price-context'
import CoinIcon from 'components/Icons/CoinIcon'
import { formatNumber } from 'utils/helpers/format'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  balance: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: '21px',
    '& span': {
      fontSize: 10,
    },
  },
  balanceContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  coin: {
    margin: theme.spacing(0, 1)
  }
  
}))

const SnobBalance = () => {
  const classes = useStyles();
  const { prices } = usePrices();

  

  return (
    <div className={classes.balanceContainer}>
      
      <div
          className={classes.root}
        >
        <CoinIcon className={classes.coin} />
        <Tooltip title='SNOB Price' arrow>
          <Typography
            color='textPrimary'
            className={classes.balance}
          >
            $ {prices.SNOB > 0.5 ? formatNumber(prices.SNOB) : formatNumber(prices.SNOB, 4)}
          </Typography>
        </Tooltip>
          

      </div>
      
    </div>
  )
}

export default memo(SnobBalance)
