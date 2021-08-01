
import { memo, useCallback } from 'react'
import {
  Grid,
  Divider,
  Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import SnowDialog from 'components/SnowDialog'
import CurrencyItem from 'containers/StableVault/Shared/CurrencyItem'

const useStyles = makeStyles(() => ({
  divider: {
    height: 1
  },
  slippage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  description: {
    fontStyle: 'italic'
  }
}));

const VaultSwapDialog = ({
  token,
  value,
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
      title='You Will Receive'
      onClose={handleClose}
      cancelLabel='Close'
      confirmLabel='Confirm Withdraw'
      onCancel={handleClose}
      onConfirm={onConfirm}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CurrencyItem
            token={token}
            value={value}
          />
        </Grid>
        <Grid item xs={12}>
          <Divider
            flexItem
            orientation='horizontal'
            className={classes.divider}
          />
        </Grid>
        <Grid item xs={12} className={classes.slippage}>
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

export default memo(VaultSwapDialog)