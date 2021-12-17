import { memo } from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  info: {
    display: 'flex',
    flexDirection: 'column',
    width: 400,
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      width: 350
    }
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

const BaseAPRTooltip = ({ dailyAPR, weeklyAPY, yearlyAPY }) => {
  const classes = useStyles();

  return (
    <div className={classes.info}>
      <Typography>Base APR includes the platform&apos;s Reward APR minus the 10% Snowball Performance Fee.</Typography>
      <div className={classes.container}>
        <div className={classes.left}>
          <Typography variant="body2">
            Reward APR: <br />
            Base APR (w/ fees):
          </Typography>
        </div>
        <div className={classes.right}>
          <Typography variant="subtitle2" className={classes.title}>
            {typeof(dailyAPR) === 'number' ? (dailyAPR * 365 + 10)?.toFixed(2) : ''}%
          </Typography>
          <Typography variant="subtitle2" className={classes.title}>
            {typeof(dailyAPR) === 'number' ? (dailyAPR * 365)?.toFixed(2) : dailyAPR}%
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default memo(BaseAPRTooltip);
