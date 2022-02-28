import { memo, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  ListItem,
  Avatar,
  Grid,
  Button,
  Typography,
  Link as MuiLink,
} from "@material-ui/core";
import Link from "next/link";
import WarningIcon from "@material-ui/icons/WarningRounded";

import {
  NOTIFICATION_WARNING,
  GAUGE_PROXY_WARNING,
} from "utils/constants/common";
import {
  messageForDissmissNotification,
  NOTIFICATION_TYPE,
  OPTIMIZER,
  SNOW_DAY,
} from "../constants";
import LINKS from "utils/constants/links";
import { getAPR } from "utils/helpers/getAPR";
import { useStakingContract } from "contexts/staking-context";
import { useAPIContext } from "contexts/api-context";

const useStyles = makeStyles((theme) => ({
  notificationContainer: { cursor: "pointer" },
  notificationIconContainer: {
    backgroundColor: theme.custom.palette.joe_red,
  },
  link: {
    textDecoration: "underline",
  },
}));

const NotificationListView = ({
  buttonText,
  fixClick,
  readMoreClick,
  isFixMyPool,
  fromContext,
  notificationType,
  notificationKey,
  onOptimizePoolNotificationDismiss,
}) => {
  const classes = useStyles();
  const { isLocked, totalSupply, loading } = useStakingContract();
  const { getCurrentDistributionPhase } = useAPIContext();
  const { data, loading: currentDistributionPhaseLoading } =
    getCurrentDistributionPhase();
  const [snobAndAxialAPR, setSnobAndAxialAPR] = useState([]);

  useEffect(() => {
    async function fetchAPR() {
      try {
        const res = await getAPR(
          totalSupply / 1e18,
          data?.CurrentDistributionPhase.snobDistributed
        );
        setSnobAndAxialAPR(res);
      } catch (err) {
        console.log(err);
      }
    }
    fetchAPR();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, currentDistributionPhaseLoading]);

  const renderSnowDayMessage = () => {
    if (isLocked) {
      return (
        <Typography variant="caption">
          {`Happy Snow Day! This week's distribution is of X SNOB and X AXIAL, resulting in ${
            loading || currentDistributionPhaseLoading
              ? "loading..."
              : snobAndAxialAPR[0]?.toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })
          }% APR! Feel free to claim your earnings anytime.`}
        </Typography>
      );
    }

    return (
      <Typography variant="caption">
        {`Happy Snow Day! X SNOB and X AXIAL tokens were just distributed to xSNOB holders, resulting in ${
          loading || currentDistributionPhaseLoading
            ? "loading..."
            : snobAndAxialAPR[0]?.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })
        }% APR. Check out our `}
        <Link href={`${LINKS.STAKING.HREF}`}>
          <Typography variant="caption" className={classes.link}>
            Staking page
          </Typography>
        </Link>
        {` to learn more.`}
      </Typography>
    );
  };

  const renderNotificationTypeDescription = (notificationType) => {
    if (notificationType === OPTIMIZER) {
      return (
        <Typography variant="caption">
          {`Tired of moving funds around? Check out Snowball's new Optimized Pools on our `}
          <Link href={`${LINKS.COMPOUND_AND_EARN.HREF}?platform=optimized`}>
            <Typography variant="caption" className={classes.link}>
              Compound and earn page!
            </Typography>
          </Link>
        </Typography>
      );
    } else if (notificationType === SNOW_DAY) {
      return renderSnowDayMessage();
    }

    return null;
  };

  const conditionalMessageRender = () => {
    if (fromContext) {
      return (
        <Grid item xs={12}>
          <Typography variant="body1">Partial Investment Pending</Typography>
          <Typography variant="caption">Please refresh the page!!</Typography>
        </Grid>
      );
    } else if (isFixMyPool) {
      return (
        <>
          <Grid item xs={12}>
            <Typography variant="body1">Partial Investment</Typography>
            <Typography variant="caption">{NOTIFICATION_WARNING}</Typography>
          </Grid>
          <Grid item xs={12}>
            <MuiLink component="button" variant="body2" onClick={readMoreClick}>
              Read more
            </MuiLink>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              size="small"
              color="primary"
              disableElevation
              fullWidth
              onClick={() => fixClick(buttonText)}
            >
              {buttonText}
            </Button>
          </Grid>
        </>
      );
    } else if (notificationType === NOTIFICATION_TYPE) {
      return (
        <>
          <Grid item xs={12}>
            <Typography variant="body1">
              {messageForDissmissNotification[notificationKey].name}
            </Typography>
            {renderNotificationTypeDescription(notificationKey)}
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={() => onOptimizePoolNotificationDismiss(notificationKey)}
              fullWidth
            >
              Dismiss
            </Button>
          </Grid>
        </>
      );
    }

    return (
      <>
        <Grid item xs={12}>
          <Typography variant="body1">Gauge Proxy Upgrade</Typography>
          <Typography variant="caption">{GAUGE_PROXY_WARNING}</Typography>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            size="small"
            color="primary"
            disableElevation
            fullWidth
            onClick={() => fixClick(buttonText)}
          >
            {buttonText}
          </Button>
        </Grid>
      </>
    );
  };

  return (
    <ListItem className={classes.notificationContainer}>
      <Grid container justify="space-between" spacing={2}>
        <Grid item xs={1}>
          <Avatar className={classes.notificationIconContainer}>
            <WarningIcon />
          </Avatar>
        </Grid>

        <Grid item xs={9}>
          <Grid container spacing={1}>
            {conditionalMessageRender()}
          </Grid>
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default memo(NotificationListView);
