import { memo } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Skeleton from "components/Skeletons";
import Shimmer from "components/Skeletons/Shimmer";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "10px 15px",
    borderRadius: 8,
    position: "relative",
    overflow: "hidden",
    backgroundColor: theme.palette.background.primary,
    height: "100%",
  },
  child: {
    marginTop: 20,
    display: "flex",
    justifyContent: "space-between",
  },
  width45: {
    width: "45%",
  },
  top20: {
    marginTop: 20,
  },
}));

const DashboardTVL = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div>
        <Skeleton type="title" />
        <Skeleton type="text" />
      </div>
      <div className={classes.child}>
        <div className={classes.width45}>
          <Skeleton type="title" />
          <Skeleton type="text" />
        </div>
        <div className={classes.width45}>
          <Skeleton type="title" />
          <Skeleton type="text" />
        </div>
      </div>
      <div className={classes.child}>
        <div className={classes.width45}>
          <Skeleton type="title" />
          <Skeleton type="text" />
        </div>
        <div className={classes.width45}>
          <Skeleton type="title" />
          <Skeleton type="text" />
        </div>
      </div>
      <div className={classes.top20}>
        <Skeleton type="title" />
        <Skeleton type="text" />
      </div>
      <Shimmer />
    </div>
  );
};

export default memo(DashboardTVL);
