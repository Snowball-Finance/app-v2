import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ViewListIcon from '@material-ui/icons/ViewList';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  root: {
    height: theme.spacing(6),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  iconButton: {
    color: theme.palette.action.active,
    cursor: 'pointer',
  },
  activeIconButton: {
    color: theme.custom.palette.blue,
  },
}));

const GridListView = ({ className, style, isListView, onChange }) => {
  const classes = useStyles();

  return (
    <Paper
      className={clsx(classes.root, className)}
      style={style}
      elevation={0}
    >
      <ViewModuleIcon
        onClick={() => onChange(false)}
        className={clsx(classes.iconButton, {
          [classes.activeIconButton]: !isListView,
        })}
      />
      <ViewListIcon
        onClick={() => onChange(true)}
        className={clsx(classes.iconButton, {
          [classes.activeIconButton]: isListView,
        })}
      />
    </Paper>
  );
};

export default memo(GridListView);
