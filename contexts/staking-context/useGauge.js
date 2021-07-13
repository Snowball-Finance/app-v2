import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3'

import { CONTRACTS } from 'config'
import GAUGE_TOKEN_ABI from 'libs/abis/gauge-token.json'
import GAUGE_ABI from 'libs/abis/gauge.json'
import { isEmpty, delay } from 'utils/helpers/utility'
import getPairDataPrefill from 'utils/helpers/getPairDataPrefill'
import GAUGE_INFO from 'utils/constants/gauge-info'

const useGauge = ({
  prices,
  gaugeProxyContract,
  setLoading
}) => {
  const { library, account } = useWeb3React()
  const [gauges, setGauges] = useState([])

  useEffect(() => {
    if (!isEmpty(gaugeProxyContract) && !isEmpty(prices)) {
      getGaugeProxyInfo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prices, gaugeProxyContract])

  const getGaugeProxyInfo = async () => {
    try {
      const tokens = await gaugeProxyContract.tokens()
      const totalWeight = await gaugeProxyContract.totalWeight()

      // add any denylist item here
      const approve = token => {
        return token != 0x53B37b9A6631C462d74D65d61e1c056ea9dAa637
      }
      const approvedTokens = tokens.filter(approve)

      const gaugeAddresses = await Promise.all(
        approvedTokens.map((token) => {
          return gaugeProxyContract.getGauge(token)
        }),
      )

      const balancesUserInfosHarvestables = await Promise.all(
        approvedTokens.flatMap((token, index) => {
          const { a, b } = GAUGE_INFO[token]
          const gaugeTokenContract = new ethers.Contract(token, GAUGE_TOKEN_ABI, library.getSigner())
          const aTokenContract = new ethers.Contract(a.address, GAUGE_TOKEN_ABI, library.getSigner())
          const bTokenContract = new ethers.Contract(b.address, GAUGE_TOKEN_ABI, library.getSigner())
          const gaugeContract = new ethers.Contract(gaugeAddresses[index], GAUGE_ABI, library.getSigner())

          return [
            gaugeProxyContract.weights(token),
            gaugeContract.rewardRate(),
            gaugeContract.derivedSupply(),
            gaugeContract.totalSupply(),
            gaugeTokenContract.balanceOf(account),
            gaugeContract.balanceOf(account),
            gaugeContract.earned(account),
            gaugeProxyContract.votes(account, token),
            gaugeProxyContract.usedWeights(account),
            aTokenContract.balanceOf(token),
            bTokenContract.balanceOf(token),
            gaugeTokenContract.totalSupply(),
            gaugeTokenContract.balanceOf(CONTRACTS.ICE_QUEEN),
          ]
        }),
      )

      const gauges = approvedTokens.map((token, idx) => {
        const address = gaugeAddresses[idx]
        const gaugeWeight = +balancesUserInfosHarvestables[idx * 13].toString()
        const rewardRate = +balancesUserInfosHarvestables[idx * 13 + 1].toString()
        const derivedSupply = +balancesUserInfosHarvestables[idx * 13 + 2].toString()
        const totalSupply = +balancesUserInfosHarvestables[idx * 13 + 3].toString()
        const balance = balancesUserInfosHarvestables[idx * 13 + 4]
        const staked = balancesUserInfosHarvestables[idx * 13 + 5]
        const harvestable = balancesUserInfosHarvestables[idx * 13 + 6]
        const userWeight = +balancesUserInfosHarvestables[idx * 13 + 7].toString()
        const userCurrentWeights = +balancesUserInfosHarvestables[idx * 13 + 8].toString()
        const numAInPairBN = balancesUserInfosHarvestables[idx * 13 + 9]
        const numBInPair = balancesUserInfosHarvestables[idx * 13 + 10]
        const totalSupplyBN = balancesUserInfosHarvestables[idx * 13 + 11]
        const iceQueenPairSupply = balancesUserInfosHarvestables[idx * 13 + 12]
        const rewardRatePerYear = derivedSupply
          ? (rewardRate / derivedSupply) * 3600 * 24 * 365
          : Number.POSITIVE_INFINITY
        const { tokenName, poolName } = GAUGE_INFO[token]
        const { totalValueOfPair, pricePerToken } = getPairDataPrefill(
          prices,
          token,
          numAInPairBN,
          numBInPair,
          totalSupplyBN
        )

        const numTokensInPool = parseFloat(ethers.utils.formatEther(iceQueenPairSupply))
        const valueStakedInGauge = pricePerToken * numTokensInPool
        const fullApy = (rewardRatePerYear * prices['snowball']) / pricePerToken

        return {
          allocPoint: gaugeWeight / totalWeight.toString() || 0,
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
          depositTokenName: tokenName,
          poolName,
          rewardRatePerYear,
          fullApy,
          usdPerToken: pricePerToken,
          totalValue: totalValueOfPair,
          valueStakedInGauge,
          numTokensInPool,
        }
      })

      setGauges(gauges)
    } catch (error) {
      console.log('[Error] gaugeProxyContract => ', error)
    }
  }

  const voteFarms = async (tokens, weights) => {
    setLoading(true)
    try {
      let loop = true
      let tx = null
      const ethereumProvider = await detectEthereumProvider()
      const web3 = new Web3(ethereumProvider)

      const weightsData = weights.map((weight) => ethers.BigNumber.from(weight))
      const gasLimit = await gaugeProxyContract.estimateGas.vote(
        tokens,
        weightsData,
      )
      const { hash } = await gaugeProxyContract.vote(
        tokens,
        weightsData,
        { gasLimit },
      )

      while (loop) {
        tx = await web3.eth.getTransactionReceipt(hash)
        if (isEmpty(tx)) {
          await delay(300)
        } else {
          loop = false
        }
      }

      if (tx.status) {
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