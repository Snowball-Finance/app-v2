
import { memo, useMemo } from 'react'
import {
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import moment from 'moment';

import getTransactionInfo from 'utils/helpers/getTransactionInfo'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    width: '100%'
  },
  infoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  info: {
    fontSize: 10,
    textTransform: 'capitalize',
    '& span': {
      fontSize: 14,
      fontWeight: 'bold'
    }
  }
}));

const TransactionItem = ({
  transaction
}) => {
  const classes = useStyles();

  const typeInfo = useMemo(() => getTransactionInfo(transaction.type.toLowerCase()), [transaction]);

  return (
    <div className={classes.container}>
      <typeInfo.icon />
      <div className={classes.infoContainer}>
        <Typography
          color='textPrimary'
          className={classes.header}
        >
          <span>{transaction.type}</span>
          <br />
          {transaction.ticker}
        </Typography>
        <Typography
          color='textPrimary'
          align='right'
          className={classes.info}
        >
          <span style={{ color: typeInfo.color }}>
            {`$ ${transaction.valueUSD.toLocaleString()}`}
          </span>
          <br />
          {moment(transaction.createdAt).fromNow()}
        </Typography>
      </div>
    </div>
  )
}

export default memo(TransactionItem);
