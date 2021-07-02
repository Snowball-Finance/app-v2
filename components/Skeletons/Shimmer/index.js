import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  shimmerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    animation: '$loading 2.5s infinite',
  },
  shimmer: {
    width: '50%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    transform: 'skewX(-20deg)',
    boxShadow: '0 0 30px 30px rgba(255,255,255,0.2)',
  },
  '@keyframes loading': {
    '0%': { transform: 'translateX(-150%)' },
    '50%': { transform: 'translateX(-60%)' },
    '100%': { transform: 'translateX(150%)' },
  },
}));

const Shimmer = () => {
  const classes = useStyles();

  return (
    <div className={classes.shimmerWrapper}>
      <div className={classes.shimmer} />
    </div>
  );
};

export default memo(Shimmer);
