import { formatNumber } from 'utils/helpers/format';

export const sortingByType = (type, data, userPools) => {
  let sortedData = [...data];
  if (type === 'apy') {
    sortedData = sortedData.sort(
      (a, b) => b.gaugeInfo.fullYearlyAPY - a.gaugeInfo.fullYearlyAPY
    );
  } else if(type === 'tvl') {
    sortedData = sortedData.sort((a, b) => b.tvlStaked - a.tvlStaked);
  } else {
    let userPoolA = {
      usdValue: 0,
      userDepositedLP: 0,
      totalSupply: 0,
      valueEarned: 0,
      SNOBHarvestable: 0,
      SNOBValue: 0,
    };
    let userPoolB = {
      usdValue: 0,
      userDepositedLP: 0,
      totalSupply: 0,
      valueEarned: 0,
      SNOBHarvestable: 0,
      SNOBValue: 0,
    }
    if (userPools) {
      userPoolA = userPools.find((pool) => pool?.address.toLowerCase() === a.address.toLowerCase());
      userPoolB = userPools.find((pool) => pool?.address.toLowerCase() === b.address.toLowerCase());
    }
    sortedData = sortedData.sort(
      (a, b) => formatNumber(userPoolA?.SNOBValue || 0.00, 2) - formatNumber(userPoolB?.SNOBValue || 0.00, 2)
    );
  }
  return sortedData;
};

export const sortingByUserPool = (type, data) => {
  let sortedData = [...data];
  if (type === 'apy') {
    sortedData = sortedData.sort(
      (a, b) =>
        b.usdValue - a.usdValue ||
        b.userDepositedLP - a.userDepositedLP ||
        b.userLPBalance - a.userLPBalance ||
        b.gaugeInfo.fullYearlyAPY - a.gaugeInfo.fullYearlyAPY
    );
  } else {
    sortedData = sortedData.sort(
      (a, b) =>
        b.usdValue - a.usdValue ||
        b.userLPBalance - a.userLPBalance ||
        b.tvlStaked - a.tvlStaked
    );
  }
  return sortedData;
};
