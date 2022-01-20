import { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { WAVAX } from "utils/constants/addresses";

import { IS_MAINNET } from 'config';
import MAIN_ERC20_ABI from 'libs/abis/main/erc20.json';
import TEST_ERC20_ABI from 'libs/abis/test/erc20.json';
import SNOWGLOBE_ABI from 'libs/abis/snowglobe.json';
import LP_TOKEN_ABI from 'libs/abis/lp-token.json';
import GAUGE_ABI from 'libs/abis/gauge.json';
import SNOWGLOBE_ZAPPERS_ABI from 'libs/abis/snowglobezap';
import AMM_ROUTER_ABI from 'libs/abis/ammrouter.json';
import { usePopup } from 'contexts/popup-context';
import { useContracts } from 'contexts/contract-context';
import { useAPIContext } from 'contexts/api-context';
import { isEmpty, getBalanceWithRetry } from 'utils/helpers/utility';
import MESSAGES from 'utils/constants/messages';
import ANIMATIONS from 'utils/constants/animate-icons';
import { BNToFloat, floatToBN } from 'utils/helpers/format';
import { getZapperContract } from 'utils/helpers/getZapperContract';
import { AVALANCHE_MAINNET_PARAMS } from 'utils/constants/connectors';
import { usePrices } from './price-context';
import { getLink } from 'utils/helpers/getLink';
import { useProvider } from './provider-context';
import { getMultiContractData } from 'libs/services/multicall';
import { approveContractAction } from 'utils/contractHelpers/approve';
import { wrapAVAX } from 'utils/helpers/wrapAVAX';
import { getDeprecatedCalls, getGaugeCalls, getPoolCalls, getTokensBalance } from 'libs/services/multicall-queries';
import { AnalyticActions, AnalyticCategories, createEvent, analytics } from "utils/analytics";
import { CONTRACTS } from 'config';
import { useNotification } from 'contexts/notification-context';

const ERC20_ABI = IS_MAINNET ? MAIN_ERC20_ABI : TEST_ERC20_ABI;
const CompoundAndEarnContext = createContext(null);

export function CompoundAndEarnProvider({ children }) {
  const { library, account } = useWeb3React();
  const { gauges, retrieveGauge, getBalanceInfo, getGaugeProxyInfo } = useContracts();
  const { getLastSnowballInfo, getDeprecatedContracts } = useAPIContext();
  const { provider } = useProvider();
  const { prices } = usePrices();
  const snowballInfoQuery = getLastSnowballInfo();
  const deprecatedContractsQuery = getDeprecatedContracts();
  const { data: { LastSnowballInfo: { poolsInfo: pools = [] } = {} } = {} } = snowballInfoQuery;

  const { setPopUp } = usePopup();
  const { addPartialInvestment } = useNotification();

  const [userPools, setUserPools] = useState([]);
  const [userDeprecatedPools, setUserDeprecatedPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadedDeprecated, setLoadedDeprecated] = useState(false);
  const [sortedUserPools, setSortedUserPools] = useState(false);
  const [isTransacting, setIsTransacting] = useState({
    approve: false,
    deposit: false,
    withdraw: false,
  });
  const [transactionStatus, setTransactionStatus] = useState({
    approvalStep: 0,
    depositStep: 0,
    withdrawStep: 0,
  });
  const [transactionUpdateLoading, setTransactionUpdateLoading] = useState(false);

  useEffect(() => {
    //only fetch total information when the userpools are empty
    //otherwise we always want to update by single pool to have
    //a more performatic approach
    if (account && pools?.length > 0 && !isEmpty(gauges)) {
      setLoading(true);
      getBalanceInfosAllPools(gauges);
    }
    //reset state
    if (!account) {
      setSortedUserPools(false);
      setLoadedDeprecated(false);
      setUserPools([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gauges, account, prices]);

  useEffect(() => {
    async function loadDeprecatedPools() {
      //check for deprecated Pools
      const deprecatedContracts = deprecatedContractsQuery.data?.DeprecatedContracts;

      if (deprecatedContracts) {
        let deprecatedUserCalls = [];
        deprecatedContracts.forEach(pool => {
          deprecatedUserCalls = deprecatedUserCalls.concat(getDeprecatedCalls(pool, account));
        });
        const deprecatedData = await getMultiContractData(provider, deprecatedUserCalls);

        const deprecatedUserBalance = [];
        deprecatedContracts.forEach(pool => {
          const deprecatedInfo = generateDeprecatedInfo(pool, deprecatedData);
          if (deprecatedInfo) {
            deprecatedUserBalance.push(deprecatedInfo);
          }
        });
        setUserDeprecatedPools(deprecatedUserBalance);
      }
    }

    //after done loading, search for deprecated pools
    if (!loading && account) {
      loadDeprecatedPools();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, account]);

  const generateDeprecatedInfo = (pool, deprecatedData) => {
    const snowglobeInfo = deprecatedData[pool.contractAddresses[0]];
    const gaugeInfo = deprecatedData[pool.contractAddresses[1]];

    let userDeposited = gaugeInfo.balanceOf / 1e18;
    const balanceInToken = snowglobeInfo.balanceOf / 1e18;
    if (pool.kind === 'Snowglobe') {
      userDeposited += balanceInToken;
    }

    const SNOBHarvestable = gaugeInfo.earned;
    //return if it has nothing deposited
    if (+userDeposited === 0 && +SNOBHarvestable === 0) {
      return;
    }

    return {
      address: pool.contractAddresses[0],
      gaugeInfo: {
        address: pool.contractAddresses[1],
      },
      userBalanceSnowglobe: balanceInToken,
      name: pool.pair,
      kind: pool.kind,
      source: pool.source,
      symbol:
        pool.source === 'Trader Joe'
          ? 'JLP'
          : pool.source === 'Teddy Cash'
            ? 'TLP'
            : pool.source === 'Banker Joe'
              ? 'BLP'
              : pool.source === 'BENQI'
                ? 'QLP'
                : pool.source === 'AAVE'
                  ? 'ALP'
                  : pool.source === 'Platypus'
                    ? 'PLP'
                    : pool.source === 'Pangolin'
                      ? 'PGL'
                      : pool.source === 'Axial'
                        ? 'AXLP'
                        : 'SNOB',
      userDepositedLP: userDeposited,
      SNOBHarvestable: SNOBHarvestable / 1e18,
      SNOBValue: (SNOBHarvestable / 1e18) * prices?.SNOB,
      claimed: !SNOBHarvestable > 0,
      withdrew: !userDeposited > 0,
      deprecatedPool: true,
    };
  };

  const generatePoolInfo = (item, gauges, contractData) => {
    const lpData = contractData[item.lpAddress];
    const snowglobeData = contractData[item.address];
    const gauge = gauges.find(gauge => gauge.address.toLowerCase() === item.gaugeInfo.address.toLowerCase());

    let totalSupply = 0,
      userDepositedLP = 0,
      SNOBHarvestable = 0,
      SNOBValue = 0,
      underlyingTokens,
      userBalanceSnowglobe,
      userLPBalance,
      lpDecimals = 18;

    if (!isEmpty(gauge)) {
      SNOBHarvestable = gauge.harvestable / 1e18;
      SNOBValue = SNOBHarvestable * prices?.SNOB;
    }

    userLPBalance = lpData.balanceOf;
    lpDecimals = lpData.decimals;
    let snowglobeRatio = floatToBN(1, 18);
    switch (item.kind) {
      case 'Snowglobe':
        userBalanceSnowglobe = snowglobeData.balanceOf;
        if (+userBalanceSnowglobe <= 0 && gauge.staked <= 0) {
          break;
        }

        totalSupply = snowglobeData.totalSupply;

        const snowglobeTotalBalance = snowglobeData.balance;
        if (snowglobeTotalBalance > 0) {
          snowglobeRatio = snowglobeData.getRatio;
        } else {
          snowglobeRatio = floatToBN(1, 18);
        }
        if (userBalanceSnowglobe.gt('0x0') && userLPBalance.eq('0x0')) {
          userLPBalance = userLPBalance.add(userBalanceSnowglobe);
        }
        userDepositedLP = BNToFloat(userBalanceSnowglobe, lpDecimals) * BNToFloat(snowglobeRatio, 18);

        if (!isEmpty(gauge)) {
          userDepositedLP += (gauge.staked / 10 ** lpDecimals) * BNToFloat(snowglobeRatio, 18);
        }

        if (userDepositedLP > 0 && item.token1.address) {
          let reserves = lpData.getReserves;
          let totalSupplyPGL = BNToFloat(lpData.totalSupply, 18);

          const r0 = BNToFloat(reserves[0], item.token0.decimals);
          const r1 = BNToFloat(reserves[1], item.token1.decimals);
          let reserve0Owned = (userDepositedLP * r0) / totalSupplyPGL;
          let reserve1Owned = (userDepositedLP * r1) / totalSupplyPGL;
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
            },
          };
        }
        break;
      case 'Stablevault':
        if (!isEmpty(gauge)) {
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
      usdValue: userDepositedLP * item.pricePoolToken,
      totalSupply,
      SNOBHarvestable,
      SNOBValue,
      underlyingTokens,
      userBalanceSnowglobe,
      userBalanceGauge: gauge ? gauge.staked : 0,
      snowglobeRatio,
    };
  };

  const getBalanceInfosAllPools = async gauges => {
    setLoading(true);
    try {
      let poolsCalls = [];
      pools.forEach(item => {
        poolsCalls = poolsCalls.concat(getPoolCalls(item, account));
      });
      const poolsData = await getMultiContractData(provider, poolsCalls);

      const poolInfo = pools.map(item => generatePoolInfo(item, gauges, poolsData));

      setUserPools(poolInfo);
    } catch (error) {
      console.log('[Error] getBalanceInfosAllPools => ', error);
    }
    setLoading(false);
  };

  const getBalanceInfoSinglePool = async poolAddress => {
    if (!account || isEmpty(gauges)) {
      return;
    }
    try {
      let givenPool = pools.find(pool => {
        return pool.address.toLowerCase() === poolAddress.toLowerCase();
      });

      //update gauge state
      const gaugeCalls = getGaugeCalls(givenPool, account);
      const gaugeData = await getMultiContractData(provider, gaugeCalls);
      const gaugeInfo = await retrieveGauge(givenPool, gaugeData);

      const poolCalls = getPoolCalls(givenPool, account);
      const poolData = await getMultiContractData(provider, poolCalls);

      //update token Balance
      let tokenCalls;
      if (givenPool.token1.address) {
        tokenCalls = getTokensBalance([givenPool.token0.address, givenPool.token1.address], account);
      } else {
        tokenCalls = getTokensBalance([givenPool.token0.address], account);
      }

      const tokenData = await getMultiContractData(provider, tokenCalls);

      //update user pool state
      let poolInfo = generatePoolInfo(givenPool, [gaugeInfo], poolData, tokenData);

      poolInfo.token0Balance = tokenData[poolInfo.token0.address].balanceOftoken0;
      if (poolInfo.token1.address) {
        poolInfo.token1Balance = tokenData[poolInfo.token1.address].balanceOftoken1;
      }

      getBalanceInfo();

      return poolInfo;
    } catch (error) {
      console.log('[Error] getBalanceInfosSinglePool => ', error);
    }
  };

  const _approve = async (contract, spender, amount) => {
    return new Promise(async (resolve, reject) => {
      try {
        const allowance = await contract.allowance(account, spender);
        if (amount.gt(allowance)) {
          let useExact = false;
          await contract.estimateGas.approve(spender, ethers.constants.MaxUint256).catch(error => {
            // general fallback for tokens who restrict approval amounts
            console.log(error);
            useExact = true;
          });
          const approval = await contract.approve(spender, useExact ? ethers.constants.MaxUint256 : amount);
          const transactionApprove = await approval.wait(1);
          if (!transactionApprove.status) {
            setPopUp({
              title: 'Transaction Error',
              text: `Error Approving`,
            });
            reject(false);
          }
        }
        resolve(true);
        analytics.trackEvent(createEvent({
          category: AnalyticCategories.wallet,
          action: AnalyticActions.approve,
          name: `${amount}`,
        }))
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  };

  const approve = async (item, amount, addressFromZapper, onlyGauge = false, infiniteApproval = true) => {
    if (!account) {
      setPopUp({
        title: 'Network Error',
        icon: ANIMATIONS.WARNING.VALUE,
        text: MESSAGES.METAMASK_NOT_CONNECTED,
      });
    }
    setIsTransacting({ approve: true });
    try {
      if (item.kind === 'Stablevault') {
        const vaultContract = new ethers.Contract(item.address, ERC20_ABI, library.getSigner());
        const gauge = gauges.find(gauge => gauge.address.toLowerCase() === item.gaugeInfo.address.toLowerCase());
        await _approve(vaultContract, gauge.address, amount);
        setIsTransacting({ approve: false });
        setTransactionStatus({ approvalStep: 2, depositStep: 0, withdrawStep: 0 });
        return true;
      }

      const snowglobeContract = new ethers.Contract(item.address, SNOWGLOBE_ABI, library.getSigner());
      const gauge = gauges.find(gauge => gauge.address.toLowerCase() === item.gaugeInfo.address.toLowerCase());

      let snowglobeRatio;
      try {
        snowglobeRatio = await snowglobeContract.getRatio();
        snowglobeRatio = snowglobeRatio.add(ethers.utils.parseUnits('0.1'));
      } catch (error) {
        snowglobeRatio = ethers.utils.parseUnits('1.1');
      }
      if (!onlyGauge) {
        const lpContract = new ethers.Contract(addressFromZapper ?? item.lpAddress, ERC20_ABI, library.getSigner());
        const spender = addressFromZapper ? getZapperContract(item) : snowglobeContract.address;

        await approveContractAction({ contract: lpContract, spender, account, amount, infiniteApproval });
      }
      setTransactionStatus({ approvalStep: 1, depositStep: 0, withdrawStep: 0 });

      await approveContractAction({ contract: snowglobeContract, spender: gauge.address, account, amount: amount.mul(snowglobeRatio), infiniteApproval });
      setTransactionStatus({ approvalStep: 2, depositStep: 0, withdrawStep: 0 });
      setIsTransacting({ approve: false });
      return true;
    } catch (error) {
      setPopUp({
        title: 'Transaction Error',
        icon: ANIMATIONS.ERROR.VALUE,
        text: `Error Approving: ${error.message}`,
      });
      console.log(error);
    }
    setIsTransacting({ approve: false });
  };

  const zapIntoSnowglobe = async (amount, baseTokenAddress, item, isNativeAVAX, zapperSlippage) => {
    const zapperAddress = getZapperContract(item);
    const zappersContract = new ethers.Contract(zapperAddress, SNOWGLOBE_ZAPPERS_ABI, library.getSigner());
    if(!isNativeAVAX){ 
      const estimateSwap = await zappersContract.estimateSwap(item.address, baseTokenAddress, amount);

      const amountMinToken = estimateSwap.swapAmountOut.sub(estimateSwap.swapAmountOut.div(100).mul(zapperSlippage));

      const zapTx = await zappersContract.zapIn(item.address, amountMinToken, baseTokenAddress, amount);
      return zapTx;
    } else { 
      //if the pair uses WAVAX we want to go through it because it costs less gas!!
      let hasWAVAX, WAVAXPos;
      if(item.token0.address === WAVAX) {
        hasWAVAX = true;
        WAVAXPos = 0;
      } else if (item.token1.address === WAVAX) {
        hasWAVAX = true;
        WAVAXPos = 1;
      }

      if(hasWAVAX){
        const estimateSwap = await zappersContract.estimateSwap(item.address, item[`token${WAVAXPos}`].address, amount);

        //1% slippage
        const amountMinToken = estimateSwap.swapAmountOut.sub(estimateSwap.swapAmountOut.div(100).mul(zapperSlippage));

        const zapTx = await zappersContract.zapInAVAX(item.address, amountMinToken, WAVAX, {value: amount});
        return zapTx;
      } else {
        let routerAddress;
        switch(item.source) {
          case "Trader Joe": case "Axial":
            routerAddress = CONTRACTS.ROUTER_TRADERJOE;
            break;
          case "Pangolin":
            routerAddress = CONTRACTS.ROUTER_PANGOLIN;
            break;
          default:
            throw new Error("Router not found for this pool");
        }
        //simulate a swap between WAVAX and TOKEN0 to know how much it is worth
        const routerContract = new ethers.Contract(routerAddress,AMM_ROUTER_ABI,library.getSigner());

        const  [, amountOut] = await routerContract.getAmountsOut(amount,[WAVAX, item.token0.address]);

        const amountMinToken = amountOut.sub(amountOut.div(100).mul(zapperSlippage));
        
        const zapTx = await zappersContract.zapInAVAX(item.address, amountMinToken, item.token0.address, {value: amount});
        
        return zapTx;
      }
    }
  }

  const deposit = async (
      item,
      amount,
      addressFromZapper, 
      onlyGauge = false, 
      isNativeAVAX = false, 
      zapperSlippage = 1
    ) => {
    if (!account) {
      setPopUp({
        title: 'Network Error',
        icon: ANIMATIONS.WARNING.VALUE,
        text: MESSAGES.METAMASK_NOT_CONNECTED,
      });
      return false;
    }

    let gaugeDeposit;
    setIsTransacting({ deposit: true });
    try {    
      //We want to go straight for the zapper
      if(addressFromZapper) {
        gaugeDeposit = await zapIntoSnowglobe(
          amount, addressFromZapper, item, addressFromZapper === "0x0", zapperSlippage
        );
      } else if (transactionStatus.depositStep === 0) {
        if (item.kind === 'Snowglobe') {
          //if this deposit is native we need to wrap it
          if(isNativeAVAX) {
            const wrapped = await wrapAVAX(amount, library.getSigner());
            if(!wrapped){
              setPopUp({
                title: 'Transaction Error',
                icon: ANIMATIONS.ERROR.VALUE,
                text: `Error wrapping AVAX`,
              });
              return;
            }
          }

          const lpContract = new ethers.Contract(item.lpAddress, ERC20_ABI, library.getSigner());
          const snowglobeContract = new ethers.Contract(item.address, SNOWGLOBE_ABI, library.getSigner());

          const balance = await getBalanceWithRetry(lpContract, account);
          amount = amount.gt(balance) ? balance : amount;

          if (amount.gt(0x00) && !onlyGauge) {
            const snowglobeDeposit = await snowglobeContract.deposit(amount);
            const transactionSnowglobeDeposit = await snowglobeDeposit.wait(1);
            if (!transactionSnowglobeDeposit.status) {
              setPopUp({
                title: 'Transaction Error',
                icon: ANIMATIONS.ERROR.VALUE,
                text: `Error depositing into Snowglobe`,
              });
              return;
            }
          }
          setTransactionStatus({ approvalStep: 2, depositStep: 1, withdrawStep: 0 });
        } else {
          const tokenContract = new ethers.Contract(item.address, ERC20_ABI, library.getSigner());

          const balance = await tokenContract.balanceOf(account);
          amount = amount.gt(balance) ? balance : amount;
        }
      }

      const gauge = gauges.find(gauge => gauge.address.toLowerCase() === item.gaugeInfo.address.toLowerCase());
      const gaugeContract = new ethers.Contract(gauge.address, GAUGE_ABI, library.getSigner());

      if(!addressFromZapper){
        gaugeDeposit = item.kind === 'Snowglobe' 
          ? await gaugeContract.depositAll()
          : gaugeDeposit = await gaugeContract.deposit(amount);
      }

      const transactionGaugeDeposit = await gaugeDeposit.wait(1);
      if (!transactionGaugeDeposit.status) {
        setPopUp({
          title: 'Transaction Error',
          icon: ANIMATIONS.ERROR.VALUE,
          text: `Error depositing into Gauge`,
        });
        return;
      } else {
        const linkTx = getLink(
          `${AVALANCHE_MAINNET_PARAMS.blockExplorerUrls[0]}tx/${transactionGaugeDeposit.transactionHash}`,
          'Check on Snowtrace.',
        );
        setPopUp({
          title: 'Deposit Complete',
          icon: ANIMATIONS.SUCCESS.VALUE,
          text: linkTx,
        });
      }
      setTransactionStatus({ approvalStep: 2, depositStep: 2, withdrawStep: 0 });
      //refresh data only after 2sec to our node have time to catch up with network
      setTimeout(async () => {
        setTransactionUpdateLoading(true);
        await getBalanceInfosAllPools(await getGaugeProxyInfo());
        setTransactionUpdateLoading(false);
        setSortedUserPools(false);
      }, 2000);
    } catch (error) {
      if(transactionStatus.depositStep >= 0) {
        addPartialInvestment({ isFixMyPool: true, buttonText: 'Fix my pool', fromContext: true });
      }
      setPopUp({
        title: 'Transaction Error',
        icon: ANIMATIONS.ERROR.VALUE,
        text: `Error Depositing: ${error.message}`,
      });
    }
    setIsTransacting({ deposit: false });
  };

  const calculateSwapAmountOut = async (useAVAX, amount, item, selectedToken) => {
    if(amount <= 0 || amount.eq("0x0")){
      return {
        [item.token0.address]: {
          amount:ethers.BigNumber.from(0),
          reserve:ethers.BigNumber.from(0)
        },
        [item.token1.address]: {
          amount:ethers.BigNumber.from(0),
          reserve:ethers.BigNumber.from(0)
        }
      }
    }

    let routerAddress;
    switch(item.source) {
      case "Trader Joe": case "Axial":
        routerAddress = CONTRACTS.ROUTER_TRADERJOE;
        break;
      case "Pangolin":
        routerAddress = CONTRACTS.ROUTER_PANGOLIN;
        break;
      default:
        throw new Error("Router not found for this pool");
    }

    const routerContract = new ethers.Contract(routerAddress,AMM_ROUTER_ABI,library.getSigner());

    //we need to get the reserves of this tokens to calculate the price impact
    const lpContract = new ethers.Contract(item.lpAddress, LP_TOKEN_ABI, library.getSigner());
    const reserves = await lpContract.getReserves();

    let baseToken, swappedToken, amountToSwap, baseReserve, swappedReserve
    
    if(useAVAX){
      let hasWAVAX, otherTokenPos;
      if(item.token0.address.toLowerCase() === WAVAX.toLowerCase()) {
        hasWAVAX = true;
        otherTokenPos = 1;
      } else if (item.token1.address.toLowerCase() === WAVAX.toLowerCase()) {
        hasWAVAX = true;
        otherTokenPos = 0;
      }
      
      if(hasWAVAX){
        baseToken = WAVAX;
        baseReserve = otherTokenPos === 0 ? reserves._reserve1 : reserves._reserve0;
        swappedReserve = otherTokenPos === 0 ? reserves._reserve0 : reserves._reserve1;
        swappedToken = item[`token${otherTokenPos}`].address;
        amountToSwap = amount;
      } else {
        try {
          [, amountToSwap] = await routerContract.getAmountsOut(amount,[WAVAX, item.token0.address]);
          baseToken = item.token0.address;
          swappedToken = item.token1.address;
          baseReserve = reserves._reserve0;
          swappedReserve = reserves._reserve1;
        } catch (error) {
          //if there`s no path WAVAX/TOKEN0 we try token1
          [, amountToSwap] = await routerContract.getAmountsOut(amount,[WAVAX, item.token1.address]);
          baseToken = item.token1.address;
          swappedToken = item.token0.address;
          baseReserve = reserves._reserve1;
          swappedReserve = reserves._reserve0;
        }
      }
    } else {
      if(item.token0.address === selectedToken.address) {
        baseToken = item.token0.address;
        swappedToken = item.token1.address;
        baseReserve = reserves._reserve0;
        swappedReserve = reserves._reserve1; 
      } else if (item.token1.address === selectedToken.address){
        baseToken = item.token1.address;
        swappedToken = item.token0.address;
        baseReserve = reserves._reserve1;
        swappedReserve = reserves._reserve0;
      }
      amountToSwap = amount;
    }
    const [, estimateSwap] = await routerContract.getAmountsOut(amountToSwap.div(2), [baseToken, swappedToken]);
    return {
      [baseToken]: {
        amount:amountToSwap.div(2),
        reserve:baseReserve
      },
      [swappedToken]: {
        amount:estimateSwap,
        reserve:swappedReserve
      }
    }
  }

  const withdraw = async (item, amount = 0, allowClaim = undefined) => {
    if (!account) {
      setPopUp({
        title: 'Network Error',
        icon: ANIMATIONS.WARNING.VALUE,
        text: MESSAGES.METAMASK_NOT_CONNECTED,
      });
      return;
    }

    const prevWithdrawStep = transactionStatus.withdrawStep;
    setIsTransacting({ withdraw: true, pageview: true });

    try {
      const gaugeContract = new ethers.Contract(item.gaugeInfo.address, GAUGE_ABI, library.getSigner());
      const gaugeBalance = await gaugeContract.balanceOf(account);
      if (gaugeBalance.gt(0x00)) {
        if (prevWithdrawStep < 1) {
          const gaugeWithdraw = await gaugeContract.withdraw(amount > 0 ? amount : gaugeBalance);
          const transactionGaugeWithdraw = await gaugeWithdraw.wait(1);
          setTransactionStatus({ approvalStep: 0, depositStep: 0, withdrawStep: 1 });
          if (!transactionGaugeWithdraw.status) {
            setPopUp({
              title: 'Transaction Error',
              icon: ANIMATIONS.ERROR.VALUE,
              text: `Error withdrawing from Gauge`,
            });
            setIsTransacting({ withdraw: false, pageview: false });
            return;
          }

          if (item.kind === 'Stablevault') {
            const linkTx = getLink(
              `${AVALANCHE_MAINNET_PARAMS.blockExplorerUrls[0]}tx/${transactionGaugeWithdraw.transactionHash}`,
              'Check on Snowtrace.',
            );
            setPopUp({
              title: 'Withdraw Complete',
              icon: ANIMATIONS.SUCCESS.VALUE,
              text: linkTx,
            });
            setTransactionStatus({ approvalStep: 0, depositStep: 0, withdrawStep: 2 });
            if (item.deprecatedPool) {
              item.withdrew = true;
            } else {
              if (prevWithdrawStep < 1) {
                await claim(item, true);
                setTransactionStatus({ approvalStep: 0, depositStep: 0, withdrawStep: 3 });
                //refresh data only after 2sec to our node have time to catch up with network
                setTimeout(async () => {
                  setTransactionUpdateLoading(true);
                  await getBalanceInfosAllPools(await getGaugeProxyInfo());
                  setTransactionUpdateLoading(false);
                  setSortedUserPools(false);
                }, 2000);
              }
            }
          }
        }
      }

      if (item.kind === 'Snowglobe') {
        const snowglobeContract = new ethers.Contract(item.address, SNOWGLOBE_ABI, library.getSigner());

        const snowglobeBalance = await getBalanceWithRetry(snowglobeContract, account);

        let snowglobeWithdraw;
        //if the node is falling behind uses withdrawAll instead
        //we don`t want to call withdrawAll directly because it can fail at dust amounts
        if (snowglobeBalance.gt(0x00)) {
          snowglobeWithdraw = await snowglobeContract.withdraw(amount > 0 ? amount : snowglobeBalance);
        } else {
          snowglobeWithdraw = await snowglobeContract.withdrawAll();
        }

        if (prevWithdrawStep < 2) {
          const transactionSnowglobeWithdraw = await snowglobeWithdraw.wait(1);

          if (!transactionSnowglobeWithdraw.status) {
            setPopUp({
              title: 'Transaction Error',
              icon: ANIMATIONS.ERROR.VALUE,
              text: `Error withdrawing from Snowglobe`,
            });
            return;
          }
          const linkTx = getLink(
            `${AVALANCHE_MAINNET_PARAMS.blockExplorerUrls[0]}tx/${transactionSnowglobeWithdraw.transactionHash}`,
            'Check on Snowtrace.',
          );
          setPopUp({
            title: 'Withdraw Complete',
            icon: ANIMATIONS.SUCCESS.VALUE,
            text: linkTx,
          });
          setTransactionStatus({ approvalStep: 0, depositStep: 0, withdrawStep: 2 });
        }

        try {
          if (item.deprecatedPool) {
            item.withdrew = true;
          } 
          
            if (allowClaim) {
              await claim(item, true);
              setTransactionStatus({ approvalStep: 0, depositStep: 0, withdrawStep: 3 });
            }
            //refresh data only after 2sec to our node have time to catch up with network
            setTimeout(async () => {
              setTransactionUpdateLoading(true);
              await getBalanceInfosAllPools(await getGaugeProxyInfo());
              setTransactionUpdateLoading(false);
              setSortedUserPools(false);
            }, 2000);
          
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      if (error.code == 4001) {
        setPopUp({
          title: 'Rejected',
          icon: ANIMATIONS.ERROR.VALUE,
          text: `You rejected this withdrawal`,
        });
      } else {
        setPopUp({
          title: 'Transaction Error',
          icon: ANIMATIONS.ERROR.VALUE,
          text: `Error withdrawing`,
        });
      }
      console.log(error);
    }
    setIsTransacting({ withdraw: false, pageview: false });
  };

  const claim = async (item, withdraw = false) => {
    if (!account || !gauges) {
      setPopUp({
        title: 'Network Error',
        icon: ANIMATIONS.WARNING.VALUE,
        text: MESSAGES.METAMASK_NOT_CONNECTED,
      });
      return;
    }

    if (item.SNOBHarvestable <= 0) {
      return;
    }

    setIsTransacting({ pageview: true, withdraw: true });
    try {
      const gaugeContract = new ethers.Contract(item.gaugeInfo.address, GAUGE_ABI, library.getSigner());

      const gaugeReward = await gaugeContract.getReward();
      const transactionReward = await gaugeReward.wait(1);
      if (transactionReward.status) {
        const linkTx = getLink(
          `${AVALANCHE_MAINNET_PARAMS.blockExplorerUrls[0]}tx/${transactionReward.transactionHash}`,
          'Check on Snowtrace.',
        );
        setPopUp({
          title: 'Claim Complete',
          icon: ANIMATIONS.SUCCESS.VALUE,
          text: linkTx,
        });
        if (item.deprecatedPool) {
          item.claimed = true;
        }
      } else {
        setPopUp({
          title: 'Claim Error',
          icon: ANIMATIONS.ERROR.VALUE,
          text: `Error claiming from Gauge`,
        });
      }
    } catch (error) {
      setPopUp({
        title: 'Claim Error',
        icon: ANIMATIONS.ERROR.VALUE,
        text: `Error claiming from Gauge ${error.message}`,
      });
    }
    if (!withdraw) {
      setIsTransacting({ pageview: false });
    }
  };

  return (
    <CompoundAndEarnContext.Provider
      value={{
        loading,
        isTransacting,
        transactionUpdateLoading,
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
        setUserPools,
        getBalanceInfosAllPools,
        calculateSwapAmountOut,
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
    transactionUpdateLoading,
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
    setUserPools,
    getBalanceInfosAllPools,
    calculateSwapAmountOut,
  } = context;

  return {
    loading,
    isTransacting,
    transactionUpdateLoading,
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
    setUserPools,
    getBalanceInfosAllPools,
    calculateSwapAmountOut,
  };
}
