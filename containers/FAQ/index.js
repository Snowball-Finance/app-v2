
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    backgroundColor: theme.palette.background.default
  }
}));

const FAQ = () => {
  const classes = useStyles();

  return (
    <main className={classes.root}>
      FAQ Page
    </main>
  )
}

export default memo(FAQ)