
import { memo, useState } from 'react'
import { Grid } from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'

import AddIcon from 'components/Icons/AddIcon'
import GradientButton from 'components/UI/Buttons/GradientButton'
import TokenTextField from 'components/UI/TextFields/TokenTextField'
import CardFormWrapper from 'parts/Card/CardFormWrapper'
import AdvancedTransactionOption from 'parts/AdvancedTransactionOption'
import VaultLiquidityDialog from 'parts/Vault/VaultLiquidityDialog'
import TOKENS from 'utils/temp/tokens'
import { useFormStyles } from 'styles/use-styles'

const LiquidityForm = () => {
  const classes = useFormStyles();

  const [firstToken, setFirstToken] = useState(TOKENS[0]);
  const [secondToken, setSecondToken] = useState(TOKENS[1]);
  const [thirdToken, setThirdToken] = useState(TOKENS[2]);
  const [maxSlippage, setMaxSlippage] = useState(0.1)
  const [liquidityData, setLiquidityData] = useState([])
  const [receivingValue, setReceivingValue] = useState({})
  const [discount, setDiscount] = useState(0)
  const [liquidityDialog, setLiquidityDialog] = useState(false);

  const { control, handleSubmit, errors } = useForm();

  const onSubmit = (data) => {
    const liquidityData = [
      {
        token: TOKENS[0],
        value: data.firstInput
      },
      {
        token: TOKENS[1],
        value: data.secondInput
      },
      {
        token: TOKENS[2],
        value: data.thirdInput
      }
    ]

    const receivingValue = {
      token: 's3D',
      value: 30.95
    }
    setLiquidityData(liquidityData)
    setReceivingValue(receivingValue)
    setDiscount(0.94)
    setLiquidityDialog(true)
  }

  const addLiquidity = () => {
    setLiquidityDialog(false)
    try {
      console.log('confirm logic');
    } catch (error) {
      console.log(error)
    }
  }

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
              Add liquidity
            </GradientButton>
          </Grid>
        </Grid>
      </form>
      {liquidityDialog &&
        <VaultLiquidityDialog
          discount={discount}
          liquidityData={liquidityData}
          receivingValue={receivingValue}
          maxSlippage={maxSlippage}
          open={liquidityDialog}
          setOpen={setLiquidityDialog}
          onConfirm={addLiquidity}
        />
      }
    </CardFormWrapper>
  )
}

export default memo(LiquidityForm)