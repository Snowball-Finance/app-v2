import { memo, useMemo } from 'react'
import { Paper, IconButton, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import MenuOpenIcon from '@material-ui/icons/MenuOpen'

import { useContracts } from 'contexts/contract-context'
import { usePrices } from 'contexts/price-context'
import DollarIcon from 'components/Icons/DollarIcon'
import ConnectWallet from './ConnectWallet'

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: 2,
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.primary,
    boxShadow: '0 4px 24px 0 rgb(34 41 47 / 10%)',
  },
  rowContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  balanceContainer: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  menuIcon: {
    width: 40,
    height: 40,
  },
  balance: {
    fontWeight: 'bold',
    marginLeft: theme.spacing(1),
    '& small': {
      fontWeight: 'normal',
    },
  },
}))

const TopAppBar = ({ openDrawer, onDraw }) => {
  const classes = useStyles()
  const { snowballBalance } = useContracts()
  const { prices } = usePrices();

  const snowballPrice = useMemo(() => prices.SNOB * snowballBalance, [prices, snowballBalance]);

  return (
    <Paper className={classes.appBar} elevation={0}>
      <div className={classes.rowContainer}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onDraw}
          className={classes.menuIcon}
        >
          {openDrawer ? (
            <MenuOpenIcon color="primary" />
          ) : (
            <MenuIcon color="primary" />
          )}
        </IconButton>

        <div className={classes.balanceContainer}>
          <DollarIcon />
          <Typography variant="body2" className={classes.balance}>
            {snowballBalance.toLocaleString()} SNOB
            <small>(${snowballPrice.toFixed(3)})</small>
          </Typography>
        </div>
      </div>

      <div className={classes.rowContainer}>
        <ConnectWallet />
      </div>
    </Paper>
  )
}

export default memo(TopAppBar)
