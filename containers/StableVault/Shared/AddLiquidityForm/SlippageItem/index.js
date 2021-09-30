
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import { formatNumber } from 'utils/helpers/format';

import SnowTokenIcon from 'components/SnowTokenIcon'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1, 1.5),
    marginTop: '10px',
    borderRadius: 10,
    background: 'rgba(40, 162, 255, 0.12)',
  },
  infoContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  token: {
    fontSize: 16,
    fontWeight: 'bold',
    margin: theme.spacing(0, 1),
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
    }
  },
}));

const SlippageItem = ({
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

export default memo(SlippageItem)