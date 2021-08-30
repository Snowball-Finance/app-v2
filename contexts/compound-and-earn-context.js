import { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';

import { IS_MAINNET } from 'config';
import MAIN_ERC20_ABI from 'libs/abis/main/erc20.json';
import TEST_ERC20_ABI from 'libs/abis/test/erc20.json';
import SNOWGLOBE_ABI from 'libs/abis/snowglobe.json';
import GAUGE_ABI from 'libs/abis/gauge.json';
import LP_ABI from 'libs/abis/lp-token.json';
import { usePopup } from 'contexts/popup-context'
import { useContracts } from 'contexts/contract-context';
import { useAPIContext } from 'contexts/api-context';
import { isEmpty, provider } from 'utils/helpers/utility';
import { toast } from 'react-toastify';
import Toast from 'components/Toast';
import { BNToFloat, floatToBN } from 'utils/helpers/format';

const ERC20_ABI = IS_MAINNET ? MAIN_ERC20_ABI : TEST_ERC20_ABI;
const CompoundAndEarnContext = createContext(null);

export function CompoundAndEarnProvider({ children }) {
  const { library, account } = useWeb3React();
  const { gauges, retrieveGauge, setGauges, getBalanceInfo } = useContracts();
  const { getLastSnowballInfo } = useAPIContext();
  const snowballInfoQuery = getLastSnowballInfo();
  const { data: { LastSnowballInfo: { poolsInfo: pools = [] } = {} } = {} } = snowballInfoQuery;

  const { setPopUp } = usePopup();

  const [userPools, setUserPools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTransacting, setIsTransacting] = useState({ approve: false, deposit: false });
  const [transactionStatus, setTransactionStatus] = useState({ approvalStep: 0, depositStep: 0 })

  useEffect(() => {
    if(userPools.length === 0){
      getBalanceInfosAllPools();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps   
  }, [pools, gauges, account]);

  const generatePoolInfo = async (item,gauges) => {
    const lpContract = new ethers.Contract(item.lpAddress, LP_ABI, provider);
    const gauge = gauges.find((gauge) => gauge.address.toLowerCase() === item.gaugeInfo.address.toLowerCase());

    let totalSupply, userDepositedLP, SNOBHarvestable, SNOBValue, 
      underlyingTokens, userBalanceSnowglobe,userLPBalance;
    const lpDecimals = await lpContract.decimals();
    userLPBalance  = await lpContract.balanceOf(account);

    if (item.kind === 'Snowglobe') {
      const snowglobeContract = new ethers.Contract(item.address, SNOWGLOBE_ABI, provider);
      totalSupply = await snowglobeContract.totalSupply();

      let snowglobeRatio;

      const snowglobeTotalBalance = await snowglobeContract.balance();
      if (snowglobeTotalBalance > 0) {
        snowglobeRatio = await snowglobeContract.getRatio();
      } else {
        snowglobeRatio = floatToBN(1,18);
      }

      userBalanceSnowglobe = await snowglobeContract.balanceOf(account);
      if(userBalanceSnowglobe.gt('0x0') && userLPBalance.eq('0x0')){
        userLPBalance = userLPBalance.add(userBalanceSnowglobe);
      }
      userDepositedLP = BNToFloat(userBalanceSnowglobe,lpDecimals) * BNToFloat(snowglobeRatio,18);
      if (!isEmpty(gauge)) {
        userDepositedLP += (gauge.staked / 10**lpDecimals) * BNToFloat(snowglobeRatio,18);
        SNOBHarvestable = gauge.harvestable / 1e18;
        SNOBValue = SNOBHarvestable * snowballInfoQuery.data?.LastSnowballInfo?.snowballToken.pangolinPrice;
      }

      if (userDepositedLP > 0 && item.token1.address) {
        let reserves = await lpContract.getReserves();
        let totalSupplyPGL = BNToFloat(await lpContract.totalSupply(),18);

        const r0 = BNToFloat(reserves._reserve0,item.token0.decimals);
        const r1 = BNToFloat(reserves._reserve1,item.token1.decimals);
        let reserve0Owned = userDepositedLP * (r0) / (totalSupplyPGL);
        let reserve1Owned = userDepositedLP * (r1) / (totalSupplyPGL);
        underlyingTokens = {
          token0: {
            address: item.token0.address,
            symbol: item.token0.symbol,
            reserveOwned: reserve0Owned,
          },
          token1: {
            address: item.token1.address,
            symbol: item.token1.symbol,
            reserveOwned: reserve1Owned,
          }
        }
      }
    } else if (!isEmpty(gauge)) {
      userDepositedLP = gauge.staked / 1e18;
      totalSupply = gauge.totalSupply;
      SNOBHarvestable = gauge.harvestable / 1e18;
      SNOBValue = SNOBHarvestable * snowballInfoQuery.data?.LastSnowballInfo?.snowballToken.pangolinPrice;
    }

    return {
      ...item,
      address: item.address,
      userLPBalance,
      lpDecimals,
      userDepositedLP: userDepositedLP,
      usdValue: (userDepositedLP) * item.pricePoolToken,
      totalSupply,
      SNOBHarvestable,
      SNOBValue,
      underlyingTokens,
      userBalanceSnowglobe,
      userBalanceGauge: gauge ? gauge.staked: 0
    };
  }

  const getBalanceInfosAllPools = async () => {
    if (!account || isEmpty(gauges)) {
      return
    }
    setLoading(true);
    try {
      const dataWithPoolBalance = await Promise.all(
        pools.map(async (item) => {
          return await generatePoolInfo(item,gauges);
        }));
      setUserPools(dataWithPoolBalance);
    } catch (error) {
      console.log('[Error] getBalanceInfosAllPools => ', error)
    }
    setLoading(false);
  };

  const getBalanceInfoSinglePool = async (poolAddress) => {
    if (!account || isEmpty(gauges)) {
      return
    }
    try {
      
      let givenPool = pools.find((pool) => {
        return pool.address.toLowerCase() === poolAddress.toLowerCase();
      });

      //update gauge state
      const gaugeInfo = await retrieveGauge(givenPool);
  
      let foundGauge = false;
      let clonedGauges = gauges.concat([]);
      for (const idx in clonedGauges) {
        if (clonedGauges[idx].address.toLowerCase() === givenPool.gaugeInfo.address.toLowerCase()) {
          foundGauge = true;
          clonedGauges[idx] = gaugeInfo;
        }
      }
      if (!foundGauge) {
        clonedGauges.append(gaugeInfo);
      }
      setGauges(clonedGauges);

      //update user pool state
      let poolInfo = await generatePoolInfo(givenPool,clonedGauges);
      let foundPool = false;
      let cloneUserPools = userPools.concat([]);
      for(const idx in cloneUserPools){
        if(cloneUserPools[idx].address.toLowerCase() === poolAddress.toLowerCase()){
          foundPool = true;
          cloneUserPools[idx] = poolInfo;
        }
      }
      if(!foundPool){
        cloneUserPools.push(poolInfo);
      }
      setUserPools(cloneUserPools);

      getBalanceInfo();
      
    } catch (error) {
      console.log('[Error] getBalanceInfosSinglePool => ', error)
    }
  };

  const _approve = async (contract, spender, amount) => {
    return new Promise(async (resolve, reject) => {
      const allowance = await contract.allowance(account, spender)
      if (amount.gt(allowance)) {
        const approval = await contract.approve(spender, amount);
        const transactionApprove = await approval.wait(1);
        if (!transactionApprove.status) {
          setPopUp({
            title: 'Transaction Error',
            text: `Error Approving`
          });
          reject(false);
        }
      }
      resolve(true)
    })
  }

  const approve = async (item, amount, onlyGauge = false) => {
    if (!account) {
      setPopUp({
        title: 'Network Error',
        text: `Please Switch to Avalanche Chain and connect metamask`
      })
    }

    setIsTransacting({ approve: true });
    try {
      if (item.kind === 'Stablevault') {
        const vaultContract = new ethers.Contract(item.address, ERC20_ABI, library.getSigner());
        const gauge = gauges.find((gauge) => gauge.address.toLowerCase() === item.gaugeInfo.address.toLowerCase());
        await _approve(vaultContract, gauge.address, amount);
        setIsTransacting({ approve: false });
        setTransactionStatus({ approvalStep: 2, depositStep: 0 });
        return;
      }

      const lpContract = new ethers.Contract(item.lpAddress, ERC20_ABI, library.getSigner());
      const snowglobeContract = new ethers.Contract(item.address, SNOWGLOBE_ABI, library.getSigner());
      const gauge = gauges.find((gauge) => gauge.address.toLowerCase() === item.gaugeInfo.address.toLowerCase());

      let snowglobeRatio;
      try {
        snowglobeRatio = await snowglobeContract.getRatio();
        snowglobeRatio = snowglobeRatio.add(ethers.utils.parseUnits('0.1'));
      } catch (error) {
        snowglobeRatio = ethers.utils.parseUnits('1.1');
      }
      if(!onlyGauge){
        await _approve(lpContract, snowglobeContract.address, amount);
      }
      setTransactionStatus({ approvalStep: 1, depositStep: 0 });
      
      await _approve(snowglobeContract, gauge.address, amount.mul(snowglobeRatio));
      setTransactionStatus({ approvalStep: 2, depositStep: 0 });
    } catch (error) {
      setPopUp({
        title: 'Transaction Error',
        text: `Error Approving: ${error.message}`
      });
      console.log(error)
    }
    setIsTransacting({ approve: false });
  }

  const deposit = async (item, amount, onlyGauge = false) => {
    if (!account) {
      setPopUp({
        title: 'Network Error',
        text: `Please Switch to Avalanche Chain and connect metamask`
      })
      return false;
    }

    setIsTransacting({ deposit: true });
    try {
      if (item.kind === 'Snowglobe') {
        const lpContract = new ethers.Contract(item.lpAddress, ERC20_ABI, library.getSigner());
        const snowglobeContract = new ethers.Contract(item.address, SNOWGLOBE_ABI, library.getSigner());

        const balance = await lpContract.balanceOf(account);
        amount = amount.gt(balance) ? balance : amount;

        if (amount.gt(0x00) && !onlyGauge) {
          const snowglobeDeposit = await snowglobeContract.deposit(amount);
          const transactionSnowglobeDeposit = await snowglobeDeposit.wait(1);
          if (!transactionSnowglobeDeposit.status) {
            setPopUp({
              title: 'Transaction Error',
              text: `Error depositing into Snowglobe`
            });
            return;
          }
        }
        setTransactionStatus({ approvalStep: 2, depositStep: 1 });
        amount = await snowglobeContract.balanceOf(account);
      } else {
        const vaultContract = new ethers.Contract(item.address, ERC20_ABI, library.getSigner());
        const balance = await vaultContract.balanceOf(account);
        amount = amount.gt(balance) ? balance : amount
      }

      const gauge = gauges.find((gauge) => gauge.address.toLowerCase() === item.gaugeInfo.address.toLowerCase());
      const gaugeContract = new ethers.Contract(gauge.address, GAUGE_ABI, library.getSigner());

      const gaugeDeposit = await gaugeContract.deposit(amount);
      const transactionGaugeDeposit = await gaugeDeposit.wait(1);
      if (!transactionGaugeDeposit.status) {
        setPopUp({
          title: 'Transaction Error',
          text: `Error depositing into Gauge`
        });
        return;
      }
      setTransactionStatus({ approvalStep: 2, depositStep: 2 });
      getBalanceInfoSinglePool(item.address);
    } catch (error) {
      setPopUp({
        title: 'Transaction Error',
        text: `Error Depositing: ${error.message}`
      })
    }
    setIsTransacting({ deposit: false });
  }

  const withdraw = async (item) => {
    if (!account) {
      setPopUp({
        title: 'Network Error',
        text: `Please Switch to Avalanche Chain and connect metamask`
      });
      return;
    }

    setIsTransacting({ pageview: true });
    try {
      const gauge = gauges.find((gauge) => gauge.address.toLowerCase() === item.gaugeInfo.address.toLowerCase());
      const gaugeContract = new ethers.Contract(gauge.address, GAUGE_ABI, library.getSigner());

      const gaugeBalance = await gaugeContract.balanceOf(account);
      if (gaugeBalance.gt(0x00)) {
        const gaugeWithdraw = await gaugeContract.withdraw(gaugeBalance);
        const transactionGaugeWithdraw = await gaugeWithdraw.wait(1);
        if (!transactionGaugeWithdraw.status) {
          setPopUp({
            title: 'Transaction Error',
            text: `Error withdrawing from Gauge`
          });
          setIsTransacting({ pageview: false });
          return;
        }

        if (item.kind === 'Stablevault') {
          setPopUp({
            title: 'Withdraw Complete',
            text: `Gauge Receipt: ${transactionGaugeWithdraw.transactionHash}\n`
          });
          setIsTransacting({ pageview: false });
          getBalanceInfoSinglePool(item.address);
          toast(<Toast message={'Withdraw Successful!!'} toastType={'tokenOperation'}
          tokens={[item.token0.address,item.token1?.address, 
            item.token2?.address, item.token3?.address]}/>);
        }
      }

      if (item.kind === 'Snowglobe') {
        const snowglobeContract = new ethers.Contract(item.address, SNOWGLOBE_ABI, library.getSigner());
        const snowglobeBalance = await snowglobeContract.balanceOf(account);

        if (snowglobeBalance.gt(0x00)) {
          const snowglobeWithdraw = await snowglobeContract.withdraw(snowglobeBalance);
          const transactionSnowglobeWithdraw = await snowglobeWithdraw.wait(1)

          if (!transactionSnowglobeWithdraw.status) {
            setPopUp({
              title: 'Transaction Error',
              text: `Error withdrawing from Snowglobe`
            });
            return;
          }
          setPopUp({
            title: 'Withdraw Complete',
            text: `Globe Receipt: ${transactionSnowglobeWithdraw.transactionHash}\n`
          });
          getBalanceInfoSinglePool(item.address);
          toast(<Toast message={'Withdraw Successful!!'} toastType={'tokenOperation'} 
          tokens={[item.token0.address,item.token1?.address, 
            item.token2?.address, item.token3?.address]}/>);
        }
      }
    } catch (error) {
      setPopUp({
        title: 'Transaction Error',
        text: `Error withdrawing`
      });
      console.log(error)
    }
    setIsTransacting({ pageview: false });
  }

  const claim = async (item) => {
    if (!account || !gauges) {
      setPopUp({
        title: 'Network Error',
        text: `Please Switch to Avalanche Chain and connect metamask`
      })
      return;
    }

    setIsTransacting({ pageview: true });
    try {
      const gauge = gauges.find((gauge) => gauge.address.toLowerCase() === item.gaugeInfo.address.toLowerCase());
      const gaugeContract = new ethers.Contract(gauge.address, GAUGE_ABI, library.getSigner());

      const gaugeReward = await gaugeContract.getReward()
      const transactionReward = await gaugeReward.wait(1)
      if (transactionReward.status) {
        setPopUp({
          title: 'Claim Complete',
          text: `Claim Receipt: ${transactionReward.transactionHash}\n`
        });
        getBalanceInfoSinglePool(item.address);
        toast(<Toast message={'Claim Successful!!'} toastType={'tokenOperation'}
          tokens={[item.token0.address,item.token1?.address, 
            item.token2?.address, item.token3?.address]}/>);
      } else {
        setPopUp({
          title: 'Claim Error',
          text: `Error claiming from Gauge ${error.message}`
        });
      }
    } catch (error) {
      setPopUp({
        title: 'Claim Error',
        text: `Error claiming from Gauge ${error.message}`
      });
    }
    setIsTransacting({ pageview: false });
  }

  return (
    <CompoundAndEarnContext.Provider value={{
      loading,
      isTransacting,
      userPools,
      transactionStatus,
      approve,
      deposit,
      withdraw,
      claim,
      setTransactionStatus
    }}>
      {children}
    </CompoundAndEarnContext.Provider>
  );
}

export function useCompoundAndEarnContract() {
  const context = useContext(CompoundAndEarnContext);
  if (!context) {
    throw new Error('Missing stats context');
  }

  const {
    loading,
    isTransacting,
    userPools,
    transactionStatus,
    approve,
    deposit,
    withdraw,
    claim,
    setTransactionStatus
  } = context;

  return {
    loading,
    isTransacting,
    userPools,
    transactionStatus,
    approve,
    deposit,
    withdraw,
    claim,
    setTransactionStatus
  };
}
