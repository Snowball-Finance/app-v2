import { memo, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { LAST_SNOWBALL_INFO } from 'api/compound-and-earn/queries';
import CompoundAndEarnSkeleton from 'components/Skeletons/CompoundAndEarn';
import SearchInput from 'components/UI/SearchInput';
import Selects from 'components/UI/Selects';
import PageHeader from 'parts/PageHeader';
import { useCompoundAndEarnContract } from 'contexts/compound-and-earn-context';
import ListView from './ListView';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    backgroundColor: theme.palette.background.default,
  },
  container: {
    width: '80%',
  },
  title: {
    marginTop: theme.spacing(2),
  },
  filter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  search: {
    width: '60%',
  },
  selectBox: {
    width: '15%',
  },
}));

const CompoundAndEarn = () => {
  const classes = useStyles();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('apy');
  const [userPool, setPool] = useState('all');
  const [lastSnowballInfo, setLastSnowballInfo] = useState([]);

  const { getBalanceInfosByPool } = useCompoundAndEarnContract();

  const { data, loading, error } = useQuery(LAST_SNOWBALL_INFO);

  const modifiedDataWithUserPoll = async () => {
    const modifiedData = await getBalanceInfosByPool();
    if (modifiedData) {
      const sortedData = modifiedData.sort(
        (a, b) => b.gaugeInfo.fullYearlyAPY - a.gaugeInfo.fullYearlyAPY
      );
      setLastSnowballInfo(sortedData);
    }
  };

  useEffect(() => {
    if (data && !loading) {
      modifiedDataWithUserPoll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loading]);

  const handleSearch = (value) => {
    const filterData = data?.LastSnowballInfo?.poolsInfo.filter(
      (item) => item.name.search(value.toUpperCase()) != -1
    );
    setLastSnowballInfo(filterData);
    setSearch(value);
  };

  const handleSorting = (event) => {
    const sortedData = sortingByType(
      event.target.value,
      data?.LastSnowballInfo?.poolsInfo
    );
    setLastSnowballInfo(sortedData);
    setType(event.target.value);
  };

  const handleUserPoolChange = (event) => {
    const sortedData = sortingByUserPool(
      type,
      event.target.value,
      lastSnowballInfo
    );
    setLastSnowballInfo(sortedData);
    setPool(event.target.value);
  };

  if (error) {
    return <div>Something went wrong!!</div>;
  }

  return (
    <main className={classes.root}>
      <PageHeader
        title="Compound and Earn SNOB now!"
        subHeader="Check your Investments"
      />
      <div className={classes.container}>
        <div className={classes.filter}>
          <SearchInput
            className={classes.search}
            value={search}
            placeholder="Search your favorite pairs"
            onChange={(newValue) => handleSearch(newValue)}
            onCancelSearch={() => setSearch('')}
          />
          <Selects
            className={classes.selectBox}
            value={type}
            options={TYPES}
            onChange={handleSorting}
          />
          <Selects
            className={classes.selectBox}
            value={userPool}
            options={POOLS}
            onChange={handleUserPoolChange}
          />
        </div>

        <Typography variant="h5" className={classes.title}>
          PAIRS
        </Typography>

        {loading ? (
          <CompoundAndEarnSkeleton />
        ) : (
          <ListView poolsInfo={lastSnowballInfo} />
        )}
      </div>
    </main>
  );
};

export default memo(CompoundAndEarn);

const TYPES = [
  {
    value: 'apy',
    label: 'APY',
  },
  {
    value: 'tvl',
    label: 'TVL',
  },
];

const POOLS = [
  {
    value: 'all',
    label: 'All Pools',
  },
  {
    value: 'pangolin',
    label: 'Pangolin Pools',
  },
  {
    value: 'traderJoe',
    label: 'Trader Joe Pools',
  },
];

const sortingByType = (type, data) => {
  let sortedData = [...data];
  if (type === 'apy') {
    sortedData = sortedData.sort(
      (a, b) => b.gaugeInfo.fullYearlyAPY - a.gaugeInfo.fullYearlyAPY
    );
  } else {
    sortedData = sortedData.sort((a, b) => b.tvlStaked - a.tvlStaked);
  }
  return sortedData;
};

const sortingByUserPool = (type, userPool, data) => {
  let sortedData = [...data];
  if (type === 'apy') {
    if (userPool === 'pangolin') {
      sortedData = sortedData.sort(
        (a, b) =>
          b.gaugeInfo.fullYearlyAPY - a.gaugeInfo.fullYearlyAPY ||
          b.pngBalance - a.pngBalance
      );
    } else if (userPool === 'traderJoe') {
      sortedData = sortedData.sort(
        (a, b) =>
          b.gaugeInfo.fullYearlyAPY - a.gaugeInfo.fullYearlyAPY ||
          b.traderJoeBalance - a.traderJoeBalance
      );
    } else {
      sortedData = sortingByType(type, data);
    }
  } else {
    if (userPool === 'pangolin') {
      sortedData = sortedData.sort(
        (a, b) => b.tvlStaked - a.tvlStaked || b.pngBalance - a.pngBalance
      );
    } else if (userPool === 'traderJoe') {
      sortedData = sortedData.sort(
        (a, b) =>
          b.tvlStaked - a.tvlStaked || b.traderJoeBalance - a.traderJoeBalance
      );
    } else {
      sortedData = sortingByType(type, data);
    }
  }
  return sortedData;
};
