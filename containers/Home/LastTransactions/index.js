import { memo, useState, useCallback } from 'react';
import { Card } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import LastTransactionsHeader from 'parts/Transaction/LastTransactionsHeader';
import DashboardTransactionSkeleton from 'components/Skeletons/DashboardTransaction';
import ContainedButton from 'components/UI/Buttons/ContainedButton';
import TransactionItem from './TransactionItem';
import { useAPIContext } from 'contexts/api-context';

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: theme.spacing(2),
    height: '100%',
    backgroundColor: theme.palette.background.primary,
  },
  buttonContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
}));

const LastTransactions = () => {
  const classes = useStyles();
  const [isFetchMore, setFetchMore] = useState(true);

  const { getMultipleTransactionsInfo } = useAPIContext();
  const multipleTransactionsQuery = getMultipleTransactionsInfo();

  const loadMore = useCallback(() => {
    if (multipleTransactionsQuery.fetchMore === undefined) return;
    multipleTransactionsQuery.fetchMore({
      variables: {
        skip: multipleTransactionsQuery.data?.MultipleTransactionInfo.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (
          !fetchMoreResult.MultipleTransactionInfo.length ||
          fetchMoreResult.MultipleTransactionInfo.length < 10
        ) {
          setFetchMore(false);
          return prev;
        }
        return Object.assign({}, prev, {
          MultipleTransactionInfo: [
            ...prev.MultipleTransactionInfo,
            ...fetchMoreResult.MultipleTransactionInfo,
          ],
        });
      },
    });
  }, [multipleTransactionsQuery]);

  if (multipleTransactionsQuery.error) {
    return <div>Something went wrong...</div>;
  }

  return (
    <Card className={classes.card}>
      <LastTransactionsHeader title="From Stablevault and others" />
      {multipleTransactionsQuery.data?.MultipleTransactionInfo.map((transaction) => (
        <TransactionItem key={transaction.hash} transaction={transaction} />
      ))}
      {isFetchMore && !multipleTransactionsQuery.loading && (
        <div className={classes.buttonContainer}>
          <ContainedButton size="small" disableElevation onClick={loadMore}>
            Fetch More
          </ContainedButton>
        </div>
      )}
      {multipleTransactionsQuery.loading && <DashboardTransactionSkeleton />}
    </Card>
  );
};

export default memo(LastTransactions);
