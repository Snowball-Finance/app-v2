import { memo, useState, useRef, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Popper, Paper, ClickAwayListener } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
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
    [theme.breakpoints.down('sm')]: {
      '&::before': {
        bottom: 0,
        right: '75%',
      },
    }
  },
  icon: {
    fontSize: 14,
    color: theme.custom.palette.blue,
    cursor: 'pointer',
  },
}));

const CustomPopover = ({
  contentClassName,
  children,
}) => {
  const classes = useStyles();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  // const [mouseOverPopover, setMouseOverPopover] = useState(false);

  const handleOpenActions = (event) => {
    setOpen(true);
  };

  // const handleCloseActions = () => {
  //   setOpen(false);
  // };

  const handleClosePopover = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  // const handleEnterPopover = () => {
  //   setMouseOverPopover(true);
  // };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <HelpOutlineIcon
        name='custom-popover'
        className={classes.icon}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup='true'
        onClick={handleOpenActions}
        // onMouseEnter={handleOpenActions}
        // onMouseLeave={handleCloseActions}
      />
      <Popper
        placement='top'
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
      >
        <ClickAwayListener onClickAway={handleClosePopover}>
          <Paper
            className={clsx(classes.paper, contentClassName)}
            // onMouseEnter={handleEnterPopover}
            // onMouseLeave={handleClosePopover}
          >
            {children}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  );
};

export default memo(CustomPopover);
