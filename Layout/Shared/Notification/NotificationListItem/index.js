import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ListItem, Avatar, Grid, Typography } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/WarningRounded';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  notificationContainer: { cursor: 'pointer' },
  notificationIconContainer: {
    backgroundColor: theme.custom.palette.joe_red,
  },
  read: {
    backgroundColor: theme.custom.palette.lightGrey,
  },
}));

const NotificationListView = ({ address, message, read, messageClick }) => {
  const classes = useStyles();

  return (
    <ListItem
      className={clsx(classes.notificationContainer, { [classes.read]: !read })}
      onClick={() => messageClick(address)}
    >
      <Grid container justify="space-between" spacing={2}>
        <Grid item xs={1}>
          <Avatar className={classes.notificationIconContainer}>
            <WarningIcon />
          </Avatar>
        </Grid>

        <Grid item xs={9}>
          <Typography variant="body1">Partial Investment</Typography>
          <Typography variant="caption">{message}</Typography>
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default memo(NotificationListView);
