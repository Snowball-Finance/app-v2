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
      width: 350,
    },
  },
}));

const OptimizedTooltip = () => {
  const classes = useStyles();

  return (
    <div className={classes.info}>
      <Typography>
        Optimized Pools will automatically move your investment to the platform
        offering the best rates every 24 hours.
      </Typography>
    </div>
  );
};

export default memo(OptimizedTooltip);
