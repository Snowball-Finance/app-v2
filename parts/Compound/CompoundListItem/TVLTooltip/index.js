import { memo } from 'react';
import Image from 'next/image';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  info: {
    display: 'flex',
    flexDirection: 'column',
    width: 300,
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      width: 250
    }
  },
  left: {
    width: '70%',
  },
  right: {
    width: '30%',
  },
  icon: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    objectFit: 'contain',
    height: 100,
  },
}));

const TVLTooltip = ({ icon }) => {
  const classes = useStyles();

  return (
    <div className={classes.info}>
      <Typography variant="h6">Total Value Locked</Typography>
      <div className={classes.left}>
        <Typography variant="body2">
          This number equals the total amount deposited into the pool.
        </Typography>
      </div>
      <div className={classes.right}>
        <div className={classes.icon}>
          <Image alt="icon" src={icon} width={74} height={100} layout='fixed' />
        </div>
      </div>
    </div>
  );
};

export default memo(TVLTooltip);
