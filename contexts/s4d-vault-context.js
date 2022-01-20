import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'

import { IS_MAINNET, CONTRACTS } from 'config'
import MAIN_ERC20_ABI from 'libs/abis/main/erc20.json'
import TEST_ERC20_ABI from 'libs/abis/test/erc20.json'
import S4D_VAULT_ABI from 'libs/abis/s4d-vault.json'
import GAUGE_ABI from 'libs/abis/gauge.json'
import MESSAGES from 'utils/constants/messages';
import { getEnglishDateWithTime } from 'utils/helpers/time'
import { usePopup } from 'contexts/popup-context'
import { BNToFloat, BNToString, floatToBN } from 'utils/helpers/format'
import { useCompoundAndEarnContract } from './compound-and-earn-context'
import { useProvider } from './provider-context'
import { AnalyticActions, AnalyticCategories, createEvent, analytics } from "utils/analytics"

const ERC20_ABI = IS_MAINNET ? MAIN_ERC20_ABI : TEST_ERC20_ABI
const ContractContext = createContext(null)

const tokenArray = [
  { index: 0, name: 'DAI.e', priceId: 'dai', decimal: 18 },
  { index: 1, name: 'FRAX', priceId: 'frax', decimal: 18 },
  { index: 2, name: 'TUSD', priceId: 'tusd', decimal: 18 },
  { index: 3, name: 'USDT.e', priceId: 'usdt', decimal: 6 }
]

const pairNames = 'DAI.e + FRAX + TUSD + USDT.e'

export function S4dVaultContractProvider({ children }) {
  const { provider } = useProvider();
  const unsignedS4dContract = new ethers.Contract(CONTRACTS.S4D.TOKEN, ERC20_ABI, provider)
  const unsignedDaiContract = new ethers.Contract(CONTRACTS.S4D.DAI, ERC20_ABI, provider)
  const unsignedFraxContract = new ethers.Contract(CONTRACTS.S4D.FRAX, ERC20_ABI, provider)
  const unsignedTusdContract = new ethers.Contract(CONTRACTS.S4D.TUSD, ERC20_ABI, provider)
  const unsignedUsdtContract = new ethers.Contract(CONTRACTS.S4D.USDT, ERC20_ABI, provider)
  const unsignedVaultContract = new ethers.Contract(CONTRACTS.S4D.VAULT, S4D_VAULT_ABI, provider)

  const { library, account } = useWeb3React();
  const { setPopUp } = usePopup();
  const { getBalanceInfosAllPools } = useCompoundAndEarnContract();

  const [loading, setLoading] = useState(false)
  const [svToken, setSVToken] = useState({ name: 'S4D', priceId: 's4d', decimal: 18, balance: 0, supply: 0, percentage: 0, ratio: 0 })
  const [daiToken, setDaiToken] = useState({ ...tokenArray[0], balance: 0, supply: 0, percentage: 0 })
  const [fraxToken, setFraxToken] = useState({ ...tokenArray[1], balance: 0, supply: 0, percentage: 0 })
  const [tusdToken, setTusdToken] = useState({ ...tokenArray[2], balance: 0, supply: 0, percentage: 0 })
  const [usdtToken, setUsdtToken] = useState({ ...tokenArray[3], balance: 0, supply: 0, percentage: 0 })
  const [totalSupply, setTotalSupply] = useState(0);
  const [staked, setStaked] = useState(0);
  const [transactions, setTransactions] = useState([])

  const s4dContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S4D.TOKEN, ERC20_ABI, library.getSigner()) : null, [library])
  const daiContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S4D.DAI, ERC20_ABI, library.getSigner()) : null, [library])
  const fraxContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S4D.FRAX, ERC20_ABI, library.getSigner()) : null, [library]);
  const tusdContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S4D.TUSD, ERC20_ABI, library.getSigner()) : null, [library]);
  const usdtContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S4D.USDT, ERC20_ABI, library.getSigner()) : null, [library])
  const vaultContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S4D.VAULT, S4D_VAULT_ABI, library.getSigner()) : null, [library])
  const gaugeContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S4D.GAUGE, GAUGE_ABI, library.getSigner()) : null, [library])
  const tokenValues = useMemo(() => {
    return {
      'DAI.e': daiToken,
      'FRAX': fraxToken,
      'TUSD': tusdToken,
      'USDT.e': usdtToken
    }
  }, [daiToken, fraxToken, tusdToken, usdtToken]);

  const getTokenContract = (token) => {
    switch (token.name) {
      case 'DAI.e': return daiContract;
      case 'FRAX': return fraxContract;
      case 'TUSD': return tusdContract;
      case 'USDT.e': return usdtContract;
      default: return daiContract;
    }
  }

  const getTokenById = (id) => {
    switch (parseInt(id, 10)) {
      case 0: return daiToken;
      case 1: return fraxToken;
      case 2: return tusdToken;
      case 3: return usdtToken;
      default: return daiToken;
    }
  }

  useEffect(() => {
    getSupply();
    getTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  const getSupply = async () => {
    try {
      const [
        s4dSupply,
        daiSupply,
        fraxSupply,
        tusdSupply,
        usdtSupply,
      ] = await Promise.all([
        unsignedS4dContract.totalSupply(),
        unsignedDaiContract.balanceOf(CONTRACTS.S4D.VAULT),
        unsignedFraxContract.balanceOf(CONTRACTS.S4D.VAULT),
        unsignedTusdContract.balanceOf(CONTRACTS.S4D.VAULT),
        unsignedUsdtContract.balanceOf(CONTRACTS.S4D.VAULT),
      ]);

      const s4dSupplyValue = BNToFloat(s4dSupply, svToken.decimal)
      const daiSupplyValue = BNToFloat(daiSupply, daiToken.decimal)
      const fraxSupplyValue = BNToFloat(fraxSupply, fraxToken.decimal)
      const tusdSupplyValue = BNToFloat(tusdSupply, tusdToken.decimal)
      const usdtSupplyValue = BNToFloat(usdtSupply, usdtToken.decimal)
      const totalSupply = daiSupplyValue + fraxSupplyValue + tusdSupplyValue + usdtSupplyValue
      const daiPercentage = totalSupply ? daiSupplyValue / totalSupply : 0
      const fraxPercentage = totalSupply ? fraxSupplyValue / totalSupply : 0
      const tusdPercentage = totalSupply ? tusdSupplyValue / totalSupply : 0
      const usdtPercentage = totalSupply ? usdtSupplyValue / totalSupply : 0
      const s4dRatio = s4dSupplyValue ? totalSupply / s4dSupplyValue : 0

      setTotalSupply(totalSupply)
      setSVToken((prev) => ({ ...prev, supply: s4dSupplyValue, ratio: s4dRatio }))
      setDaiToken((prev) => ({ ...prev, percentage: daiPercentage, supply: daiSupplyValue }));
      setFraxToken((prev) => ({ ...prev, percentage: fraxPercentage, supply: fraxSupplyValue }));
      setTusdToken((prev) => ({ ...prev, percentage: tusdPercentage, supply: tusdSupplyValue }));
      setUsdtToken((prev) => ({ ...prev, percentage: usdtPercentage, supply: usdtSupplyValue }));
    } catch (error) {
      console.log('[Error] getSupply => ', error)
    }
  }

  useEffect(() => {
    if (!!account && s4dContract && daiContract && fraxContract && tusdContract && usdtContract && gaugeContract) {
      getInit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, s4dContract, daiContract, fraxContract, tusdContract, usdtContract, gaugeContract]);

  const getInit = async () => {
    try {
      const [
        s4dBalance,
        daiBalance,
        fraxBalance,
        tusdBalance,
        usdtBalance,
        s4dSupply,
        stakedBalance
      ] = await Promise.all([
        s4dContract.balanceOf(account),
        daiContract.balanceOf(account),
        fraxContract.balanceOf(account),
        tusdContract.balanceOf(account),
        usdtContract.balanceOf(account),
        s4dContract.totalSupply({ gasLimit: 1000000 }),
        gaugeContract.balanceOf(account)
      ]);

      const s4dBalanceValue = BNToString(s4dBalance, svToken.decimal)
      const daiBalanceValue = BNToString(daiBalance, daiToken.decimal)
      const fraxBalanceValue = BNToString(fraxBalance, fraxToken.decimal)
      const tusdBalanceValue = BNToString(tusdBalance, tusdToken.decimal)
      const usdtBalanceValue = BNToString(usdtBalance, usdtToken.decimal)
      const s4dSupplyValue = BNToFloat(s4dSupply, svToken.decimal)
      const stakedValue = BNToFloat(stakedBalance, 18)
      const s4dPercentage = s4dSupplyValue ? parseFloat(s4dBalanceValue) / s4dSupplyValue : 0
      setStaked(stakedValue)
      setSVToken((prev) => ({ ...prev, balance: s4dBalanceValue, percentage: s4dPercentage, supply: s4dSupplyValue }))
      setDaiToken((prev) => ({ ...prev, balance: daiBalanceValue }));
      setFraxToken((prev) => ({ ...prev, balance: fraxBalanceValue }));
      setTusdToken((prev) => ({ ...prev, balance: tusdBalanceValue }));
      setUsdtToken((prev) => ({ ...prev, balance: usdtBalanceValue }));
    } catch (error) {
      console.log('[Error] getInit => ', error)
    }
  }

  const getTransactions = async () => {
    try {
      let blockNumber = await provider.getBlockNumber();
      let events = [];
      let transactions = [];
      let attempt = 0;

      while (events.length < 10 && attempt < 10) {
        const moreEvents = await unsignedVaultContract.queryFilter('*', blockNumber - 500, blockNumber);
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
                balance: BNToString(item.args.tokensSold, soldToken.decimal)
              }
            ]
            break;
          case 'RemoveLiquidity':
            const removeTokenAmounts = item.args.tokenAmounts;
            for (let i = 0; i < 4; i++) {
              const removedToken = getTokenById(i)
              transactions = [
                ...transactions,
                {
                  type: 'remove',
                  token: removedToken.name,
                  time: item.timestamp,
                  balance: -BNToString(removeTokenAmounts[i], removedToken.decimal)
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
                balance: -BNToString(item.args.tokensBought, removeToken.decimal)
              }
            ]
            break;
          case 'AddLiquidity':
            const addTokenAmounts = item.args.tokenAmounts;
            for (let i = 0; i < 4; i++) {
              const addedToken = getTokenById(i)
              transactions = [
                ...transactions,
                {
                  type: 'add',
                  token: addedToken.name,
                  time: item.timestamp,
                  balance: BNToString(addTokenAmounts[i], addedToken.decimal)
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
      if (fromAmount < 0 || !unsignedVaultContract) { return 0; }
      if (fromToken.name === toToken.name) { return fromAmount }

      const toAmount = await unsignedVaultContract.calculateSwap(fromToken.index, toToken.index, fromAmount)
      const toAmountValue = BNToString(toAmount, toToken.decimal)
      return toAmountValue || 0;
    } catch (error) {
      console.log('[Error] getToSwapAmount => ', error)
      return 0
    }
  }

  const getWithdrawAmount = async (withdrawPercentage, checkedValue) => {
    let withdrawAmount = [0, 0, 0, 0]
    if (!withdrawPercentage) { return withdrawAmount }
    if (!unsignedVaultContract) { return withdrawAmount }

    if (!account) {
      setPopUp({
        title: 'Network Error',
        text: MESSAGES.METAMASK_NOT_CONNECTED
      })
      return withdrawAmount;
    }

    try {
      const calculatedWithdraw = floatToBN(svToken.balance, 18)
      const calculatedWithdrawValue = calculatedWithdraw.mul(withdrawPercentage).div(100);

      if (checkedValue === -1) {
        const removeAmounts = await unsignedVaultContract.calculateRemoveLiquidity(calculatedWithdrawValue);
        for (let i = 0; i < 4; i++) {
          const token = getTokenById(i);
          withdrawAmount[i] = BNToFloat(removeAmounts[i], token.decimal)
        }
      } else {
        const removeAmount = await unsignedVaultContract.calculateRemoveLiquidityOneToken(calculatedWithdrawValue, checkedValue);
        const token = getTokenById(checkedValue);
        withdrawAmount[checkedValue] = BNToFloat(removeAmount, token.decimal);
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
        text: MESSAGES.METAMASK_NOT_CONNECTED
      })
      return { minToMintValue: 0, discount: 0 };
    }

    try {
      const daiAmount = data[0].value;
      const fraxAmount = data[1].value;
      const tusdAmount = data[2].value;
      const usdtAmount = data[3].value;
      let totalAmount = 0;
      for (let i = 0; i < 4; i++) {
        totalAmount += BNToFloat(data[i].value, data[i].token.decimal);
      }

      const minToMint = await unsignedVaultContract.calculateTokenAmount([daiAmount, fraxAmount, tusdAmount, usdtAmount], true)
      const minToMintValue = BNToFloat(minToMint, 18)
      const ratio = svToken.ratio || 1;
      const usdValue = minToMintValue * ratio;
      const difference = (minToMintValue * (svToken.ratio || 1)) - totalAmount
      const discount = (totalAmount > 0 ? (difference / totalAmount) * 100 : 0);

      return {
        minToMintValue,
        discount,
        ratio,
        usdValue,
        totalAmount,
      }
    } catch (error) {
      console.log('[Error] getWithdrawAmount => ', error)
      return { minToMintValue: 0, discount: 0, ratio: 0, usdValue: 0, totalAmount: 0 };
    }
  }

  const onSwap = async ({ fromToken, toToken, fromAmount, toAmount, maxSlippage }) => {
    if (!account) {
      setPopUp({
        title: 'Network Error',
        text: MESSAGES.METAMASK_NOT_CONNECTED
      })
      return;
    }

    setLoading(true)
    try {
      const tokenContract = getTokenContract(fromToken);
      const tokenBalance = await tokenContract.balanceOf(account);

      if (tokenBalance.lt(fromAmount)) {
        setPopUp({
          title: 'Balance Error',
          text: `Please check balance of ${fromToken.name} token on your wallet.`
        })
        setLoading(false)
        return;
      }

      const tokenAllowance = await tokenContract.allowance(account, CONTRACTS.S4D.VAULT);
      if (tokenAllowance.lt(fromAmount)) {
        const tokenApprove = await tokenContract.approve(CONTRACTS.S4D.VAULT, ethers.constants.MaxUint256);
        const transactionApprove = await tokenApprove.wait(1)

        if (!transactionApprove.status) {
          setLoading(false)
          return;
        }
      }

      const slippageMultiplier = 1000 - (maxSlippage * 10);
      const minAmount = toAmount * slippageMultiplier / 1000;
      const minAmountValue = floatToBN(minAmount, toToken.decimal)
      const deadline = Date.now() + 180;

      const tokenSwap = await vaultContract.swap(
        fromToken.index,
        toToken.index,
        fromAmount,
        minAmountValue,
        deadline
      );
      const transactionSwap = await tokenSwap.wait(1)

      if (transactionSwap.status) {
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
        text: MESSAGES.METAMASK_NOT_CONNECTED
      })
      return;
    }

    setLoading(true)
    try {
      for (const item of liquidityData) {
        const { token, value } = item;
        if (value) {
          const tokenContract = getTokenContract(token);
          const tokenBalance = await tokenContract.balanceOf(account);

          if (tokenBalance.lt(value)) {
            setPopUp({
              title: 'Balance Error',
              text: `Please check balance of ${token.name} token on your wallet.`
            })
            setLoading(false)
            return;
          }

          const tokenAllowance = await tokenContract.allowance(account, CONTRACTS.S4D.VAULT);
          if (tokenAllowance.lt(value)) {
            const tokenApprove = await tokenContract.approve(CONTRACTS.S4D.VAULT, ethers.constants.MaxUint256);
            const transactionApprove = await tokenApprove.wait(1)

            if (!transactionApprove.status) {
              setLoading(false)
              return;
            }
          }
        }
      }

      const daiAmount = liquidityData[0].value;
      const fraxAmount = liquidityData[1].value;
      const tusdAmount = liquidityData[2].value;
      const usdtAmount = liquidityData[3].value;
      const slippageMultiplier = 1000 - (maxSlippage * 10);
      const minToMint = receivingValue.value * slippageMultiplier / 1000;
      const minToMintAmount = floatToBN(minToMint, 18)
      const deadline = Date.now() + 180;

      const addLiquidity = await vaultContract.addLiquidity([daiAmount, fraxAmount, tusdAmount, usdtAmount], minToMintAmount, deadline);
      const transactionAddLiquidity = await addLiquidity.wait(1)

      if (transactionAddLiquidity.status) {
        //refresh the pool status for the user be able to deposit
        setTimeout(() => getBalanceInfosAllPools(), 2000);
        await getInit();
      }
      analytics.trackEvent(createEvent({
        action: AnalyticActions.add,
        category: AnalyticCategories.s4d,
      }))
    } catch (error) {
      console.log('[Error] addLiquidity => ', error)
      analytics.trackEvent(createEvent({
        action: AnalyticActions.s4d,
        name: `${error}`,
        category: AnalyticCategories.error,
      }))
    }
    setLoading(false)
  }

  const removeLiquidity = async (liquidityData, withdrawPercentage, maxSlippage, selectedToken) => {
    if (!account) {
      setPopUp({
        title: 'Network Error',
        text: MESSAGES.METAMASK_NOT_CONNECTED
      })
      return;
    }

    setLoading(true)
    try {
      const calculatedWithdraw = floatToBN(svToken.balance, 18)
      const calculatedWithdrawValue = calculatedWithdraw.mul(withdrawPercentage).div(100);

      const tokenAllowance = await s4dContract.allowance(account, CONTRACTS.S4D.VAULT);
      if (tokenAllowance.lt(calculatedWithdrawValue)) {
        const tokenApprove = await s4dContract.approve(CONTRACTS.S4D.VAULT, ethers.constants.MaxUint256);
        const transactionApprove = await tokenApprove.wait(1)

        if (!transactionApprove.status) {
          setLoading(false)
          return;
        }
      }

      const deadline = Date.now() + 180;
      let transactionRemoveLiquidity = {};
      if (selectedToken === -1) {
        const minToRemoveAmount = [];
        for (let i = 0; i < 4; i++) {
          const { token, value } = liquidityData[i];
          minToRemoveAmount[i] = floatToBN(value * maxSlippage, token.decimal);
        }

        const removeLiquidity = await vaultContract.removeLiquidity(calculatedWithdrawValue, minToRemoveAmount, deadline);
        transactionRemoveLiquidity = await removeLiquidity.wait(1)
      } else {
        const { token, value } = liquidityData[selectedToken];
        const minToRemoveAmount = floatToBN(value * maxSlippage, token.decimal);

        const removeLiquidityOneToken = await vaultContract.removeLiquidityOneToken(calculatedWithdrawValue, selectedToken, minToRemoveAmount, deadline);
        transactionRemoveLiquidity = await removeLiquidityOneToken.wait(1)
      }

      if (transactionRemoveLiquidity.status) {
        await getInit();
      }
      trackEvent(createEvent({
        action: AnalyticActions.remove,
        category: AnalyticCategories.s4d,
      }))
    } catch (error) {
      console.log('[Error] removeLiquidity => ', error)
    }
    setLoading(false)
  }

  return (
    <ContractContext.Provider
      value={{
        loading,
        svToken,
        daiToken,
        fraxToken,
        tusdToken,
        usdtToken,
        tokenArray,
        tokenValues,
        pairNames,
        totalSupply,
        staked,
        transactions,
        getToSwapAmount,
        getDepositReview,
        getWithdrawAmount,
        onSwap,
        addLiquidity,
        removeLiquidity
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}

export function useS4dVaultContracts() {
  const context = useContext(ContractContext)
  if (!context) {
    throw new Error('Missing stats context')
  }

  const {
    loading,
    svToken,
    daiToken,
    fraxToken,
    tusdToken,
    usdtToken,
    tokenArray,
    tokenValues,
    pairNames,
    totalSupply,
    staked,
    transactions,
    getToSwapAmount,
    getDepositReview,
    getWithdrawAmount,
    onSwap,
    addLiquidity,
    removeLiquidity
  } = context

  return {
    loading,
    svToken,
    daiToken,
    fraxToken,
    tusdToken,
    usdtToken,
    tokenArray,
    tokenValues,
    pairNames,
    totalSupply,
    staked,
    transactions,
    getToSwapAmount,
    getDepositReview,
    getWithdrawAmount,
    onSwap,
    addLiquidity,
    removeLiquidity
  }
}