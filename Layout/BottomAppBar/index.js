import { memo } from 'react'
import { Hidden, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import ConnectWallet from '../Shared/ConnectWallet'
import SnobBalance from '../Shared/SnobBalance'
import SnobPrice from '../Shared/SnobPrice'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
  },
  appBar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 2),
    margin: theme.spacing(1, 2),
    backgroundColor: theme.palette.background.primary,
    boxShadow: '0 4px 24px 0 rgb(34 41 47 / 10%)',
  },
  rowContainer: {
    display: 'flex',
    alignItems: 'center',
  }
}))

const BottomAppBar = () => {
  const classes = useStyles()

  return (
    <Hidden smUp>
      <div className={classes.root}>
        <Paper className={classes.appBar} elevation={0}>
          <SnobPrice />  
          <div className={classes.rowContainer}>
            <SnobBalance />    
            <ConnectWallet />  
          </div>    
        </Paper>
      </div>
    </Hidden>
  )
}

export default memo(BottomAppBar)
