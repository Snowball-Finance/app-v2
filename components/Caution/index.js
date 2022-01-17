import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Avatar, Typography } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/WarningTwoTone';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  caution: {
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

const Caution = ({ children, style, className }) => {
  const classes = useStyles();

  return (
    <Box className={clsx(classes.caution, className)} style={style}>
      <Grid container spacing={2}>
        <Grid item>
          <Avatar className={classes.iconContainer}>
            <WarningIcon className={classes.icon} />
          </Avatar>
        </Grid>
        <Grid item>
          <Typography variant="body1">Caution</Typography>
          {children}
        </Grid>
      </Grid>
    </Box>
  );
};

export default memo(Caution);
