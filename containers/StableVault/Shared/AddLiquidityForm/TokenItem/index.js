
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import { formatNumber } from 'utils/helpers/format';

import SnowTokenIcon from 'containers/CompoundAndEarn/ListItem/SnowTokenIcon'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(0, 1.5),
    borderRadius: 8,
  },
  infoContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  token: {
    fontSize: 16,
    margin: theme.spacing(0, 1),
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
    }
  },
}));

const TotalItem = ({
  token,
  value,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.infoContainer}>
        <SnowTokenIcon token={token.name} size={35} />
        <Typography className={classes.token}>
          {token.name}
        </Typography>
      </div>
      <Typography className={classes.token}>
        {formatNumber(value, 2)}
      </Typography>
    </div>
  )
}

export default memo(TotalItem)