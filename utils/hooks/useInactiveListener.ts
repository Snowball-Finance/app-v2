import { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';

import { injected } from 'utils/constants/connectors'

const useInactiveListener = (suppress = false) => {
  const { active, error, activate } = useWeb3React();

  useEffect(() => {
    const ethereum = window['ethereum'];
    ethereum && ethereum.removeAllListeners(["networkChanged"]);

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleChainChanged = (chainId: number) => {
        console.log('chainChanged', chainId);
        activate(injected);
      };

      const handleAccountsChanged = (accounts: Array<any>) => {
        console.log('accountsChanged', accounts);
        if (accounts.length > 0) {
          activate(injected);
        }
      };

      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('chainChanged', handleChainChanged);
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
    
    return () => { };
  }, [active, error, suppress, activate]);
}

export default useInactiveListener;