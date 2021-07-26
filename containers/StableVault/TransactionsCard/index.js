
import { memo, useEffect } from 'react'

import { useS3dVaultContracts } from 'contexts/s3d-vault-context'
import { useS3fVaultContracts } from 'contexts/s3f-vault-context'

import LastTransactionsHeader from 'parts/Transaction/LastTransactionsHeader'
import TransactionItem from 'parts/Transaction/TransactionItem'
import CardFormWrapper from 'parts/Card/CardFormWrapper'

const TransactionsCard = ({vault}) => {
	const { transactions, getTransactions } = (vault == 's3D') ? useS3dVaultContracts() : useS3fVaultContracts();

	useEffect(() => {
		getTransactions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<CardFormWrapper>
			<LastTransactionsHeader title={`From Stablevault ${vault} Vault`} />
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