
import { memo, useMemo, useState } from 'react'
import { Grid } from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import SwapIcon from 'components/Icons/SwapIcon'
import GradientButton from 'components/UI/Buttons/GradientButton'
import TokenTextField from 'components/UI/TextFields/TokenTextField'
import CardFormWrapper from 'parts/Card/CardFormWrapper'
import AdvancedTransactionOption from 'parts/AdvancedTransactionOption'
import VaultSwapDialog from 'parts/Vault/VaultSwapDialog'
import { BALANCE_VALID } from 'utils/constants/validations'
import TOKENS from 'utils/temp/tokens'
import { useFormStyles } from 'styles/use-styles'

const schema = yup.object().shape({
  fromSwap: BALANCE_VALID
});

const SwapForm = () => {
  const classes = useFormStyles();

  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[1]);
  const [maxSlippage, setMaxSlippage] = useState(0.1)
  const [swapDialog, setSwapDialog] = useState(false);

  const { control, handleSubmit, errors, watch } = useForm({
    resolver: yupResolver(schema)
  });

  const fromSwap = watch('fromSwap');
  const toSwap = useMemo(() => fromSwap * 0.95, [fromSwap]);

  const onSubmit = () => {
    setSwapDialog(true)
  }

  const onSwap = () => {
    setSwapDialog(false)
    try {
      console.log('confirm logic');
    } catch (error) {
      console.log(error)
    }
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
              tokens={TOKENS}
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
              tokens={TOKENS}
              balance={toToken.balance}
              value={toSwap.toFixed(3)}
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
          onConfirm={onSwap}
          token={toToken}
          value={toSwap}
          maxSlippage={maxSlippage}
        />
      }
    </CardFormWrapper>
  )
}

export default memo(SwapForm)