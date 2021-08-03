import { memo, useState } from 'react'
import { Grid } from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'

import { usePopup } from 'contexts/popup-context'
import AddIcon from 'components/Icons/AddIcon'
import GradientButton from 'components/UI/Buttons/GradientButton'
import TokenTextField from 'components/UI/TextFields/TokenTextField'
import CardFormWrapper from 'parts/Card/CardFormWrapper'
import AdvancedTransactionOption from 'parts/AdvancedTransactionOption'
import VaultAddLiquidityDialog from './VaultAddLiquidityDialog'
import { useFormStyles } from 'styles/use-styles'
import getVaultInfo from 'utils/helpers/getVaultInfo'

const AddLiquidityForm = ({
  vault,
  tokenArray,
  tokenValues,
  getDepositReview,
  addLiquidity
}) => {
  const classes = useFormStyles();
  const { setPopUp } = usePopup();

  const vaultInfo = getVaultInfo(vault)
  const [maxSlippage, setMaxSlippage] = useState(0.1);
  const [liquidityData, setLiquidityData] = useState([]);
  const [receivingValue, setReceivingValue] = useState({});
  const [discount, setDiscount] = useState(0);
  const [liquidityDialog, setLiquidityDialog] = useState(false);

  const { control, handleSubmit, setValue } = useForm();

  const onSubmit = async (data) => {
    let isValidation = true;
    for (const token of tokenArray) {
      isValidation = isValidation && !data[`input${token.index}`]
    }

    if (isValidation) {
      setPopUp({
        title: 'Input Error',
        text: `Please enter at least one input`
      })
      return;
    }

    let liquidityData = []
    for (const token of tokenArray) {
      liquidityData = [
        ...liquidityData,
        {
          token,
          value: data[`input${token.index}`] || 0
        }
      ]
    }

    const { minToMintValue, discount } = await getDepositReview(liquidityData)
    const receivingValue = {
      token: vault,
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
    for (const token of tokenArray) {
      setValue(`input${token.index}`, '')
    }
  }

  return (
    <CardFormWrapper title='Add Liquidity'>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          {tokenArray.map((token) => {
            const tokenBalance = tokenValues[token.name]?.balance || 0
            return (
              <Grid key={token.index} item xs={12}>
                <Controller
                  as={<TokenTextField />}
                  name={`input${token.index}`}
                  label='Input:'
                  placeholder='0.0'
                  token={token}
                  balance={tokenBalance}
                  control={control}
                  defaultValue={''}
                />
                {(token.index < tokenArray.length - 1) &&
                  <div className={classes.iconContainer}>
                    <AddIcon className={classes.icon} />
                  </div>
                }
              </Grid>
            );
          })}
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
              Add Liquidity
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

export default memo(AddLiquidityForm)