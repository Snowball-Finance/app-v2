import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { BNToFloat, formatNumber, formatNumberByNotation } from 'utils/helpers/format';
import UnderlyingTokenItem from './UnderlyingTokenItem';
import { ethers } from 'ethers';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  greyBorder: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 0.8,
    borderStyle: 'solid',
    borderColor: theme.custom.palette.border,
    padding: theme.spacing(1),
    marginTop: theme.spacing(1),
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

const Total = ({ item, userData, userLastDeposit }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Box fontWeight={600}>Pool Information</Box>
      <div className={classes.lower}>
        <div className={classes.container}>
          <Typography variant="body2">Total LP</Typography>
          <Typography variant="subtitle2">{formatNumberByNotation(userData?.userDepositedLP || 0.00, 5, true)
          } LP {!item.deprecatedPool && ('($' + formatNumber(userData?.usdValue || 0.00) + ')')}</Typography>
        </div>
        {!item.deprecatedPool && <div className={classes.container}>
          <Typography variant="body2">Share of Pool</Typography>
          <Typography variant="subtitle2">{formatNumber(
            ((userData?.userBalanceSnowglobe ? BNToFloat(userData?.userBalanceSnowglobe, userData?.lpDecimals) : 0) +
              (userData?.userBalanceGauge / 10 ** userData?.lpDecimals)) /
            BNToFloat(userData?.totalSupply, userData?.lpDecimals) * 100 || 0.00, 5)} %
          </Typography>
        </div>}
        {!item.deprecatedPool && userData?.userDepositedLP > 0 &&
          userLastDeposit?.lpQuantity &&
          <div className={classes.container}>
            <Typography variant="body2">LP Earned</Typography>
            <Typography variant="subtitle2">
              {formatNumber(
                userLastDeposit?.lpQuantity ?
                  ((ethers.BigNumber.from(userLastDeposit?.lpQuantity)
                    / 10 ** userData?.lpDecimals) -
                    (userData?.userDepositedLP || 0.00))
                  * -1
                  : 0.00)} (${formatNumber(
                    ((ethers.BigNumber.from(userLastDeposit?.lpQuantity)
                      / 10 ** userData?.lpDecimals) -
                      (userData?.userDepositedLP || 0.00))
                    * -1
                    * item.pricePoolToken)})
            </Typography>
          </div>}
        <div className={classes.container}>
          <Typography variant='subtitle2'>&nbsp;</Typography>
        </div>
        {!item.metaToken && (userData?.underlyingTokens || item?.token1?.address) &&
          <div className={classes.greyBorder}>
            <div className={classes.container}>
              {userData?.underlyingTokens ?
                <>
                  <UnderlyingTokenItem
                    pairsIcon={[userData?.underlyingTokens?.token0.address]}
                    amount={formatNumberByNotation(userData?.underlyingTokens?.token0.reserveOwned, 3, true)}
                    symbol={userData?.underlyingTokens?.token0.symbol} />
                  <UnderlyingTokenItem
                    pairsIcon={[userData?.underlyingTokens?.token1.address]}
                    amount={formatNumberByNotation(userData?.underlyingTokens?.token1.reserveOwned, 3, true)}
                    symbol={userData?.underlyingTokens?.token1.symbol} />
                </> :
                <>
                  {item?.token0?.address &&
                    <UnderlyingTokenItem
                      pairsIcon={[item.token0.address]}
                      amount={0}
                      symbol={item.token0.symbol} />}
                  {item?.token1?.address &&
                    <UnderlyingTokenItem
                      pairsIcon={[item.token1.address]}
                      amount={0}
                      symbol={item.token1.symbol} />
                  }
                </>
              }
            </div>
          </div>}
      </div>
    </div>
  );
};

export default memo(Total);
