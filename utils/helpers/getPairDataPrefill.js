import { ethers } from 'ethers'
import GAUGE_INFO from 'utils/constants/gauge-info'

const getPairDataPrefill = (
  prices,
  pairAddress,
  numAInPairBN,
  numBInPairBN,
  totalSupplyBN,
) => {
  const { a, b } = GAUGE_INFO[pairAddress];

  const numAInPair = parseFloat(
    ethers.utils.formatUnits(numAInPairBN, a.decimals),
  );
  const numBInPair = parseFloat(
    ethers.utils.formatUnits(numBInPairBN, b.decimals),
  );

  const priceA = prices[a.priceId];
  const priceB = prices[b.priceId];
  let totalValueOfPair;
  // In case price one token is not listed on coingecko
  if (priceA) {
    totalValueOfPair = 2 * priceA * numAInPair;
  } else {
    totalValueOfPair = 2 * priceB * numBInPair;
  }
  const totalSupply = parseFloat(ethers.utils.formatEther(totalSupplyBN)); // Uniswap LP tokens are always 18 decimals
  const pricePerToken = totalValueOfPair / totalSupply;

  return { totalValueOfPair, totalSupply, pricePerToken };
};

export default getPairDataPrefill