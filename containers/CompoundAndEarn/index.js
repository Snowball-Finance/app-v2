import { memo, useEffect, useState, useCallback } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useRouter } from 'next/router'
import FilterListIcon from '@material-ui/icons/FilterList';
import SortIcon from '@material-ui/icons/Sort';
import { makeStyles } from '@material-ui/core/styles';
import { useWeb3React } from '@web3-react/core';
import { useAPIContext } from 'contexts/api-context';
import { useCompoundAndEarnContract } from 'contexts/compound-and-earn-context';
import { useContracts } from 'contexts/contract-context';
import CompoundAndEarnSkeleton from 'components/Skeletons/CompoundAndEarn';
import SearchInput from 'components/UI/SearchInput';
import Selects from 'components/UI/Selects';
import PageHeader from 'parts/PageHeader';
import List  from './List';
import { TYPES, POOLS } from 'utils/constants/compound-and-earn';
import { sortingByType, sortingByUserPool } from 'utils/helpers/sorting';
import getProperAction from 'utils/helpers/getProperAction';
import { isEmpty, debounce } from 'utils/helpers/utility';

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
  const { query, push } = useRouter();

  const { AVAXBalance } = useContracts();
  const { userPools, userDeprecatedPools, loadedDeprecated,
    sortedUserPools,setLoadedDeprecated,setSortedUserPools,
    setUserPools, transactionUpdateLoading } = useCompoundAndEarnContract();

  const [modal, setModal] = useState({ open: false, title: '', address: '' });
  const [search, setSearch] = useState('');
  const [type, setType] = useState('apy');
  const [userPool, setPool] = useState('all');
  const [lastSnowballInfo, setLastSnowballInfo] = useState([]);
  const [lastSnowballModifiedInfo, setLastSnowballModifiedInfo] = useState([]);
  const [filterDataByProtocol, setFilterDataByProtocol] = useState([]);
  const [loadedSort, setLoadedSort] = useState(false);

  //reset state when index opened
  useEffect(() => {
    if (!loadedSort) {
      setSortedUserPools(false);
      setLoadedSort(true);
    }
  },[loadedSort,setSortedUserPools,classes])

  useEffect(()=>{
    setLoadedSort(true);
    setSortedUserPools(false);
  }, [account])

  useEffect(() => {
    if (userDeprecatedPools.length > 0 && !loadedDeprecated && sortedUserPools) {
      let newArray = [...userPools];
      userDeprecatedPools.forEach((pool) => {
        //check if it's not duplicated
        if (userPools.indexOf(
          (element) => element.address.toLowerCase() === pool.address.toLowerCase()
        ) === -1) {
          newArray.push(pool);
        }
      })
      setLoadedDeprecated(true);
      setSortedUserPools(false);
      setUserPools(newArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDeprecatedPools, loadedDeprecated, sortedUserPools]);

  useEffect(() => {
    const { data: { LastSnowballInfo: { poolsInfo = [] } = {} } = {} } = snowballInfoQuery;

    if (isEmpty(userPools)) {
      let sortedData = [...poolsInfo]
      sortedData = sortedData.sort((a, b) => b.gaugeInfo.fullYearlyAPY - a.gaugeInfo.fullYearlyAPY);
      setLastSnowballInfo(sortedData);
      if(query.pool) {
        initailSearchByQueryParams();
      } else {
        setSearch('');
      }
      if(query.platform) {
        initailPlatformByQueryParams();
      } else {
        setPool('all');
      }
      setType('apy');
      return
    } else if (account || !sortedUserPools) {

      const sortedData = sortingByUserPool(type, userPools);
      setLastSnowballModifiedInfo(sortedData);
      setLastSnowballInfo(sortedData);
      setSortedUserPools(true);
      if(query.pool) {
        initailSearchByQueryParams();
      } else {
        setSearch('');
      }
      if(query.platform) {
        initailPlatformByQueryParams();
      } else {
        setPool('all');
      }
      setType('apy');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snowballInfoQuery, userPools, account, sortedUserPools]);

  const initailSearchByQueryParams = () => {
    setSearch(query.pool);
    delayFilterData(query.pool);
  }

  const initailPlatformByQueryParams = () => {
    setPool(query.platform);
    delayPoolFilterData(query.platform)
  }

  const handleSearch = (value) => {
    if (!value) {
      handleCancelSearch();
      return;
    }
    let filterData = filterDataByProtocol.length
      ? [...filterDataByProtocol]
      : lastSnowballModifiedInfo?.length
        ? [...lastSnowballModifiedInfo]
        : snowballInfoQuery?.data?.LastSnowballInfo?.poolsInfo?.length
          ? [...snowballInfoQuery?.data?.LastSnowballInfo?.poolsInfo]
          : [];

    const splittedValue = value.split(' ');
    splittedValue.forEach((spiltItem) => {
      filterData = filterData.filter(
        (item) => item.name.toUpperCase().includes(spiltItem.toUpperCase())
      );
    });

    let sortedData = sortingByType(type, filterData);
    if (account) {
      sortedData = sortingByUserPool(type, filterData);
    }

    setLastSnowballInfo(sortedData);
  };

  const handleCancelSearch = () => {
    let filterData = filterDataByProtocol.length
      ? [...filterDataByProtocol]
      : lastSnowballModifiedInfo.length
        ? [...lastSnowballModifiedInfo]
        : snowballInfoQuery?.data?.LastSnowballInfo?.poolsInfo?.length
          ? [...snowballInfoQuery?.data?.LastSnowballInfo?.poolsInfo]
          : [];
    let sortedData = sortingByType(type, filterData);
    if (account) {
      sortedData = sortingByUserPool(type, filterData);
    }

    setLastSnowballInfo(sortedData);
    setSearch('');
  };

  const handleSorting = (event) => {
    let filterData = filterDataByProtocol.length
      ? [...filterDataByProtocol]
      : lastSnowballModifiedInfo.length
        ? [...lastSnowballModifiedInfo]
        : [...lastSnowballInfo];

    let sortedData = sortingByType(event.target.value, filterData);
    if (account) {
      sortedData = sortingByUserPool(event.target.value, filterData);
    }

    if (search !== "") {
      filterData = sortedData;
      const splittedValue = search.split(' ');
      splittedValue.forEach((spiltItem) => {
        filterData = filterData.filter(
          (item) => item.name.search(spiltItem.toUpperCase()) != -1
        );
      });
      setLastSnowballInfo(filterData);
       }else {
         setLastSnowballInfo(sortedData);
          setType(event.target.value);
       }
  };

  const handleUserPoolChange = (value) => {
    let filteredData = lastSnowballModifiedInfo.length
      ? [...lastSnowballModifiedInfo]
      : snowballInfoQuery.data?.LastSnowballInfo?.poolsInfo?.length
        ?[...snowballInfoQuery.data?.LastSnowballInfo?.poolsInfo]
        : [];

    if (value === 'myPools') {
      const filteredDataWithTokensToInvested = filteredData.filter((item) => {
        const [actionType] = getProperAction(item, null, item.userLPBalance, AVAXBalance, item.usdValue);
        return actionType === 'Deposit';
      });
      const filteredDataWithDepositLP = filteredData.filter(
        (item) => item.usdValue > 0
      );
      filteredData = [
        ...filteredDataWithDepositLP,
        ...filteredDataWithTokensToInvested,
      ];
    } else if (value === 'claimable') {
      filteredData = filteredData.filter(
        (item) => item.SNOBHarvestable > 0
      );
    } else if (value !== 'all' && value !== 'claimable') {
      filteredData = filteredData.filter((item) =>
        item.source.toLowerCase().includes(value)
      );
    }
    const sortedData = sortingByUserPool(type, filteredData);
    setFilterDataByProtocol(sortedData);
    if (search !== "") {
      let filterData = sortedData;
      const splittedValue = search.split(' ');
      splittedValue.forEach((spiltItem) => {
        filterData = filterData.filter(
          (item) => item.name.search(spiltItem.toUpperCase()) != -1
        );
      });
      setLastSnowballInfo(filterData);
      } else{
        setLastSnowballInfo(sortedData);
      }
      setPool(value);
  };

  if (snowballInfoQuery.error) {
    return <div>Something went wrong!!</div>;
  }

  const delayFilterData = useCallback(debounce(handleSearch, 400), [type, userPool, lastSnowballModifiedInfo, filterDataByProtocol, snowballInfoQuery]);
  const delayPoolFilterData = useCallback(debounce(handleUserPoolChange, 400), [type, userPool, lastSnowballModifiedInfo, filterDataByProtocol, snowballInfoQuery]);

  const searchTermInputHandler = value => {
    setSearch(value);
    delayFilterData(value);
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
            onChange={(value)=>{
              searchTermInputHandler(value)
              push({query:{...query, pool: value}})
            }}
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
            onChange={(event)=>{
              handleUserPoolChange(event.target.value)
              push({query:{...query, platform: event.target.value}})
            }}
            startIcon={<FilterListIcon />}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h5'>
            PAIRS
          </Typography>
        </Grid>
        {transactionUpdateLoading || snowballInfoQuery.loading
          ? (
            <Grid item xs={12}>
              <CompoundAndEarnSkeleton />
            </Grid>
          ) : (
              <List pools={lastSnowballInfo} modal={modal} setModal={setModal}/>
            )
        }
      </Grid>
    </main>
  );
};

export default memo(CompoundAndEarn);