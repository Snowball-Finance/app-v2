import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, CircularProgress } from '@material-ui/core';
import SnowTokenIcon from 'components/SnowTokenIcon';
import SnowPairsIcon from 'components/SnowPairsIcon';

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

const Toast = ({message, processing = true, tokens}) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={4} className={classes.iconContainer} >
        {processing ? <CircularProgress /> 
        : tokens ? <SnowPairsIcon pairsIcon={tokens} size={36} /> : <SnowTokenIcon/>}
      </Grid>
      <Grid item xs={8} className={classes.description}>
        <Typography variant="body1" className={classes.title}>
          {processing ? 'Processing operation...' : 'Operation Succeed!'}
        </Typography>
        <Typography variant="caption" className={classes.subtitle}>
          {message}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default memo(Toast);
