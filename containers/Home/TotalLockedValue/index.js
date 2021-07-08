import { memo } from 'react';
import {
  Grid,
  Card,
  Typography,
  Divider,
  LinearProgress,
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/client';

import { DASHBOARD_TOTAL_BACKGROUND_IMAGE_PATH } from 'utils/constants/image-paths';
import { GET_TVL_INFO_LAST_SNOWBALL } from 'api/dashboard/queries';
import DashboardTVLSkeletons from 'components/Skeletons/DashboardTVL';

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
  const { data, loading, error } = useQuery(GET_TVL_INFO_LAST_SNOWBALL);

  if (error) {
    return <div>Something went wrong...</div>;
  }

  if (loading) {
    return <DashboardTVLSkeletons />;
  }

  return (
    <Card className={classes.card}>
      <Typography variant="h5" color="textPrimary" className={classes.title}>
        Total Value Locked
      </Typography>
      <Typography variant="h3" color="textPrimary" className={classes.snob}>
        ${data?.LastSnowballInfo?.snowballTVL.toLocaleString()}
      </Typography>

      <div>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={5}>
            <Typography variant="h6" color="secondary">
              Marketcap
            </Typography>
            <Typography variant="subtitle1" color="textPrimary">
              $
              {(
                data?.LastSnowballInfo?.snowballToken.supply *
                data?.LastSnowballInfo?.snowballToken.pangolinPrice
              ).toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={7}>
            <Typography variant="h6" color="secondary">
              Circulating Supply
            </Typography>
            <Typography variant="subtitle1" color="textPrimary">
              {`${(data?.LastSnowballInfo?.snowballToken.supply).toLocaleString()} - Max: 18,000,000`}
            </Typography>
            <BorderLinearProgress
              variant="determinate"
              value={
                (+data?.LastSnowballInfo?.snowballToken.supply / 18000000) * 100
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
              {data?.LastSnowballInfo?.snobPerBlock} / ~
              {data?.LastSnowballInfo?.blocksPast24hrs *
                data?.LastSnowballInfo?.snobPerBlock}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" color="secondary">
              Blocks Past 24hrs
            </Typography>
            <Typography variant="subtitle1" color="textPrimary">
              {(data?.LastSnowballInfo?.blocksPast24hrs).toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" color="secondary">
              Current Distribution Phase
            </Typography>
            <Typography variant="subtitle1" color="textPrimary">
              {(data?.LastSnowballInfo?.blockHeight).toLocaleString()}/
              {(data?.LastSnowballInfo?.snobNextPhase).toLocaleString()}
              {/* <small>(1,610,242 blocks left)</small> */}
            </Typography>
          </Grid>
        </Grid>
      </div>
    </Card>
  );
};

export default memo(TotalLockedValue);
