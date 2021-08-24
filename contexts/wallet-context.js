import { createContext, useContext, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'

import useEagerConnect from 'utils/hooks/useEagerConnect'
import useInactiveListener from 'utils/hooks/useInactiveListener'
import WalletModal from 'components/WalletModal'

const ContractContext = createContext(null)

export function WalletProvider({ children }) {
  const { connector, activate } = useWeb3React();

  const [isWalletDialog, setIsWalletDialog] = useState(false);
  const [activatingConnector, setActivatingConnector] = useState();

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager || !!activatingConnector)

  const onConnectWallet = (injected) => {
    setActivatingConnector(injected);
    activate(injected);
  }

  return (
    <ContractContext.Provider
      value={{
        setIsWalletDialog,
        onConnectWallet
      }}
    >
      {children}
      {isWalletDialog &&
        <WalletModal
          open={isWalletDialog}
          onClose={() => setIsWalletDialog(false)}
          onConnectWallet={onConnectWallet}
        />
      }
    </ContractContext.Provider>
  )
}

export function useWallets() {
  const context = useContext(ContractContext)
  if (!context) {
    throw new Error('Missing stats context')
  }

  const {
    setIsWalletDialog,
    onConnectWallet
  } = context

  return {
    setIsWalletDialog,
    onConnectWallet
  }
}