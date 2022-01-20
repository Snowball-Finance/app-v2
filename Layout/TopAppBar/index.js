import { memo } from 'react'
import { Hidden, Paper, IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import MenuOpenIcon from '@material-ui/icons/MenuOpen'

import Logo from 'components/Logo'
import ConnectWallet from '../Shared/ConnectWallet'
import SnobBalance from '../Shared/SnobBalance'
import SnobPrice from '../Shared/SnobPrice'
import SnobPriceChange from 'Layout/Shared/SnobPriceChange'
import ThemeButton from 'Layout/Shared/ThemeButton'
import Notification from '../Shared/Notification'

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: 2,
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 2),
    backgroundColor: theme.palette.background.primary,
    boxShadow: '0 4px 24px 0 rgb(34 41 47 / 10%)',
  },
  rowContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  menuIcon: {
    width: 40,
    height: 40
  }
}))

const TopAppBar = ({
  isMobile,
  openDrawer,
  onDraw
}) => {
  const classes = useStyles()

  return (
    <Paper className={classes.appBar} elevation={0}>
      <div className={classes.rowContainer}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge='start'
          onClick={onDraw}
          className={classes.menuIcon}
        >
          {openDrawer && !isMobile ? (
            <MenuOpenIcon color="primary" />
          ) : (
            <MenuIcon color="primary" />
          )}
        </IconButton>

        <Hidden xsDown>
          <SnobPrice />
          <SnobPriceChange />  
        </Hidden>
      </div>

      <Hidden smUp>
        <Logo isLabel />
        <ThemeButton />
      </Hidden>

      <Hidden xsDown>
        <div className={classes.rowContainer}>
          <Notification />
          <SnobBalance />
          <ConnectWallet />
          <ThemeButton />
        </div>
      </Hidden>
    </Paper>
  )
}

export default memo(TopAppBar)
