import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    width: '30%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
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

const ApyCalculation = ({ dailyAPY, weeklyAPY, yearlyAPY }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="subtitle1" className={classes.boldSubtitle}>
        APY Calculations
      </Typography>
      <div className={classes.container}>
        <Typography variant="body2">Daily:</Typography>
        <Typography variant="subtitle2">{dailyAPY?.toFixed(2)}%</Typography>
      </div>
      <div className={classes.container}>
        <Typography variant="body2">Weekly:</Typography>
        <Typography variant="subtitle2">{weeklyAPY?.toFixed(2)}%</Typography>
      </div>
      <div className={classes.container}>
        <Typography variant="body2">Total APY:</Typography>
        <Typography variant="subtitle2">{yearlyAPY?.toFixed(2)}%</Typography>
      </div>
    </div>
  );
};

export default memo(ApyCalculation);
