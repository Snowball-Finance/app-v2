
import { memo, useCallback, useState } from 'react'
import { Grid } from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import AddIcon from 'components/Icons/AddIcon'
import GradientButton from 'components/UI/Buttons/GradientButton'
import TokenTextField from 'components/UI/TextFields/TokenTextField'
import CardFormWrapper from 'parts/Card/CardFormWrapper'
import AdvancedTransactionOption from 'parts/AdvancedTransactionOption'
import { BALANCE_VALID } from 'utils/constants/validations'
import TOKENS from 'utils/temp/tokens'
import { useFormStyles } from 'styles/use-styles'

const schema = yup.object().shape({
  firstInput: BALANCE_VALID,
  secondInput: BALANCE_VALID,
  thirdInput: BALANCE_VALID,
});

const LiquidityForm = () => {
  const classes = useFormStyles();

  const [firstToken, setFirstToken] = useState(TOKENS[0]);
  const [secondToken, setSecondToken] = useState(TOKENS[1]);
  const [thirdToken, setThirdToken] = useState(TOKENS[2]);

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
    <CardFormWrapper title='Add liquidity'>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Controller
              as={<TokenTextField />}
              name='firstInput'
              label='Input:'
              token={firstToken}
              setToken={setFirstToken}
              tokens={TOKENS}
              balance={firstToken.balance}
              error={errors.firstInput?.message}
              control={control}
              defaultValue={0}
            />
            <div className={classes.iconContainer}>
              <AddIcon className={classes.icon} />
            </div>
          </Grid>
          <Grid item xs={12}>
            <Controller
              as={<TokenTextField />}
              name='secondInput'
              label='Input:'
              token={secondToken}
              setToken={setSecondToken}
              tokens={TOKENS}
              balance={secondToken.balance}
              error={errors.secondInput?.message}
              control={control}
              defaultValue={0}
            />
            <div className={classes.iconContainer}>
              <AddIcon className={classes.icon} />
            </div>
          </Grid>
          <Grid item xs={12}>
            <Controller
              as={<TokenTextField />}
              name='thirdInput'
              label='Input:'
              token={thirdToken}
              setToken={setThirdToken}
              tokens={TOKENS}
              balance={thirdToken.balance}
              error={errors.thirdInput?.message}
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

export default memo(LiquidityForm)