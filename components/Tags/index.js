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
    backgroundColor: 'rgba(103, 166, 240, 0.12)',
    color: '#28A2FF'
  },
  PNG: {
    backgroundColor: 'rgba(255, 107, 0, 0.12)',
    color: '#FF9F43'
  },
  JOE: {
    backgroundColor: 'rgba(242, 113, 106, 0.12)',
    color: '#F2716A'
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
