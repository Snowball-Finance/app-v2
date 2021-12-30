import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  ListItem,
  Avatar,
  Grid,
  Button,
  Typography,
  Link,
} from '@material-ui/core';
import WarningIcon from '@material-ui/icons/WarningRounded';

import { NOTIFICATION_WARNING } from 'utils/constants/common';

const useStyles = makeStyles((theme) => ({
  notificationContainer: { cursor: 'pointer' },
  notificationIconContainer: {
    backgroundColor: theme.custom.palette.joe_red,
  },
}));

const NotificationListView = ({
  buttonText,
  fixClick,
  readMoreClick,
  isFixMyPool,
  fromContext,
}) => {
  const classes = useStyles();

  const conditionalMessageRender = () => {
    if (fromContext) {
      return (
        <Grid item xs={12}>
          <Typography variant="body1">Partial Investment Pending</Typography>
          <Typography variant="caption">Please refresh the page!!</Typography>
        </Grid>
      );
    } else if (isFixMyPool) {
      return (
        <>
          <Grid item xs={12}>
            <Typography variant="body1">Partial Investment</Typography>
            <Typography variant="caption">{NOTIFICATION_WARNING}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Link component="button" variant="body2" onClick={readMoreClick}>
              Read more
            </Link>
          </Grid>
        </>
      );
    }

    return (
      <Grid item xs={12}>
        <Typography variant="body1">Gauge Proxy Upgrade</Typography>
        <Typography variant="caption">
          In order to better serve the community{"'"}s desire for more frequent
          changes in SNOB rewards, we have upgraded to GaugeProxyV2. This will
          allow us to have much more frequent SNOB reward distribution changes.
          <br /> <br />
          Please click the button below to upgrade to GaugeProxyV2 and continue
          receiving SNOB rewards.
        </Typography>
      </Grid>
    );
  };

  return (
    <ListItem className={classes.notificationContainer}>
      <Grid container justify="space-between" spacing={2}>
        <Grid item xs={1}>
          <Avatar className={classes.notificationIconContainer}>
            <WarningIcon />
          </Avatar>
        </Grid>

        <Grid item xs={9}>
          <Grid container spacing={1}>
            {conditionalMessageRender()}

            {!fromContext && (
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  disableElevation
                  fullWidth
                  onClick={fixClick}
                >
                  {buttonText}
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default memo(NotificationListView);
