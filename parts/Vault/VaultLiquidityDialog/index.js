
import { memo, useCallback, useMemo } from 'react'
import {
  Grid,
  Divider,
  Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import SnowDialog from 'components/SnowDialog'
import CurrencyItem from 'parts/Vault/CurrencyItem'

const useStyles = makeStyles(() => ({
  header: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  divider: {
    height: 1
  },
  rowContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  description: {
    fontStyle: 'italic'
  },
  label: {
    fontWeight: 'bold'
  }
}));

const VaultLiquidityDialog = ({
  discount,
  liquidityData,
  receivingValue,
  maxSlippage,
  open,
  setOpen,
  onConfirm
}) => {
  const classes = useStyles();

  const totalValue = useMemo(() => {
    let total = 0;
    for (const item of liquidityData) {
      total += item.value
    }
    return total
  }, [liquidityData])

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <SnowDialog
      open={open}
      title='Review Liquidity'
      onClose={handleClose}
      cancelLabel='Close'
      confirmLabel='Confirm Liquidity'
      onCancel={handleClose}
      onConfirm={onConfirm}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography className={classes.header}>
            Depositing
          </Typography>
        </Grid>
        {liquidityData.map((item, index) => (
          <Grid item xs={12} key={index}>
            <CurrencyItem
              token={item.token}
              value={item.value}
            />
          </Grid>
        ))}
        <Grid item xs={12} className={classes.rowContainer}>
          <Typography className={classes.label}>
            Total:
          </Typography>
          <Typography>
            {totalValue}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider
            flexItem
            orientation='horizontal'
            className={classes.divider}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography className={classes.header}>
            Receiving
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.rowContainer}>
          <Typography className={classes.label}>
            {receivingValue.token}:
          </Typography>
          <Typography>
            {receivingValue.value}
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.rowContainer}>
          <Typography className={classes.label}>
            Discount:
          </Typography>
          <Typography>
            {discount}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider
            flexItem
            orientation='horizontal'
            className={classes.divider}
          />
        </Grid>
        <Grid item xs={12} className={classes.rowContainer}>
          <Typography>
            Max slippage
          </Typography>
          <Typography>
            {`${maxSlippage}%`}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider
            flexItem
            orientation='horizontal'
            className={classes.divider}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography className={classes.description}>
            Output is estimated. If the price changes by more than
            the max slippage the transaction will revert.
          </Typography>
        </Grid>
      </Grid>
    </SnowDialog>
  );
}

export default memo(VaultLiquidityDialog)