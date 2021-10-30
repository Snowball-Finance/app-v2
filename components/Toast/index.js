import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, CircularProgress } from '@material-ui/core';
import SnowTokenIcon from 'containers/CompoundAndEarn/ListItem/SnowTokenIcon';
import SnowPairsIcon from 'components/SnowPairsIcon';
import WarningIcon from 'components/Icons/WarningIcon';

const useStyles = makeStyles((theme) => ({
  root: {
    height: 100,
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.custom.palette.lightBlue,
  },
  warningContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.custom.palette.red_warning,
  },
  description: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  title: {
    lineHeight: '16px',
    fontWeight: 600
  },
  subtitle: {
    lineHeight: '12px',
  },
}));

const Toast = ({ message, toastType, tokens, title }) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={4} className={
        toastType === 'warning' ? classes.warningContainer
          : classes.iconContainer} >

        {toastType === 'processing' ? <CircularProgress />
          : tokens ? <SnowPairsIcon pairsIcon={tokens} size={36} />
            : toastType === 'warning' ? <WarningIcon />
              : <SnowTokenIcon />}
      </Grid>
      <Grid item xs={8} className={classes.description}>
        <Typography variant="body1" className={classes.title}>
          {title ? title
            : toastType === 'processing' ? 'Processing operation...'
              : toastType === 'warning' ? 'Warning!'
                : 'Operation Succeed!'}
        </Typography>
        <Typography variant="caption" className={classes.subtitle}>
          {message}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default memo(Toast);
