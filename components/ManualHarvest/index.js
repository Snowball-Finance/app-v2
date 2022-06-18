import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Avatar, Typography } from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  information: {
    padding: theme.spacing(1),
    borderRadius: 4,
    marginTop: theme.spacing(1),
    backgroundColor: theme.custom.palette.caution,
  },
  iconContainer: {
    backgroundColor: theme.palette.background.default,
  },
  icon: {
    color: theme.custom.palette.png_orange,
  },
}));

const ManualHarvest = ({ children, style, className }) => {
  const classes = useStyles();

  return (
    <Box className={clsx(classes.information, className)} style={style}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={"auto"}>
          <Avatar className={classes.iconContainer}>
            <CachedIcon className={classes.icon} />
          </Avatar>
        </Grid>
        <Grid item xs={10}>
          <Typography variant="body1">Manual Harvest</Typography>
          {children}
        </Grid>
      </Grid>
    </Box>
  );
};

export default memo(ManualHarvest);
