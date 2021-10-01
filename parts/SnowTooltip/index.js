import { memo } from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CustomPopover from 'components/CustomPopover';

const useStyles = makeStyles((theme) => ({
  info: {
    display: 'flex',
    flexDirection: 'column',
    width: 400,
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      width: 350
    }
  },
  popover: {
    backgroundColor: theme.custom.palette.lightBlue,
    '&::before': {
      backgroundColor: theme.custom.palette.lightBlue,
    },
  },
  container: {
    display: 'flex',
  },
  left: {
    width: '100%',
  },
  right: {
    width: '50%',
    textAlign: 'end',
  },
  title: {
    fontWeight: 600,
  },
}));

const SnowTooltip = ({
  title,
  text,
}) => {  
  const classes = useStyles();

  return (
    <CustomPopover contentClassName={classes.popover}>
    <div className={classes.info}>
      <Typography variant="h6">{title}</Typography>
      <div className={classes.container}>
        <div className={classes.left}>
          <Typography variant="body2">{text}</Typography>
        </div>
      </div>
    </div>
    </CustomPopover>
  );
};

export default memo(SnowTooltip)