
import { memo, useState, useEffect, useCallback, useMemo } from 'react'
import { Grid } from '@material-ui/core'

import SnowDialog from 'components/SnowDialog'
import ContainedButton from 'components/UI/Buttons/ContainedButton'
import AdvancedTransactionOption from 'parts/AdvancedTransactionOption'
import CurrencyItem from 'containers/StableVault/Shared/CurrencyItem'
import WithdrawPercentage from '../WithdrawPercentage'
import WithdrawTokenRadio from '../WithdrawTokenRadio'
import { useFormStyles } from 'styles/use-styles'

const VaultRemoveLiquidityDialog = ({
  open,
  setOpen,
  tokenArray,
  getWithdrawAmount,
  removeLiquidity,
}) => {
  const classes = useFormStyles();

  const [withdrawPercentage, setWithdrawPercentage] = useState(0);
  const [selectedToken, setSelectedToken] = useState(-1);
  const [maxSlippage, setMaxSlippage] = useState(0.1);
  const [withdrawAmount, setWithdrawAmount] = useState([]);

  useEffect(() => {
    const load = async () => {
      const withdrawAmount = await getWithdrawAmount(withdrawPercentage, selectedToken)
      setWithdrawAmount(withdrawAmount)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withdrawPercentage, selectedToken])

  const isUnValidation = useMemo(() => {
    let validation = true;
    for (const amount of withdrawAmount) {
      validation = validation && !amount
    }
    return validation
  }, [withdrawAmount])

  const onSubmit = async () => {
    let liquidityData = []
    for (const token of tokenArray) {
      liquidityData = [
        ...liquidityData,
        {
          token,
          value: withdrawAmount[token.index] || 0
        }
      ]
    }

    await removeLiquidity(liquidityData, withdrawPercentage, maxSlippage, selectedToken)
    setOpen(false)
  }

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <SnowDialog
      open={open}
      title='Withdraw'
      onClose={handleClose}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <WithdrawPercentage
            value={withdrawPercentage}
            setValue={setWithdrawPercentage}
          />
        </Grid>
        <Grid item xs={12}>
          <WithdrawTokenRadio
            tokens={tokenArray}
            value={selectedToken}
            setValue={setSelectedToken}
          />
        </Grid>
        {tokenArray.map((token, index) => {
          return (
            <Grid key={index} item xs={12}>
              <CurrencyItem
                token={token}
                value={withdrawAmount[index] || 0}
              />
            </Grid>
          );
        })}

        <Grid item xs={12}>
          <AdvancedTransactionOption
              state={{
                slippage:maxSlippage
              }}
              handleSlippage={setMaxSlippage}
              useApproval={false}
          />
        </Grid>
        <Grid item xs={12}>
          <ContainedButton
            fullWidth
            disabled={isUnValidation}
            className={classes.button}
            onClick={onSubmit}
          >
            Withdraw
          </ContainedButton>
        </Grid>
      </Grid>
    </SnowDialog>
  );
}

export default memo(VaultRemoveLiquidityDialog)