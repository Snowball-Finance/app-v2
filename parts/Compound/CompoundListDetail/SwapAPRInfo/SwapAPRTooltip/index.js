import { memo } from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  info: {
    display: 'flex',
    flexDirection: 'column',
    width: 400,
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      width: 350,
    },
  },
}));

const SwapAPRTooltip = () => {
  const classes = useStyles();

  return (
    <div className={classes.info}>
      <Typography variant="h6">Swap APR</Typography>
      <Typography variant="body2">
        Swap APR is the return you receive from the liquidity you provided being
        used in trades. Swap APR takes the form of your LP tokens being
        redeemable for more of the underlying assets.
      </Typography>
    </div>
  );
};

export default memo(SwapAPRTooltip);
