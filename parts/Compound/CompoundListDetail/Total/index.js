import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { BNToFloat, formatNumber } from 'utils/helpers/format';
import SnowPairsIcon from 'components/SnowPairsIcon';

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
      <Box fontWeight={600}>Pool Information</Box>
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
        <div className={classes.container}>
          <Typography variant='subtitle2'>&nbsp;</Typography>
        </div>
        <div className={classes.greyBorder}>
          <div className={classes.container}>
            {userData?.underlyingTokens ?
              <>
                <Box display='flex' alignItems='center'>
                  <Typography variant="subtitle2" className={classes.underlyingTokensLine} noWrap>
                    <SnowPairsIcon pairsIcon={[userData?.underlyingTokens?.token0.address]} size={20} /> &nbsp;
                    {formatNumber(userData?.underlyingTokens?.token0.reserveOwned, 3, true)} &nbsp;
                    <b>{userData?.underlyingTokens?.token0.symbol}</b>
                  </Typography>
                </Box>
                <Box display='flex' alignItems='center'>
                  <Typography variant="subtitle2" className={classes.underlyingTokensLine} noWrap>
                    <SnowPairsIcon pairsIcon={[userData?.underlyingTokens?.token1.address]} size={20} /> &nbsp;
                    {formatNumber(userData?.underlyingTokens?.token1.reserveOwned, 3, true)}
                    <b>{userData?.underlyingTokens?.token1.symbol}</b>
                  </Typography>
                </Box>
              </>:
              <>
                <Box display='flex' alignItems='center'>
                  <SnowPairsIcon pairsIcon={[item.token0.address]} size={20} />
                  <b>&nbsp;0 {item.token0.symbol}</b>
                </Box>
                {item.token1.address &&
                  <Box display='flex' alignItems='center'>
                    <SnowPairsIcon pairsIcon={[item.token1.address]} size={20} />
                    <b>&nbsp;0 {item.token1.symbol}</b>
                  </Box>
                }
                {item.token2.address &&
                  <Box display='flex' alignItems='center'>
                    <SnowPairsIcon pairsIcon={[item.token2.address]} size={20} />
                    <b>&nbsp;0 {item.token2.symbol}</b>
                  </Box>
                }
                {item.token3.address &&
                  <Box display='flex' alignItems='center'>
                    <SnowPairsIcon pairsIcon={[item.token3.address]} size={20} />
                    <b>&nbsp;0 {item.token3.symbol}</b>
                  </Box>
                }
              </>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Total);
