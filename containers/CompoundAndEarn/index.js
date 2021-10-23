import {memo,useEffect,useReducer,useState} from 'react';
import {Grid,Typography} from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import SortIcon from '@material-ui/icons/Sort';
import {makeStyles} from '@material-ui/core/styles';
import {useWeb3React} from '@web3-react/core';

import {useAPIContext} from 'contexts/api-context';
import {useCompoundAndEarnContract} from 'contexts/compound-and-earn-context';
import CompoundAndEarnSkeleton from 'components/Skeletons/CompoundAndEarn';
import SearchInput from 'components/UI/SearchInput';
import Selects from 'components/UI/Selects';
import PageHeader from 'parts/PageHeader';
import ListItem from './ListItem';
import {TYPES,POOLS} from 'utils/constants/compound-and-earn';
import {sortingByType,sortingByUserPool} from 'utils/helpers/sorting';
import getProperAction from 'utils/helpers/getProperAction';
import {isEmpty} from 'utils/helpers/utility';
import {compondAndEarnActionTypes,compondAndEarnReducer} from './internalReducer';

const useStyles=makeStyles((theme) => ({
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

const CompoundAndEarn=() => {
	const classes=useStyles();
	const {account}=useWeb3React();
	const {getLastSnowballInfo}=useAPIContext();
	const _snowballInfoQuery=getLastSnowballInfo();

	const {userPools,userDeprecatedPools,loadedDeprecated,
		sortedUserPools,setLoadedDeprecated,setSortedUserPools,
		setUserPools}=useCompoundAndEarnContract();

	const [modal,setModal]=useState({open: false,title: '',address: ''});
	const [search,setSearch]=useState('');
	const [type,setType]=useState('apy');
	const [userPool,setPool]=useState('all');
	const [lastSnowballInfo,setLastSnowballInfo]=useState([]);
	const [lastSnowballModifiedInfo,setLastSnowballModifiedInfo]=useState([]);
	const [filterDataByProtocol,setFilterDataByProtocol]=useState([]);
	const [loadedSort,setLoadedSort]=useState(false);


	const [pageState,dispatch]=useReducer(compondAndEarnReducer,{
		account: '',
		search: '',
		type: 'apy',
		userPool: 'all',
		lastSnowballInfo: [],
		lastSnowballModifiedInfo: [],
		snowballInfoQuery: getLastSnowballInfo(),
		filterDataByProtocol: [],
		modal: {open: false,title: '',address: ''},
		loadedSort: false,
	})

	const {snowballInfoQuery}=pageState

	useEffect(() => {
		dispatch({
			type: compondAndEarnActionTypes.setAccount,
			payload: account
		})
		return () => {
		}
	},[account])

	useEffect(() => {
		dispatch({
			type: compondAndEarnActionTypes.setSnowballInfoQuery,
			payload: _snowballInfoQuery
		})
		return () => {
		}
	},[_snowballInfoQuery])



	console.log(pageState)

	//reset state when index opened
	useEffect(() => {
		if(!loadedSort) {
			setSortedUserPools(false);
			setLoadedSort(true);
		}
	},[loadedSort,setSortedUserPools])

	useEffect(() => {
		if(userDeprecatedPools.length>0&&!loadedDeprecated&&sortedUserPools) {
			let newArray=[...userPools];
			userDeprecatedPools.forEach((pool) => {
				//check if it's not duplicated
				if(userPools.indexOf(
					(element) => element.address.toLowerCase()===pool.address.toLowerCase()
				)===-1) {
					newArray.push(pool);
				}
			})
			setLoadedDeprecated(true);
			setSortedUserPools(false);
			setUserPools(newArray);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[userDeprecatedPools,loadedDeprecated,sortedUserPools]);

	//useEffect(() => {
	//	const {data: {LastSnowballInfo: {poolsInfo=[]}={}}={}}=snowballInfoQuery;

	//	if(isEmpty(userPools)) {
	//		let sortedData=[...poolsInfo]
	//		sortedData=sortedData.sort((a,b) => b.gaugeInfo.fullYearlyAPY-a.gaugeInfo.fullYearlyAPY);
	//		setLastSnowballInfo(sortedData);
	//		setSearch('');
	//		setType('apy');
	//		setPool('all');
	//		return
	//	}

	//	if(!sortedUserPools) {
	//		const sortedData=sortingByUserPool(type,userPools);
	//		setLastSnowballModifiedInfo(sortedData);
	//		setLastSnowballInfo(sortedData);
	//		setSortedUserPools(true);
	//		setSearch('');
	//		setType('apy');
	//		setPool('all');
	//	}
	//	// eslint-disable-next-line react-hooks/exhaustive-deps
	//},[snowballInfoQuery,userPools,account,sortedUserPools]);

	const handleSearch=(value) => {
		dispatch({
			type: compondAndEarnActionTypes.search,
			payload: value
		})
	};

	const handleCancelSearch=() => {
		dispatch({
			type: compondAndEarnActionTypes.cancelSearch,
		})
	};

	const handleSorting=(event) => {
		const value=event.target.value
		dispatch({type: compondAndEarnActionTypes.setSort,payload: value})
	};

	const handleUserPoolChange=(event) => {
		const value=event.target.value
		dispatch({type: compondAndEarnActionTypes.userPoolChange,payload: value})
	};

	if(snowballInfoQuery.error) {
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
						value={pageState.search}
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
						value={pageState.userPool}
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
					):(
						<Grid container spacing={3} className={classes.container} style={{width: '100%',height: '70vh'}}>
							{snowballInfoQuery.loading
								? (
									<Grid item xs={12}>
										<CompoundAndEarnSkeleton />
									</Grid>
								):(
									pageState.lastSnowballInfo?.map((pool,index) => {
										return <Grid item key={pool.address} xs={12}>
											{(!pool.deprecatedPool||!(pool.withdrew&&pool.claimed))&&
												<ListItem pool={pool} modal={modal} setModal={setModal} poolList={pageState.lastSnowballInfo} />}
										</Grid>
									})
								)
							}
						</Grid>

					)
				}
			</Grid>
		</main>
	);
};

export default memo(CompoundAndEarn);