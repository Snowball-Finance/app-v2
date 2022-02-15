import { memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  ListItem,
  Avatar,
  Grid,
  Button,
  Typography,
  Link,
} from "@material-ui/core";
import WarningIcon from "@material-ui/icons/WarningRounded";

import {
  NOTIFICATION_WARNING,
  GAUGE_PROXY_WARNING,
} from "utils/constants/common";
import { messageForDissmissNotification, NOTIFICATION_TYPE } from "../constants";

const useStyles = makeStyles((theme) => ({
  notificationContainer: { cursor: "pointer" },
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
  notificationType,
  notificationKey,
  onOptimizePoolNotificationDismiss,
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

          <Grid item xs={12}>
            <Button
              variant="contained"
              size="small"
              color="primary"
              disableElevation
              fullWidth
              onClick={() => fixClick(buttonText)}
            >
              {buttonText}
            </Button>
          </Grid>
        </>
      );
    } else if (notificationType === NOTIFICATION_TYPE) {
      return (
        <>
          <Grid item xs={12}>
            <Typography variant="body1">{messageForDissmissNotification[notificationKey].name}</Typography>
            <Typography variant="caption">{messageForDissmissNotification[notificationKey].description}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={onOptimizePoolNotificationDismiss}
            >
              Dismiss
            </Button>
          </Grid>
        </>
      );
    }

    return (
      <>
        <Grid item xs={12}>
          <Typography variant="body1">Gauge Proxy Upgrade</Typography>
          <Typography variant="caption">{GAUGE_PROXY_WARNING}</Typography>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            size="small"
            color="primary"
            disableElevation
            fullWidth
            onClick={() => fixClick(buttonText)}
          >
            {buttonText}
          </Button>
        </Grid>
      </>
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
          </Grid>
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default memo(NotificationListView);
