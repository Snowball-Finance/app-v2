import { memo, useEffect, useMemo, useState } from 'react'
import { Grid } from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import SwapIcon from 'components/Icons/SwapIcon'
import GradientButton from 'components/UI/Buttons/GradientButton'
import TokenTextField from 'components/UI/TextFields/TokenTextField'
import CardFormWrapper from 'parts/Card/CardFormWrapper'
import AdvancedTransactionOption from 'parts/AdvancedTransactionOption'
import { BALANCE_VALID } from 'utils/constants/validations'
import { isEmpty } from 'utils/helpers/utility'
import getVaultInfo from 'utils/helpers/getVaultInfo'
import { usePopup } from 'contexts/popup-context'
import { useFormStyles } from 'styles/use-styles'
import { floatToBN } from 'utils/helpers/format'

const schema = yup.object().shape({
  fromSwap: BALANCE_VALID
});

const SwapForm = ({
  vault,
  tokenArray,
  tokenValues,
  getToSwapAmount,
  onSwap
}) => {
  const classes = useFormStyles();
  const { setPopUp } = usePopup();

  const vaultInfo = getVaultInfo(vault)
  const [fromToken, setFromToken] = useState({});
  const [toToken, setToToken] = useState({});
  const [toSwap, setToSwap] = useState(0);
  const [maxSlippage, setMaxSlippage] = useState(0.1)

  useEffect(() => {
    setFromToken(tokenArray[0])
    setToToken(tokenArray[1])
  }, [tokenArray]);

  const fromTokenBalance = useMemo(() => {
    if (isEmpty(fromToken) && isEmpty(tokenValues)) {
      return 0
    }
    return tokenValues[fromToken.name]?.balance || 0
  }, [fromToken, tokenValues])

  const toTokenBalance = useMemo(() => {
    if (isEmpty(toToken) && isEmpty(tokenValues)) {
      return 0
    }
    return tokenValues[toToken.name]?.balance || 0
  }, [toToken, tokenValues])

  const { control, handleSubmit, errors, watch, setValue } = useForm({
    resolver: yupResolver(schema)
  });

  const fromSwap = watch('fromSwap');

  useEffect(() => {
    const calculateToSwap = async () => {
      if(fromSwap > 0){
        const toSwap = await getToSwapAmount(fromToken, toToken, 
          floatToBN(fromSwap,fromToken.decimal));
        setToSwap(toSwap)
      }
    }
    calculateToSwap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromToken, toToken, fromSwap])

  const onSubmit = async () => {
    if (fromToken.name === toToken.name) {
      setPopUp({
        title: 'Alert',
        text: 'You cannot select same token to swap. Please choose other token.'
      })
      return
    }

    const params = {
      fromToken,
      toToken,
      fromAmount: floatToBN(fromSwap,fromToken.decimal),
      toAmount: toSwap,
      maxSlippage
    }
    await onSwap(params)
    setValue('fromSwap', '')
  }

  const swapIconHandler = () => {
    const newFromToken = toToken;
    const newToToken = fromToken;
    setFromToken(newFromToken)
    setToToken(newToToken)
  }

  return (
    <CardFormWrapper title='Swap'>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Controller
              as={<TokenTextField />}
              isTokenSelect
              name='fromSwap'
              label='Swap from:'
              placeholder='0.0'
              disabledToken={toToken}
              token={fromToken}
              setToken={setFromToken}
              tokens={tokenArray}
              balance={fromTokenBalance}
              error={errors.fromSwap?.message}
              control={control}
              defaultValue={''}
            />
            <div className={classes.iconContainer}>
              <SwapIcon
                className={classes.icon}
                onClick={swapIconHandler}
              />
            </div>
          </Grid>
          <Grid item xs={12}>
            <TokenTextField
              readOnly
              isTokenSelect
              disabledMax
              label='Swap to:'
              placeholder='0.0'
              disabledToken={fromToken}
              token={toToken}
              setToken={setToToken}
              tokens={tokenArray}
              balance={toTokenBalance}
              value={!!toSwap ? parseFloat(toSwap || 0, 3).toFixed(3) : ''}
            />
          </Grid>
          <Grid item xs={12}>
            <AdvancedTransactionOption
              value={maxSlippage}
              setValue={setMaxSlippage}
            />
          </Grid>
          <Grid item xs={12}>
            <GradientButton
              fullWidth
              type='submit'
              color={vaultInfo.color}
              className={classes.button}
            >
              Swap
            </GradientButton>
          </Grid>
        </Grid>
      </form>
    </CardFormWrapper>
  )
}
export default memo(SwapForm)