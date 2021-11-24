import { memo } from 'react';
import { Typography, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { usePrices } from 'contexts/price-context';
import { formatNumber } from 'utils/helpers/format';

const useStyles = makeStyles((theme) => ({
  rootGreen: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '10px',
    backgroundColor: '#E5F8EE',
  },
  rootRed: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '10px',
    backgroundColor: '#FCE8E8',
  },
  balanceRed: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '3px 14px',
    fontSize: 14,
    fontWeight: '600',
    color: '#E84142',
    '& span': {
      fontSize: 10,
    },
  },
  balanceGreen: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '3px 14px',
    fontSize: 14,
    fontWeight: '600',
    color: '#28C76F',
    '& span': {
      fontSize: 10,
    },
  },
  balanceContainer: {
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing('auto', 1),
  },
}));

const SnobChange = () => {
  const classes = useStyles();
  const { prices } = usePrices();

  return (
    <div className={classes.balanceContainer}>
      <div className={prices.SNOB24HChange > 0 ? classes.rootGreen : classes.rootRed}>
        <Tooltip title='Price Change 24h' arrow>
          <Typography
            color='textPrimary'
            className={prices.SNOB24HChange > 0 ? classes.balanceGreen : classes.balanceRed}
          >
            {(prices.SNOB24HChange > 0 ? '+' : '') + formatNumber(prices.SNOB24HChange, 2)}%
          </Typography>
        </Tooltip>
      </div>
    </div>
  );
};

export default memo(SnobChange);
