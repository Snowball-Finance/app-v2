import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
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
  underlyingTokensLine: {
    display: 'flex',
    alignItems: 'center',
  },
  boldSubtitle: {
    fontWeight: 600,
  },
}));

const Total = ({ item, userData }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.upper}>
        <div className={classes.container}>
          <Typography>SNOB (Claimable)</Typography>
          <Typography><b>{formatNumber(userData?.SNOBHarvestable || 0.00, 2)}</b> (${formatNumber(userData?.SNOBValue || 0.00, 2)})</Typography>
        </div>
      </div>

      <div className={classes.lower}>
        <div className={classes.container}>
          <Typography variant="body2">Total LP</Typography>
          <Typography variant="subtitle2">{formatNumber(userData?.userDepositedLP || 0.00, 5, true)
          } LP {!item.deprecatedPool &&('($'+formatNumber(userData?.usdValue || 0.00)+')')}</Typography>
        </div>
        {!item.deprecatedPool &&<div className={classes.container}>
          <Typography variant="body2">Share of Pool</Typography>
          <Typography variant="subtitle2">{formatNumber(
              ((userData?.userBalanceSnowglobe ? BNToFloat(userData?.userBalanceSnowglobe,userData?.lpDecimals) : 0) +
              (userData?.userBalanceGauge/10**userData?.lpDecimals)) / 
              BNToFloat(userData?.totalSupply,userData?.lpDecimals) * 100 || 0.00, 5)}
            %</Typography>
        </div>}
        {userData?.underlyingTokens ? <div className={classes.infoContainer}>
          <Typography variant="body2">{userData.underlyingTokens ? `Underlying tokens` : ``}</Typography>
          <Typography variant="subtitle2" className={classes.underlyingTokensLine}> <SnowPairsIcon pairsIcon={[userData?.underlyingTokens?.token0.address]} size={25} />
            {formatNumber(userData?.underlyingTokens?.token0.reserveOwned, 3, true)} | <SnowPairsIcon pairsIcon={[userData?.underlyingTokens?.token1.address]} size={25} />
            {formatNumber(userData?.underlyingTokens?.token1.reserveOwned, 3, true)} </Typography>
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
