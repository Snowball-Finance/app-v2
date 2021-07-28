import { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';

import { IS_MAINNET, CONTRACTS } from 'config';
import MAIN_ERC20_ABI from 'libs/abis/main/erc20.json';
import TEST_ERC20_ABI from 'libs/abis/test/erc20.json';
import SNOWGLOBE_ABI from 'libs/abis/snowglobe.json'
import { useQuery } from '@apollo/client';
import { LAST_SNOWBALL_INFO } from 'api/compound-and-earn/queries';
import { usePopup } from 'contexts/popup-context'
import { usePoolContract } from './pool-context';
import { useContracts } from './contract-context';

const ERC20_ABI = IS_MAINNET ? MAIN_ERC20_ABI : TEST_ERC20_ABI;
const CompoundAndEarnContext = createContext(null);

export function CompoundAndEarnProvider({ children }) {
  const { library, account } = useWeb3React();
  const [userPools, setUserPools] = useState([]);
  const { gauges } = useContracts();
  const { pools } = usePoolContract();

  useEffect(() => {
    {
      getBalanceInfosByPool();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pools, gauges, account]);

  const { setPopUp } = usePopup();
  const { data } = useQuery(LAST_SNOWBALL_INFO);

  const approve = async (pairsName, amount) => {
    if (!account) {
      setPopUp({
        title: 'Network Error',
        text: `Please Switch to Avalanche Chain and connect metamask`
      })
    } else {
      const filterData = data?.LastSnowballInfo?.poolsInfo.filter(
        (item) => item.name.search(pairsName.toUpperCase()) != -1
      );
      const lpContract = new ethers.Contract(filterData[0].lpAddress, ERC20_ABI, library.getSigner());
      amount = ethers.utils.parseEther(amount.toString());
      const balance = await lpContract.balanceOf(account);
      if (amount > balance) {
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

  const submit = async (method, pairsName, amount) => {
    if (!account) {
      setPopUp({
        title: 'Network Error',
        text: `Please Switch to Avalanche Chain and connect metamask`
      })
      return false;
    } else {
      const filterData = data?.LastSnowballInfo?.poolsInfo.filter(
        (item) => item.name.search(pairsName.toUpperCase()) != -1
      );
      if (method === 'Deposit') {
        const lpContract = new ethers.Contract(filterData[0].lpAddress, ERC20_ABI, library.getSigner());
        amount = ethers.utils.parseEther(amount.toString());
        const balance = await lpContract.balanceOf(account);
        if (amount > balance) {
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

  const getBalanceInfosByPool = async () => {
    if (!account || !gauges || !pools) {
      return false;
    }
    console.log(gauges);
    const dataWithPoolBalance = await Promise.all(pools.map(async (item) => {
      const gauge = gauges.find((gauge) => gauge.address.toLowerCase() ===
        item.gaugeInfo.address.toLowerCase());
      let totalSupply, userLP, SNOBHarvestable, SNOBValue;
      if (item.kind === 'Snowglobe') {
        const snowglobeContract = new ethers.Contract(item.address,
          SNOWGLOBE_ABI, library.getSigner());

        totalSupply = await snowglobeContract.totalSupply() / 1e18;
        const snowglobeRatio = (await snowglobeContract.getRatio()) / 1e18;
        let balanceSnowglobe = await snowglobeContract.balanceOf(account) / 1e18;
        if (gauge) {
          balanceSnowglobe += gauge.staked / 1e18;
          SNOBHarvestable = gauge.harvestable / 1e18;
          SNOBValue = SNOBHarvestable * data?.LastSnowballInfo?.snowballToken.pangolinPrice;
        }
        userLP = (balanceSnowglobe * snowglobeRatio);
      } else {
        if (gauge) {
          userLP = gauge.staked / 1e18;
          totalSupply = gauge.totalSupply / 1e18;
          SNOBHarvestable = gauge.harvestable / 1e18;
          SNOBValue = SNOBHarvestable * data?.LastSnowballInfo?.snowballToken.pangolinPrice;
        }
      }
      return {
        ...item,
        address: item.address,
        userLP: userLP,
        usdValue: userLP * item.pricePoolToken,
        totalSupply, SNOBHarvestable,
        SNOBValue
      };
    }));
    setUserPools(dataWithPoolBalance);
    return dataWithPoolBalance;
  };

  return (
    <CompoundAndEarnContext.Provider value={{ approve, submit, getBalanceInfosByPool, userPools }}>
      {children}
    </CompoundAndEarnContext.Provider>
  );
}

export function useCompoundAndEarnContract() {
  const context = useContext(CompoundAndEarnContext);
  if (!context) {
    throw new Error('Missing stats context');
  }

  const { approve, submit, getBalanceInfosByPool, userPools } = context;

  return { approve, submit, getBalanceInfosByPool, userPools };
}
