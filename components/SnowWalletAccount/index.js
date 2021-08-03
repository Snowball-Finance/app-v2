import React, { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import SnowIdenticon from 'components/SnowIdenticon'
import getEllipsis from 'utils/helpers/getEllipsis'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '10px 16px 16px 10px',
    backgroundColor: 'rgba(40, 162, 255, 0.12)'
  },
  account: {
    padding: theme.spacing(0, 1),
  }
}));

const SnowWalletAccount = ({
  account,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root} {...rest}>
      <Typography
        variant='caption'
        color='textPrimary'
        className={classes.account}
      >
        {getEllipsis(account || '')}
      </Typography>
      <SnowIdenticon value={account} />
    </div>
  );
};

export default memo(SnowWalletAccount);