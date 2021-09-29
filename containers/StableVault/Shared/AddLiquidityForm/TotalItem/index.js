
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import { formatNumber } from 'utils/helpers/format';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1, 1.5),
    borderRadius: 8,
    border: `1px solid ${theme.custom.palette.border}`,
  },
  infoContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  token: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: theme.spacing(0, 1),
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
    }
  },
}));

const TotalItem = ({
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
        {formatNumber(value, 2)}
      </Typography>
    </div>
  )
}

export default memo(TotalItem)