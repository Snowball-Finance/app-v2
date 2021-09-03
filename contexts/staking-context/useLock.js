import { useState, useEffect, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { parseEther } from 'ethers/lib/utils'

import { CONTRACTS } from 'config'
import { isEmpty } from 'utils/helpers/utility'
import { getEpochSecondForDay } from 'utils/helpers/date'
import { BNToFloat, BNToString } from 'utils/helpers/format'
import SNOWCONE_ABI from 'libs/abis/snowcone.json'
import SNOWBALL_ABI from 'libs/abis/snowball.json'

const useLock = ({
  prices,
  setLoading,
  snowballContract,
  snowconeContract
}) => {
  const { account, library } = useWeb3React();

  const [snowballBalance, setSnowballBalance] = useState(0);
  const [lockedAmount, setLockedAmount] = useState();
  const [lockEndDate, setLockEndDate] = useState();
  const [snowconeBalance, setSnowconeBalance] = useState();
  const [totalSupply, setTotalSupply] = useState(0);
  const [totalLocked, setTotalLocked] = useState(0);

  const lockedValue = useMemo(() => prices.SNOB * BNToFloat(totalSupply), [prices?.SNOB, totalSupply])
  const totalSnowballValue = useMemo(() => prices.SNOB *BNToFloat(totalLocked), [prices?.SNOB, totalLocked])
  const unlockTime = useMemo(() => {
    const date = new Date()
    return date.setTime(+(lockEndDate?.toString() || 0) * 1000)
  }, [lockEndDate])
  const isLocked = useMemo(() => Boolean(+(lockEndDate?.toString() || 0)), [lockEndDate])
  const isExpired = useMemo(() => unlockTime < new Date(), [unlockTime])

  useEffect(() => {
    if (!isEmpty(snowballContract)) {
      getSnowballInfo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snowballContract])

  const getSnowballInfo = async () => {
    try {
      const latestSnowballBalance = await snowballContract.balanceOf(account);
      const snowballBalance = BNToString(latestSnowballBalance, 18);
      setSnowballBalance(snowballBalance);
    } catch (error) {
      console.log('[Error] snowballContract => ', error)
    }
  }

  useEffect(() => {
    if (!isEmpty(snowconeContract)) {
      getSnowconeInfo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snowconeContract])

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
      const tokenApprove = await snowballContractApprove.approve(CONTRACTS.SNOWCONE, amount);
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
      const tokenApprove = await snowballContractApprove.approve(CONTRACTS.SNOWCONE, amount);
      const transactionApprove = await tokenApprove.wait(1)
      if (!transactionApprove.status) {
        setLoading(false)
        return;
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
      const lockedDate = getEpochSecondForDay(new Date(data.date))
      const gasLimit = await snowconeContract.estimateGas.increase_unlock_time(lockedDate);
      const tokenIncrease = await snowconeContract.increase_unlock_time(lockedDate, { gasLimit });
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

  return {
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
    createLock,
    increaseAmount,
    increaseTime,
    withdraw
  }
}

export default useLock