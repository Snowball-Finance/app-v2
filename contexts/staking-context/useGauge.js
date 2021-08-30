import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'

import { CONTRACTS } from 'config'
import GAUGE_PROXY_ABI from 'libs/abis/gauge-proxy.json'
import GAUGE_TOKEN_ABI from 'libs/abis/gauge-token.json'
import GAUGE_ABI from 'libs/abis/gauge.json'
import { isEmpty } from 'utils/helpers/utility'
import { BNToFloat } from 'utils/helpers/format'
import { useAPIContext } from 'contexts/api-context'

const useGauge = ({
  prices,
  gaugeProxyContract,
  setLoading
}) => {
  const { library, account } = useWeb3React()
  const [gauges, setGauges] = useState([])
  const { getLastSnowballInfo } = useAPIContext();
  const snowballInfoQuery = getLastSnowballInfo();
  const { data: { LastSnowballInfo: { poolsInfo: pools = [] } = {} } = {} } = snowballInfoQuery;

  useEffect(() => {
    if (!isEmpty(gaugeProxyContract) && !isEmpty(prices) && !isEmpty(pools)) {
      getGaugeProxyInfo()
    }

    if (isEmpty(account)) {
      setGauges([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prices, pools, gaugeProxyContract, account]);

  const retrieveGauge = async (pool, totalWeight) => {
    if(!totalWeight){
      totalWeight = await gaugeProxyContract.totalWeight();
    }
    const gaugeTokenContract = new ethers.Contract(pool.address, GAUGE_TOKEN_ABI, library.getSigner())
    const gaugeContract = new ethers.Contract(pool.gaugeInfo.address, GAUGE_ABI, library.getSigner())

    const address = pool.gaugeInfo.address;
    const gaugeWeight = await gaugeProxyContract.weights(pool.address);
    const rewardRate = await gaugeContract.rewardRate();
    const derivedSupply = await gaugeContract.derivedSupply();
    const totalSupply = await gaugeContract.totalSupply();
    const balance = await gaugeTokenContract.balanceOf(account);
    const staked = await gaugeContract.balanceOf(account);
    const harvestable = await gaugeContract.earned(account);
    const userWeight = await gaugeProxyContract.votes(account, pool.address);
    const userCurrentWeights = await gaugeProxyContract.usedWeights(account);
    const iceQueenPairSupply = await gaugeTokenContract.balanceOf(CONTRACTS.ICE_QUEEN);
    const rewardRatePerYear = derivedSupply ? (rewardRate / derivedSupply)
      * 3600 * 24 * 365 : Number.POSITIVE_INFINITY;

    const gauge = pool;

    const numTokensInPool = BNToFloat(iceQueenPairSupply);
    const fullApy = 0;

    return {
      allocPoint: gaugeWeight / totalWeight || 0,
      token:pool.address,
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
      numTokensInPool,
    }
  }

  const getGaugeProxyInfo = async () => {
    try {
      const totalWeight = await gaugeProxyContract.totalWeight();

      const gauges = await Promise.all(
        pools.map(async (pool) => {
          return await retrieveGauge(pool, totalWeight);
        })
      );
      setGauges(gauges);
    } catch (error) {
      console.log('[Error] gaugeProxyContract => ', error)
    }
  }

  const voteFarms = async (tokens, weights) => {
    setLoading(true)
    try {
      const weightsData = weights.map((weight) => ethers.BigNumber.from(weight));
      const gaugeProxyVoteContract = new ethers.Contract(CONTRACTS.GAUGE_PROXYV2, GAUGE_PROXY_ABI, library.getSigner());
      const gasLimit = await gaugeProxyVoteContract.estimateGas.vote(tokens, weightsData)
      const tokenVote = await gaugeProxyVoteContract.vote(tokens, weightsData, { gasLimit })
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
    voteFarms,
    retrieveGauge,
    setGauges
  }
}

export default useGauge