import { memo, useState } from 'react'
import { Grid } from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'

import { usePopup } from 'contexts/popup-context'
import AddIcon from 'components/Icons/AddIcon'
import GradientButton from 'components/UI/Buttons/GradientButton'
import TokenTextField from 'components/UI/TextFields/TokenTextField'
import CardFormWrapper from 'parts/Card/CardFormWrapper'
import AdvancedTransactionOption from 'parts/AdvancedTransactionOption'
import { useFormStyles } from 'styles/use-styles'
import getVaultInfo from 'utils/helpers/getVaultInfo'
import { floatToBN } from 'utils/helpers/format'
import VaultAddLiquidityDialog from './VaultAddLiquidityDialog'

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

  const { control, handleSubmit, setValue } = useForm();
  const [open, setAddLiquidityDialog] = useState(false);
  const [tokenData, setTokenData] = useState();
  const [s4d, setS4d] = useState(0);
  const [s4dRatio, setS4dRatio] = useState(0);
  const [usdValue, setUsdValue] = useState(0);
  const [discountValue, setDiscount] = useState(0);
  const [s4dTotal, setS4dTotal] = useState(0);

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
          value: floatToBN(data[`input${token.index}`], token.decimal) || 0
        }
      ]
    }

    const { minToMintValue, discount, ratio, usdValue, totalAmount } = await getDepositReview(liquidityData)

    setS4d(minToMintValue);
    setS4dRatio(ratio);
    setUsdValue(usdValue);
    setDiscount(discount)
    setS4dTotal(totalAmount);
    setTokenData(liquidityData)
    setAddLiquidityDialog(true)

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
                  placeholder='0.00'
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
        {open &&
          <VaultAddLiquidityDialog
            open={open}
            setOpen={setAddLiquidityDialog}
            maxSlippage={maxSlippage}
            liquidityData={tokenData}
            addLiquidity={addLiquidity}
            vault={vault}
            totalAmount={s4dTotal}
            minToMintValue={s4d}
            discount={discountValue}
            ratio={s4dRatio}
            usdValue={usdValue}
          />
        }
      </form>
    </CardFormWrapper>
  )
}

export default memo(AddLiquidityForm)