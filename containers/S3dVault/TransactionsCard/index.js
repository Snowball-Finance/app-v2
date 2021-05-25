
import { memo } from 'react'

import LastTransactionsHeader from 'parts/Transaction/LastTransactionsHeader'
import TransactionItem from 'parts/Transaction/TransactionItem'
import CardFormWrapper from 'parts/Card/CardFormWrapper'
import TRANSACTIONS from 'utils/temp/transactions'

const TransactionsCard = () => {
  return (
    <CardFormWrapper>
      <LastTransactionsHeader title='From Stablevault s3F Vault' />
      {TRANSACTIONS.map((transaction, index) => (
        <TransactionItem
          key={index}
          transaction={transaction}
        />
      ))}
    </CardFormWrapper>
  )
}

export default memo(TransactionsCard)