import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'

import { CONTRACTS } from 'config'
import { usePoolContract } from 'contexts/pool-context'
import GAUGE_TOKEN_ABI from 'libs/abis/gauge-token.json'
import GAUGE_ABI from 'libs/abis/gauge.json'
import { isEmpty } from 'utils/helpers/utility'
import getPairDataPrefill from 'utils/helpers/getPairDataPrefill'
import { BNToFloat } from 'utils/helpers/format'

const useGauge = ({
  prices,
  gaugeProxyContract,
  setLoading
}) => {
  const { library, account } = useWeb3React()
  const [gauges, setGauges] = useState([])
  const { pools, getGaugeInfo } = usePoolContract();

  useEffect(() => {
    if (!isEmpty(gaugeProxyContract) && !isEmpty(prices) && !isEmpty(pools)) {
      getGaugeProxyInfo()
    }

    if (isEmpty(account)) {
      setGauges([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prices, pools, gaugeProxyContract, account])

  const getGaugeProxyInfo = async () => {
    try {
      const totalWeight = await gaugeProxyContract.totalWeight();

      const gaugeAddresses = [];
      const poolAddresses = [];
      pools.forEach((item) => {
        if (item?.gaugeInfo.address != '0x0000000000000000000000000000000000000000') {
          gaugeAddresses.push(item.gaugeInfo.address);
          poolAddresses.push(item.address);
        }
      });
      const gauges = await Promise.all(
        poolAddresses.map(async (token, index) => {
          const { token0 = {}, token1 = {} } = getGaugeInfo(token);
          const gaugeTokenContract = new ethers.Contract(token, GAUGE_TOKEN_ABI, library.getSigner())
          const aTokenContract = new ethers.Contract(token0.address, GAUGE_TOKEN_ABI, library.getSigner())
          const bTokenContract = token1.address ? new ethers.Contract(token1.address, GAUGE_TOKEN_ABI, library.getSigner()) : null
          const gaugeContract = new ethers.Contract(gaugeAddresses[index], GAUGE_ABI, library.getSigner())

          const address = gaugeAddresses[index];
          const gaugeWeight = await gaugeProxyContract.weights(token);
          const rewardRate = await gaugeContract.rewardRate();
          const derivedSupply = await gaugeContract.derivedSupply();
          const totalSupply = await gaugeContract.totalSupply();
          const balance = await gaugeTokenContract.balanceOf(account);
          const staked = await gaugeContract.balanceOf(account);
          const harvestable = await gaugeContract.earned(account);
          const userWeight = await gaugeProxyContract.votes(account, token);
          const userCurrentWeights = await gaugeProxyContract.usedWeights(account);
          const numAInPairBN = await aTokenContract.balanceOf(token);
          const numBInPair = await bTokenContract?.balanceOf(token);
          const totalSupplyBN = await gaugeTokenContract.totalSupply();
          const iceQueenPairSupply = await gaugeTokenContract.balanceOf(CONTRACTS.ICE_QUEEN);
          const rewardRatePerYear = derivedSupply ? (rewardRate / derivedSupply) 
              * 3600 * 24 * 365 : Number.POSITIVE_INFINITY;
          
          const gauge = getGaugeInfo(token);
          const { totalValueOfPair, pricePerToken } = numBInPair ? getPairDataPrefill(
            prices,
            gauge,
            numAInPairBN,
            numBInPair,
            totalSupplyBN
          ) : () => { return (null, null) }
  
          const numTokensInPool = BNToFloat(iceQueenPairSupply);
          const valueStakedInGauge = pricePerToken * numTokensInPool;
          const fullApy = (rewardRatePerYear * prices['SNOB']) / pricePerToken;

          return {
            allocPoint: gaugeWeight / totalWeight || 0,
            token,
            address,
            gaugeAddress: address,
            gaugeWeight,
            totalWeight: +totalWeight.toString(),
            userWeight,
            userCurrentWeights,
            rewardRate,
            derivedSupply,
            totalSupply,
            balance,
            staked,
            harvestable,
            depositTokenName: `${gauge?.kind === 'Snowglobe' ? gauge?.symbol + '-' : ''}` +
              `${gauge?.name}` || 'No Name',
            poolName: `${gauge?.kind === 'Snowglobe' ? gauge?.symbol + '-' : ''}` +
              `${gauge?.name || 'No Name'} Pool`,
            rewardRatePerYear,
            fullApy,
            usdPerToken: pricePerToken,
            totalValue: totalValueOfPair,
            valueStakedInGauge,
            numTokensInPool,
          }
        })
      );
      setGauges(gauges)
    } catch (error) {
      console.log('[Error] gaugeProxyContract => ', error)
    }
  }

  const voteFarms = async (tokens, weights) => {
    setLoading(true)
    try {
      const weightsData = weights.map((weight) => ethers.BigNumber.from(weight))
      const gasLimit = await gaugeProxyContract.estimateGas.vote(tokens, weightsData)
      const tokenVote = await gaugeProxyContract.vote(tokens, weightsData, { gasLimit })
      const transactionVote = await tokenVote.wait(1)

      if (transactionVote.status) {
        await getGaugeProxyInfo()
      }
    } catch (error) {
      console.log('[Error] vote => ', error)
    }
    setLoading(false)
  }

  return {
    gauges,
    voteFarms
  }
}

export default useGauge