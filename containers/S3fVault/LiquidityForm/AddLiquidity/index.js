
import { memo, useState } from 'react'
import { Grid } from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'

import { usePopup } from 'contexts/popup-context'
import { useS3fVaultContracts } from 'contexts/s3f-vault-context'
import AddIcon from 'components/Icons/AddIcon'
import GradientButton from 'components/UI/Buttons/GradientButton'
import TokenTextField from 'components/UI/TextFields/TokenTextField'
import CardFormWrapper from 'parts/Card/CardFormWrapper'
import AdvancedTransactionOption from 'parts/AdvancedTransactionOption'
import VaultAddLiquidityDialog from 'parts/Vault/VaultAddLiquidityDialog'
import { useFormStyles } from 'styles/use-styles'

const AddLiquidity = () => {
  const classes = useFormStyles()
  const { setPopUp } = usePopup()
  const { fraxToken, tusdToken, usdtToken, getDepositReview, addLiquidity } = useS3fVaultContracts()

  const [maxSlippage, setMaxSlippage] = useState(0.1)
  const [liquidityData, setLiquidityData] = useState([])
  const [receivingValue, setReceivingValue] = useState({})
  const [discount, setDiscount] = useState(0)
  const [liquidityDialog, setLiquidityDialog] = useState(false);

  const { control, handleSubmit, setValue } = useForm();

  const onSubmit = async (data) => {
    if (!data.firstInput && !data.secondInput && !data.thirdInput) {
      setPopUp({
        title: 'Input Error',
        text: `Please enter at least one input`
      })
      return;
    }

    const liquidityData = [
      {
        token: fraxToken,
        value: data.firstInput
      },
      {
        token: tusdToken,
        value: data.secondInput
      },
      {
        token: usdtToken,
        value: data.thirdInput
      }
    ]

    const { minToMintValue, discount } = await getDepositReview(liquidityData)
    const receivingValue = {
      token: 's3F',
      value: minToMintValue
    }

    setLiquidityData(liquidityData)
    setReceivingValue(receivingValue)
    setDiscount(discount)
    setLiquidityDialog(true)
  }

  const addLiquidityHandler = async () => {
    setLiquidityDialog(false)
    await addLiquidity(liquidityData, maxSlippage, receivingValue)
    setValue('firstInput', 0)
    setValue('secondInput', 0)
    setValue('thirdInput', 0)
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
              token={fraxToken}
              balance={fraxToken.balance}
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
              token={tusdToken}
              balance={tusdToken.balance}
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
              token={usdtToken}
              balance={usdtToken.balance}
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
              color='secondary'
              className={classes.button}
            >
              Add liquidity
            </GradientButton>
          </Grid>
        </Grid>
      </form>
      {liquidityDialog &&
        <VaultAddLiquidityDialog
          discount={discount}
          liquidityData={liquidityData}
          receivingValue={receivingValue}
          maxSlippage={maxSlippage}
          open={liquidityDialog}
          setOpen={setLiquidityDialog}
          onConfirm={addLiquidityHandler}
        />
      }
    </CardFormWrapper>
  )
}

export default memo(AddLiquidity)