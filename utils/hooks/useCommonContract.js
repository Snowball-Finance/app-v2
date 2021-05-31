import { useEffect, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'

import { C_CHAIN_ID } from 'config'
import { usePopup } from 'contexts/popup-context'

const useCommonContract = () => {
  const { setPopUp } = usePopup();
  const { chainId } = useWeb3React();

  const isWrongNetwork = useMemo(() => chainId !== C_CHAIN_ID, [chainId])

  useEffect(() => {
    if (!!chainId && chainId !== C_CHAIN_ID) {
      setPopUp({
        title: 'Network Error',
        text: `Switch to Avalanche Chain`
      })
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId]);

  return {
    isWrongNetwork
  }
}

export default useCommonContract