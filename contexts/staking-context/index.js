import { createContext, useState, useContext, useMemo } from 'react'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'

import { CONTRACTS } from 'config'
import GAUGE_PROXY_ABI from 'libs/abis/gauge-proxy.json'
import SNOWBALL_ABI from 'libs/abis/snowball.json'
import SNOWCONE_ABI from 'libs/abis/snowcone.json'
import FEE_DISTRIBUTOR_ABI from 'libs/abis/fee-distributor.json'
import { useContracts } from 'contexts/contract-context'
import { usePrices } from 'contexts/price-context'
import useLock from './useLock'
import useClaim from './useClaim'
import useGauge from './useGauge'

const ContractContext = createContext(null)

export function StakingContractProvider({ children }) {
  const { library } = useWeb3React();
  const { isWrongNetwork } = useContracts()
  const { prices } = usePrices();
  const [loading, setLoading] = useState(false);

  const gaugeProxyContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.GAUGE_PROXY, GAUGE_PROXY_ABI, library.getSigner()) : null, [library])
  const snowballContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.SNOWBALL, SNOWBALL_ABI, library.getSigner()) : null, [library])
  const snowconeContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.SNOWCONE, SNOWCONE_ABI, library.getSigner()) : null, [library])
  const feeDistributorContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.FEE_DISTRIBUTOR, FEE_DISTRIBUTOR_ABI, library.getSigner()) : null, [library])

  const {
    snowballBalance,
    snowconeBalance,
    lockedAmount,
    lockEndDate,
    totalSupply,
    totalLocked,
    lockedValue,
    totalSnowballValue,
    unlockTime,
    isLocked,
    isExpired,
    createLock,
    increaseAmount,
    increaseTime,
    withdraw
  } = useLock({
    prices,
    setLoading,
    snowballContract,
    snowconeContract
  })

  const {
    claim,
    userClaimable,
    nextDistribution,
  } = useClaim({
    setLoading,
    feeDistributorContract,
  })

  const { gauges, voteFarms } = useGauge({
    prices,
    gaugeProxyContract,
    setLoading
  })

  return (
    <ContractContext.Provider
      value={{
        isWrongNetwork,
        loading,
        prices,
        snowballBalance,
        snowconeBalance,
        lockedAmount,
        lockEndDate,
        totalSupply,
        totalLocked,
        lockedValue,
        totalSnowballValue,
        unlockTime,
        isLocked,
        isExpired,
        gauges,
        userClaimable,
        nextDistribution,
        claim,
        createLock,
        increaseAmount,
        increaseTime,
        withdraw,
        voteFarms
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}

export function useStakingContract() {
  const context = useContext(ContractContext)
  if (!context) {
    throw new Error('Missing stats context')
  }

  const {
    isWrongNetwork,
    loading,
    prices,
    snowballBalance,
    snowconeBalance,
    lockedAmount,
    lockEndDate,
    totalSupply,
    totalLocked,
    lockedValue,
    totalSnowballValue,
    unlockTime,
    isLocked,
    isExpired,
    gauges,
    userClaimable,
    nextDistribution,
    claim,
    createLock,
    increaseAmount,
    increaseTime,
    withdraw,
    voteFarms
  } = context

  return {
    isWrongNetwork,
    loading,
    prices,
    snowballBalance,
    snowconeBalance,
    lockedAmount,
    lockEndDate,
    totalSupply,
    totalLocked,
    lockedValue,
    totalSnowballValue,
    unlockTime,
    isLocked,
    isExpired,
    gauges,
    userClaimable,
    nextDistribution,
    claim,
    createLock,
    increaseAmount,
    increaseTime,
    withdraw,
    voteFarms
  }
}