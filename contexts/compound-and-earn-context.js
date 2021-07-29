import { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3'

import { IS_MAINNET, CONTRACTS } from 'config';
import MAIN_ERC20_ABI from 'libs/abis/main/erc20.json';
import TEST_ERC20_ABI from 'libs/abis/test/erc20.json';
import SNOWGLOBE_ABI from 'libs/abis/snowglobe.json';
import GAUGE_ABI from 'libs/abis/gauge.json';
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
      const balance = await lpContract.balanceOf(account);

      amount = ethers.utils.parseEther(amount.toString());
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
        const balance = await lpContract.balanceOf(account);

        amount = ethers.utils.parseEther(amount.toString());
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

  const claim = async (item) => {
    if (!account || !gauges || !pools) {
      return {claimTxReceipt: null, error: "Network Error"};
    }
    const gauge = gauges.find((gauge) => gauge.address.toLowerCase() === item.gaugeInfo.address.toLowerCase());
    const gaugeContract = new ethers.Contract(gauge.address, GAUGE_ABI, library.getSigner());
    const ethereumProvider = await detectEthereumProvider();
    const web3 = new Web3(ethereumProvider);

    gaugeContract.getReward().then((t) => {
      web3.waitForTransaction(t.hash).then((receipt) => {
        return {claimTxReceipt: receipt, error: null};
      }).catch((error) => {
        return {claimTxReceipt: null, error: error};     
      }); 
    }).catch((error) => {
      return {claimTxReceipt: null, error: error};
    }); 
  }

  const getBalanceInfosByPool = async () => {
    if (!account || !gauges || !pools) {
      return false;
    }
    const dataWithPoolBalance = await Promise.all(pools.map(async (item) => {
      const gauge = gauges.find((gauge) => gauge.address.toLowerCase() ===
        item.gaugeInfo.address.toLowerCase());
      let totalSupply, userDepositedLP, SNOBHarvestable, SNOBValue;
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
        userDepositedLP = (balanceSnowglobe * snowglobeRatio);
      } else {
        if (gauge) {
          userDepositedLP = gauge.staked / 1e18;
          totalSupply = gauge.totalSupply / 1e18;
          SNOBHarvestable = gauge.harvestable / 1e18;
          SNOBValue = SNOBHarvestable * data?.LastSnowballInfo?.snowballToken.pangolinPrice;
        }
      }

      const lpContract = new ethers.Contract(item.lpAddress, ERC20_ABI, library.getSigner());
      const userLPBalance = await lpContract.balanceOf(account) / 1e18;

      return {
        ...item,
        address: item.address,
        userLPBalance: userLPBalance,
        userDepositedLP: userDepositedLP,
        usdValue: userDepositedLP * item.pricePoolToken,
        totalSupply, 
        SNOBHarvestable,
        SNOBValue
      };
    }));
    setUserPools(dataWithPoolBalance);
  };

  return (
    <CompoundAndEarnContext.Provider value={{ approve, submit, claim, userPools }}>
      {children}
    </CompoundAndEarnContext.Provider>
  );
}

export function useCompoundAndEarnContract() {
  const context = useContext(CompoundAndEarnContext);
  if (!context) {
    throw new Error('Missing stats context');
  }

  const { approve, submit, claim, userPools } = context;

  return { approve, submit, claim, userPools };
}
