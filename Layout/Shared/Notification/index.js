import { memo, useState } from 'react';
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

import { useNotification } from 'contexts/notification-context';
import { CONTRACTS } from 'config';
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
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const { notifications } = useNotification();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onMessageClick = (address) => {
    window.open(
      `https://snowtrace.io/token/${CONTRACTS.SNOWBALL}?a=${address}`,
      '_blank'
    );
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Badge
        className={classes.iconButton}
        badgeContent={notifications.length}
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
                  <Chip
                    label={`${notifications.length} new`}
                    color="primary"
                    size="small"
                  />
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
