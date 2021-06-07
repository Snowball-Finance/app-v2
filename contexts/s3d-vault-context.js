import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3'

import { IS_MAINNET, CONTRACTS } from 'config'
import MAIN_ERC20_ABI from 'libs/abis/main/erc20.json'
import TEST_ERC20_ABI from 'libs/abis/test/erc20.json'
import S3D_VAULT_ABI from 'libs/abis/s3d-vault.json'
import GAUGE_ABI from 'libs/abis/gauge.json'
import { isEmpty, delay } from 'utils/helpers/utility'
import { getEnglishDateWithTime } from 'utils/helpers/time'
import { usePopup } from 'contexts/popup-context'

const ERC20_ABI = IS_MAINNET ? MAIN_ERC20_ABI : TEST_ERC20_ABI
const ContractContext = createContext(null)

export function S3dVaultContractProvider({ children }) {
  const { library, account } = useWeb3React();
  const { setPopUp } = usePopup();

  const [loading, setLoading] = useState(false)
  const [s3dToken, setS3dToken] = useState({ name: 'S3D', priceId: 's3d', decimal: 18, price: 0, balance: 0, supply: 0, percentage: 0, ratio: 0 })
  const [usdtToken, setUsdtToken] = useState({ index: 0, name: 'USDT', priceId: 'usdt', decimal: 6, price: 0, balance: 0, supply: 0, percentage: 0 })
  const [busdToken, setBusdToken] = useState({ index: 1, name: 'BUSD', priceId: 'busd', decimal: 18, price: 0, balance: 0, supply: 0, percentage: 0 })
  const [daiToken, setDaiToken] = useState({ index: 2, name: 'DAI', priceId: 'dai', decimal: 18, price: 0, balance: 0, supply: 0, percentage: 0 })
  const [totalSupply, setTotalSupply] = useState(0);
  const [staked, setStaked] = useState(0);
  const [transactions, setTransactions] = useState([])

  const s3dContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S3D.TOKEN, ERC20_ABI, library.getSigner()) : null, [library])
  const usdtContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S3D.USDT, ERC20_ABI, library.getSigner()) : null, [library])
  const busdContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S3D.BUSD, ERC20_ABI, library.getSigner()) : null, [library])
  const daiContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S3D.DAI, ERC20_ABI, library.getSigner()) : null, [library])
  const vaultContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S3D.VAULT, S3D_VAULT_ABI, library.getSigner()) : null, [library])
  const gaugeContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S3D.GAUGE, GAUGE_ABI, library.getSigner()) : null, [library])
  const tokenArray = useMemo(() => [usdtToken, busdToken, daiToken], [usdtToken, busdToken, daiToken]);

  const getTokenContract = (token) => {
    switch (token.name) {
      case 'USDT': return usdtContract;
      case 'BUSD': return busdContract;
      case 'DAI': return daiContract;
      default: return usdtContract;
    }
  }

  const getTokenById = (id) => {
    switch (id) {
      case 0: return usdtToken;
      case 1: return busdToken;
      case 2: return daiToken;
      default: return usdtToken;
    }
  }

  useEffect(() => {
    if (s3dContract && usdtContract && busdContract && daiContract && vaultContract && gaugeContract) {
      getInit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s3dContract, usdtContract, busdContract, daiContract, vaultContract, gaugeContract]);

  const getInit = async () => {
    try {
      const [
        s3dBalance,
        usdtBalance,
        busdBalance,
        daiBalance,
        s3dSupply,
        usdtSupply,
        busdSupply,
        daiSupply,
        stakedBalance
      ] = await Promise.all([
        s3dContract.balanceOf(account, { gasLimit: 1000000 }),
        usdtContract.balanceOf(account, { gasLimit: 1000000 }),
        busdContract.balanceOf(account, { gasLimit: 1000000 }),
        daiContract.balanceOf(account, { gasLimit: 1000000 }),
        s3dContract.totalSupply({ gasLimit: 1000000 }),
        usdtContract.balanceOf(CONTRACTS.S3D.VAULT, { gasLimit: 1000000 }),
        busdContract.balanceOf(CONTRACTS.S3D.VAULT, { gasLimit: 1000000 }),
        daiContract.balanceOf(CONTRACTS.S3D.VAULT, { gasLimit: 1000000 }),
        gaugeContract.balanceOf(account, { gasLimit: 1000000 })
      ]);

      const s3dBalanceValue = parseFloat(ethers.utils.formatUnits(s3dBalance, 18))
      const usdtBalanceValue = parseFloat(ethers.utils.formatUnits(usdtBalance, 6))
      const busdBalanceValue = parseFloat(ethers.utils.formatUnits(busdBalance, 18))
      const daiBalanceValue = parseFloat(ethers.utils.formatUnits(daiBalance, 18))
      const s3dSupplyValue = parseFloat(ethers.utils.formatUnits(s3dSupply, 18))
      const usdtSupplyValue = parseFloat(ethers.utils.formatUnits(usdtSupply, 6))
      const busdSupplyValue = parseFloat(ethers.utils.formatUnits(busdSupply, 18))
      const daiSupplyValue = parseFloat(ethers.utils.formatUnits(daiSupply, 18))
      const stakedValue = parseFloat(ethers.utils.formatUnits(stakedBalance, 18))
      const totalSupply = usdtSupplyValue + busdSupplyValue + daiSupplyValue
      const s3dPercentage = s3dSupplyValue ? s3dBalanceValue / s3dSupplyValue : 0
      const usdtPercentage = totalSupply ? usdtSupplyValue / totalSupply : 0
      const busdPercentage = totalSupply ? busdSupplyValue / totalSupply : 0
      const daiPercentage = totalSupply ? daiSupplyValue / totalSupply : 0
      const s3dRatio = s3dSupplyValue ? totalSupply / s3dSupplyValue : 0
      setTotalSupply(totalSupply)
      setStaked(stakedValue)
      setS3dToken((prev) => ({ ...prev, balance: s3dBalanceValue, percentage: s3dPercentage, supply: s3dSupplyValue, ratio: s3dRatio }))
      setUsdtToken((prev) => ({ ...prev, balance: usdtBalanceValue, percentage: usdtPercentage, supply: usdtSupplyValue }));
      setBusdToken((prev) => ({ ...prev, balance: busdBalanceValue, percentage: busdPercentage, supply: busdSupplyValue }));
      setDaiToken((prev) => ({ ...prev, balance: daiBalanceValue, percentage: daiPercentage, supply: daiSupplyValue }));
    } catch (error) {
      console.log('[Error] getInit => ', error)
    }
  }

  const getTransactions = async () => {
    try {
      let blockNumber = await library.getBlockNumber();
      let events = [];
      let transactions = [];
      let attempt = 0;

      while (events.length < 10 && attempt < 10) {
        const moreEvents = await vaultContract.queryFilter('*', blockNumber - 500, blockNumber);
        events = events.concat(moreEvents);
        blockNumber = blockNumber - 501;
        attempt += 1;
      }
      await Promise.all(events.map(async (event) => {
        const block = await event.getBlock();
        event.timestamp = getEnglishDateWithTime(new Date(block.timestamp * 1000));
      }));

      for (const item of events) {
        switch (item.event) {
          case 'TokenSwap':
            const boughtToken = getTokenById(item.args.boughtId)
            const soldToken = getTokenById(item.args.soldId)
            transactions = [
              ...transactions,
              {
                type: 'swap',
                token: `${soldToken.name} - ${boughtToken.name}`,
                time: item.timestamp,
                balance: ethers.utils.formatUnits(item.args.tokensSold, soldToken.decimal)
              }
            ]
            break;
          case 'RemoveLiquidity':
            const removeTokenAmounts = item.args.tokenAmounts;
            if (removeTokenAmounts[0] > 0) {
              transactions = [
                ...transactions,
                {
                  type: 'remove',
                  token: usdtToken.name,
                  time: item.timestamp,
                  balance: -ethers.utils.formatUnits(removeTokenAmounts[0], usdtToken.decimal)
                }
              ]
            }
            if (removeTokenAmounts[1] > 0) {
              transactions = [
                ...transactions,
                {
                  type: 'remove',
                  token: busdToken.name,
                  time: item.timestamp,
                  balance: -ethers.utils.formatUnits(removeTokenAmounts[1], busdToken.decimal)
                }
              ]
            }
            if (removeTokenAmounts[2] > 0) {
              transactions = [
                ...transactions,
                {
                  type: 'remove',
                  token: daiToken.name,
                  time: item.timestamp,
                  balance: -ethers.utils.formatUnits(removeTokenAmounts[2], daiToken.decimal)
                }
              ]
            }
            break;
          case 'RemoveLiquidityOne':
            const removeToken = getTokenById(item.args.boughtId)
            transactions = [
              ...transactions,
              {
                type: 'remove',
                token: removeToken.name,
                time: item.timestamp,
                balance: -ethers.utils.formatUnits(item.args.tokensBought, removeToken.decimal)
              }
            ]
            break;
          case 'AddLiquidity':
            const addTokenAmounts = item.args.tokenAmounts;
            if (addTokenAmounts[0] > 0) {
              transactions = [
                ...transactions,
                {
                  type: 'add',
                  token: usdtToken.name,
                  time: item.timestamp,
                  balance: ethers.utils.formatUnits(addTokenAmounts[0], usdtToken.decimal)
                }
              ]
            }
            if (addTokenAmounts[1] > 0) {
              transactions = [
                ...transactions,
                {
                  type: 'add',
                  token: busdToken.name,
                  time: item.timestamp,
                  balance: ethers.utils.formatUnits(addTokenAmounts[1], busdToken.decimal)
                }
              ]
            }
            if (addTokenAmounts[2] > 0) {
              transactions = [
                ...transactions,
                {
                  type: 'add',
                  token: daiToken.name,
                  time: item.timestamp,
                  balance: ethers.utils.formatUnits(addTokenAmounts[2], daiToken.decimal)
                }
              ]
            }
            break;
          default: break;
        }
      }
      setTransactions(transactions)
    } catch (error) {
      console.log('[Error] getTransactions => ', error)
    }
  }

  const getToSwapAmount = async (fromToken, toToken, fromAmount) => {
    try {
      if (!vaultContract) { return 0; }
      if (fromToken.name === toToken.name) { return fromAmount }

      const fromAmountValue = ethers.utils.parseUnits(fromAmount.toString(), fromToken.decimal);
      const toAmount = await vaultContract.calculateSwap(fromToken.index, toToken.index, fromAmountValue)
      const toAmountValue = parseFloat(ethers.utils.formatUnits(toAmount, toToken.decimal))
      return toAmountValue || 0;
    } catch (error) {
      console.log('[Error] getToSwapAmount => ', error)
      return 0
    }
  }

  const getWithdrawAmount = async (withdrawPercentage, checkedValue) => {
    let withdrawAmount = [0, 0, 0]
    if (!withdrawPercentage) { return withdrawAmount }
    if (!vaultContract) { return withdrawAmount }

    if (!account) {
      setPopUp({
        title: 'Network Error',
        text: `Please Switch to Avalanche Chain and connect metamask`
      })
      return withdrawAmount;
    }

    try {
      const calculatedWithdraw = s3dToken.balance * withdrawPercentage / 100;
      const calculatedWithdrawValue = ethers.utils.parseUnits(calculatedWithdraw.toString(), 18);

      if (checkedValue === -1) {
        const removeAmounts = await vaultContract.calculateRemoveLiquidity(account, calculatedWithdrawValue);
        for (let i = 0; i < 3; i++) {
          const token = getTokenById(i);
          withdrawAmount[i] = parseFloat(ethers.utils.formatUnits(removeAmounts[i], token.decimal))
        }
      } else {
        const removeAmount = await vaultContract.calculateRemoveLiquidityOneToken(account, calculatedWithdrawValue, checkedValue);
        const token = getTokenById(checkedValue);
        withdrawAmount[checkedValue] = parseFloat(ethers.utils.formatUnits(removeAmount, token.decimal));
      }
      return withdrawAmount;
    } catch (error) {
      console.log('[Error] getWithdrawAmount => ', error)
      return 0
    }
  }

  const getDepositReview = async (data) => {
    if (!account) {
      setPopUp({
        title: 'Network Error',
        text: `Please Switch to Avalanche Chain and connect metamask`
      })
      return { minToMintValue: 0, discount: 0 };
    }

    const usdtAmount = ethers.utils.parseUnits(data[0].value.toString(), data[0].token.decimal)
    const busdAmount = ethers.utils.parseUnits(data[1].value.toString(), data[1].token.decimal)
    const daiAmount = ethers.utils.parseUnits(data[2].value.toString(), data[2].token.decimal)
    const totalAmount = data[0].value + data[1].value + data[2].value

    const minToMint = await vaultContract.calculateTokenAmount(account, [usdtAmount, busdAmount, daiAmount], true)
    const minToMintValue = parseFloat(ethers.utils.formatUnits(minToMint, 18))
    const difference = (minToMintValue * (s3dToken.ratio || 1)) - totalAmount
    const discount = (totalAmount > 0 ? (difference / totalAmount) * 100 : 0);

    return {
      minToMintValue,
      discount
    }
  }

  const onSwap = async ({ fromToken, toToken, fromAmount, toAmount, maxSlippage }) => {
    if (!account) {
      setPopUp({
        title: 'Network Error',
        text: `Please Switch to Avalanche Chain and connect metamask`
      })
      return;
    }

    setLoading(true)
    try {
      let loop = true
      let tx = null
      const ethereumProvider = await detectEthereumProvider();
      const web3 = new Web3(ethereumProvider);
      const tokenContract = getTokenContract(fromToken);

      const amount = ethers.utils.parseUnits((fromAmount).toString(), fromToken.decimal);
      const { hash: approveHash } = await tokenContract.approve(CONTRACTS.S3D.VAULT, amount);

      while (loop) {
        tx = await web3.eth.getTransactionReceipt(approveHash);
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

      const fromAmountValue = ethers.utils.parseUnits(fromAmount.toString(), fromToken.decimal)
      const slippageMultiplier = 1000 - (maxSlippage * 10);
      const minAmount = toAmount * slippageMultiplier / 1000;
      const minAmountValue = ethers.utils.parseUnits(minAmount.toString(), toToken.decimal)
      const deadline = Date.now() + 180;

      const { hash: swapHash } = await vaultContract.swap(
        fromToken.index,
        toToken.index,
        fromAmountValue,
        minAmountValue,
        deadline
      );

      loop = true;
      tx = null;
      while (loop) {
        tx = await web3.eth.getTransactionReceipt(swapHash);
        if (isEmpty(tx)) {
          await delay(300)
        } else {
          loop = false
        }
      }

      if (tx.status) {
        await getInit();
      }
    } catch (error) {
      console.log('[Error] onSwap => ', error)
    }
    setLoading(false)
  }

  const addLiquidity = async (liquidityData, maxSlippage, receivingValue) => {
    if (!account) {
      setPopUp({
        title: 'Network Error',
        text: `Please Switch to Avalanche Chain and connect metamask`
      })
      return;
    }

    setLoading(true)
    try {
      let loop = true
      let tx = null
      const ethereumProvider = await detectEthereumProvider();
      const web3 = new Web3(ethereumProvider);

      for (const item of liquidityData) {
        const { token, value } = item;
        if (value) {
          const tokenContract = getTokenContract(token);
          const amount = ethers.utils.parseUnits((value).toString(), token.decimal);
          const { hash: approveHash } = await tokenContract.approve(CONTRACTS.S3D.VAULT, amount);

          while (loop) {
            tx = await web3.eth.getTransactionReceipt(approveHash);
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
        }
      }

      const usdtAmount = ethers.utils.parseUnits(liquidityData[0].value.toString(), liquidityData[0].token.decimal)
      const busdAmount = ethers.utils.parseUnits(liquidityData[1].value.toString(), liquidityData[1].token.decimal)
      const daiAmount = ethers.utils.parseUnits(liquidityData[2].value.toString(), liquidityData[2].token.decimal)
      const slippageMultiplier = 1000 - (maxSlippage * 10);
      const minToMint = receivingValue.value * slippageMultiplier / 1000;
      const minToMintAmount = ethers.utils.parseUnits(minToMint.toString(), 18)
      const deadline = Date.now() + 180;

      const { hash: liquidityHash } = await vaultContract.addLiquidity([usdtAmount, busdAmount, daiAmount], minToMintAmount, deadline);

      loop = true;
      tx = null;
      while (loop) {
        tx = await web3.eth.getTransactionReceipt(liquidityHash);
        if (isEmpty(tx)) {
          await delay(300)
        } else {
          loop = false
        }
      }

      if (tx.status) {
        await getInit();
      }
    } catch (error) {
      console.log('[Error] addLiquidity => ', error)
    }
    setLoading(false)
  }

  const removeLiquidity = async (liquidityData, withdrawPercentage, maxSlippage, selectedToken) => {
    if (!account) {
      setPopUp({
        title: 'Network Error',
        text: `Please Switch to Avalanche Chain and connect metamask`
      })
      return;
    }

    setLoading(true)
    try {
      let loop = true
      let tx = null
      const ethereumProvider = await detectEthereumProvider();
      const web3 = new Web3(ethereumProvider);

      const allowedTokens = await s3dContract.allowance(account, CONTRACTS.S3D.VAULT)
      if (allowedTokens !== ethers.constants.MaxUint256) {
        const { hash: approveHash } = await s3dContract.approve(CONTRACTS.S3D.VAULT, ethers.constants.MaxUint256)

        while (loop) {
          tx = await web3.eth.getTransactionReceipt(approveHash);
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
      }

      const calculatedWithdraw = s3dToken.balance * withdrawPercentage / 100;
      const calculatedWithdrawValue = ethers.utils.parseUnits(calculatedWithdraw.toString(), 18);
      const deadline = Date.now() + 180;
      if (selectedToken === -1) {
        const minToRemoveAmount = [];
        for (let i = 0; i < 3; i++) {
          const { token, value } = liquidityData[i];
          minToRemoveAmount[i] = ethers.utils.parseUnits((value * maxSlippage).toFixed(token.decimal).toString(), token.decimal)
        }

        const { hash: removeHash } = await vaultContract.removeLiquidity(calculatedWithdrawValue, minToRemoveAmount, deadline);
        while (loop) {
          tx = await web3.eth.getTransactionReceipt(removeHash);
          if (isEmpty(tx)) {
            await delay(300)
          } else {
            loop = false
          }
        }
      } else {
        const { token, value } = liquidityData[selectedToken];
        const minToRemoveAmount = ethers.utils.parseUnits((value * maxSlippage).toFixed(token.decimal).toString(), token.decimal)

        const { hash: removeHash } = await vaultContract.removeLiquidityOneToken(calculatedWithdrawValue, selectedToken, minToRemoveAmount, deadline);

        while (loop) {
          tx = await web3.eth.getTransactionReceipt(removeHash);
          if (isEmpty(tx)) {
            await delay(300)
          } else {
            loop = false
          }
        }
      }

      if (tx.status) {
        await getInit();
      }
    } catch (error) {
      console.log('[Error] removeLiquidity => ', error)
    }
    setLoading(false)
  }

  const onStake = async () => {
    if (!account) {
      setPopUp({
        title: 'Network Error',
        text: `Please Switch to Avalanche Chain and connect metamask`
      })
      return;
    }

    setLoading(true)
    try {
      let loop = true
      let tx = null
      const ethereumProvider = await detectEthereumProvider();
      const web3 = new Web3(ethereumProvider);

      const amount = ethers.utils.parseUnits((s3dToken.balance).toString(), s3dToken.decimal);
      const { hash: approveHash } = await s3dContract.approve(CONTRACTS.S3D.GAUGE, amount);

      while (loop) {
        tx = await web3.eth.getTransactionReceipt(approveHash);
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

      const { hash: stakeHash } = await gaugeContract.deposit(amount);

      loop = true;
      tx = null;
      while (loop) {
        tx = await web3.eth.getTransactionReceipt(stakeHash);
        if (isEmpty(tx)) {
          await delay(300)
        } else {
          loop = false
        }
      }

      if (tx.status) {
        await getInit();
      }
    } catch (error) {
      console.log('[Error] onSwap => ', error)
    }
    setLoading(false)
  }

  const onWithdraw = async () => {
    if (!account) {
      setPopUp({
        title: 'Network Error',
        text: `Please Switch to Avalanche Chain and connect metamask`
      })
      return;
    }

    setLoading(true)
    try {
      let loop = true
      let tx = null
      const ethereumProvider = await detectEthereumProvider();
      const web3 = new Web3(ethereumProvider);

      const amount = ethers.utils.parseUnits((staked).toString(), s3dToken.decimal);
      const { hash: withdrawHash } = await gaugeContract.withdraw(amount);

      loop = true;
      tx = null;
      while (loop) {
        tx = await web3.eth.getTransactionReceipt(withdrawHash);
        if (isEmpty(tx)) {
          await delay(300)
        } else {
          loop = false
        }
      }

      if (tx.status) {
        await getInit();
      }
    } catch (error) {
      console.log('[Error] onSwap => ', error)
    }
    setLoading(false)
  }

  return (
    <ContractContext.Provider
      value={{
        loading,
        s3dToken,
        usdtToken,
        busdToken,
        daiToken,
        tokenArray,
        totalSupply,
        staked,
        transactions,
        getTransactions,
        getToSwapAmount,
        getDepositReview,
        getWithdrawAmount,
        onSwap,
        addLiquidity,
        removeLiquidity,
        onStake,
        onWithdraw
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
    loading,
    s3dToken,
    usdtToken,
    busdToken,
    daiToken,
    tokenArray,
    totalSupply,
    staked,
    transactions,
    getTransactions,
    getToSwapAmount,
    getDepositReview,
    getWithdrawAmount,
    onSwap,
    addLiquidity,
    removeLiquidity,
    onStake,
    onWithdraw
  } = context

  return {
    loading,
    s3dToken,
    usdtToken,
    busdToken,
    daiToken,
    tokenArray,
    totalSupply,
    staked,
    transactions,
    getTransactions,
    getToSwapAmount,
    getDepositReview,
    getWithdrawAmount,
    onSwap,
    addLiquidity,
    removeLiquidity,
    onStake,
    onWithdraw
  }
}