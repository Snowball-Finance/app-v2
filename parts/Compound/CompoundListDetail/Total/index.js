import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '30%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderRadius: 10,
    borderWidth: 0.8,
    borderStyle: 'solid',
    borderColor: theme.custom.palette.blue,
    padding: theme.spacing(1),
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

const Total = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Typography variant="body2">Total deposited:</Typography>
        <Typography variant="subtitle2">0.25%</Typography>
      </div>
      <div className={classes.container}>
        <Typography variant="body2">Share of Pool:</Typography>
        <Typography variant="subtitle2">1.76%</Typography>
      </div>
      <div className={classes.container}>
        <Typography variant="body2" className={classes.boldSubtitle}>
          SNOB earned:
        </Typography>
        <Typography variant="subtitle2" className={classes.boldSubtitle}>
          191.60%
        </Typography>
      </div>
      <div className={classes.container}>
        <Typography variant="body2" className={classes.boldSubtitle}>
          Amount earned:
        </Typography>
        <Typography variant="subtitle2" className={classes.boldSubtitle}>
          10%
        </Typography>
      </div>
    </div>
  );
};

export default memo(Total);
