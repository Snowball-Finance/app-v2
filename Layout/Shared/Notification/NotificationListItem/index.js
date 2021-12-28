import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  ListItem,
  Avatar,
  Grid,
  Button,
} from '@material-ui/core';
import WarningIcon from '@material-ui/icons/WarningRounded';

const useStyles = makeStyles((theme) => ({
  notificationContainer: { cursor: 'pointer' },
  notificationIconContainer: {
    backgroundColor: theme.custom.palette.joe_red,
  },
}));

const NotificationListView = ({
  message,
  buttonText,
  fixClick,
}) => {
  const classes = useStyles();

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
            {message}

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
          </Grid>
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default memo(NotificationListView);
