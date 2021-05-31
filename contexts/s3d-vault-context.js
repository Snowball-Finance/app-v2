import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'

import { IS_MAINNET, CONTRACTS } from 'config'
import MAIN_ERC20_ABI from 'libs/abis/main/erc20.json'
import TEST_ERC20_ABI from 'libs/abis/test/erc20.json'
import S3D_VAULT_ABI from 'libs/abis/s3d-vault.json'

const ERC20_ABI = IS_MAINNET ? MAIN_ERC20_ABI : TEST_ERC20_ABI
const ContractContext = createContext(null)

export function S3dVaultContractProvider({ children }) {
  const { library, account } = useWeb3React();

  const [s3dToken, setS3dToken] = useState({ name: 'S3D', priceId: 's3d', price: 0, balance: 0 })
  const [usdtToken, setUsdtToken] = useState({ name: 'USDT', priceId: 'usdt', price: 0, balance: 0 })
  const [busdToken, setBusdToken] = useState({ name: 'BUSD', priceId: 'busd', price: 0, balance: 0 })
  const [daiToken, setDaiToken] = useState({ name: 'DAI', priceId: 'dai', price: 0, balance: 0 })

  const s3dContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S3D.TOKEN, ERC20_ABI, library.getSigner()) : null, [library])
  const usdtContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S3D.USDT, ERC20_ABI, library.getSigner()) : null, [library])
  const busdContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S3D.BUSD, ERC20_ABI, library.getSigner()) : null, [library])
  const daiContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S3D.DAI, ERC20_ABI, library.getSigner()) : null, [library])
  const vaultContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S3D.VAULT, S3D_VAULT_ABI, library.getSigner()) : null, [library])
  const tokenArray = useMemo(() => [usdtToken, busdToken, daiToken], [usdtToken, busdToken, daiToken]);

  useEffect(() => {
    if (s3dContract && usdtContract && busdContract && daiContract && vaultContract) {
      getInit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s3dContract, usdtContract, busdContract, daiContract, vaultContract]);

  const getInit = async () => {
    try {
      const [
        s3dBalance,
        usdtBalance,
        busdBalance,
        daiBalance,
      ] = await Promise.all([
        s3dContract.balanceOf(account),
        usdtContract.balanceOf(account),
        busdContract.balanceOf(account),
        daiContract.balanceOf(account),
      ]);

      setS3dToken((prev) => ({ ...prev, balance: ethers.utils.formatUnits(s3dBalance, 18) }))
      setUsdtToken((prev) => ({ ...prev, balance: ethers.utils.formatUnits(usdtBalance, 6) }));
      setBusdToken((prev) => ({ ...prev, balance: ethers.utils.formatUnits(busdBalance, 18) }));
      setDaiToken((prev) => ({ ...prev, balance: ethers.utils.formatUnits(daiBalance, 18) }));
    } catch (error) {
      console.log('[Error] getInit => ', error)
    }
  }

  console.log('s3dToken => ', s3dToken)
  console.log('usdtToken => ', usdtToken)
  console.log('busdToken => ', busdToken)
  console.log('daiToken => ', daiToken)

  return (
    <ContractContext.Provider
      value={{
        tokenArray
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}

export function useS3dVaultContracts() {
  const context = useContext(ContractContext)
  if (!context) {
    throw new Error('Missing stats context')
  }

  const {
    tokenArray
  } = context

  return {
    tokenArray
  }
}