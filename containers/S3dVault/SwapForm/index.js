
import { memo, useEffect, useState } from 'react'
import { Grid } from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { useS3dVaultContracts } from 'contexts/s3d-vault-context'
import SwapIcon from 'components/Icons/SwapIcon'
import GradientButton from 'components/UI/Buttons/GradientButton'
import TokenTextField from 'components/UI/TextFields/TokenTextField'
import CardFormWrapper from 'parts/Card/CardFormWrapper'
import AdvancedTransactionOption from 'parts/AdvancedTransactionOption'
import VaultSwapDialog from 'parts/Vault/VaultSwapDialog'
import { BALANCE_VALID } from 'utils/constants/validations'
import { useFormStyles } from 'styles/use-styles'

const schema = yup.object().shape({
  fromSwap: BALANCE_VALID
});

const SwapForm = () => {
  const classes = useFormStyles();
  const { tokenArray, getToSwapAmount, onSwap } = useS3dVaultContracts()

  const [fromToken, setFromToken] = useState({});
  const [toToken, setToToken] = useState({});
  const [toSwap, setToSwap] = useState(0);
  const [maxSlippage, setMaxSlippage] = useState(0.1)
  const [swapDialog, setSwapDialog] = useState(false);

  useEffect(() => {
    setFromToken(tokenArray[0])
    setToToken(tokenArray[1])
  }, [tokenArray]);

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
    setValue('fromSwap', 0)
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
              token={fromToken}
              setToken={setFromToken}
              tokens={tokenArray}
              balance={fromToken.balance}
              error={errors.fromSwap?.message}
              control={control}
              defaultValue={0}
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
              token={toToken}
              setToken={setToToken}
              tokens={tokenArray}
              balance={toToken.balance}
              value={parseFloat(toSwap || 0, 3).toFixed(3)}
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