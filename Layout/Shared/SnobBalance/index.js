import { memo, useMemo } from 'react'
import { Typography, Tooltip } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { useContracts } from 'contexts/contract-context'
import { usePrices } from 'contexts/price-context'
import { formatNumber } from 'utils/helpers/format'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '10px',
    backgroundColor: '#E5F3FF',
  },
  balance: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '8px 16px',
    fontSize: 14,
    fontWeight: '600',
    color: '#28A2FF',
    '& span': {
      fontSize: 10,
    },
  },
  balanceContainer: {
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing('auto', 1)
  },
  
}))

const SnobBalance = () => {
  const classes = useStyles()
  const { snowballBalance } = useContracts()
  const { prices } = usePrices();

  const snowballPrice = useMemo(() => prices.SNOB * snowballBalance, [prices, snowballBalance]);

  return (
    <div className={classes.balanceContainer}>
      <div
          className={classes.root}
        >
        <Tooltip title='Amount of SNOB in your wallet' arrow>
          <Typography
            color='textPrimary'
            className={classes.balance}
          >
            {formatNumber(snowballBalance, 2)} SNOB 
            <span>&nbsp;(${formatNumber(snowballPrice, 2)}) </span>
          </Typography>
        </Tooltip>
          

      </div>
      
    </div>
  )
}

export default memo(SnobBalance)
