
import { memo, useCallback, useState } from 'react'
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
import TOKENS from 'utils/temp/tokens'
import { useFormStyles } from 'styles/use-styles'

const schema = yup.object().shape({
  fromSwap: BALANCE_VALID,
  toSwap: BALANCE_VALID,
});

const SwapForm = () => {
  const classes = useFormStyles();

  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[1]);

  const { control, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = useCallback(async (data) => {
    try {
      console.log(data);
    } catch (error) {
      console.log(error)
    }
  }, []);

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
            <Controller
              as={<TokenTextField />}
              isTokenSelect
              name='toSwap'
              label='Swap to:'
              token={toToken}
              setToken={setToToken}
              tokens={TOKENS}
              balance={toToken.balance}
              error={errors.toSwap?.message}
              control={control}
              defaultValue={0}
            />
          </Grid>
          <Grid item xs={12}>
            <AdvancedTransactionOption />
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
    </CardFormWrapper>
  )
}

export default memo(SwapForm)