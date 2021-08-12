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

    const { minToMintValue } = await getDepositReview(liquidityData)
    const receivingValue = {
      token: vault,
      value: minToMintValue
    }

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
    </CardFormWrapper>
  )
}

export default memo(AddLiquidityForm)