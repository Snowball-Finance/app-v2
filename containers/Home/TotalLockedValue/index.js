
import { memo } from 'react'
import {
  Grid,
  Card,
  Typography,
  Divider
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { DASHBOARD_TOTAL_BACKGROUND_IMAGE_PATH } from 'utils/constants/image-paths'

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
    height: '100%'
  },
  title: {
    fontWeight: 'bold',
    [theme.breakpoints.down('xs')]: {
      fontSize: 18,
    }
  },
  snob: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      fontSize: 40,
    }
  },
  divider: {
    height: 1,
  },
}));

const TotalLockedValue = ({
  latestInfo
}) => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <Typography
        variant='h5'
        color='textPrimary'
        className={classes.title}
      >
        Total Value Locked
      </Typography>
      <Typography
        color='textPrimary'
        className={classes.snob}
      >
        ${(latestInfo.totalTVL || 0).toLocaleString()}
      </Typography>

      <div>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant='h6' color='secondary'>
              Marketcap
          </Typography>
            <Typography variant='h6' color='textPrimary'>
              ${(latestInfo.marketcap || 0).toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant='h6' color='secondary'>
              Circulating Supply
          </Typography>
            <Typography variant='h6' color='textPrimary'>
              {`${(latestInfo.circulatingSupply || 0).toLocaleString()} - Max: 18,000,000`}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider
              flexItem
              orientation='horizontal'
              className={classes.divider}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant='h6' color='secondary'>
              SNOB per Block / Day
          </Typography>
            <Typography variant='h6' color='textPrimary'>
              {`${latestInfo.snobPerBlockDay}  /  7500`}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant='h6' color='secondary'>
              Blocks Past 24hrs
          </Typography>
            <Typography variant='h6' color='textPrimary'>
              {`~${(latestInfo.blockPast24hrs || 0).toLocaleString()}`}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h6' color='secondary'>
              Current Distribution Phase
          </Typography>
            <Typography variant='h6' color='textPrimary'>
              1,454,758 / 3,065,000 <small>(1,610,242 blocks left)</small>
            </Typography>
          </Grid>
        </Grid>
      </div>
    </Card>
  )
}

export default memo(TotalLockedValue);