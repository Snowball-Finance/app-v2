import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'

import { IS_MAINNET, CONTRACTS } from 'config'
import MAIN_ERC20_ABI from 'libs/abis/main/erc20.json'
import TEST_ERC20_ABI from 'libs/abis/test/erc20.json'
import S3F_VAULT_ABI from 'libs/abis/s3f-vault.json'
import GAUGE_ABI from 'libs/abis/gauge.json'
import { provider } from 'utils/helpers/utility'
import { getEnglishDateWithTime } from 'utils/helpers/time'
import { usePopup } from 'contexts/popup-context'

const ERC20_ABI = IS_MAINNET ? MAIN_ERC20_ABI : TEST_ERC20_ABI;
const ContractContext = createContext(null);

const unsignedS3fContract = provider ? new ethers.Contract(CONTRACTS.S3F.TOKEN, ERC20_ABI, provider) : null
const unsignedFraxContract = provider ? new ethers.Contract(CONTRACTS.S3F.FRAX, ERC20_ABI, provider) : null
const unsignedTusdContract = provider ? new ethers.Contract(CONTRACTS.S3F.TUSD, ERC20_ABI, provider) : null
const unsignedUsdtContract = provider ? new ethers.Contract(CONTRACTS.S3F.USDT, ERC20_ABI, provider) : null
const unsignedVaultContract = provider ? new ethers.Contract(CONTRACTS.S3F.VAULT, S3F_VAULT_ABI, provider) : null

const tokenArray = [
  { index: 0, name: 'FRAX', priceId: 'frax', decimal: 18 },
  { index: 1, name: 'TUSD', priceId: 'tusd', decimal: 18 },
  { index: 2, name: 'USDT', priceId: 'usdt', decimal: 6 },
]
const pairNames = 'FRAX + TUSD + USDT';

export function S3fVaultContractProvider({ children }) {
  const { library, account } = useWeb3React();
  const { setPopUp } = usePopup();

  const [loading, setLoading] = useState(false);
  const [svToken, setSVToken] = useState({ name: 'S3F', priceId: 's3f', decimal: 18, price: 0, balance: 0, supply: 0, percentage: 0, ratio: 0 });
  const [fraxToken, setFraxToken] = useState({ ...tokenArray[0], price: 0, balance: 0, supply: 0, percentage: 0 })
  const [tusdToken, setTusdToken] = useState({ ...tokenArray[1], price: 0, balance: 0, supply: 0, percentage: 0 })
  const [usdtToken, setUsdtToken] = useState({ ...tokenArray[2], price: 0, balance: 0, supply: 0, percentage: 0 })
  const [totalSupply, setTotalSupply] = useState(0);
  const [staked, setStaked] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const s3fContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S3F.TOKEN, ERC20_ABI, library.getSigner()) : null, [library]);
  const fraxContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S3F.FRAX, ERC20_ABI, library.getSigner()) : null, [library]);
  const tusdContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S3F.TUSD, ERC20_ABI, library.getSigner()) : null, [library]);
  const usdtContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S3F.USDT, ERC20_ABI, library.getSigner()) : null, [library]);
  const vaultContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S3F.VAULT, S3F_VAULT_ABI, library.getSigner()) : null, [library]);
  const gaugeContract = useMemo(() => library ? new ethers.Contract(CONTRACTS.S3F.GAUGE, GAUGE_ABI, library.getSigner()) : null, [library]);
  const tokenValues = useMemo(() => {
    return {
      FRAX: fraxToken,
      TUSD: tusdToken,
      USDT: usdtToken,
    }
  }, [fraxToken, tusdToken, usdtToken]);

  const getTokenContract = (token) => {
    switch (token.name) {
      case 'FRAX': return fraxContract;
      case 'TUSD': return tusdContract;
      case 'USDT': return usdtContract;
      default: return fraxContract;
    }
  }

  const getTokenById = (id) => {
    switch (parseInt(id, 10)) {
      case 0: return fraxToken;
      case 1: return tusdToken;
      case 2: return usdtToken;
      default: return fraxToken;
    }
  }

  useEffect(() => {
    if (unsignedS3fContract && unsignedFraxContract && unsignedTusdContract && unsignedUsdtContract) {
      getSupply();
      getTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unsignedS3fContract, unsignedFraxContract, unsignedTusdContract, unsignedUsdtContract]);

  const getSupply = async () => {
    try {
      const [
        s3fSupply,
        fraxSupply,
        tusdSupply,
        usdtSupply
      ] = await Promise.all([
        unsignedS3fContract.totalSupply({ gasLimit: 1000000 }),
        unsignedFraxContract.balanceOf(CONTRACTS.S3F.VAULT, { gasLimit: 1000000 }),
        unsignedTusdContract.balanceOf(CONTRACTS.S3F.VAULT, { gasLimit: 1000000 }),
        unsignedUsdtContract.balanceOf(CONTRACTS.S3F.VAULT, { gasLimit: 1000000 }),
      ]);

      const s3fSupplyValue = parseFloat(ethers.utils.formatUnits(s3fSupply, svToken.decimal))
      const fraxSupplyValue = parseFloat(ethers.utils.formatUnits(fraxSupply, fraxToken.decimal))
      const tusdSupplyValue = parseFloat(ethers.utils.formatUnits(tusdSupply, tusdToken.decimal))
      const usdtSupplyValue = parseFloat(ethers.utils.formatUnits(usdtSupply, usdtToken.decimal))
      const totalSupply = fraxSupplyValue + tusdSupplyValue + usdtSupplyValue
      const fraxPercentage = totalSupply ? fraxSupplyValue / totalSupply : 0
      const tusdPercentage = totalSupply ? tusdSupplyValue / totalSupply : 0
      const usdtPercentage = totalSupply ? usdtSupplyValue / totalSupply : 0
      const s3fRatio = s3fSupplyValue ? totalSupply / s3fSupplyValue : 0

      setTotalSupply(totalSupply)
      setSVToken((prev) => ({ ...prev, supply: s3fSupplyValue, ratio: s3fRatio }))
      setFraxToken((prev) => ({ ...prev, percentage: fraxPercentage, supply: fraxSupplyValue }));
      setTusdToken((prev) => ({ ...prev, percentage: tusdPercentage, supply: tusdSupplyValue }));
      setUsdtToken((prev) => ({ ...prev, percentage: usdtPercentage, supply: usdtSupplyValue }));
    } catch (error) {
      console.log('[Error] getSupply => ', error)
    }
  }

  useEffect(() => {
    if (!!account && s3fContract && fraxContract && tusdContract && usdtContract && gaugeContract) {
      getInit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, s3fContract, fraxContract, tusdContract, usdtContract, gaugeContract]);

  const getInit = async () => {
    try {
      const [
        s3fBalance,
        fraxBalance,
        tusdBalance,
        usdtBalance,
        s3fSupply,
        stakedBalance
      ] = await Promise.all([
        s3fContract.balanceOf(account, { gasLimit: 1000000 }),
        fraxContract.balanceOf(account, { gasLimit: 1000000 }),
        tusdContract.balanceOf(account, { gasLimit: 1000000 }),
        usdtContract.balanceOf(account, { gasLimit: 1000000 }),
        s3fContract.totalSupply({ gasLimit: 1000000 }),
        gaugeContract.balanceOf(account, { gasLimit: 1000000 })
      ]);

      const s3fBalanceValue = parseFloat(ethers.utils.formatUnits(s3fBalance, svToken.decimal))
      const fraxBalanceValue = parseFloat(ethers.utils.formatUnits(fraxBalance, fraxToken.decimal))
      const tusdBalanceValue = parseFloat(ethers.utils.formatUnits(tusdBalance, tusdToken.decimal))
      const usdtBalanceValue = parseFloat(ethers.utils.formatUnits(usdtBalance, usdtToken.decimal))
      const s3fSupplyValue = parseFloat(ethers.utils.formatUnits(s3fSupply, svToken.decimal))
      const stakedValue = parseFloat(ethers.utils.formatUnits(stakedBalance, 18))
      const s3fPercentage = s3fSupplyValue ? s3fBalanceValue / s3fSupplyValue : 0

      setStaked(stakedValue)
      setSVToken((prev) => ({ ...prev, balance: s3fBalanceValue, percentage: s3fPercentage, supply: s3fSupplyValue }))
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
                balance: ethers.utils.formatUnits(item.args.tokensSold, soldToken.decimal)
              }
            ]
            break;
          case 'RemoveLiquidity':
            const removeTokenAmounts = item.args.tokenAmounts;
            for (let i = 0; i < 3; i++) {
              const removedToken = getTokenById(i)
              transactions = [
                ...transactions,
                {
                  type: 'remove',
                  token: usdtToken.name,
                  time: item.timestamp,
                  balance: -ethers.utils.formatUnits(removeTokenAmounts[0], removedToken.decimal)
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
            for (let i = 0; i < 3; i++) {
              const addedToken = getTokenById(i)
              transactions = [
                ...transactions,
                {
                  type: 'add',
                  token: usdtToken.name,
                  time: item.timestamp,
                  balance: ethers.utils.formatUnits(addTokenAmounts[0], addedToken.decimal)
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
      if (fromAmount === '' || !unsignedVaultContract) { return 0; }
      if (fromToken.name === toToken.name) { return fromAmount }

      const fromAmountValue = ethers.utils.parseUnits(fromAmount.toString(), fromToken.decimal);
      const toAmount = await unsignedVaultContract.calculateSwap(fromToken.index, toToken.index, fromAmountValue)
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
    if (!unsignedVaultContract) { return withdrawAmount }

    if (!account) {
      setPopUp({
        title: 'Network Error',
        text: `Please Switch to Avalanche Chain and connect metamask`
      })
      return withdrawAmount;
    }

    try {
      const calculatedWithdraw = svToken.balance * withdrawPercentage / 100;
      const calculatedWithdrawValue = ethers.utils.parseUnits(calculatedWithdraw.toString(), 18);

      if (checkedValue === -1) {
        const removeAmounts = await unsignedVaultContract.calculateRemoveLiquidity(account, calculatedWithdrawValue);
        for (let i = 0; i < 3; i++) {
          const token = getTokenById(i);
          withdrawAmount[i] = parseFloat(ethers.utils.formatUnits(removeAmounts[i], token.decimal))
        }
      } else {
        const removeAmount = await unsignedVaultContract.calculateRemoveLiquidityOneToken(account, calculatedWithdrawValue, checkedValue);
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

    const minToMint = await unsignedVaultContract.calculateTokenAmount(account, [fraxAmount, tusdAmount, usdtAmount], true)
    const minToMintValue = parseFloat(ethers.utils.formatUnits(minToMint, 18))
    const difference = (minToMintValue * (svToken.ratio || 1)) - totalAmount
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
      const tokenContract = getTokenContract(fromToken);
      const amount = ethers.utils.parseUnits((fromAmount).toString(), fromToken.decimal);
      const tokenApprove = await tokenContract.approve(CONTRACTS.S3F.VAULT, amount);
      const transactionApprove = await tokenApprove.wait(1)

      if (!transactionApprove.status) {
        setLoading(false)
        return;
      }

      const fromAmountValue = ethers.utils.parseUnits(fromAmount.toString(), fromToken.decimal)
      const slippageMultiplier = 1000 - (maxSlippage * 10);
      const minAmount = toAmount * slippageMultiplier / 1000;
      const minAmountValue = ethers.utils.parseUnits(minAmount.toFixed(toToken.decimal).toString(), toToken.decimal)
      const deadline = Date.now() + 180;

      const tokenSwap = await vaultContract.swap(
        fromToken.index,
        toToken.index,
        fromAmountValue,
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
        text: `Please Switch to Avalanche Chain and connect metamask`
      })
      return;
    }

    setLoading(true)
    try {
      for (const item of liquidityData) {
        const { token, value } = item;
        if (value) {
          const tokenContract = getTokenContract(token);
          const tokenApprove = await tokenContract.approve(CONTRACTS.S3F.VAULT, ethers.constants.MaxUint256);
          const transactionApprove = await tokenApprove.wait(1)

          if (!transactionApprove.status) {
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

      const addLiquidity = await vaultContract.addLiquidity([fraxAmount, tusdAmount, usdtAmount], minToMintAmount, deadline);
      const transactionAddLiquidity = await addLiquidity.wait(1)

      if (transactionAddLiquidity.status) {
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
      const allowedTokens = await s3fContract.allowance(account, CONTRACTS.S3F.VAULT)
      if (allowedTokens !== ethers.constants.MaxUint256) {
        const tokenApprove = await s3fContract.approve(CONTRACTS.S3F.VAULT, ethers.constants.MaxUint256)
        const transactionApprove = await tokenApprove.wait(1)

        if (!transactionApprove.status) {
          setLoading(false)
          return;
        }
      }

      const calculatedWithdraw = svToken.balance * withdrawPercentage / 100;
      const calculatedWithdrawValue = ethers.utils.parseUnits(calculatedWithdraw.toString(), 18);
      const deadline = Date.now() + 180;
      let transactionRemoveLiquidity = {};
      if (selectedToken === -1) {
        const minToRemoveAmount = [];
        for (let i = 0; i < 3; i++) {
          const { token, value } = liquidityData[i];
          minToRemoveAmount[i] = ethers.utils.parseUnits((value * maxSlippage).toFixed(token.decimal).toString(), token.decimal)
        }

        const removeLiquidity = await vaultContract.removeLiquidity(calculatedWithdrawValue, minToRemoveAmount, deadline);
        transactionRemoveLiquidity = await removeLiquidity.wait(1)
      } else {
        const { token, value } = liquidityData[selectedToken];
        const minToRemoveAmount = ethers.utils.parseUnits((value * maxSlippage).toFixed(token.decimal).toString(), token.decimal)

        const removeLiquidityOneToken = await vaultContract.removeLiquidityOneToken(calculatedWithdrawValue, selectedToken, minToRemoveAmount, deadline);
        transactionRemoveLiquidity = await removeLiquidityOneToken.wait(1)
      }

      if (transactionRemoveLiquidity.status) {
        await getInit();
      }
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

export function useS3fVaultContracts() {
  const context = useContext(ContractContext)
  if (!context) {
    throw new Error('Missing stats context')
  }

  const {
    loading,
    svToken,
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