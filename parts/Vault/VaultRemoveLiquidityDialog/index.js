
import { memo, useCallback } from 'react'
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
}));

const VaultRemoveLiquidityDialog = ({
  liquidityData,
  maxSlippage,
  open,
  setOpen,
  onConfirm
}) => {
  const classes = useStyles();

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <SnowDialog
      open={open}
      title='You will receive'
      onClose={handleClose}
      cancelLabel='Close'
      confirmLabel='Confirm Withdraw'
      onCancel={handleClose}
      onConfirm={onConfirm}
    >
      <Grid container spacing={2}>
        {liquidityData.map((item, index) => (
          <Grid item xs={12} key={index}>
            <CurrencyItem
              token={item.token}
              value={item.value}
            />
          </Grid>
        ))}
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

export default memo(VaultRemoveLiquidityDialog)