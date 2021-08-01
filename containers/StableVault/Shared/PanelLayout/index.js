import { memo } from 'react'
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const usePanelStyles = makeStyles((theme) => ({
  container: {
    margin: 0,
    width: '100%'
  },
  leftCard: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center'
    }
  },
  rightCard: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center'
    }
  }
}));

const PanelLayout = ({
  children
}) => {
  const classes = usePanelStyles();

  return (
    <Grid container spacing={3} className={classes.container}>
      {children}
    </Grid>
  )
}

export { usePanelStyles }
export default memo(PanelLayout)
