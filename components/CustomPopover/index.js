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
    overflowX: 'unset',
    overflowY: 'unset',
    '&::before': {
      content: '""',
      position: 'absolute',
      marginRight: '-0.71em',
      bottom: 0,
      right: '50%',
      width: 10,
      height: 10,
      backgroundColor: theme.palette.background.paper,
      transform: 'translate(-50%, 50%) rotate(135deg)',
      clipPath:
        'polygon(-5px -5px, calc(100% + 5px) -5px, calc(100% + 5px) calc(100% + 5px))',
    },
  },
  icon: {
    fontSize: 14,
    color: theme.custom.palette.blue,
    cursor: 'pointer',
  },
}));

const CustomPopover = ({
  style,
  anchorClassName,
  contentClassName,
  children,
}) => {
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
        className={clsx(classes.icon, anchorClassName)}
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      />
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: clsx(classes.paper, contentClassName),
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
        elevation={0}
      >
        {children}
      </Popover>
    </>
  );
};

export default memo(CustomPopover);
