import getProperAction from 'utils/helpers/getProperAction';
import {sortingByType,sortingByUserPool} from 'utils/helpers/sorting';

export const compondAndEarnActionTypes={
	setAccount: 'setAccount',
	search: 'search',
	cancelSearch: 'cancelSearch',
	setSnowballInfoQuery: 'snowballInfoQuery',
	setLastSnowballInfo: 'setLastSnowballInfo',
	setSort: 'setSort',
	userPoolChange: 'userPoolChange'
}
const getFilterData=(state) => {
	const {
		lastSnowballModifiedInfo,
		filterDataByProtocol,
		snowballInfoQuery
	}=state
	let filterData=[]
	if(filterDataByProtocol.length) {
		filterData=[...filterDataByProtocol]
	}
	else if(lastSnowballModifiedInfo.length) {
		filterData=[...lastSnowballModifiedInfo]
	}
	else {
		filterData=[...snowballInfoQuery.data?.LastSnowballInfo?.poolsInfo]
	}
	return filterData
}

export const compondAndEarnReducer=(state,action) => {
	console.log(action.type)
	const newState={...state}

	const {
		account,
		search,
		type,
		userPool,
		lastSnowballInfo,
		lastSnowballModifiedInfo,
		snowballInfoQuery,
		filterDataByProtocol,
		modal,
		loadedSort
	}=newState

	switch(action.type) {
		case compondAndEarnActionTypes.setAccount: {
			newState.account=action.payload
		}
			break
		case compondAndEarnActionTypes.setSnowballInfoQuery: {
			newState.snowballInfoQuery=action.payload
		}
			break
		case compondAndEarnActionTypes.setLastSnowballInfo: {
			newState.lastSnowballInfo=action.payload
		}
			break
		case compondAndEarnActionTypes.userPoolChange: {
			const value=action.payload
			let filteredData=lastSnowballModifiedInfo.length
				? [...lastSnowballModifiedInfo]
				:[...snowballInfoQuery.data?.LastSnowballInfo?.poolsInfo];

			if(value==='myPools') {
				const filteredDataWithTokensToInvested=filteredData.filter((item) => {
					const [actionType]=getProperAction(item,null,item.userLPBalance,item.usdValue);
					return actionType==='Deposit';
				});
				const filteredDataWithDepositLP=filteredData.filter(
					(item) => item.usdValue>0
				);
				filteredData=[
					...filteredDataWithDepositLP,
					...filteredDataWithTokensToInvested,
				];
			} else if(value==='claimable') {
				filteredData=filteredData.filter(
					(item) => item.SNOBHarvestable>0
				);
			} else if(value!=='all'&&value!=='claimable') {
				filteredData=filteredData.filter((item) =>
					item.source.toLowerCase().includes(value)
				);
			}
			const sortedData=sortingByUserPool(type,filteredData);
			newState.filterDataByProtocol=(sortedData);
			if(search!=="") {
				let filterData=sortedData;
				const splittedValue=search.split(' ');
				splittedValue.forEach((spiltItem) => {
					filterData=filterData.filter(
						(item) => item.name.search(spiltItem.toUpperCase())!=-1
					);
				});
				newState.lastSnowballInfo=filterData;
			}
			else newState.lastSnowballInfo=sortedData;
			newState.userPool=value;
		}
			break
		case compondAndEarnActionTypes.setSort: {
			const value=action.payload

			let filterData=filterDataByProtocol.length
				? [...filterDataByProtocol]
				:lastSnowballModifiedInfo.length
					? [...lastSnowballModifiedInfo]
					:[...lastSnowballInfo];

			let sortedData=sortingByType(value,filterData);
			if(account) {
				sortedData=sortingByUserPool(value,filterData);
			}

			if(search!=="") {
				filterData=sortedData;
				const splittedValue=search.split(' ');
				splittedValue.forEach((spiltItem) => {
					filterData=filterData.filter(
						(item) => item.name.search(spiltItem.toUpperCase())!=-1
					);
				});
				newState.lastSnowballInfo=filterData;
			}
			else {
				newState.lastSnowballInfo=sortedData
			}
			newState.type=value
		}
			break
		case compondAndEarnActionTypes.search:
			{
				const value=action.payload
				let filterData=getFilterData(newState)

				const splittedValue=value.split(' ');
				splittedValue.forEach((spiltItem) => {
					filterData=filterData.filter(
						(item) => item.name.search(spiltItem.toUpperCase())!=-1
					);
				});

				let sortedData=sortingByType(type,filterData);
				if(account) {
					sortedData=sortingByUserPool(type,filterData);
				}

				newState.lastSnowballInfo=sortedData
				newState.search=action.payload
			}
			break
		case compondAndEarnActionTypes.cancelSearch: {
			let filterData=getFilterData(newState)
			let sortedData=sortingByType(type,filterData);
			if(account) {
				sortedData=sortingByUserPool(type,filterData);
			}
			newState.lastSnowballInfo=sortedData
			newState.search=''
		}
			break
		default:
			break
	}
	return newState
}
