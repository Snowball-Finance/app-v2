import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import SnowPairsIcon from 'components/SnowPairsIcon';
import SnowTextField from 'components/UI/TextFields/SnowTextField';

const useStyles = makeStyles((theme) => ({
  inputContainer: {
    border: '1px solid rgba(108, 117, 125, 0.12)',
    borderRadius: 7,
    padding: theme.spacing(1, 0),
  },
  input: {
    '& .MuiOutlinedInput-root': {
      border: 'none',
    },
    '& input': {
      textAlign: 'end',
      fontSize: theme.typography.h4.fontSize
    },
  },
  balanceText: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20
  },
  pairContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: theme.spacing(1),
  },
  pairText: {
    textAlign: 'center',
  },
}));

const Details = ({
  item,
  title,
  amount,
  error,
  inputHandler
}) => {
  const classes = useStyles();
  const token0 = item.token0.address;
  const token1 = item.token1.address;
  const token2 = item.token2.address;
  const token3 = item.token3.address;
  console.log(item)
  return (
    <>
      <div className={classes.pairContainer}>
        <div>
          <SnowPairsIcon pairsIcon={[token0, token1, token2, token3]} size={50} />
        </div>
        <div className={classes.pairText}>
          <Typography variant='caption'>{title}</Typography>
          <Typography variant='h6'>{item.name}</Typography>
        </div>
      </div>

      <div className={classes.inputContainer}>
        <SnowTextField
          className={classes.input}
          type='number'
          name='percent'
          value={amount > 0 ? amount : 0}
          error={error}
          onChange={inputHandler}
        />
        <Typography variant='caption' className={classes.balanceText}>
        Available: {((title === "Withdraw" ? item.userBalanceGauge : item.userLPBalance) / 10 ** item.lpDecimals).toLocaleString(
          undefined, { maximumSignificantDigits: 18 })} {token1 ? item.symbol : item.name}
        </Typography>
      </div>
    </>
  );
};

export default memo(Details);
