
import { memo, useEffect, useState, useMemo } from 'react'
import { Grid } from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { useS3fVaultContracts } from 'contexts/s3f-vault-context'
import SwapIcon from 'components/Icons/SwapIcon'
import GradientButton from 'components/UI/Buttons/GradientButton'
import TokenTextField from 'components/UI/TextFields/TokenTextField'
import CardFormWrapper from 'parts/Card/CardFormWrapper'
import AdvancedTransactionOption from 'parts/AdvancedTransactionOption'
import VaultSwapDialog from 'parts/Vault/VaultSwapDialog'
import { BALANCE_VALID } from 'utils/constants/validations'
import { useFormStyles } from 'styles/use-styles'
import { isEmpty } from 'utils/helpers/utility'

const schema = yup.object().shape({
  fromSwap: BALANCE_VALID
});

const SwapForm = () => {
  const classes = useFormStyles();
  const { tokenArray, tokenValues, getToSwapAmount, onSwap } = useS3fVaultContracts()

  const [fromToken, setFromToken] = useState({});
  const [toToken, setToToken] = useState({});
  const [toSwap, setToSwap] = useState(0);
  const [maxSlippage, setMaxSlippage] = useState(0.1)
  const [swapDialog, setSwapDialog] = useState(false);

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

  const fromSwap = watch('fromSwap')

  useEffect(() => {
    const calculateToSwap = async () => {
      const toSwap = await getToSwapAmount(fromToken, toToken, fromSwap);
      setToSwap(toSwap)
    }
    calculateToSwap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromToken, toToken, fromSwap])

  const onSubmit = () => {
    setSwapDialog(true)
  }

  const onSwapHandler = async () => {
    setSwapDialog(false)
    const params = {
      fromToken,
      toToken,
      fromAmount: fromSwap,
      toAmount: toSwap,
      maxSlippage
    }
    await onSwap(params)
    setValue('fromSwap', '')
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
              token={fromToken}
              setToken={setFromToken}
              tokens={tokenArray}
              balance={fromTokenBalance}
              error={errors.fromSwap?.message}
              control={control}
              defaultValue={''}
            />
            <div className={classes.iconContainer}>
              <SwapIcon className={classes.icon} />
            </div>
          </Grid>
          <Grid item xs={12}>
            <TokenTextField
              readOnly
              isTokenSelect
              disabledMax
              label='Swap to:'
              placeholder='0.0'
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
              color='secondary'
              className={classes.button}
            >
              Swap
            </GradientButton>
          </Grid>
        </Grid>
      </form>
      {swapDialog &&
        <VaultSwapDialog
          open={swapDialog}
          setOpen={setSwapDialog}
          onConfirm={onSwapHandler}
          token={toToken}
          value={toSwap}
          maxSlippage={maxSlippage}
        />
      }
    </CardFormWrapper>
  )
}

export default memo(SwapForm)