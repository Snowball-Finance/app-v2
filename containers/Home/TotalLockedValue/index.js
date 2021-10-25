import { memo } from 'react';
import {
  Grid,
  Card,
  Typography,
  Divider,
  LinearProgress,
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import { DASHBOARD_TOTAL_BACKGROUND_IMAGE_PATH } from 'utils/constants/image-paths';
import DashboardTVLSkeletons from 'components/Skeletons/DashboardTVL';
import { useLastSnowballInfo } from 'contexts/api-context';
import { formatNumber } from 'utils/helpers/format';

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor:
      theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: theme.custom.palette.green,
  },
}))(LinearProgress);

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: theme.spacing(2),
    backgroundImage: `url(${DASHBOARD_TOTAL_BACKGROUND_IMAGE_PATH})`,
    backgroundRepeat: 'no-repeat',
    backgroundPositionX: 'right',
    backgroundPositionY: 'bottom',
    height: '100%',
    backgroundColor: theme.palette.background.primary,
  },
  title: {
    fontWeight: 'bold',
    [theme.breakpoints.down('xs')]: {
      fontSize: 18,
    },
  },
  snob: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      fontSize: 40,
    },
  },
  divider: {
    height: 1,
  },
}));

const TotalLockedValue = () => {
  const classes = useStyles();
  const snowballTVLQuery = useLastSnowballInfo();

  if (snowballTVLQuery.error) {
    return <div>Something went wrong...</div>;
  }

  if (snowballTVLQuery.loading) {
    return <DashboardTVLSkeletons />;
  }

  return (
    <Card className={classes.card}>
      <Typography variant="h5" color="textPrimary" className={classes.title}>
        Total Value Locked
      </Typography>
      <Typography variant="h3" color="textPrimary" className={classes.snob}>
        ${formatNumber(snowballTVLQuery.data?.LastSnowballInfo?.snowballTVL, 2)}
      </Typography>

      <div>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={5}>
            <Typography variant="h6" color="secondary">
              Marketcap
            </Typography>
            <Typography variant="subtitle1" color="textPrimary">
              $
              {formatNumber(
                snowballTVLQuery.data?.LastSnowballInfo?.snowballToken.totalSupply *
                snowballTVLQuery.data?.LastSnowballInfo?.snowballToken.pangolinPrice
              , 2)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={7}>
            <Typography variant="h6" color="secondary">
              Total Supply
            </Typography>
            <Typography variant="subtitle1" color="textPrimary">
              {`${formatNumber(snowballTVLQuery.data?.LastSnowballInfo?.snowballToken.totalSupply, 2)} - Max: 18,000,000`}
            </Typography>
            <BorderLinearProgress
              variant="determinate"
              value={
                (+snowballTVLQuery.data?.LastSnowballInfo?.snowballToken.totalSupply / 18000000) * 100
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Divider
              flexItem
              orientation="horizontal"
              className={classes.divider}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" color="secondary">
              SNOB per Block / Day
            </Typography>
            <Typography variant="subtitle1" color="textPrimary">
              {formatNumber(snowballTVLQuery.data?.LastSnowballInfo?.snobPerBlock, 2)} / ~
              {formatNumber(snowballTVLQuery.data?.LastSnowballInfo?.blocksPast24hrs *
                snowballTVLQuery.data?.LastSnowballInfo?.snobPerBlock, 2)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" color="secondary">
              Blocks Past 24hrs
            </Typography>
            <Typography variant="subtitle1" color="textPrimary">
              {formatNumber(snowballTVLQuery.data?.LastSnowballInfo?.blocksPast24hrs, 2)}
            </Typography>
          </Grid>
        </Grid>
      </div>
    </Card>
  );
};

export default memo(TotalLockedValue);
