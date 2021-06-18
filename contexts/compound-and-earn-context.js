import { createContext, useContext, useMemo } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';

import { IS_MAINNET } from 'config';
import MAIN_ERC20_ABI from 'libs/abis/main/erc20.json';
import TEST_ERC20_ABI from 'libs/abis/test/erc20.json';

const ERC20_ABI = IS_MAINNET ? MAIN_ERC20_ABI : TEST_ERC20_ABI;
const CompoundAndEarnContext = createContext(null);
const AVAX_WBTC_PAIR_TOKEN = '0x7a6131110b82dacbb5872c7d352bfe071ea6a17c';

export function CompoundAndEarnProvider({ children }) {
  const { library, account } = useWeb3React();
  const pairToken = useMemo(() => library ? new ethers.Contract(AVAX_WBTC_PAIR_TOKEN, ERC20_ABI, library.getSigner()) : null, [library])
  if(pairToken) {
    Promise.all([
      pairToken.balanceOf(account),
    ]).then(result=>{
      console.log('uuuuuuuu===>', result);
    }).catch(err=>{
      console.log('eeeeeee==>', err)
    })
  }
  return (
    <CompoundAndEarnContext.Provider value={{}}>
      {children}
    </CompoundAndEarnContext.Provider>
  );
}

export function useCompoundAndEarnContract() {
  const context = useContext(CompoundAndEarnContext);
  if (!context) {
    throw new Error('Missing stats context');
  }

  const {} = context;

  return {};
}
