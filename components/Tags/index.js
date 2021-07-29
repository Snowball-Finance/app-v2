import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  tags: {
    display: 'table-cell',
    alignItems: 'center',
    padding: theme.spacing(0.3),
    fontSize: 12,
    borderRadius: 4
  },
  SNOB: {
    backgroundColor: theme.custom.palette.transparent.snob_blue,
    color: theme.custom.palette.snob_blue
  },
  PNG: {
    backgroundColor: theme.custom.palette.transparent.png_orange,
    color: theme.custom.palette.png_orange
  },
  JOE: {
    backgroundColor: theme.custom.palette.transparent.joe_red,
    color: theme.custom.palette.joe_red
  }
}));

const Tags = ({ children, style, className, type }) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.tags, className, classes[type])} style={style}>
      {children}
    </div>
  );
};

export default memo(Tags);
