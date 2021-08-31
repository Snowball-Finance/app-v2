
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
    borderRadius: 8,
    border: `1px solid ${theme.custom.palette.border}`,
  },
  infoContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  token: {
    fontSize: 18,
    margin: theme.spacing(0, 1),
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
    }
  },
  percent: {
    fontSize: 12,
    padding: theme.spacing(0.5, 1),
    color: theme.custom.palette.white,
    backgroundColor: theme.custom.palette.green,
    borderRadius: 8,
    [theme.breakpoints.down('xs')]: {
      fontSize: 10,
    }
  },
}));

const CurrencyItem = ({
  token,
  percent,
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
        {percent &&
          <Typography className={classes.percent}>
            {`${percent.toLocaleString()}%`}
          </Typography>
        }
      </div>
      <Typography className={classes.token}>
        {formatNumber(value, 2)}
      </Typography>
    </div>
  )
}

export default memo(CurrencyItem)