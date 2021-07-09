import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';

import { isEmpty, delay } from 'utils/helpers/utility'

const useClaim = ({
  setLoading,
  feeDistributorContract
}) => {
  const { account } = useWeb3React();

  const [userClaimable, setUserClaimable] = useState(0);
  const [nextDistribution, setNextDistribution] = useState(null);

  useEffect(() => {
    if (!isEmpty(feeDistributorContract)) {
      getFeeDistributorInfo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feeDistributorContract])

  const getFeeDistributorInfo = async () => {
    try {
      const [
        userClaimable,
        timeCursor,
      ] = await Promise.all([
        feeDistributorContract.callStatic['claim(address)'](account, { gasLimit: 1000000 }),
        feeDistributorContract['time_cursor()']({ gasLimit: 1000000 }),
      ]);

      const nextDistribution = new Date(timeCursor.toNumber() * 1000);
      setNextDistribution(nextDistribution);
      setUserClaimable(userClaimable.toString() ? userClaimable : null);
    } catch (error) {
      console.log('[Error] getSnowconeInfo => ', error)
    }
  }

  const claim = async () => {
    setLoading(true)
    try {
      let loop = true
      let tx = null
      const ethereumProvider = await detectEthereumProvider();
      const web3 = new Web3(ethereumProvider);

      const gasLimit = await feeDistributorContract.estimateGas['claim()']();
      const { hash } = await feeDistributorContract['claim()']({ gasLimit });

      while (loop) {
        tx = await web3.eth.getTransactionReceipt(hash);
        if (isEmpty(tx)) {
          await delay(300)
        } else {
          loop = false
        }
      }

      if (tx.status) {
        await getFeeDistributorInfo();
      }
    } catch (error) {
      console.log('[Error] claim => ', error)
    }
    setLoading(false)
  }

  return {
    userClaimable,
    nextDistribution,
    claim
  }
}

export default useClaim