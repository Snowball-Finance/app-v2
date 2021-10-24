import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import ArrowDownIcon from 'components/Icons/ArrowDownIcon';
import SnowPairsIcon from 'components/SnowPairsIcon';
import SnowTokenIcon from 'components/SnowTokenIcon';

const useStyles = makeStyles((theme) => ({
  downArrow: {
    marginTop: theme.spacing(1),
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
  },
  container: {
    marginTop: theme.spacing(1),
    borderWidth: 1,
    borderColor: theme.custom.palette.border,
    borderStyle: 'solid',
    borderRadius: 7,
    padding: theme.spacing(2),
  },
  pairLine: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  amountText: {
    marginLeft: 'auto',
  },
  tokenLine: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  pairInfoStyle: {
    marginLeft: theme.spacing(1),
  },
  estContainer: {
    marginTop: theme.spacing(1.5),
  },
  bold: {
    fontWeight: 600
  }
}));

const CompoundInfo = ({
  pool,
  amount = '0.00'
}) => {
  const classes = useStyles();
  const tokens = [pool.token0, pool.token1]
  const [token0, token1] = tokens
  const { address: address0, name: name0, symbol: symbol0 } = token0
  const { address: address1, name: name1, symbol: symbol1 } = token1
  return (
    <>
      <ArrowDownIcon className={classes.downArrow} />
      <div className={classes.container}>
        <div className={classes.pairLine}>
          <SnowPairsIcon pairsIcon={[address0, address1]} size={36} />
          <div className={classes.pairInfoStyle}>
            <Typography variant='subtitle1'>To</Typography>
            <Typography variant='subtitle1' className={classes.bold}>
              {`${symbol0}-${symbol1}`} {pool.symbol}
            </Typography>
          </div>
          <Typography className={classes.amountText}>{amount}</Typography>
        </div>
        <div className={classes.estContainer}>
          <Typography className={classes.bold} variant='subtitle1' gutterBottom>Est. pool allocation</Typography>
          <Box className={classes.tokenLine}>
            <SnowTokenIcon token={symbol0} size={20} />
            <Typography className={classes.pairInfoStyle}>{name0}</Typography>
            <Typography className={classes.amountText}>0.00</Typography>
          </Box>
          <Box className={classes.tokenLine} mb={1}>
            <SnowTokenIcon token={symbol1} size={20} />
            <Typography className={classes.pairInfoStyle}>{name1}</Typography>
            <Typography className={classes.amountText}>0.00</Typography>
          </Box>
          <Box className={classes.tokenLine} >
            <Typography>Protocol</Typography>
            <Typography className={classes.bold}>{pool.source}</Typography>
          </Box>
        </div>
      </div>
    </>
  );
};

export default memo(CompoundInfo);
