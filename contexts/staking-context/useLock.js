import { useState, useEffect, useMemo } from 'react'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { parseEther } from 'ethers/lib/utils'
import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3'

import { CONTRACTS } from 'config'
import { isEmpty, delay } from 'utils/helpers/utility'
import { getEpochSecondForDay } from 'utils/helpers/date'

const useLock = ({
  prices,
  setLoading,
  snowballContract,
  snowconeContract
}) => {
  const { account } = useWeb3React();

  const [snowballBalance, setSnowballBalance] = useState(0);
  const [lockedAmount, setLockedAmount] = useState();
  const [lockEndDate, setLockEndDate] = useState();
  const [snowconeBalance, setSnowconeBalance] = useState();
  const [totalSupply, setTotalSupply] = useState(0);
  const [totalLocked, setTotalLocked] = useState(0);

  const lockedValue = useMemo(() => prices.snowball * parseFloat(ethers.utils.formatEther(totalSupply)), [prices?.snowball, totalSupply])
  const totalSnowballValue = useMemo(() => prices.snowball * parseFloat(ethers.utils.formatEther(totalLocked)), [prices?.snowball, totalLocked])
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
      const snowballBalance = ethers.utils.formatUnits(latestSnowballBalance, 18);
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
      let loop = true
      let tx = null
      const ethereumProvider = await detectEthereumProvider();
      const web3 = new Web3(ethereumProvider);

      const amount = parseEther((data.balance).toString());
      const { hash: snowballHash } = await snowballContract.approve(CONTRACTS.SNOWCONE, amount);

      while (loop) {
        tx = await web3.eth.getTransactionReceipt(snowballHash);
        if (isEmpty(tx)) {
          await delay(300)
        } else {
          loop = false
        }
      }

      if (!tx.status) {
        setLoading(false)
        return;
      }

      const gasLimit = await snowconeContract.estimateGas.create_lock(
        amount,
        getEpochSecondForDay(new Date(data.date)),
      );
      const { hash: snowconeHash } = await snowconeContract.create_lock(
        amount,
        getEpochSecondForDay(new Date(data.date)),
        { gasLimit },
      );

      loop = true;
      tx = null;
      while (loop) {
        tx = await web3.eth.getTransactionReceipt(snowconeHash);
        if (isEmpty(tx)) {
          await delay(300)
        } else {
          loop = false
        }
      }

      if (tx.status) {
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
      let loop = true
      let tx = null
      const ethereumProvider = await detectEthereumProvider();
      const web3 = new Web3(ethereumProvider);

      const amount = parseEther((data.balance).toString());
      const { hash: snowballHash } = await snowballContract.approve(CONTRACTS.SNOWCONE, amount);

      while (loop) {
        tx = await web3.eth.getTransactionReceipt(snowballHash);
        if (isEmpty(tx)) {
          await delay(300)
        } else {
          loop = false
        }
      }

      if (!tx.status) {
        setLoading(false)
        return;
      }

      const gasLimit = await snowconeContract.estimateGas.increase_amount(amount);
      const { hash: snowconeHash } = await snowconeContract.increase_amount(
        amount,
        { gasLimit },
      );

      loop = true;
      tx = null;
      while (loop) {
        tx = await web3.eth.getTransactionReceipt(snowconeHash);
        if (isEmpty(tx)) {
          await delay(300)
        } else {
          loop = false
        }
      }

      if (tx.status) {
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
      let loop = true
      let tx = null
      const ethereumProvider = await detectEthereumProvider();
      const web3 = new Web3(ethereumProvider);

      const gasLimit = await snowconeContract.estimateGas.increase_unlock_time(
        getEpochSecondForDay(new Date(data.date))
      );
      const { hash: snowconeHash } = await snowconeContract.increase_unlock_time(
        getEpochSecondForDay(new Date(data.date)),
        { gasLimit },
      );

      while (loop) {
        tx = await web3.eth.getTransactionReceipt(snowconeHash);
        if (isEmpty(tx)) {
          await delay(300)
        } else {
          loop = false
        }
      }

      if (tx.status) {
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
      let loop = true
      let tx = null
      const ethereumProvider = await detectEthereumProvider();
      const web3 = new Web3(ethereumProvider);

      const gasLimit = await snowconeContract.estimateGas.withdraw();
      const { hash: snowconeHash } = await snowconeContract.withdraw(
        { gasLimit }
      );

      while (loop) {
        tx = await web3.eth.getTransactionReceipt(snowconeHash);
        if (isEmpty(tx)) {
          await delay(300)
        } else {
          loop = false
        }
      }

      if (tx.status) {
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