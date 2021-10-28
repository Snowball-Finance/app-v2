import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import ArrowDownIcon from 'components/Icons/ArrowDownIcon';
import SnowPairsIcon from 'components/SnowPairsIcon';
import SnowTokenIcon from 'components/SnowTokenIcon';
import { extractValidTokens } from '../utils';

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
  activeToken,
  amount = '0.00'
}) => {
  const classes = useStyles();
  const tokens = extractValidTokens({ obj: pool })


  let priceField = 'pangolinPrice'

  const halfAmount = amount / 2;

  const tokensWithPriceAndAmount = tokens.map((token) => ({ ...token, price: token[priceField], amount: halfAmount * token[priceField] }))

  return (
    <>
      <ArrowDownIcon className={classes.downArrow} />
      <div className={classes.container}>
        <div className={classes.pairLine}>
          <SnowPairsIcon pairsIcon={tokensWithPriceAndAmount.map(token => token.address)} size={36} />
          <div className={classes.pairInfoStyle}>
            <Typography variant='subtitle1'>To</Typography>
            <Typography variant='subtitle1' className={classes.bold}>
              {tokensWithPriceAndAmount.map(token => token.symbol).join('-')} {pool.symbol}
            </Typography>
          </div>
          <Typography className={classes.amountText}>{amount}</Typography>
        </div>
        <div className={classes.estContainer}>
          <Typography className={classes.bold} variant='subtitle1' gutterBottom>Est. pool allocation</Typography>
          {
            tokensWithPriceAndAmount.map((token, index) => {
              return (<Box key={index} className={classes.tokenLine} mb={index === tokensWithPriceAndAmount.length - 1 ? 1 : 0}>
                <SnowTokenIcon token={token.symbol} size={20} />
                <Typography className={classes.pairInfoStyle}>{token.name}</Typography>
                <Typography className={classes.amountText}>{token.amount}</Typography>
              </Box>)
            })
          }

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
