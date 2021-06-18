import { memo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Popover } from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
  icon: {
    fontSize: 14,
    color: theme.custom.palette.blue,
    cursor: 'pointer',
  },
}));

const CustomPopover = ({ style, className }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <HelpOutlineIcon
        style={style}
        className={clsx(classes.icon, className)}
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      />
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        Hi this is an example
      </Popover>
    </>
  );
};

export default memo(CustomPopover);
