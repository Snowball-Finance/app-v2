import { createContext, useContext, useMemo, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'

import { CONTRACTS, C_CHAIN_ID } from 'config'
import SNOWBALL_ABI from 'libs/abis/snowball.json'
import SNOWCONE_ABI from 'libs/abis/snowcone.json'
import { usePopup } from 'contexts/popup-context'
import { isEmpty } from 'utils/helpers/utility'

const ContractContext = createContext(null)

export function ContractProvider({ children }) {
  const { setPopUp } = usePopup();
  const { account, library, chainId } = useWeb3React();
  const [snowballBalance, setSnowballBalance] = useState(0);
  const [snowconeBalance, setSnowconeBalance] = useState(0);

  const isWrongNetwork = useMemo(() => chainId !== C_CHAIN_ID, [chainId])
  const snowballContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.SNOWBALL, SNOWBALL_ABI, library.getSigner()) : null, [library])
  const snowconeContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.SNOWCONE, SNOWCONE_ABI, library.getSigner()) : null, [library])

  useEffect(() => {
    if (chainId && chainId !== C_CHAIN_ID) {
      setPopUp({
        title: 'Network Error',
        text: `Switch to Avalanche Chain`
      })
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId]);

  useEffect(() => {
    if (!isEmpty(snowballContract) && !isEmpty(snowconeContract)) {
      getBalanceInfo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snowballContract, snowconeContract])

  const getBalanceInfo = async () => {
    try {
      const [
        snowballBalance,
        snowconeBalance,
      ] = await Promise.all([
        snowballContract['balanceOf(address)'](account, { gasLimit: 1000000 }),
        snowconeContract['balanceOf(address)'](account, { gasLimit: 1000000 }),
      ]);
      const snowballBalanceValue = parseFloat(ethers.utils.formatUnits(snowballBalance, 18));
      const snowconeBalanceValue = parseFloat(ethers.utils.formatUnits(snowconeBalance, 18));
      setSnowballBalance(snowballBalanceValue);
      setSnowconeBalance(snowconeBalanceValue);
    } catch (error) {
      console.log('[Error] getBalanceInfo => ', error)
    }
  }

  return (
    <ContractContext.Provider
      value={{
        isWrongNetwork,
        snowballBalance,
        snowconeBalance,
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
    isWrongNetwork,
    snowballBalance,
    snowconeBalance,
    getBalanceInfo
  } = context

  return {
    isWrongNetwork,
    snowballBalance,
    snowconeBalance,
    getBalanceInfo
  }
}