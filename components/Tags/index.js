import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  tags: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: theme.spacing(0.2),
    fontSize: 12,
    borderRadius: 4
  },
  primary: {
    backgroundColor: 'rgba(103, 166, 240, 0.12)',
    color: '#28A2FF',
  },
  secondary: {
    backgroundColor: 'rgba(255, 107, 0, 0.12)',
    color: '#FF9F43',
  },
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
