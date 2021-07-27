export const sortingByType = (type, data) => {
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

export const sortingByUserPool = (type, userPool, data) => {
  let sortedData = [...data];
  if (userPool !== 'all') {
    sortedData = sortedData.sort((a, b) => b.gaugeBalance - a.gaugeBalance);
  } else {
    sortedData = sortingByType(type, data);
  }
  return sortedData;
};
