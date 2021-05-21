
import { memo } from 'react'
import { Card } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import LastTransactionsHeader from './LastTransactionsHeader'
import TransactionItem from './TransactionItem'

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
      <LastTransactionsHeader />
      {transactions.map((transaction, index) => (
        <TransactionItem
          key={index}
          transaction={transaction}
        />
      ))}
    </Card>
  )
}

export default memo(LastTransactions);

const transactions = [
  {
    type: 'swap',
    token: 'DAI - BUSD',
    time: '5 seconds ago',
    balance: 480
  },
  {
    type: 'remove',
    token: 'DAI',
    time: '2 minutes ago',
    balance: -1480
  },
  {
    type: 'remove',
    token: 'BUSD',
    time: '5 minutes ago',
    balance: -2480
  },
  {
    type: 'add',
    token: 'Frax',
    time: '6 minutes ago',
    balance: 480
  },
  {
    type: 'add',
    token: 'DAI',
    time: '7 minutes ago',
    balance: 10220
  },
  {
    type: 'add',
    token: 'BUSD',
    time: '9 minutes ago',
    balance: 9870
  },
]