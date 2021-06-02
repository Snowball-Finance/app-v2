
import { memo, useEffect } from 'react'

import { useS3dVaultContracts } from 'contexts/s3d-vault-context'
import LastTransactionsHeader from 'parts/Transaction/LastTransactionsHeader'
import TransactionItem from 'parts/Transaction/TransactionItem'
import CardFormWrapper from 'parts/Card/CardFormWrapper'

const TransactionsCard = () => {
  const { transactions, getTransactions } = useS3dVaultContracts()

  useEffect(() => {
    getTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CardFormWrapper>
      <LastTransactionsHeader title='From Stablevault s3D Vault' />
      {transactions.map((transaction, index) => (
        <TransactionItem
          key={index}
          transaction={transaction}
        />
      ))}
    </CardFormWrapper>
  )
}

export default memo(TransactionsCard)