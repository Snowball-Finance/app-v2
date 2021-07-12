import { memo, useState, useCallback } from 'react';
import { Card } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/client';

import LastTransactionsHeader from 'parts/Transaction/LastTransactionsHeader';
import DashboardTransactionSkeleton from 'components/Skeletons/DashboardTransaction';
import ContainedButton from 'components/UI/Buttons/ContainedButton';
import { MULTIPLE_TRANSACTION_INFO } from 'api/dashboard/queries';
import TransactionItem from './TransactionItem';

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: theme.spacing(2),
    height: '100%',
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
  const { data, loading, error, fetchMore } = useQuery(
    MULTIPLE_TRANSACTION_INFO,
    {
      variables: {
        first: 10,
        skip: 0,
      },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
      nextFetchPolicy: 'cache-first',
    }
  );

  const loadMore = useCallback(() => {
    if (fetchMore === undefined) return;
    fetchMore({
      variables: {
        skip: data?.MultipleTransactionInfo.length,
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
  }, [data?.MultipleTransactionInfo.length, fetchMore]);

  if (error) {
    return <div>Something went wrong...</div>;
  }

  return (
    <Card className={classes.card}>
      <LastTransactionsHeader title="From Stablevault and others" />
      {data?.MultipleTransactionInfo.map((transaction) => (
        <TransactionItem key={transaction.hash} transaction={transaction} />
      ))}
      {isFetchMore && !loading && (
        <div className={classes.buttonContainer}>
          <ContainedButton size="small" disableElevation onClick={loadMore}>
            Fetch More
          </ContainedButton>
        </div>
      )}
      {loading && <DashboardTransactionSkeleton />}
    </Card>
  );
};

export default memo(LastTransactions);
