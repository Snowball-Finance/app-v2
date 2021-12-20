import { createContext, useContext, useMemo, useEffect, useState, useCallback } from 'react'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'

import { CONTRACTS, C_CHAIN_ID } from 'config'
import SNOWBALL_ABI from 'libs/abis/snowball.json'
import SNOWCONE_ABI from 'libs/abis/snowcone.json'
import GAUGE_PROXY_ABI from 'libs/abis/gauge-proxy.json'
import { usePopup } from 'contexts/popup-context'
import { usePrices } from 'contexts/price-context'
import { handleConnectionError, isEmpty } from 'utils/helpers/utility'
import { BNToFloat } from 'utils/helpers/format'
import { useStakingContract } from './staking-context'
import { useProvider } from './provider-context'

const ContractContext = createContext(null)

export function ContractProvider({ children }) {
  const { account, library, chainId, error } = useWeb3React();
  const { setPopUp,setOpen } = usePopup();
  const { provider } = useProvider();

  const [loading, setLoading] = useState(true);
  const [snowballBalance, setSnowballBalance] = useState(0);
  const [snowconeBalance, setSnowconeBalance] = useState(0);
  const [AVAXBalance, setAVAXBalance] = useState(0);
  const [totalSnowcone, setTotalSnowcone] = useState(0);
  const { prices } = usePrices();

  const isWrongNetwork = useMemo(() => chainId !== C_CHAIN_ID, [chainId])
  const snowballContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.SNOWBALL, SNOWBALL_ABI, provider) : null, [library,provider])
  const snowconeContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.SNOWCONE, SNOWCONE_ABI, provider) : null, [library,provider])
  const gaugeProxyContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.GAUGE_PROXYV2, GAUGE_PROXY_ABI, provider) : null, [library,provider])

  const getBalanceInfo = useCallback(async () => {
    if(!provider){
      return;
    }
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
      const avaxBalance = await provider.getBalance(account);

      setAVAXBalance(BNToFloat(avaxBalance, 18));
      setSnowballBalance(snowballBalanceValue);
      setSnowconeBalance(snowconeBalanceValue);
      setTotalSnowcone(totalSnowconeValue);
    } catch (error) {
      console.log('[Error] getBalanceInfo => ', error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, snowballContract, snowconeContract])

  useEffect(() => {
    if (!isEmpty(snowballContract) && !isEmpty(snowconeContract) 
    && loading && account) {
      getBalanceInfo();
      setLoading(false);
    }

    if (!loading) {
      if(isEmpty(account)) {
        setSnowballBalance(0);
        setSnowconeBalance(0);
        setTotalSnowcone(0);
        setAVAXBalance(0);
      } else { 
        getBalanceInfo();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snowballContract, snowconeContract, account, getBalanceInfo]);

  useEffect(() =>{
    if(error){
      const connectionError = handleConnectionError(error);
      setPopUp({
        title: 'Error Connecting Wallet',
        text: connectionError.message,
        icon: connectionError.icon,
        cancelLabel: connectionError.button,
        confirmAction: connectionError.confirmAction
      });
      console.error(error);
    }else{
      setOpen(false);
    }
  
  },[error,setPopUp,setOpen]);

  const { gauges, retrieveGauge, setGauges, getGaugeProxyInfo } = useStakingContract({
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
        AVAXBalance,
        getBalanceInfo,
        getGaugeProxyInfo
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
    AVAXBalance,
    getBalanceInfo,
    getGaugeProxyInfo
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
    AVAXBalance,
    getBalanceInfo,
    getGaugeProxyInfo
  }
}