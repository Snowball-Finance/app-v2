import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Skeleton from 'components/Skeletons';
import Shimmer from 'components/Skeletons/Shimmer';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(3),
    padding: '10px 15px',
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.primary,
  },
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 9fr',
    alignItems: 'center',
  },
}));

const CompoundAndEarnSkeleton = () => {
  const classes = useStyles();

  return [1, 2, 3].map((item) => (
    <div className={classes.root} key={item}>
      <div className={classes.container}>
        <div>
          <Skeleton type="avatar" />
        </div>
        <div>
          <Skeleton type="title" />
          <Skeleton type="text" />
        </div>
      </div>
      <Shimmer />
    </div>
  ));
};

export default memo(CompoundAndEarnSkeleton);
