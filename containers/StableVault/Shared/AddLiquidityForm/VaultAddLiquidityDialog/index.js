
import { memo, useState, useEffect, useCallback, useMemo } from 'react'
import { Grid } from '@material-ui/core'

import SnowDialog from 'components/SnowDialog'
import ContainedButton from 'components/UI/Buttons/ContainedButton'
import { useFormStyles } from 'styles/use-styles'
import SubtitleItem from '../SubTitleItem'
import TokenItem from '../TokenItem'
import ReceiveItem from '../ReceiveItem'
import BonusItem from '../BonusItem'
import DiscountItem from '../DiscountItem'
import SlippageItem from '../SlippageItem'
import TotalItem from '../TotalItem'
import { BNToFloat } from 'utils/helpers/format'

const VaultAddLiquidityDialog = ({
  open,
  setOpen,
  maxSlippage,
  liquidityData,
  addLiquidity,
  vault,
  totalAmount,
  minToMintValue,
  discount,
  ratio,
  usdValue,
}) => {
  const classes = useFormStyles();

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onDeposit = async() => {
    
    const receivingValue = {
      token: vault,
      value: minToMintValue
    }

    await addLiquidity(liquidityData, maxSlippage, receivingValue)
    handleClose();
  }


  return (
    <SnowDialog
      open={open}
      title='Deposit'
      onClose={handleClose}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SubtitleItem title="Details"/>
        </Grid>
        {liquidityData.map((item, index) => {
          return (
            <Grid key={index} item xs={12}>
              <TokenItem
                token={item.token}
                value={BNToFloat(item.value, item.token.decimal)}
              />
            </Grid>
          );
        })}
        <Grid item xs={12}>
          <TotalItem name="Total" value={totalAmount}/>
        </Grid>
        <Grid item xs={12}>
          <SubtitleItem title="You will receive"/>
        </Grid>
        <Grid item xs={12}>
          <ReceiveItem name="S4D" value={minToMintValue} />
          <ReceiveItem name="S4D Ratio:" value={ratio} />
          <ReceiveItem name="USD Value:" value={usdValue} />
          {discount >= 0 ? <BonusItem name="Bonus" value={discount} /> : <DiscountItem name="Discount" value={discount}/>}
          <SlippageItem name="Max Slippage" value={maxSlippage} />
        </Grid>
        <Grid item xs={12}>
          <ContainedButton
            fullWidth
            className={classes.button}
            onClick={() => onDeposit()}
          >
            Deposit
          </ContainedButton>
        </Grid>
      </Grid>
    </SnowDialog>
  );
}

export default memo(VaultAddLiquidityDialog)