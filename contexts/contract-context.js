import { createContext, useContext, useMemo, useEffect, useState, useCallback } from 'react'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'

import { CONTRACTS, C_CHAIN_ID } from 'config'
import SNOWBALL_ABI from 'libs/abis/snowball.json'
import SNOWCONE_ABI from 'libs/abis/snowcone.json'
import GAUGE_PROXY_ABI from 'libs/abis/gauge-proxy.json'
import { usePopup } from 'contexts/popup-context'
import useGauge from 'contexts/staking-context/useGauge'
import { usePrices } from 'contexts/price-context'
import { handleConnectionError, isEmpty } from 'utils/helpers/utility'
import { BNToFloat } from 'utils/helpers/format'

const ContractContext = createContext(null)

export function ContractProvider({ children }) {
  const { account, library, chainId, error } = useWeb3React();
  const { setPopUp,setOpen } = usePopup();

  const [loading, setLoading] = useState(false);
  const [snowballBalance, setSnowballBalance] = useState(0);
  const [snowconeBalance, setSnowconeBalance] = useState(0);
  const [totalSnowcone, setTotalSnowcone] = useState(0);
  const { prices } = usePrices();

  const isWrongNetwork = useMemo(() => chainId !== C_CHAIN_ID, [chainId])
  const snowballContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.SNOWBALL, SNOWBALL_ABI, library.getSigner()) : null, [library])
  const snowconeContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.SNOWCONE, SNOWCONE_ABI, library.getSigner()) : null, [library])
  const gaugeProxyContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.GAUGE_PROXY, GAUGE_PROXY_ABI, library.getSigner()) : null, [library])

  const getBalanceInfo = useCallback(async () => {
    try {
      const [
        snowballBalance,
        snowconeBalance,
        totalSnowconeValue
      ] = await Promise.all([
        snowballContract['balanceOf(address)'](account),
        snowconeContract['balanceOf(address)'](account),
        snowconeContract['totalSupply()'](),
      ]);
      const snowballBalanceValue = BNToFloat(snowballBalance, 18);
      const snowconeBalanceValue = BNToFloat(snowconeBalance, 18);

      setSnowballBalance(snowballBalanceValue);
      setSnowconeBalance(snowconeBalanceValue);
      setTotalSnowcone(totalSnowconeValue);
    } catch (error) {
      console.log('[Error] getBalanceInfo => ', error)
    }
  }, [account, snowballContract, snowconeContract])

  useEffect(() => {
    if (!isEmpty(snowballContract) && !isEmpty(snowconeContract)) {
      getBalanceInfo()
    }

    if (isEmpty(account)) {
      setSnowballBalance(0)
      setSnowconeBalance(0)
      setTotalSnowcone(0)
    }
  }, [snowballContract, snowconeContract, account, getBalanceInfo]);

  useEffect(() =>{
    if(error){
      const connectionError = handleConnectionError(error);
      setPopUp({
        title: 'Error Connecting Wallet',
        text: connectionError.message,
        cancelLabel: connectionError.button,
        confirmAction: connectionError.confirmAction
      });
      console.error(error);
    }else{
      setOpen(false);
    }
  
  },[error,setPopUp,setOpen]);

  const { gauges, retrieveGauge, setGauges } = useGauge({
    prices,
    gaugeProxyContract,
    setLoading
  })

  return (
    <ContractContext.Provider
      value={{
        loading,
        gauges,
        retrieveGauge,
        setGauges,
        isWrongNetwork,
        snowballBalance,
        snowconeBalance,
        totalSnowcone,
        getBalanceInfo
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}

export function useContracts() {
  const context = useContext(ContractContext)
  if (!context) {
    throw new Error('Missing stats context')
  }

  const {
    loading,
    gauges,
    retrieveGauge,
    setGauges,
    isWrongNetwork,
    snowballBalance,
    snowconeBalance,
    totalSnowcone,
    getBalanceInfo
  } = context

  return {
    loading,
    gauges,
    retrieveGauge,
    setGauges,
    isWrongNetwork,
    snowballBalance,
    snowconeBalance,
    totalSnowcone,
    getBalanceInfo
  }
}