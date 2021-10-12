import { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';

import { injected } from 'utils/constants/connectors'

const useInactiveListener = (suppress = false) => {
  const { active, error, activate } = useWeb3React();

  useEffect(() => {
    const ethereum = window['ethereum'];
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

      const handleNetworkChanged = (networkId: number) => {
        console.log('networkChanged', networkId);
        activate(injected);
      };

      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('networkChanged', handleNetworkChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('chainChanged', handleChainChanged);
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
          ethereum.removeListener('networkChanged', handleNetworkChanged);
        }
      };
    }

    return () => { };
  }, [active, error, suppress, activate]);
}

export default useInactiveListener;