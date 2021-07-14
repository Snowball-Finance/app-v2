import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '33%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  upper: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 0.8,
    borderStyle: 'solid',
    borderColor: theme.custom.palette.border,
    padding: theme.spacing(1),
  },
  lower: {
    width: '100%',
    marginTop: theme.spacing(1),
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
      <div className={classes.upper}>
        <div className={classes.container}>
          <Typography variant="h6">SNOB</Typography>
          <Typography variant="h5">77,000.5</Typography>
        </div>
        <div className={classes.container}>
          <Typography variant="caption">Claimable</Typography>
          <Typography variant="caption">($27,500)</Typography>
        </div>
      </div>

      <div className={classes.lower}>
        <div className={classes.container}>
          <Typography variant="body2">Total LP</Typography>
          <Typography variant="subtitle2">115,216 PGL ($22.1510)</Typography>
        </div>
        <div className={classes.container}>
          <Typography variant="body2">Share of Pool</Typography>
          <Typography variant="subtitle2">0.095 %</Typography>
        </div>
        <div className={classes.container}>
          <Typography variant="body2" className={classes.boldSubtitle}>
            Total earned
          </Typography>
          <Typography variant="subtitle2" className={classes.boldSubtitle}>
            $10,000
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default memo(Total);
