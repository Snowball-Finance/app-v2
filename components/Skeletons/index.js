import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles(() => ({
  skeleton: {
    background: '#ddd',
    overflow: 'hidden',
    margin: '10px 0',
    borderRadius: 4,
  },
  text: {
    width: '100%',
    height: 12,
  },
  title: {
    width: '50%',
    height: 20,
    marginBottom: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: '50%',
  },
  thumbnail: {
    width: 100,
    height: 100,
  },
}));

const Skeleton = ({ type }) => {
  const classes = useStyles();

  return <div className={clsx(classes.skeleton, { [classes[type]]: true })} />;
};

export default memo(Skeleton);
