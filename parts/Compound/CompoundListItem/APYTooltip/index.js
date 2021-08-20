import { memo } from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  info: {
    display: 'flex',
    flexDirection: 'column',
    width: 400,
    padding: theme.spacing(2),
  },
  container: {
    display: 'flex',
  },
  left: {
    width: '50%',
  },
  right: {
    width: '50%',
    textAlign: 'end',
  },
  title: {
    fontWeight: 600,
  },
}));

const APYTooltip = ({ dailyAPY, weeklyAPY, yearlyAPY }) => {
  const classes = useStyles();

  return (
    <div className={classes.info}>
      <Typography variant="h6">Annual Percentage Yield</Typography>
      <div className={classes.container}>
        <div className={classes.left}>
          <Typography variant="body2">
            This number equals the total annual yield when compounded.
          </Typography>
        </div>
        <div className={classes.right}>
          <Typography variant="subtitle2" className={classes.title}>
            {typeof(dailyAPY) === 'number' ? dailyAPY.toFixed(2) : dailyAPY}% (Daily)
          </Typography>
          <Typography variant="subtitle2" className={classes.title}>
            {typeof(weeklyAPY) === 'number' ? weeklyAPY.toFixed(2) : weeklyAPY}% (Weekly)
          </Typography>
          <Typography variant="subtitle2" className={classes.title}>
            {typeof(yearlyAPY) === 'number' ? yearlyAPY.toFixed(2) : yearlyAPY}% (Yearly)
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default memo(APYTooltip);
