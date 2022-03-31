export const sortingByType = (type, data) => {
  let sortedData = [...data];
  if (type === 'apy') {
    sortedData = sortedData.sort(
      (a, b) => (b.gaugeInfo.snobYearlyAPR + b.yearlyAPY + b.yearlySwapFees) - (a.gaugeInfo.snobYearlyAPR + a.yearlyAPY + a.yearlySwapFees)
    );
  } else if (type === 'claimable') {
    sortedData = sortedData.sort(
      (a, b) =>
        b.SNOBHarvestable - a.SNOBHarvestable
    );
  } else {
    sortedData = sortedData.sort((a, b) => b.tvlStaked - a.tvlStaked);
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
        b.SNOBHarvestable - a.SNOBHarvestable ||
        (b.gaugeInfo.snobYearlyAPR + b.yearlyAPY + b.yearlySwapFees) - (a.gaugeInfo.snobYearlyAPR + a.yearlyAPY + a.yearlySwapFees)
    );
  } else if (type === 'claimable') {
    sortedData = sortedData.sort(
      (a, b) =>
        b.SNOBHarvestable - a.SNOBHarvestable
    );
  } else {
    sortedData = sortedData.sort(
      (a, b) =>
        b.usdValue - a.usdValue ||
        b.userLPBalance - a.userLPBalance ||
        b.SNOBHarvestable - a.SNOBHarvestable ||
        b.tvlStaked - a.tvlStaked
    );
  }
  return sortedData;
};
