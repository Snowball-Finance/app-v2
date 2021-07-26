import { memo, useState } from 'react'
import { Grid } from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'

import { useS3dVaultContracts } from 'contexts/s3d-vault-context'
import { useS3fVaultContracts } from 'contexts/s3f-vault-context'
import { usePopup } from 'contexts/popup-context'
import AddIcon from 'components/Icons/AddIcon'
import GradientButton from 'components/UI/Buttons/GradientButton'
import TokenTextField from 'components/UI/TextFields/TokenTextField'
import CardFormWrapper from 'parts/Card/CardFormWrapper'
import AdvancedTransactionOption from 'parts/AdvancedTransactionOption'
import VaultAddLiquidityDialog from 'parts/Vault/VaultAddLiquidityDialog'
import { useFormStyles } from 'styles/use-styles'

const AddLiquidity = ({ vault }) => {
  const classes = useFormStyles();
  const { setPopUp } = usePopup();
  const { tokenArray, getDepositReview, addLiquidity } = (vault === 's3D') ? useS3dVaultContracts() : useS3fVaultContracts();

  const [maxSlippage, setMaxSlippage] = useState(0.1);
  const [liquidityData, setLiquidityData] = useState([]);
  const [receivingValue, setReceivingValue] = useState({});
  const [discount, setDiscount] = useState(0);
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
        token: tokenArray[0],
        value: data?.firstInput || 0
      },
      {
        token: tokenArray[1],
        value: data?.secondInput || 0
      },
      {
        token: tokenArray[2],
        value: data?.thirdInput || 0
      }
    ]

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
    setValue('firstInput', '')
    setValue('secondInput', '')
    setValue('thirdInput', '')
  }

  return (
    <CardFormWrapper title='Add Liquidity'>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          {tokenArray.map((token, index) => {
            return (
              <>
                <Grid item xs={12}>
                  <Controller
                    as={<TokenTextField />}
                    name={(index === 0)
                      ? 'firstInput'
                      : (index === 1)
                        ? 'secondInput'
                        : 'thirdInput'
                    }
                    label='Input:'
                    placeholder='0.0'
                    token={token}
                    balance={token.balance}
                    control={control}
                    defaultValue={''}
                  />

                  {(index < 2) &&
                    <div className={classes.iconContainer}>
                      <AddIcon className={classes.icon} />
                    </div>
                  }
                </Grid>
              </>
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
              color={(vault == 's3D') ? 'primary' : 'secondary'}
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

export default memo(AddLiquidity)