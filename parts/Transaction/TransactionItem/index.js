
import { memo, useMemo } from 'react'
import {
  Grid,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import getTransactionInfo from 'utils/helpers/getTransactionInfo'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    width: '100%'
  },
  infoContainer: {
    marginLeft: theme.spacing(1.5),
    width: '100%'
  },
  header: {
    fontSize: 12,
    textTransform: 'capitalize',
    '& span': {
      fontSize: 14,
      fontWeight: 'bold'
    }
  },
  time: {
    fontSize: 10,
    textTransform: 'capitalize',
  },
  balance: {
    fontSize: 14,
    fontWeight: 'bold'
  }
}));

const TransactionItem = ({
  transaction
}) => {
  const classes = useStyles();

  const typeInfo = useMemo(() => getTransactionInfo(transaction.type), [transaction]);

  return (
    <div className={classes.container}>
      <typeInfo.icon />
      <Grid container spacing={1} className={classes.infoContainer}>
        <Grid item xs={4}>
          <Typography
            color='textPrimary'
            className={classes.header}
          >
            <span>{transaction.type}</span>
            <br />
            {transaction.token}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography
            color='textPrimary'
            className={classes.time}
          >
            {transaction.time}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography
            color='textPrimary'
            align='right'
            className={classes.balance}
            style={{ color: typeInfo.color }}
          >
            {`$${parseFloat(transaction.balance).toFixed(3).toLocaleString()}`}
          </Typography>
        </Grid>
      </Grid>
    </div>
  )
}

export default memo(TransactionItem);
