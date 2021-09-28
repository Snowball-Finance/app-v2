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
import { isEmpty, delay } from 'utils/helpers/utility';
import MESSAGES from 'utils/constants/messages';
import ANIMATIONS from 'utils/constants/animate-icons';
import { BNToFloat, floatToBN } from 'utils/helpers/format';
import { AVALANCHE_MAINNET_PARAMS } from 'utils/constants/connectors';
import { usePrices } from './price-context';
import { getLink } from 'utils/helpers/getLink';
import { useProvider } from './provider-context';

const ERC20_ABI = IS_MAINNET ? MAIN_ERC20_ABI : TEST_ERC20_ABI;
const CompoundAndEarnContext = createContext(null);

export function CompoundAndEarnProvider({ children }) {
  const { library, account } = useWeb3React();
  const { gauges, retrieveGauge, getBalanceInfo, getGaugeProxyInfo  } = useContracts();
  const { getLastSnowballInfo, getDeprecatedContracts } = useAPIContext();
  const { provider } = useProvider();
  const { prices } = usePrices();
  const snowballInfoQuery = getLastSnowballInfo();
  const deprecatedContractsQuery = getDeprecatedContracts();
  const { data: { LastSnowballInfo: { poolsInfo: pools = [] } = {} } = {} } = snowballInfoQuery;

  const { setPopUp } = usePopup();

  const [userPools, setUserPools] = useState([]);
  const [userDeprecatedPools, setUserDeprecatedPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadedDeprecated, setLoadedDeprecated] = useState(false);
  const [sortedUserPools, setSortedUserPools] = useState(false);
  const [isTransacting, setIsTransacting] = useState({ approve: false, deposit: false, withdraw: false });
  const [transactionStatus, setTransactionStatus] = useState({ approvalStep: 0, depositStep: 0, withdrawStep: 0 })

  useEffect(() => {
    //only fetch total information when the userpools are empty
    //otherwise we always want to update by single pool to have
    //a more performatic approach
    if(account && !isEmpty(gauges) && !isEmpty(prices) && userPools.length === 0){
      setLoading(true);
      getBalanceInfosAllPools(gauges);
    }
    //reset state
    if(!account){
      setSortedUserPools(false);
      setLoadedDeprecated(false);
      setUserPools([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps   
  }, [gauges, account, prices]);

  useEffect(()=>{
    async function loadDeprecatedPools(){
      //check for deprecated Pools
      let deprecatedUserBalance = [];
      await Promise.all(
        deprecatedContractsQuery.data?.DeprecatedContracts.map(async(pool)=>{
          const gaugeContract = new ethers.Contract(
            pool.contractAddresses[1],GAUGE_ABI,provider);
          const tokenContract = new ethers.Contract(
            pool.contractAddresses[0],ERC20_ABI,provider);
          let userDeposited = await gaugeContract.balanceOf(account)/1e18;
          const balanceInToken = await tokenContract.balanceOf(account)/1e18;
          if(pool.kind === 'Snowglobe'){
            userDeposited += balanceInToken;
          }

          const SNOBHarvestable = await gaugeContract.earned(account);
          //return if it has nothing deposited
          if(+userDeposited === 0 && +SNOBHarvestable === 0){
            return;
          }
          deprecatedUserBalance.push(
            {
              address:pool.contractAddresses[0],
              gaugeInfo:{
                address:pool.contractAddresses[1]
              },
              userBalanceSnowglobe:balanceInToken,
              name:pool.pair,
              kind:pool.kind,
              source:pool.source,
              symbol:
                pool.source === 'Trader Joe'? 'JLP' 
                : pool.source === 'BENQI' ? 'QLP'
                : pool.source === 'Pangolin' ? 'PGL'
                : 'SNOB',
              userDepositedLP:userDeposited,
              SNOBHarvestable:SNOBHarvestable/1e18,
              SNOBValue:(SNOBHarvestable/1e18) * prices?.SNOB,
              claimed:(!SNOBHarvestable > 0),
              withdrew:(!userDeposited > 0),
              deprecatedPool:true
            }
          )
        }
      ));
     
      setUserDeprecatedPools(deprecatedUserBalance);
    }

    //after done loading, search for deprecated pools
    if(!loading && account){
      loadDeprecatedPools();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps   
  },[loading,account])

  const generatePoolInfo = async (item,gauges) => {
    const lpContract = new ethers.Contract(item.lpAddress, LP_ABI, provider);
    const gauge = gauges.find((gauge) => gauge.address.toLowerCase() === item.gaugeInfo.address.toLowerCase());

    let totalSupply = 0, userDepositedLP = 0, SNOBHarvestable = 0, SNOBValue = 0, 
      underlyingTokens, userBalanceSnowglobe, userLPBalance, lpDecimals = 18;

    if(!isEmpty(gauge)){
      SNOBHarvestable = gauge.harvestable / 1e18;
      SNOBValue = SNOBHarvestable * prices?.SNOB;
    }

    userLPBalance  = await lpContract.balanceOf(account);
    if(+userLPBalance > 0){
      lpDecimals = await lpContract.decimals();
    }

    switch(item.kind){
      case 'Snowglobe':
        const snowglobeContract = new ethers.Contract(item.address, SNOWGLOBE_ABI, provider);
        userBalanceSnowglobe = await snowglobeContract.balanceOf(account);
        if(+userBalanceSnowglobe <= 0 && gauge.staked <= 0){
          break;
        }
        
        if(+userLPBalance <= 0){
          lpDecimals = await lpContract.decimals();
        }

        totalSupply = await snowglobeContract.totalSupply();

        let snowglobeRatio;
        const snowglobeTotalBalance = await snowglobeContract.balance();
        if (snowglobeTotalBalance > 0) {
          snowglobeRatio = await snowglobeContract.getRatio();
        } else {
          snowglobeRatio = floatToBN(1, 18);
        }
        if (userBalanceSnowglobe.gt('0x0') && userLPBalance.eq('0x0')) {
          userLPBalance = userLPBalance.add(userBalanceSnowglobe);
        }
        userDepositedLP = BNToFloat(userBalanceSnowglobe, lpDecimals) *
          BNToFloat(snowglobeRatio, 18);

        if (!isEmpty(gauge)) {
          userDepositedLP += (gauge.staked / 10 ** lpDecimals) * BNToFloat(snowglobeRatio, 18);
        }

        if (userDepositedLP > 0 && item.token1.address) {
          let reserves = await lpContract.getReserves();
          let totalSupplyPGL = BNToFloat(await lpContract.totalSupply(), 18);

          const r0 = BNToFloat(reserves._reserve0, item.token0.decimals);
          const r1 = BNToFloat(reserves._reserve1, item.token1.decimals);
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
      break;
      case 'Stablevault':
        if(!isEmpty(gauge)){
          userDepositedLP = gauge.staked / 1e18;
          totalSupply = gauge.totalSupply;
        }
      break;
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

  const getBalanceInfosAllPools = async (gauges) => {
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

      //update user pool state
      const poolInfo = await generatePoolInfo(givenPool,[gaugeInfo]);

      getBalanceInfo();

      return poolInfo;
      
    } catch (error) {
      console.log('[Error] getBalanceInfosSinglePool => ', error)
    }
  };

  const _approve = async (contract, spender, amount) => {
    return new Promise(async (resolve, reject) => {
      const allowance = await contract.allowance(account, spender)
      if (amount.gt(allowance)) {
        let useExact = false;
        await contract.estimateGas.approve(spender, ethers.constants.MaxUint256).catch(() => {
          // general fallback for tokens who restrict approval amounts
          useExact = true;
        })

        const approval = await contract.approve(spender, 
          useExact 
          ? ethers.constants.MaxUint256 
          : amount);
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
        icon: ANIMATIONS.WARNING.VALUE,
        text: MESSAGES.METAMASK_NOT_CONNECTED
      })
    }

    setIsTransacting({ approve: true });
    try {
      if (item.kind === 'Stablevault') {
        const vaultContract = new ethers.Contract(item.address, ERC20_ABI, library.getSigner());
        const gauge = gauges.find((gauge) => gauge.address.toLowerCase() === item.gaugeInfo.address.toLowerCase());
        await _approve(vaultContract, gauge.address, amount);
        setIsTransacting({ approve: false });
        setTransactionStatus({ approvalStep: 2, depositStep: 0, withdrawStep: 0 });
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
      setTransactionStatus({ approvalStep: 1, depositStep: 0, withdrawStep: 0 });
      
      await _approve(snowglobeContract, gauge.address, amount.mul(snowglobeRatio));
      setTransactionStatus({ approvalStep: 2, depositStep: 0, withdrawStep: 0 });
    } catch (error) {
      setPopUp({
        title: 'Transaction Error',
        icon: ANIMATIONS.ERROR.VALUE,
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
        icon: ANIMATIONS.WARNING.VALUE,
        text: MESSAGES.METAMASK_NOT_CONNECTED
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
              icon: ANIMATIONS.ERROR.VALUE,
              text: `Error depositing into Snowglobe`
            });
            return;
          }
        }
        setTransactionStatus({ approvalStep: 2, depositStep: 1, withdrawStep: 0 });
        //await 2 seconds for our node to sync
        await delay(2000);
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
          icon: ANIMATIONS.ERROR.VALUE,
          text: `Error depositing into Gauge`
        });
        return;
      }else{
        const linkTx = getLink(
          `${AVALANCHE_MAINNET_PARAMS.
            blockExplorerUrls[0]}tx/${transactionGaugeDeposit.transactionHash}`
            ,'Check on C-Chain Explorer.');
        setPopUp({
          title: 'Deposit Complete',
          icon: ANIMATIONS.SUCCESS.VALUE,
          text: linkTx
        });
      }
      setTransactionStatus({ approvalStep: 2, depositStep: 2, withdrawStep: 0 });
      //refresh data only after 2sec to our node have time to catch up with network
      setTimeout(async ()=> {
        getBalanceInfosAllPools(await getGaugeProxyInfo());
        setSortedUserPools(false);
      },2000);
    } catch (error) {
      setPopUp({
        title: 'Transaction Error',
        icon: ANIMATIONS.ERROR.VALUE,
        text: `Error Depositing: ${error.message}`
      })
    }
    setIsTransacting({ deposit: false });
  }
  const withdraw = async (item, amount = 0) => {
    if (!account) {
      setPopUp({
        title: 'Network Error',
        icon: ANIMATIONS.WARNING.VALUE,
        text: MESSAGES.METAMASK_NOT_CONNECTED
      });
      return;
    }

    setIsTransacting({ withdraw: true });
    setTransactionStatus({ approvalStep: 0, depositStep: 0, withdrawStep: 1 });
    await claim(item);
    setIsTransacting({ withdraw: true });
    try {
      const gaugeContract = new ethers.Contract(item.gaugeInfo.address, GAUGE_ABI, library.getSigner());

      const gaugeBalance = await gaugeContract.balanceOf(account);
      if (gaugeBalance.gt(0x00)) {
        const gaugeWithdraw = await gaugeContract.withdraw(amount);
        const transactionGaugeWithdraw = await gaugeWithdraw.wait(1);
        setTransactionStatus({ approvalStep: 0, depositStep: 0, withdrawStep: 2 });
        if (!transactionGaugeWithdraw.status) {
          setPopUp({
            title: 'Transaction Error',
            icon: ANIMATIONS.ERROR.VALUE,
            text: `Error withdrawing from Gauge`
          });
          setIsTransacting({ withdraw: false });
          return;
        }

        if (item.kind === 'Stablevault') {
          const linkTx = getLink(
            `${AVALANCHE_MAINNET_PARAMS.
              blockExplorerUrls[0]}tx/${transactionGaugeWithdraw.transactionHash}`
              ,'Check on C-Chain Explorer.');
          setPopUp({
            title: 'Withdraw Complete',
            icon: ANIMATIONS.SUCCESS.VALUE,
            text: linkTx
          });
          setTransactionStatus({ approvalStep: 0, depositStep: 0, withdrawStep: 2 });
          setIsTransacting({ withdraw: false });
          if(item.deprecatedPool){
            item.withdrew = true;
          }else{
            //refresh data only after 2sec to our node have time to catch up with network
            setTimeout(async ()=> {
              await getBalanceInfosAllPools(await getGaugeProxyInfo());
              setSortedUserPools(false);
            },2000);
          }
        }
      } else {
        setTransactionStatus({ approvalStep: 0, depositStep: 0, withdrawStep: 2 });
      }

      if (item.kind === 'Snowglobe') {
        const snowglobeContract = new ethers.Contract(item.address, SNOWGLOBE_ABI, library.getSigner());
        //await 2 seconds for our node to sync
        await delay(2000);
        const snowglobeBalance = await snowglobeContract.balanceOf(account);

        if (snowglobeBalance.gt(0x00)) {
          const snowglobeWithdraw = await snowglobeContract.withdraw(amount > 0 ? amount : snowglobeBalance);
          const transactionSnowglobeWithdraw = await snowglobeWithdraw.wait(1)

          if (!transactionSnowglobeWithdraw.status) {
            setPopUp({
              title: 'Transaction Error',
              icon: ANIMATIONS.ERROR.VALUE,
              text: `Error withdrawing from Snowglobe`
            });
            return;
          }
          const linkTx = getLink(
            `${AVALANCHE_MAINNET_PARAMS.
              blockExplorerUrls[0]}tx/${transactionSnowglobeWithdraw.transactionHash}`
              ,'Check on C-Chain Explorer.');
          setPopUp({
            title: 'Withdraw Complete',
            icon: ANIMATIONS.SUCCESS.VALUE,
            text: linkTx
          });
          setTransactionStatus({ approvalStep: 0, depositStep: 0, withdrawStep: 3 });
          if(item.deprecatedPool){
            item.withdrew = true;
          }else{
            //refresh data only after 2sec to our node have time to catch up with network
            setTimeout(async ()=> {
              await getBalanceInfosAllPools(await getGaugeProxyInfo());
              setSortedUserPools(false);
            },2000);
          }
        }
      }
    } catch (error) {
      setPopUp({
        title: 'Transaction Error',
        icon: ANIMATIONS.ERROR.VALUE,
        text: `Error withdrawing`
      });
      console.log(error)
    }
    setIsTransacting({ withdraw: false });
  }

  const claim = async (item) => {
    if (!account || !gauges) {
      setPopUp({
        title: 'Network Error',
        icon: ANIMATIONS.WARNING.VALUE,
        text: MESSAGES.METAMASK_NOT_CONNECTED
      })
      return;
    }

    const userData = await getBalanceInfoSinglePool(item.address);
    if (userData.SNOBHarvestable === 0) return;

    setIsTransacting({ pageview: true });
    try {
      const gaugeContract = new ethers.Contract(item.gaugeInfo.address, GAUGE_ABI, library.getSigner());
      const gaugeReward = await gaugeContract.getReward()
      const transactionReward = await gaugeReward.wait(1)
      if (transactionReward.status) {
        const linkTx = getLink(
          `${AVALANCHE_MAINNET_PARAMS.
            blockExplorerUrls[0]}tx/${transactionReward.transactionHash}`,
            'Check on C-Chain Explorer.');
        setPopUp({
          title: 'Claim Complete',
          icon: ANIMATIONS.SUCCESS.VALUE,
          text: linkTx
        });
      if(item.deprecatedPool){
        item.claimed = true;
      }
        
      } else {
        setPopUp({
          title: 'Claim Error',
          icon: ANIMATIONS.ERROR.VALUE,
          text: `Error claiming from Gauge ${error.message}`
        });
      }
    } catch (error) {
      setPopUp({
        title: 'Claim Error',
        icon:  ANIMATIONS.ERROR.VALUE,
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
      setTransactionStatus,
      userDeprecatedPools,
      getBalanceInfoSinglePool,
      loadedDeprecated,
      sortedUserPools,
      setLoadedDeprecated,
      setSortedUserPools,
      setUserPools
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
    setTransactionStatus,
    userDeprecatedPools,
    getBalanceInfoSinglePool,
    loadedDeprecated,
    sortedUserPools,
    setLoadedDeprecated,
    setSortedUserPools,
    setUserPools
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
    setTransactionStatus,
    userDeprecatedPools,
    getBalanceInfoSinglePool,
    loadedDeprecated,
    sortedUserPools,
    setLoadedDeprecated,
    setSortedUserPools,
    setUserPools
  };
}
