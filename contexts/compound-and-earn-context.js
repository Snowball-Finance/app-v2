import { createContext, useContext, useMemo } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';

import { IS_MAINNET, CONTRACTS } from 'config';
import MAIN_ERC20_ABI from 'libs/abis/main/erc20.json';
import TEST_ERC20_ABI from 'libs/abis/test/erc20.json';
import { useQuery } from '@apollo/client';
import { LAST_SNOWBALL_INFO } from 'api/compound-and-earn/queries';
import { usePopup } from 'contexts/popup-context'

const ERC20_ABI = IS_MAINNET ? MAIN_ERC20_ABI : TEST_ERC20_ABI;
const CompoundAndEarnContext = createContext(null);
const AVAX_WBTC_PAIR_TOKEN = '0x7a6131110b82dacbb5872c7d352bfe071ea6a17c';

export function CompoundAndEarnProvider({ children }) {
  const { library, account } = useWeb3React();
  const { setPopUp } = usePopup();
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
  const { data, loading, error } = useQuery(LAST_SNOWBALL_INFO);
  
  const approve = async (pairsName, amount) => {
    if (!account) {
      setPopUp({
        title: 'Network Error',
        text: `Please Switch to Avalanche Chain and connect metamask`
      })
    } else {
      const filterData = data?.LastSnowballInfo?.poolsInfo.filter(
        (item) => item.name.search(pairsName.toUpperCase()) !=-1
      );
      const lpContract = new ethers.Contract(filterData[0].lpAddress, ERC20_ABI, library.getSigner());
      amount = ethers.utils.parseEther(amount.toString());
      const balance = await lpContract.balanceOf(account);
      if ( amount > balance ) {
        setPopUp({
          title: 'Error',
          text: `Insufficient Balance`
        })
        return false;
      } else {
        await lpContract.approve(CONTRACTS.GAUGE_PROXY, amount);
      }
    }
  }

  const submit = async (method, pairsName,  amount) => {
    if (!account) {
      setPopUp({
        title: 'Network Error',
        text: `Please Switch to Avalanche Chain and connect metamask`
      })
      return false;
    } else {
      const filterData = data?.LastSnowballInfo?.poolsInfo.filter(
        (item) => item.name.search(pairsName.toUpperCase()) !=-1
      );
      if ( method === 'Deposit') {
        const lpContract = new ethers.Contract(filterData[0].lpAddress, ERC20_ABI, library.getSigner());
        amount = ethers.utils.parseEther(amount.toString());
        const balance = await lpContract.balanceOf(account);
        if ( amount > balance ) {
          setPopUp({
            title: 'Error',
            text: `Insufficient Balance`
          })
          return false;
        } else {
          await lpContract.transfer(CONTRACTS.GAUGE_PROXY, amount);
        }
      }
      return true;
    }
  }

  return (
    <CompoundAndEarnContext.Provider value={{approve, submit}}>
      {children}
    </CompoundAndEarnContext.Provider>
  );
}

export function useCompoundAndEarnContract() {
  const context = useContext(CompoundAndEarnContext);
  if (!context) {
    throw new Error('Missing stats context');
  }

  const {approve, submit} = context;

  return {approve, submit};
}
