
import { memo, useEffect } from 'react'

import { useS4dVaultContracts } from 'contexts/s4d-vault-context'
import LastTransactionsHeader from 'parts/Transaction/LastTransactionsHeader'
import TransactionItem from 'parts/Transaction/TransactionItem'
import CardFormWrapper from 'parts/Card/CardFormWrapper'

const TransactionsCard = () => {
  const { transactions, getTransactions } = useS4dVaultContracts();

  useEffect(() => {
    getTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CardFormWrapper>
      <LastTransactionsHeader title={`From Stablevault s4D Vault`} />
      {transactions.map((transaction, index) => {
        return (
          <TransactionItem
            key={index}
            transaction={transaction}
          />
        );
      })}
    </CardFormWrapper>
  )
}

export default memo(TransactionsCard)