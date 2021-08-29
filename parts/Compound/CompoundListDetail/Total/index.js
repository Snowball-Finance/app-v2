import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { useCompoundAndEarnContract } from 'contexts/compound-and-earn-context';
import { BNToFloat, formatNumber } from 'utils/helpers/format';
import SnowPairsIcon from 'components/SnowPairsIcon';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  upper: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 0.8,
    borderStyle: 'solid',
    borderColor: theme.custom.palette.border,
    padding: theme.spacing(1),
  },
  lower: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  infoContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    }
  },
  boldSubtitle: {
    fontWeight: 600,
  },
}));

const Total = ({ item }) => {
  const classes = useStyles();
  const { userPools } = useCompoundAndEarnContract();
  let userPool = {
    usdValue: 0,
    userDepositedLP: 0,
    totalSupply: 0,
    valueEarned: 0,
    SNOBHarvestable: 0,
    SNOBValue: 0,
  };

  if (userPools) {
    userPool = userPools.find((pool) => pool?.address.toLowerCase() === item.address.toLowerCase());
  }

  return (
    <div className={classes.root}>
      <div className={classes.upper}>
        <div className={classes.container}>
          <Typography>SNOB (Claimable)</Typography>
          <Typography><b>{formatNumber(userPool?.SNOBHarvestable || 0.00, 3)}</b> (${formatNumber(userPool?.SNOBValue || 0.00, 3)})</Typography>
        </div>
      </div>

      <div className={classes.lower}>
        <div className={classes.container}>
          <Typography variant="body2">Total LP</Typography>
          <Typography variant="subtitle2">{formatNumber(userPool?.userDepositedLP || 0.00, 5, true)} LP (${formatNumber(userPool?.usdValue || 0.00)})</Typography>
        </div>
        <div className={classes.container}>
          <Typography variant="body2">Share of Pool</Typography>
          <Typography variant="subtitle2">{formatNumber(
              ((userPool?.userBalanceSnowglobe ? BNToFloat(userPool?.userBalanceSnowglobe,userPool?.lpDecimals) : 0) +
              (userPool?.userBalanceGauge/10**userPool?.lpDecimals)) / 
              BNToFloat(userPool?.totalSupply,userPool?.lpDecimals) * 100 || 0.00, 5)}
            %</Typography>
        </div>
        {userPool?.underlyingTokens ? <div className={classes.infoContainer}>
          <Typography variant="body2">{userPool.underlyingTokens ? `Underlying tokens` : ``}</Typography>
          <Typography variant="subtitle2"> <SnowPairsIcon pairsIcon={[userPool?.underlyingTokens?.token0.address]} size={25} />
            {formatNumber(userPool?.underlyingTokens?.token0.reserveOwned, 3, true)} | <SnowPairsIcon pairsIcon={[userPool?.underlyingTokens?.token1.address]} size={25} />
            {formatNumber(userPool?.underlyingTokens?.token1.reserveOwned, 3, true)} </Typography>
        </div> : null}
        <div className={classes.container}>
          {/*  <Typography variant="body2" className={classes.boldSubtitle}>
            Total earned
          </Typography>
          <Typography variant="subtitle2" className={classes.boldSubtitle}>
            ${formatNumber((userPool?.userDepositedLP-userPool?.lpLogged/1e18)*item.pricePoolToken) || 0}
          </Typography> */}
        </div>
      </div>
    </div>
  );
};

export default memo(Total);
