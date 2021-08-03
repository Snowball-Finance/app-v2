
import { memo, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { useStakingContract } from 'contexts/staking-context'
import ContainedButton from 'components/UI/Buttons/ContainedButton'
import SnowTextField from 'components/UI/TextFields/SnowTextField'
import { BALANCE_VALID } from 'utils/constants/validations'

const useStyles = makeStyles(() => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
}));

const IncreaseAmount = () => {
  const classes = useStyles();
  const { snowballBalance, increaseAmount } = useStakingContract();

  const schema = yup.object().shape({
    balance: BALANCE_VALID.max(snowballBalance, snowballBalance > 0
      ? `This field should be less than ${snowballBalance}.`
      : 'Your balance is 0'),
  });

  const { control, handleSubmit, errors, setValue } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = useCallback(async (data) => {
    try {
      await increaseAmount(data)
      await setValue('balance', 0)
    } catch (error) {
      console.log(error)
    }
  }, [increaseAmount, setValue]);

  return (
    <form
      noValidate
      className={classes.form}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography
        variant='body1'
        color='textPrimary'
        gutterBottom
      >
        Each wallet can only lock their SNOB for a single period of time.
        To lock different amounts of SNOB for different periods of time,
        use multiple wallets.
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            as={<SnowTextField />}
            type='number'
            name='balance'
            label={`Balance: ${parseFloat(snowballBalance).toFixed(3) - 0.001}`}
            placeholder='Balance'
            onMax={() => setValue('balance', (parseFloat(snowballBalance).toFixed(3) - 0.001))}
            error={errors.balance?.message}
            control={control}
            defaultValue={0}
          />
        </Grid>
        <Grid item xs={12}>
          <ContainedButton
            fullWidth
            type='submit'
          >
            Increase Amount
          </ContainedButton>
        </Grid>
      </Grid>
    </form>
  )
}

export default memo(IncreaseAmount)
