import { memo, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Badge,
  Grid,
  Popover,
  List,
  Divider,
  Typography,
  Chip,
} from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';

import {
  readNotificationByAddress,
  getNotificationsFromStorage,
} from 'utils/helpers/notifications';
import NotificationListItem from './NotificationListItem';

const useStyles = makeStyles((theme) => ({
  iconButton: {
    marginRight: theme.spacing(1),
    cursor: 'pointer',
  },
  listContainer: {
    width: 300,
    padding: theme.spacing(2, 0),
  },
  divider: {
    margin: theme.spacing(1, 0),
  },
}));

const Notification = () => {
  const initialNotifications = () => getNotificationsFromStorage();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onMessageClick = (address) => {
    readNotificationByAddress(address);
  };

  useEffect(() => {
    const handler = () => {
      const notificationsFromStorage = getNotificationsFromStorage();

      if (notificationsFromStorage.length) {
        setCount(notificationsFromStorage.length);
        setNotifications(notificationsFromStorage);
      }
    };

    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('storage', handler);
    };
  }, [notifications]);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Badge
        className={classes.iconButton}
        badgeContent={count}
        onClick={handleClick}
        color="primary"
      >
        <NotificationsIcon />
      </Badge>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <List
          className={classes.listContainer}
          subheader={
            <>
              <Grid container justify="space-around" alignItems="center">
                <Grid item>
                  <Typography variant="h6">Notifications</Typography>
                </Grid>

                <Grid item>
                  <Chip label={`${count} new`} color="primary" size="small" />
                </Grid>
              </Grid>

              <Divider className={classes.divider} />
            </>
          }
        >
          {notifications?.map((item) => (
            <NotificationListItem
              key={item.address}
              address={item.address}
              message={item.message}
              read={item.read}
              messageClick={onMessageClick}
            />
          ))}
        </List>
      </Popover>
    </>
  );
};

export default memo(Notification);
