import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { useCompoundAndEarnContract } from 'contexts/compound-and-earn-context';
import { USER_LAST_DEPOSIT } from 'api/compound-and-earn/queries';
import { useQuery } from '@apollo/client';
import { useWeb3React } from '@web3-react/core';
import { formatNumber } from 'utils/helpers/format';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '33%',
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
  boldSubtitle: {
    fontWeight: 600,
  },
}));

const Total = ({ item }) => {
  const classes = useStyles();
  const { userPools } = useCompoundAndEarnContract();
  const { account } = useWeb3React();
  let userPool = {
    usdValue: 0,
    userLP: 0,
    totalSupply: 0,
    valueEarned: 0,
  };
  const queryData = useQuery(USER_LAST_DEPOSIT, {
    variables: { wallet: account, snowglobe: item.address }
  });

  if (userPools) {
    userPool = userPools.find((pool) => pool?.address.toLowerCase() === item.address.toLowerCase());
  }

  return (
    <div className={classes.root}>
      <div className={classes.upper}>
        <div className={classes.container}>
          <Typography variant="h6">SNOB</Typography>
          <Typography variant="h5">77,000.5</Typography>
        </div>
        <div className={classes.container}>
          <Typography variant="caption">Claimable</Typography>
          <Typography variant="caption">($27,500)</Typography>
        </div>
      </div>

      <div className={classes.lower}>
        <div className={classes.container}>
          <Typography variant="body2">Total LP</Typography>
          <Typography variant="subtitle2">{formatNumber(userPool?.userLP || 0)} LP (${formatNumber(userPool?.usdValue || 0)})</Typography>
        </div>
        <div className={classes.container}>
          <Typography variant="body2">Share of Pool</Typography>
          <Typography variant="subtitle2">{formatNumber(
            userPool?.userLP / userPool?.totalSupply * 100 || 0)}%</Typography>
        </div>
        <div className={classes.container}>
          <Typography variant="body2" className={classes.boldSubtitle}>
            Total earned
          </Typography>
          <Typography variant="subtitle2" className={classes.boldSubtitle}>
            ${formatNumber((userPool?.userLP-queryData.data?.LastDepositPerWallet?.
                lpQuantity/1e18)*item.pricePoolToken) || 0}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default memo(Total);
