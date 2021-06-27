import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3'

import { IS_MAINNET, CONTRACTS } from 'config'
import MAIN_ERC20_ABI from 'libs/abis/main/erc20.json'
import TEST_ERC20_ABI from 'libs/abis/test/erc20.json'
import S3F_VAULT_ABI from 'libs/abis/s3f-vault.json'
import GAUGE_ABI from 'libs/abis/gauge.json'
import { isEmpty, delay } from 'utils/helpers/utility'
import { getEnglishDateWithTime } from 'utils/helpers/time'
import { usePopup } from 'contexts/popup-context'

const ERC20_ABI = IS_MAINNET ? MAIN_ERC20_ABI : TEST_ERC20_ABI
const ContractContext = createContext(null)

export function S3fVaultContractProvider({ children }) {
  const { library, account } = useWeb3React();
  const { setPopUp } = usePopup();

  const [loading, setLoading] = useState(false)
  const [s3fToken, setS3fToken] = useState({ name: 'S3F', priceId: 's3f', decimal: 18, price: 0, balance: 0, supply: 0, percentage: 0, ratio: 0 })
  const [fraxToken, setFraxToken] = useState({ index: 0, name: 'FRAX', priceId: 'frax', decimal: 6, price: 0, balance: 0, supply: 0, percentage: 0 })
  const [tusdToken, setTusdToken] = useState({ index: 1, name: 'TUSD', priceId: 'tusd', decimal: 18, price: 0, balance: 0, supply: 0, percentage: 0 })
  const [usdtToken, setUsdtToken] = useState({ index: 2, name: 'USDT', priceId: 'usdt', decimal: 18, price: 0, balance: 0, supply: 0, percentage: 0 })
  const [totalSupply, setTotalSupply] = useState(0);
  const [staked, setStaked] = useState(0);
  const [transactions, setTransactions] = useState([])

  const s3fContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S3F.TOKEN, ERC20_ABI, library.getSigner()) : null, [library])
  const fraxContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S3F.FRAX, ERC20_ABI, library.getSigner()) : null, [library])
  const tusdContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S3F.TUSD, ERC20_ABI, library.getSigner()) : null, [library])
  const usdtContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S3F.USDT, ERC20_ABI, library.getSigner()) : null, [library])
  const vaultContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S3F.VAULT, S3F_VAULT_ABI, library.getSigner()) : null, [library])
  const gaugeContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S3F.GAUGE, GAUGE_ABI, library.getSigner()) : null, [library])
  const tokenArray = useMemo(() => [fraxToken, tusdToken, usdtToken], [fraxToken, tusdToken, usdtToken]);

  const getTokenContract = (token) => {
    switch (token.name) {
      case 'FRAX': return fraxContract;
      case 'TUSD': return tusdContract;
      case 'USDT': return usdtContract;
      default: return fraxContract;
    }
  }

  const getTokenById = (id) => {
    switch (id) {
      case 0: return fraxToken;
      case 1: return tusdToken;
      case 2: return usdtToken;
      default: return fraxToken;
    }
  }

  useEffect(() => {
    if (s3fContract && fraxContract && tusdContract && usdtContract && vaultContract && gaugeContract) {
      getInit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s3fContract, fraxContract, tusdContract, usdtContract, vaultContract, gaugeContract]);

  const getInit = async () => {
    try {
      const [
        s3fBalance,
        fraxBalance,
        tusdBalance,
        usdtBalance,
        s3fSupply,
        fraxSupply,
        tusdSupply,
        usdtSupply,
        stakedBalance
      ] = await Promise.all([
        s3fContract.balanceOf(account, { gasLimit: 1000000 }),
        fraxContract.balanceOf(account, { gasLimit: 1000000 }),
        tusdContract.balanceOf(account, { gasLimit: 1000000 }),
        usdtContract.balanceOf(account, { gasLimit: 1000000 }),
        s3fContract.totalSupply({ gasLimit: 1000000 }),
        fraxContract.balanceOf(CONTRACTS.S3F.VAULT, { gasLimit: 1000000 }),
        tusdContract.balanceOf(CONTRACTS.S3F.VAULT, { gasLimit: 1000000 }),
        usdtContract.balanceOf(CONTRACTS.S3F.VAULT, { gasLimit: 1000000 }),
        gaugeContract.balanceOf(account, { gasLimit: 1000000 })
      ]);

      const s3fBalanceValue = parseFloat(ethers.utils.formatUnits(s3fBalance, 18))
      const fraxBalanceValue = parseFloat(ethers.utils.formatUnits(fraxBalance, 18))
      const tusdBalanceValue = parseFloat(ethers.utils.formatUnits(tusdBalance, 18))
      const usdtBalanceValue = parseFloat(ethers.utils.formatUnits(usdtBalance, 6))
      const s3fSupplyValue = parseFloat(ethers.utils.formatUnits(s3fSupply, 18))
      const fraxSupplyValue = parseFloat(ethers.utils.formatUnits(fraxSupply, 18))
      const tusdSupplyValue = parseFloat(ethers.utils.formatUnits(tusdSupply, 18))
      const usdtSupplyValue = parseFloat(ethers.utils.formatUnits(usdtSupply, 6))
      const stakedValue = parseFloat(ethers.utils.formatUnits(stakedBalance, 18))
      const totalSupply = fraxSupplyValue + tusdSupplyValue + usdtSupplyValue
      const s3fPercentage = s3fSupplyValue ? s3fBalanceValue / s3fSupplyValue : 0
      const fraxPercentage = totalSupply ? fraxSupplyValue / totalSupply : 0
      const tusdPercentage = totalSupply ? tusdSupplyValue / totalSupply : 0
      const usdtPercentage = totalSupply ? usdtSupplyValue / totalSupply : 0
      const s3fRatio = s3fSupplyValue ? totalSupply / s3fSupplyValue : 0
      setTotalSupply(totalSupply)
      setStaked(stakedValue)
      setS3fToken((prev) => ({ ...prev, balance: s3fBalanceValue, percentage: s3fPercentage, supply: s3fSupplyValue, ratio: s3fRatio }))
      setFraxToken((prev) => ({ ...prev, balance: fraxBalanceValue, percentage: fraxPercentage, supply: fraxSupplyValue }));
      setTusdToken((prev) => ({ ...prev, balance: tusdBalanceValue, percentage: tusdPercentage, supply: tusdSupplyValue }));
      setUsdtToken((prev) => ({ ...prev, balance: usdtBalanceValue, percentage: usdtPercentage, supply: usdtSupplyValue }));
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
                  token: fraxToken.name,
                  time: item.timestamp,
                  balance: -ethers.utils.formatUnits(removeTokenAmounts[0], fraxToken.decimal)
                }
              ]
            }
            if (removeTokenAmounts[1] > 0) {
              transactions = [
                ...transactions,
                {
                  type: 'remove',
                  token: tusdToken.name,
                  time: item.timestamp,
                  balance: -ethers.utils.formatUnits(removeTokenAmounts[1], tusdToken.decimal)
                }
              ]
            }
            if (removeTokenAmounts[2] > 0) {
              transactions = [
                ...transactions,
                {
                  type: 'remove',
                  token: usdtToken.name,
                  time: item.timestamp,
                  balance: -ethers.utils.formatUnits(removeTokenAmounts[2], usdtToken.decimal)
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
                  token: fraxToken.name,
                  time: item.timestamp,
                  balance: ethers.utils.formatUnits(addTokenAmounts[0], fraxToken.decimal)
                }
              ]
            }
            if (addTokenAmounts[1] > 0) {
              transactions = [
                ...transactions,
                {
                  type: 'add',
                  token: tusdToken.name,
                  time: item.timestamp,
                  balance: ethers.utils.formatUnits(addTokenAmounts[1], tusdToken.decimal)
                }
              ]
            }
            if (addTokenAmounts[2] > 0) {
              transactions = [
                ...transactions,
                {
                  type: 'add',
                  token: usdtToken.name,
                  time: item.timestamp,
                  balance: ethers.utils.formatUnits(addTokenAmounts[2], usdtToken.decimal)
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
      const calculatedWithdraw = s3fToken.balance * withdrawPercentage / 100;
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

    const fraxAmount = ethers.utils.parseUnits(data[0].value.toString(), data[0].token.decimal)
    const tusdAmount = ethers.utils.parseUnits(data[1].value.toString(), data[1].token.decimal)
    const usdtAmount = ethers.utils.parseUnits(data[2].value.toString(), data[2].token.decimal)
    const totalAmount = data[0].value + data[1].value + data[2].value

    const minToMint = await vaultContract.calculateTokenAmount(account, [fraxAmount, tusdAmount, usdtAmount], true)
    const minToMintValue = parseFloat(ethers.utils.formatUnits(minToMint, 18))
    const difference = (minToMintValue * (s3fToken.ratio || 1)) - totalAmount
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
      const { hash: approveHash } = await tokenContract.approve(CONTRACTS.S3F.VAULT, amount);

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
          const { hash: approveHash } = await tokenContract.approve(CONTRACTS.S3F.VAULT, ethers.constants.MaxUint256);

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

      const fraxAmount = ethers.utils.parseUnits(liquidityData[0].value.toString(), liquidityData[0].token.decimal)
      const tusdAmount = ethers.utils.parseUnits(liquidityData[1].value.toString(), liquidityData[1].token.decimal)
      const usdtAmount = ethers.utils.parseUnits(liquidityData[2].value.toString(), liquidityData[2].token.decimal)
      const slippageMultiplier = 1000 - (maxSlippage * 10);
      const minToMint = receivingValue.value * slippageMultiplier / 1000;
      const minToMintAmount = ethers.utils.parseUnits(minToMint.toString(), 18)
      const deadline = Date.now() + 180;

      const { hash: liquidityHash } = await vaultContract.addLiquidity([fraxAmount, tusdAmount, usdtAmount], minToMintAmount, deadline);

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

      const allowedTokens = await s3fContract.allowance(account, CONTRACTS.S3F.VAULT)
      if (allowedTokens !== ethers.constants.MaxUint256) {
        const { hash: approveHash } = await s3fContract.approve(CONTRACTS.S3F.VAULT, ethers.constants.MaxUint256)

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

      const calculatedWithdraw = s3fToken.balance * withdrawPercentage / 100;
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

      const amount = ethers.utils.parseUnits((s3fToken.balance).toString(), s3fToken.decimal);
      const { hash: approveHash } = await s3fContract.approve(CONTRACTS.S3F.GAUGE, amount);

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

      const amount = ethers.utils.parseUnits((staked).toString(), s3fToken.decimal);
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
        s3fToken,
        fraxToken,
        tusdToken,
        usdtToken,
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

export function useS3fVaultContracts() {
  const context = useContext(ContractContext)
  if (!context) {
    throw new Error('Missing stats context')
  }

  const {
    loading,
    s3fToken,
    fraxToken,
    tusdToken,
    usdtToken,
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
    s3fToken,
    fraxToken,
    tusdToken,
    usdtToken,
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