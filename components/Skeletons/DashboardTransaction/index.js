import { memo, useMemo } from "react";
import { makeStyles } from '@material-ui/core/styles';

import Skeleton from 'components/Skeletons';
import Shimmer from 'components/Skeletons/Shimmer';

const useStyles = makeStyles(() => ({
  root: {
    width: '100% !important',
    position: 'relative',
    overflow: 'hidden',
  },
  container: {
    display: 'grid',
    gridAutoColumns: '1fr',
    gridAutoFlow: 'column',
    alignItems: 'center',
  },
  child: {
    display: 'grid',
    gridTemplateColumns: '1fr 9fr',
    alignItems: 'center',
  },
}));

const DashboardTransactionSkeleton = () => {
  const classes = useStyles();
  const arr = useMemo(() => [1, 2, 3], []);

  return arr.map((item) => (
    <div className={classes.root} key={item}>
      <div className={classes.container}>
        <div className={classes.child}>
          <div>
            <Skeleton type="avatar" />
          </div>
          <div>
            <Skeleton type="title" />
            <Skeleton type="text" />
          </div>
        </div>
      </div>
      <Shimmer />
    </div>
  ));
};

export default memo(DashboardTransactionSkeleton);
