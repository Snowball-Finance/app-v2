
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(2)
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 36,
    fontWeight: 'bold',
  },
}));

const TotalLockedValue = ({
  value
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography className={classes.label}>
        Total Value Locked
      </Typography>
      <Typography className={classes.value}>
        {`$ ${value}`}
      </Typography>
    </div>
  )
}

export default memo(TotalLockedValue)