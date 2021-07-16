import { createContext, useContext, useMemo, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'

import { CONTRACTS, C_CHAIN_ID } from 'config'
import SNOWBALL_ABI from 'libs/abis/snowball.json'
import { usePopup } from 'contexts/popup-context'
import { isEmpty } from 'utils/helpers/utility'

const ContractContext = createContext(null)

export function ContractProvider({ children }) {
  const { setPopUp } = usePopup();
  const { account, library, chainId } = useWeb3React();
  const [snowballBalance, setSnowballBalance] = useState(0);

  const isWrongNetwork = useMemo(() => chainId !== C_CHAIN_ID, [chainId])
  const snowballContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.SNOWBALL, SNOWBALL_ABI, library.getSigner()) : null, [library])

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
    if (!isEmpty(snowballContract)) {
      getSnowballInfo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snowballContract])

  const getSnowballInfo = async () => {
    try {
      const snowballBalance = await snowballContract.balanceOf(account);
      const snowballBalanceValue = ethers.utils.formatUnits(snowballBalance, 18);
      setSnowballBalance(snowballBalanceValue);
    } catch (error) {
      console.log('[Error] snowballContract => ', error)
    }
  }

  return (
    <ContractContext.Provider
      value={{
        isWrongNetwork,
        snowballBalance
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
    snowballBalance
  } = context

  return {
    isWrongNetwork,
    snowballBalance
  }
}