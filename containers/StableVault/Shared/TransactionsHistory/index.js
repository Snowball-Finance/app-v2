
import { memo } from 'react'
import { Typography } from '@material-ui/core'

import LastTransactionsHeader from 'parts/Transaction/LastTransactionsHeader'
import TransactionItem from 'parts/Transaction/TransactionItem'
import CardFormWrapper from 'parts/Card/CardFormWrapper'
import { isEmpty } from 'utils/helpers/utility'

const TransactionsHistory = ({
  vault,
  transactions
}) => {
  return (
    <CardFormWrapper>
      <LastTransactionsHeader title={`From Stablevault ${vault} Vault`} />
      {isEmpty(transactions)
        ? (
          <Typography
            align='center'
            variant='h5'
          >
            No Transaction
          </Typography>
        )
        : transactions.map((transaction, index) => (
          <TransactionItem
            key={index}
            transaction={transaction}
          />
        ))
      }
    </CardFormWrapper>
  )
}

export default memo(TransactionsHistory)