import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const GridView = () => {
  const classes = useStyles();

  return (
    <Typography variant="subtitle1" className={classes.root}>
      Working on it...
    </Typography>
  );
};

export default memo(GridView);
