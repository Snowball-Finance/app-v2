import { memo, useEffect, useState } from 'react';
import { Grid, Typography } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import SortIcon from '@material-ui/icons/Sort';
import { makeStyles } from '@material-ui/core/styles';
import { useWeb3React } from '@web3-react/core';

import { useAPIContext } from 'contexts/api-context';
import { useCompoundAndEarnContract } from 'contexts/compound-and-earn-context';
import CompoundAndEarnSkeleton from 'components/Skeletons/CompoundAndEarn';
import SearchInput from 'components/UI/SearchInput';
import Selects from 'components/UI/Selects';
import PageHeader from 'parts/PageHeader';
import ListItem from './ListItem';
import { TYPES, POOLS } from 'utils/constants/compound-and-earn';
import { sortingByType, sortingByUserPool } from 'utils/helpers/sorting';
import getProperAction from 'utils/helpers/getProperAction';
import { isEmpty } from 'utils/helpers/utility';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    backgroundColor: theme.palette.background.default,
  },
  container: {
    width: '100%',
    maxWidth: 1200,
    marginTop: theme.spacing(2),
  },
  input: {
    boxShadow: theme.custom.utils.boxShadow,
  },
}));

const CompoundAndEarn = () => {
  const classes = useStyles();
  const { account } = useWeb3React();
  const { getLastSnowballInfo } = useAPIContext();
  const snowballInfoQuery = getLastSnowballInfo();
  const { userPools, userDeprecatedPools, loadedDeprecated,
    sortedUserPools,setLoadedDeprecated,setSortedUserPools } = useCompoundAndEarnContract();

  const [search, setSearch] = useState('');
  const [type, setType] = useState('apy');
  const [userPool, setPool] = useState('all');
  const [lastSnowballInfo, setLastSnowballInfo] = useState([]);
  const [firstSnowballInfo, setFirstSnowballInfo] = useState([]);

  useEffect(() => {
    if(userDeprecatedPools.length > 0 && !loadedDeprecated && sortedUserPools){
      let newArray = [...lastSnowballInfo];
      userDeprecatedPools.forEach((pool) => {
        newArray.unshift(pool);
      })
      setLastSnowballInfo(newArray);
      setFirstSnowballInfo(newArray);
      setLoadedDeprecated(true);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  },[userDeprecatedPools,loadedDeprecated,sortedUserPools]);

  useEffect(() => {
    const { data: { LastSnowballInfo: { poolsInfo = [] } = {} } = {} } = snowballInfoQuery;

    if (isEmpty(userPools)) {
      let sortedData = [...poolsInfo]
      sortedData = sortedData.sort((a, b) => b.gaugeInfo.fullYearlyAPY - a.gaugeInfo.fullYearlyAPY);
      setLastSnowballInfo(sortedData);
      return
    }

    if(!sortedUserPools){
      const sortedData = sortingByUserPool(type, userPools);
      setLastSnowballInfo(sortedData);
      setSortedUserPools(true);
      setLoadedDeprecated(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snowballInfoQuery, userPools, account, sortedUserPools]);

  const handleSearch = (value) => {
    let filterData = firstSnowballInfo.length
        ? [...firstSnowballInfo]
        : [...snowballInfoQuery.data?.LastSnowballInfo?.poolsInfo];
    const splittedValue = value.split(' ');
    splittedValue.forEach((spiltItem) => {
      filterData = filterData.filter(
        (item) => item.name.search(spiltItem.toUpperCase()) != -1
      );
    });

    filterData = sortingByType(type, filterData, userPools);
    if (account) {
      filterData = sortingByUserPool(type, filterData);
    }

    if (userPool === 'myPools') {
      const filteredDataWithTokensToInvested = filterData.filter((item) => {
        const [actionType] = getProperAction(item, null, item.userLPBalance, item.usdValue);
        return actionType === 'Deposit';
      });
      const filteredDataWithDepositLP = filterData.filter(
        (item) => item.usdValue > 0
      );
      filterData = [
        ...filteredDataWithDepositLP,
        ...filteredDataWithTokensToInvested,
      ];
    } else if (userPool !== 'all') {
      filterData = filterData.filter((item) =>
        item.source.toLowerCase().includes(userPool)
      );
    }
    filterData = sortingByUserPool(type, filterData);

    setLastSnowballInfo(filterData);
    setSearch(value);
  };

  const handleCancelSearch = () => {
    let filterData = firstSnowballInfo.length
        ? [...firstSnowballInfo]
        : [...snowballInfoQuery.data?.LastSnowballInfo?.poolsInfo];

    filterData = sortingByType(type, filterData, userPools);
    if (account) {
      filterData = sortingByUserPool(type, filterData);
    }

    if (userPool === 'myPools') {
      const filteredDataWithTokensToInvested = filterData.filter((item) => {
        const [actionType] = getProperAction(item, null, item.userLPBalance, item.usdValue);
        return actionType === 'Deposit';
      });
      const filteredDataWithDepositLP = filterData.filter(
        (item) => item.usdValue > 0
      );
      filterData = [
        ...filteredDataWithDepositLP,
        ...filteredDataWithTokensToInvested,
      ];
    } else if (userPool !== 'all') {
      filterData = filterData.filter((item) =>
        item.source.toLowerCase().includes(userPool)
      );
    }
    filterData = sortingByUserPool(type, filterData);

    setLastSnowballInfo(filterData);
    setSearch('');
  };

  const handleSorting = (event) => {
    let filterData = firstSnowballInfo.length
        ? [...firstSnowballInfo]
        : [...lastSnowballInfo];

    filterData = sortingByType(event.target.value, filterData, userPools);
    if (account) {
      filterData = sortingByUserPool(event.target.value, filterData);
    }

    const splittedValue = search.split(' ');
    splittedValue.forEach((spiltItem) => {
      filterData = filterData.filter(
        (item) => item.name.search(spiltItem.toUpperCase()) != -1
      );
    });

    if (userPool === 'myPools') {
      const filteredDataWithTokensToInvested = filterData.filter((item) => {
        const [actionType] = getProperAction(item, null, item.userLPBalance, item.usdValue);
        return actionType === 'Deposit';
      });
      const filteredDataWithDepositLP = filterData.filter(
        (item) => item.usdValue > 0
      );
      filterData = [
        ...filteredDataWithDepositLP,
        ...filteredDataWithTokensToInvested,
      ];
    } else if (userPool !== 'all') {
      filterData = filterData.filter((item) =>
        item.source.toLowerCase().includes(userPool)
      );
    }

    setLastSnowballInfo(filterData);
    setType(event.target.value);
  };

  const handleUserPoolChange = (event) => {
    let filteredData = firstSnowballInfo.length
      ? [...firstSnowballInfo]
      : [...snowballInfoQuery.data?.LastSnowballInfo?.poolsInfo];

    if (event.target.value === 'myPools') {
      const filteredDataWithTokensToInvested = filteredData.filter((item) => {
        const [actionType] = getProperAction(item, null, item.userLPBalance, item.usdValue);
        return actionType === 'Deposit';
      });
      const filteredDataWithDepositLP = filteredData.filter(
        (item) => item.usdValue > 0
      );
      filteredData = [
        ...filteredDataWithDepositLP,
        ...filteredDataWithTokensToInvested,
      ];
    } else if (event.target.value !== 'all') {
      filteredData = filteredData.filter((item) =>
        item.source.toLowerCase().includes(event.target.value)
      );
    }
    let filterData = sortingByUserPool(type, filteredData);

    const splittedValue = search.split(' ');
    splittedValue.forEach((spiltItem) => {
      filterData = filterData.filter(
        (item) => item.name.search(spiltItem.toUpperCase()) != -1
      );
    });

    setLastSnowballInfo(filterData);
    setPool(event.target.value);
  };

  if (snowballInfoQuery.error) {
    return <div>Something went wrong!!</div>;
  }

  return (
    <main className={classes.root}>
      <PageHeader
        title='Compound and Earn SNOB now!'
        subHeader='Check your Investments'
      />
      <Grid container spacing={3} className={classes.container}>
        <Grid item xs={12} md={8}>
          <SearchInput
            className={classes.input}
            value={search}
            placeholder='Search your favorite pairs'
            onChange={(newValue) => handleSearch(newValue)}
            onCancelSearch={handleCancelSearch}
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <Selects
            className={classes.input}
            value={type}
            options={TYPES}
            onChange={handleSorting}
            startIcon={<SortIcon />}
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <Selects
            className={classes.input}
            value={userPool}
            options={POOLS}
            onChange={handleUserPoolChange}
            startIcon={<FilterListIcon />}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h5'>
            PAIRS
          </Typography>
        </Grid>
        {snowballInfoQuery.loading
          ? (
            <Grid item xs={12}>
              <CompoundAndEarnSkeleton />
            </Grid>
          ) : (
            lastSnowballInfo?.map((pool, index) => (
                <Grid item key={index} xs={12}>
                  {(!pool.deprecatedPool || !(pool.withdrew && pool.claimed)) && 
                    <ListItem pool={pool} />}
                </Grid>
              ))
          )
        }
      </Grid>
    </main>
  );
};

export default memo(CompoundAndEarn);
