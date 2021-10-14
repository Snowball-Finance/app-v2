import { createContext, useState, useContext, useMemo, useEffect } from 'react'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { toast } from 'react-toastify';

import { parseEther } from 'ethers/lib/utils'
import { isEmpty } from 'utils/helpers/utility'
import { getEpochSecondForDay } from 'utils/helpers/date'
import { BNToFloat, BNToString } from 'utils/helpers/format'
import GAUGE_TOKEN_ABI from 'libs/abis/gauge-token.json'
import GAUGE_ABI from 'libs/abis/gauge.json';
import { CONTRACTS } from 'config'
import GAUGE_PROXY_ABI from 'libs/abis/gauge-proxy.json'
import SNOWBALL_ABI from 'libs/abis/snowball.json'
import SNOWCONE_ABI from 'libs/abis/snowcone.json'
import FEE_DISTRIBUTOR_ABI from 'libs/abis/fee-distributor.json'
import { usePrices } from 'contexts/price-context'
import { useAPIContext } from './api-context'
import { useProvider } from './provider-context'
import Toast from 'components/Toast';

const ContractContext = createContext(null)

export function StakingContractProvider({ children }) {
  const { provider } = useProvider();
  const { library,account } = useWeb3React();
  const { prices } = usePrices();
  const { getLastSnowballInfo } = useAPIContext();
  const { data: { LastSnowballInfo: { poolsInfo: pools = [] } = {} } = {} } = getLastSnowballInfo();

  const [loading, setLoading] = useState(false);
  const [gauges, setGauges] = useState([]);
  const [snowballBalance, setSnowballBalance] = useState(0);
  const [lockedAmount, setLockedAmount] = useState();
  const [lockEndDate, setLockEndDate] = useState();
  const [snowconeBalance, setSnowconeBalance] = useState();
  const [totalSupply, setTotalSupply] = useState(0);
  const [totalLocked, setTotalLocked] = useState(0);
  const [userClaimable, setUserClaimable] = useState(0);
  const [userSherpaClaimable, setUserSherpaClaimable] = useState(0);

  const gaugeProxyContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.GAUGE_PROXYV2, GAUGE_PROXY_ABI, provider) : null, [library,provider])
  const snowballContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.SNOWBALL, SNOWBALL_ABI, provider) : null, [library,provider])
  const snowconeContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.SNOWCONE, SNOWCONE_ABI, provider) : null, [library,provider])
  const feeDistributorContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.FEE_DISTRIBUTOR, FEE_DISTRIBUTOR_ABI, library.getSigner()) : null, [library])
  const sherpaDistributorContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.SHERPA_FEE_DISTRIBUTOR, FEE_DISTRIBUTOR_ABI, library.getSigner()) : null, [library])
  const lockedValue = useMemo(() => prices.SNOB * BNToFloat(totalSupply), [prices?.SNOB, totalSupply])
  const totalSnowballValue = useMemo(() => prices.SNOB *BNToFloat(totalLocked), [prices?.SNOB, totalLocked])
  const unlockTime = useMemo(() => {
    const date = new Date()
    return date.setTime(+(lockEndDate?.toString() || 0) * 1000)
  }, [lockEndDate])
  const isLocked = useMemo(() => Boolean(+(lockEndDate?.toString() || 0)), [lockEndDate])
  const isExpired = useMemo(() => unlockTime < new Date(), [unlockTime]);

  useEffect(() => {
    if (!isEmpty(feeDistributorContract) && !isEmpty(sherpaDistributorContract)) {
      getFeeDistributorInfo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feeDistributorContract,sherpaDistributorContract])

  useEffect(() => {
    if (!isEmpty(gaugeProxyContract) && (!isEmpty(pools)) && provider) {
      getGaugeProxyInfo();
    }

    if (isEmpty(account)) {
      setGauges([])
    }

    if (!isEmpty(snowballContract) && provider) {
      getSnowballInfo()
    }

    if (!isEmpty(snowconeContract) && provider) {
      getSnowconeInfo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gaugeProxyContract, account, pools, snowballContract, snowconeContract, provider]);

  const getFeeDistributorInfo = async () => {
    try {
      const userClaimable = await feeDistributorContract.callStatic['claim(address)'](account, { gasLimit: 1000000 })
      setUserClaimable(userClaimable.toString() ? userClaimable : null);

      const sherpaClaimable = await sherpaDistributorContract.callStatic['claim(address)'](account, { gasLimit: 1000000 })
      setUserSherpaClaimable(sherpaClaimable.toString() ? sherpaClaimable : null);
    } catch (error) {
      console.log('[Error] getFeeDistributorInfo => ', error)
    }
  }

  const claim = async () => {
    setLoading(true)
    try {
      const gasLimit = await feeDistributorContract.estimateGas['claim()']();
      const tokenClaim = await feeDistributorContract['claim()']({ gasLimit });
      const transactionClaim = await tokenClaim.wait(1)

      if (transactionClaim.status) {
        await getFeeDistributorInfo();
      }
    } catch (error) {
      console.log('[Error] claim => ', error)
    }
    setLoading(false)
  }

  const sherpaClaim = async () => {
    setLoading(true)
    try {
      const gasLimit = await sherpaDistributorContract.estimateGas['claim()']();
      const tokenClaim = await sherpaDistributorContract['claim()']({ gasLimit });
      const transactionClaim = await tokenClaim.wait(1)

      if (transactionClaim.status) {
        await getFeeDistributorInfo();
      }
    } catch (error) {
      console.log('[Error] sherpaClaim => ', error)
    }
    setLoading(false)
  }

  const retrieveGauge = async (pool, totalWeight) => {
    if(!totalWeight){
      totalWeight = await gaugeProxyContract.totalWeight();
    }
    const gaugeTokenContract = new ethers.Contract(pool.address, GAUGE_TOKEN_ABI, library.getSigner())
    const gaugeContract = new ethers.Contract(pool.gaugeInfo.address, GAUGE_ABI, library.getSigner())

    const address = pool.gaugeInfo.address;
    const balance = await gaugeTokenContract.balanceOf(account);
    const staked = await gaugeContract.balanceOf(account);
    const harvestable = await gaugeContract.earned(account);
    const totalSupply = await gaugeContract.totalSupply();
    const gauge = pool;
    const fullApy = 0;

    return {
      token:pool.address,
      address,
      gaugeAddress: address,
      gaugeTokenContract,
      totalWeight: +totalWeight.toString(),
      totalSupply,
      balance,
      staked,
      harvestable,
      depositTokenName: `${gauge?.kind === 'Snowglobe' ? gauge?.symbol + '-' : ''}` +
        `${gauge?.name}` || 'No Name',
      poolName: `${gauge?.kind === 'Snowglobe' ? gauge?.symbol + '-' : ''}` +
        `${gauge?.name || 'No Name'} Pool`,
      fullApy,
    }
  }

  const getGaugeProxyInfo = async () => {
    try {
      const totalWeight = await gaugeProxyContract.totalWeight();

      const gauges = await Promise.all(
        pools.map(async (pool) => {
          return await retrieveGauge(pool, totalWeight);
        })
      );
      setGauges(gauges);
      return gauges;
    } catch (error) {
      console.log('[Error] gaugeProxyContract => ', error)
    }
  }

  const voteFarms = async (tokens, weights) => {
    setLoading(true)
    try {
      const weightsData = weights.map((weight) => ethers.BigNumber.from(weight));
      const gaugeProxyVoteContract = new ethers.Contract(CONTRACTS.GAUGE_PROXYV2, GAUGE_PROXY_ABI, library.getSigner());
      const gasLimit = await gaugeProxyVoteContract.estimateGas.vote(tokens, weightsData)
      const tokenVote = await gaugeProxyVoteContract.vote(tokens, weightsData, { gasLimit })
      const transactionVote = await tokenVote.wait(1)

      if (transactionVote.status) {
        await getGaugeProxyInfo()
      }
    } catch (error) {
      console.log('[Error] vote => ', error)
    }
    setLoading(false)
  }

  const getSnowballInfo = async () => {
    try {
      const latestSnowballBalance = await snowballContract.balanceOf(account);
      const snowballBalance = BNToString(latestSnowballBalance, 18);
      setSnowballBalance(snowballBalance);
    } catch (error) {
      console.log('[Error] snowballContract => ', error)
    }
  }

  const getSnowconeInfo = async () => {
    try {
      const [
        lockStats,
        snowconeBalance,
        totalSupply,
        totalLocked,
      ] = await Promise.all([
        snowconeContract.locked(account, { gasLimit: 1000000 }),
        snowconeContract['balanceOf(address)'](account, { gasLimit: 1000000 }),
        snowconeContract['totalSupply()']({ gasLimit: 1000000 }),
        snowconeContract['supply()']({ gasLimit: 1000000 }),
      ]);

      setLockedAmount(lockStats?.amount);
      setLockEndDate(lockStats?.end);
      setSnowconeBalance(snowconeBalance);
      setTotalSupply(totalSupply);
      setTotalLocked(totalLocked);
    } catch (error) {
      console.log('[Error] getSnowconeInfo => ', error)
    }
  }

  const createLock = async (data) => {
    setLoading(true)
    try {
      const { balance, date } = data
      const amount = parseEther((balance).toString());
      const snowballContractApprove = new ethers.Contract(CONTRACTS.SNOWBALL, SNOWBALL_ABI, library.getSigner());
      const tokenApprove = await snowballContractApprove.approve(CONTRACTS.SNOWCONE, ethers.constants.MaxUint256);
      const transactionApprove = await tokenApprove.wait(1)
      if (!transactionApprove.status) {
        setLoading(false)
        return;
      }

      const lockedDate = getEpochSecondForDay(new Date(date))
      const snowconeContractLock = new ethers.Contract(CONTRACTS.SNOWCONE, SNOWCONE_ABI, library.getSigner());
      const gasLimit = await snowconeContractLock.estimateGas.create_lock(amount, lockedDate);
      const tokenLock = await snowconeContractLock.create_lock(amount, lockedDate, { gasLimit });
      const transactionLock = await tokenLock.wait(1)

      if (transactionLock.status) {
        await getSnowballInfo();
        await getSnowconeInfo();
      }
    } catch (error) {
      console.log('[Error] createLock => ', error)
    }
    setLoading(false)
  }

  const increaseAmount = async (data) => {
    setLoading(true)
    try {
      const amount = parseEther((data.balance).toString());
      const snowballContractApprove = new ethers.Contract(CONTRACTS.SNOWBALL, SNOWBALL_ABI, library.getSigner());
      const allowance = await snowballContractApprove.allowance(account, CONTRACTS.SNOWCONE);
      if(amount.gt(allowance)) {
        const tokenApprove = await snowballContractApprove.approve(CONTRACTS.SNOWCONE, ethers.constants.MaxUint256);
        toast(<Toast message={'Waiting for approval...'} toastType={'processing'}/>);
        const transactionApprove = await tokenApprove.wait(1)
        if (!transactionApprove.status) {
          setLoading(false)
          return;
        }
      }

      const snowconeContractIncrease = new ethers.Contract(CONTRACTS.SNOWCONE, SNOWCONE_ABI, library.getSigner());
      const gasLimit = await snowconeContractIncrease.estimateGas.increase_amount(amount);
      const tokenIncrease = await snowconeContractIncrease.increase_amount(amount, { gasLimit });
      const transactionIncrease = await tokenIncrease.wait(1)

      if (transactionIncrease.status) {
        await getSnowballInfo();
        await getSnowconeInfo();
      }
    } catch (error) {
      console.log('[Error] increaseAmount => ', error)
    }
    setLoading(false)
  }

  const increaseTime = async (data) => {
    setLoading(true)
    try {
      const lockedDate = getEpochSecondForDay(new Date(data.date));
      console.log(lockedDate);
      const snowconeContractTime = new ethers.Contract(CONTRACTS.SNOWCONE, SNOWCONE_ABI, library.getSigner());
      const gasLimit = await snowconeContractTime.estimateGas.increase_unlock_time(lockedDate);
      const tokenIncrease = await snowconeContractTime.increase_unlock_time(lockedDate, { gasLimit });
      const transactionIncrease = await tokenIncrease.wait(1)

      if (transactionIncrease.status) {
        await getSnowballInfo();
        await getSnowconeInfo();
      }
    } catch (error) {
      console.log('[Error] increaseTime => ', error)
    }
    setLoading(false)
  }

  const withdraw = async () => {
    setLoading(true)
    try {
      const snowconeContractWithdraw = new ethers.Contract(CONTRACTS.SNOWCONE, SNOWCONE_ABI, library.getSigner());
      const gasLimit = await snowconeContractWithdraw.estimateGas.withdraw();
      const tokenWithdraw = await snowconeContractWithdraw.withdraw({ gasLimit });
      const transactionWithdraw = await tokenWithdraw.wait(1)

      if (transactionWithdraw.status) {
        await getSnowballInfo();
        await getSnowconeInfo();
      }
    } catch (error) {
      console.log('[Error] withdraw => ', error)
    }
    setLoading(false)
  }

  return (
    <ContractContext.Provider
      value={{
        loading,
        prices,
        snowballBalance,
        snowconeBalance,
        lockedAmount,
        lockEndDate,
        totalSupply,
        totalLocked,
        lockedValue,
        totalSnowballValue,
        unlockTime,
        isLocked,
        isExpired,
        gauges,
        userClaimable,
        claim,
        createLock,
        increaseAmount,
        increaseTime,
        withdraw,
        voteFarms,
        retrieveGauge,
        setGauges,
        userSherpaClaimable,
        sherpaClaim,
        gaugeProxyContract,
        getGaugeProxyInfo
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}

export function useStakingContract() {
  const context = useContext(ContractContext)
  if (!context) {
    throw new Error('Context not initialized yet!')
  }

  const {
    loading,
    prices,
    snowballBalance,
    snowconeBalance,
    lockedAmount,
    lockEndDate,
    totalSupply,
    totalLocked,
    lockedValue,
    totalSnowballValue,
    unlockTime,
    isLocked,
    isExpired,
    gauges,
    userClaimable,
    claim,
    createLock,
    increaseAmount,
    increaseTime,
    withdraw,
    voteFarms,
    retrieveGauge,
    setGauges,
    userSherpaClaimable,
    sherpaClaim,
    gaugeProxyContract,
    getGaugeProxyInfo
  } = context

  return {
    loading,
    prices,
    snowballBalance,
    snowconeBalance,
    lockedAmount,
    lockEndDate,
    totalSupply,
    totalLocked,
    lockedValue,
    totalSnowballValue,
    unlockTime,
    isLocked,
    isExpired,
    gauges,
    userClaimable,
    claim,
    createLock,
    increaseAmount,
    increaseTime,
    withdraw,
    voteFarms,
    retrieveGauge,
    setGauges,
    userSherpaClaimable,
    sherpaClaim,
    gaugeProxyContract,
    getGaugeProxyInfo
  }
}
