import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'

import { isEmpty } from 'utils/helpers/utility'

const useClaim = ({
  setLoading,
  feeDistributorContract
}) => {
  const { account } = useWeb3React();
  const [userClaimable, setUserClaimable] = useState(0);

  useEffect(() => {
    if (!isEmpty(feeDistributorContract)) {
      getFeeDistributorInfo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feeDistributorContract])

  const getFeeDistributorInfo = async () => {
    try {
      const userClaimable = await feeDistributorContract.callStatic['claim(address)'](account, { gasLimit: 1000000 })
      setUserClaimable(userClaimable.toString() ? userClaimable : null);
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

  return {
    userClaimable,
    claim
  }
}

export default useClaim