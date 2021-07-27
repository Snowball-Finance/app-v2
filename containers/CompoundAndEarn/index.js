import { memo, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useWeb3React } from '@web3-react/core';

import { LAST_SNOWBALL_INFO } from 'api/compound-and-earn/queries';
import CompoundAndEarnSkeleton from 'components/Skeletons/CompoundAndEarn';
import SearchInput from 'components/UI/SearchInput';
import Selects from 'components/UI/Selects';
import PageHeader from 'parts/PageHeader';
import { useCompoundAndEarnContract } from 'contexts/compound-and-earn-context';
import { TYPES, POOLS } from 'utils/constants/compound-and-earn';
import { sortingByType, sortingByUserPool } from 'utils/helpers/sorting';
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
  const [lastSnowballModifiedInfo, setLastSnowballModifiedInfo] = useState([]);

  const { getBalanceInfosByPool } = useCompoundAndEarnContract();

  const { data, loading, error } = useQuery(LAST_SNOWBALL_INFO);
  const { library, account } = useWeb3React();

  const modifiedDataWithUserPoll = async () => {
    const modifiedData = await getBalanceInfosByPool();
    if (modifiedData) {
      const sortedData = sortingByType(type, modifiedData);
      setLastSnowballModifiedInfo(sortedData);
      setLastSnowballInfo(sortedData);
    }
  };

  useEffect(() => {
    if (data && !loading) {
      if (!(library && account)) {
        let clonedData = [...data?.LastSnowballInfo?.poolsInfo];
        const sortedData = clonedData.sort(
          (a, b) => b.gaugeInfo.fullYearlyAPY - a.gaugeInfo.fullYearlyAPY
        );
        setLastSnowballInfo(sortedData);
      } else {
        modifiedDataWithUserPoll();
      }
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
    let filteredData = lastSnowballModifiedInfo.length
      ? [...lastSnowballModifiedInfo]
      : [...data?.LastSnowballInfo?.poolsInfo];

    if (event.target.value !== 'all') {
      filteredData = filteredData.filter((item) =>
        item.source.toLowerCase().includes(event.target.value)
      );
    }
    const sortedData = sortingByUserPool(
      type,
      event.target.value,
      filteredData
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
