import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import SnowPairsIcon from 'components/SnowPairsIcon';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
    borderWidth: 1,
    borderRadius: 7,
    borderStyle: 'solid',
    borderColor: theme.custom.palette.border,
  },
  icons: {
    marginRight: theme.spacing(1),
  },
  secondTokenIcon: {
    marginLeft: theme.spacing(-2),
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pairContainer: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
  },
  balanceContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
}));

const Details = ({ data, item, calculatedBalance }) => {
  const classes = useStyles();
  const token0 = item.token0.address;
  const token1 = item.token1.address;
  const token2 = item.token2.address;

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.pairContainer}>
          <SnowPairsIcon pairsIcon={[token0, token1, token2]} size={50}/>
          <div>
            <Typography variant="caption">{data.name}</Typography>
            <Typography variant="subtitle1">{item.name}</Typography>
          </div>
        </div>

        <div className={classes.balanceContainer}>
          <Typography variant="subtitle1">{calculatedBalance}</Typography>
          <Typography variant="caption">Available: {data.availableBalance}PGL</Typography>
        </div>
      </div>
    </div>
  );
};

export default memo(Details);
