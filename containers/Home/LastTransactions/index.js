
import { memo } from 'react'
import { Card } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import LastTransactionsHeader from 'parts/Transaction/LastTransactionsHeader'
import TransactionItem from './TransactionItem'
import TRANSACTIONS from 'utils/temp/transactions'

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: theme.spacing(2),
    height: '100%'
  },
}));

const LastTransactions = () => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <LastTransactionsHeader title='From Stablevault and others' />
      {TRANSACTIONS.map((transaction, index) => (
        <TransactionItem
          key={index}
          transaction={transaction}
        />
      ))}
    </Card>
  )
}

export default memo(LastTransactions)