
import { memo } from 'react'
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import ShareCard from './ShareCard'
import CurrencyReserves from './CurrencyReserves'

const useStyles = makeStyles((theme) => ({
  leftCard: {
    display: 'flex',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center'
    }
  },
  rightCard: {
    display: 'flex',
    justifyContent: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center'
    }
  }
}));

const MyShare = () => {
  const classes = useStyles();

  return (
    <Grid container spacing={6}>
      <Grid item sm={12} md={6} className={classes.leftCard}>
        <ShareCard />
      </Grid>
      <Grid item sm={12} md={6} className={classes.rightCard}>
        <CurrencyReserves />
      </Grid>
    </Grid>
  )
}

export default memo(MyShare)