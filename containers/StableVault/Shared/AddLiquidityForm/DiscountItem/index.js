
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1, 1.5),
    marginTop: '10px',
    borderRadius: 10,
    background: 'rgba(234, 84, 85, 0.12)',
  },
  infoContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  token: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EB5757',
    margin: theme.spacing(0, 1),
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
    }
  },
}));

const DiscountItem = ({
  name,
  value,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.infoContainer}>
        <Typography className={classes.token}>
          {name}
        </Typography>
      </div>
      <Typography className={classes.token}>
        {value}%
      </Typography>
    </div>
  )
}

export default memo(DiscountItem)