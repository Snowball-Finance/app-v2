import { memo, useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  Badge,
  Grid,
  Popover,
  List,
  Divider,
  Typography,
  Chip,
} from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";

import { useNotification } from "contexts/notification-context";
import NotificationListItem from "./NotificationListItem";
import LINKS from "utils/constants/links";
import { useContracts } from "contexts/contract-context";
import { usePopup } from "contexts/popup-context";
import { CONTRACTS } from "config";
import GAUGE_PROXY_ABI from "libs/abis/gauge-proxy.json";
import GAUGE_ABI from "libs/abis/gauge.json";
import GAUGE_TOKEN_ABI from "libs/abis/gauge-token.json";
import UpgradeSteps from "parts/GeneralAlerts/UpgradeSteps";
import { isEmpty } from "utils/helpers/utility";
import { useCompoundAndEarnContract } from "contexts/compound-and-earn-context";
import { useAPIContext } from "contexts/api-context";
import ANIMATIONS from "utils/constants/animate-icons";

const useStyles = makeStyles((theme) => ({
  iconButton: {
    marginRight: theme.spacing(1),
    cursor: "pointer",
  },
  listContainer: {
    width: 300,
    padding: theme.spacing(2, 0),
  },
  divider: {
    margin: theme.spacing(1, 0),
  },
}));

const Notification = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const {
    notifications,
    addPartialInvestment,
    dismissNotification,
  } = useNotification();
  const { account, library } = useWeb3React();
  const { gauges } = useContracts();
  const { setPopUp } = usePopup();
  const { getLastSnowballInfo } = useAPIContext();
  const { data: { LastSnowballInfo: { poolsInfo: pools = [] } = {} } = {} } =
    getLastSnowballInfo();

  //upgrade gaugesv2
  const [gaugeStep, setGaugeStep] = useState("fixMyPool");
  const [userGauges, setUserGauges] = useState([]);
  const [upgradingStep, setUpgradingStep] = useState({
    fixMyPool: {
      current: 0,
      total: 0,
      pools: 0,
    },
    upgrade: {
      current: 0,
      total: 0,
      pools: 0,
    },
  });

  //partial investments
  const [asked, setAsked] = useState(false);
  const [deposited, setDeposited] = useState(false);
  const [pendingPools, setPendingPools] = useState([]);
  const { userPools, deposit, approve } = useCompoundAndEarnContract();

  useEffect(() => {
    if (!asked && account && userPools.length > 0 && gauges.length > 0) {
      const checkUserPools = async () => {
        if (userPools.length > 0) {
          let pending = [];
          //check for funds dangling in snowglobes
          for (const idx in userPools) {
            if (userPools[idx].userBalanceSnowglobe > 0) {
              pending.push(userPools[idx]);
            }
          }

          setUpgradingStep((prev) => ({
            ...prev,
            fixMyPool: {
              total: pending.length * 2,
              current: 0,
              pools: pending.length,
            },
          }));
          setPendingPools(pending);
          setAsked(true);
        }
      };
      checkUserPools();
    }
  }, [account, asked, userPools, gauges]);

  useEffect(() => {
    if (pendingPools.length > 0) {
      addPartialInvestment({ isFixMyPool: true, buttonText: "Fix my pool" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingPools]);

  const userPoolsFix = async () => {
    if (!deposited && pendingPools.length > 0 && pools.length > 0) {
      setDeposited(true);
      for (const idx in pendingPools) {
        const pool = pools.find((item) => {
          return (
            pendingPools[idx].address.toLowerCase() ===
            item.address.toLowerCase()
          );
        });
        if (pool) {
          setUpgradingStep((prev) => {
            return {
              ...prev,
              fixMyPool: {
                current: prev.fixMyPool.current++,
                ...prev.fixMyPool,
              },
            };
          });
          await approve(
            pool,
            pendingPools[idx].userBalanceSnowglobe,
            null,
            true,
            false
          );
          setUpgradingStep((prev) => {
            return {
              ...prev,
              fixMyPool: {
                current: prev.fixMyPool.current++,
                ...prev.fixMyPool,
              },
            };
          });
          await deposit(
            pool,
            pendingPools[idx].userBalanceSnowglobe,
            null,
            true,
            false
          );
        }
      }
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  useEffect(() => {
    if (account && !isEmpty(gauges)) {
      checkUserBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, gauges]);

  const checkUserBalance = async () => {
    try {
      let userGauges = [];
      const gaugeProxyV1Contract = new ethers.Contract(
        CONTRACTS.GAUGE_PROXYV1,
        GAUGE_PROXY_ABI,
        library.getSigner()
      );
      const gaugeProxyV2Contract = new ethers.Contract(
        CONTRACTS.GAUGE_PROXYV2,
        GAUGE_PROXY_ABI,
        library.getSigner()
      );
      await Promise.all(
        gauges.map(async (item) => {
          const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
          const oldGaugeAddress = await gaugeProxyV1Contract.getGauge(
            item.token
          );
          const newGaugeAddress = await gaugeProxyV2Contract.getGauge(
            item.token
          );
          //ensure that we have a gauge
          if (
            oldGaugeAddress !== ZERO_ADDRESS &&
            newGaugeAddress !== ZERO_ADDRESS
          ) {
            const gaugeContract = new ethers.Contract(
              oldGaugeAddress,
              GAUGE_ABI,
              library.getSigner()
            );
            const gaugeBalance = await gaugeContract.balanceOf(account);
            const gauge = {
              address: oldGaugeAddress,
              token: item.token,
            };
            if (gaugeBalance.gt(0x00)) {
              userGauges = [...userGauges, gauge];
            }
          }
        })
      );

      if (!isEmpty(userGauges)) {
        setUpgradingStep((prev) => {
          return {
            ...prev,
            upgrade: {
              total: userGauges.length * 4,
              current: 0,
              pools: userGauges.length,
            },
          };
        });
        setUserGauges(userGauges);
        addPartialInvestment({ isFixMyPool: false, buttonText: "Upgrade" });
      }
    } catch (error) {
      console.log("[checkUserBalance] Error => ", error);
    }
  };

  const upgradeGaugeProxy2 = async () => {
    try {
      const gaugeProxyV2Contract = new ethers.Contract(
        CONTRACTS.GAUGE_PROXYV2,
        GAUGE_PROXY_ABI,
        library.getSigner()
      );

      for (const gauge of userGauges) {
        const newGaugeAddress = await gaugeProxyV2Contract.getGauge(
          gauge.token
        );
        if (!newGaugeAddress) {
          setPopUp({
            title: "Transaction Error",
            icon: ANIMATIONS.ERROR.VALUE,
            text: `Error get New Gauge Address from New GaugeProxy`,
          });
          return;
        }

        const gaugeContract = new ethers.Contract(
          gauge.address,
          GAUGE_ABI,
          library.getSigner()
        );
        const newGaugeContract = new ethers.Contract(
          newGaugeAddress,
          GAUGE_ABI,
          library.getSigner()
        );
        const tokenContract = new ethers.Contract(
          gauge.token,
          GAUGE_TOKEN_ABI,
          library.getSigner()
        );

        // withdraw from oldGauge
        const gaugeBalance = await gaugeContract.balanceOf(account);
        const gaugeWithdraw = await gaugeContract.withdraw(gaugeBalance);
        const transactionGaugeWithdraw = await gaugeWithdraw.wait(1);
        if (!transactionGaugeWithdraw.status) {
          setPopUp({
            title: "Transaction Error",
            icon: ANIMATIONS.ERROR.VALUE,
            text: `Error withdrawing from Gauge`,
          });
          return;
        }
        setUpgradingStep((prev) => {
          return {
            ...prev,
            upgrade: {
              current: prev.upgrade.current++,
              ...prev.upgrade,
            },
          };
        });

        // claim from oldGauge
        const gaugeClaim = await gaugeContract.getReward();
        const transactionGaugeClaim = await gaugeClaim.wait(1);
        if (!transactionGaugeClaim.status) {
          setPopUp({
            title: "Transaction Error",
            icon: ANIMATIONS.ERROR.VALUE,
            text: `Error claiming from Gauge`,
          });
          return;
        }
        setUpgradingStep((prev) => {
          return {
            ...prev,
            upgrade: {
              current: prev.upgrade.current++,
              ...prev.upgrade,
            },
          };
        });

        // approve token newGauge
        const tokenBalance = await tokenContract.balanceOf(account);
        const tokenApprove = await tokenContract.approve(
          newGaugeAddress,
          ethers.constants.MaxUint256
        );
        const transactionTokenApprove = await tokenApprove.wait(1);
        if (!transactionTokenApprove.status) {
          setPopUp({
            title: "Transaction Error",
            icon: ANIMATIONS.ERROR.VALUE,
            text: `Error approving token`,
          });
          return;
        }
        setUpgradingStep((prev) => {
          return {
            ...prev,
            upgrade: {
              current: prev.upgrade.current++,
              ...prev.upgrade,
            },
          };
        });

        // deposit token on newGauge
        const tokenDeposit = await newGaugeContract.deposit(tokenBalance);
        const transactionTokenDeposit = await tokenDeposit.wait(1);
        if (!transactionTokenDeposit.status) {
          setPopUp({
            title: "Transaction Error",
            icon: ANIMATIONS.ERROR.VALUE,
            text: `Error depositing token`,
          });
          return;
        }
        setUpgradingStep((prev) => {
          return {
            ...prev,
            upgrade: {
              current: prev.upgrade.current++,
              ...prev.upgrade,
            },
          };
        });
      }

      setPopUp({
        title: "Success",
        icon: ANIMATIONS.SUCCESS.VALUE,
        text: "Upgrade to GaugeProxyV2 completed!",
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.log("[upgradeGaugeProxy2] Error => ", error);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFixMyPool = (buttonText) => {
    setConfirmDialog(true);
    const isUpgradeButton = buttonText === "Upgrade";
    if (isUpgradeButton) {
      setGaugeStep("upgrade");
      upgradeGaugeProxy2();
    } else {
      setGaugeStep("fixMyPool");
      userPoolsFix();
    }
  };

  const handleReadMore = () => {
    window.open(LINKS.GITBOOK_DOCS.COMPOUNDING.HREF, "_blank");
  };

  const onOptimizePoolNotificationDismiss = (key) => {
    dismissNotification(key);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <Badge
        className={classes.iconButton}
        badgeContent={notifications.length}
        onClick={handleClick}
        color="primary"
      >
        <NotificationsIcon />
      </Badge>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <List
          className={classes.listContainer}
          subheader={
            <>
              <Grid container justify="space-around" alignItems="center">
                <Grid item>
                  <Typography variant="h6">Notifications</Typography>
                </Grid>

                <Grid item>
                  <Chip
                    label={`${notifications.length} new`}
                    color="primary"
                    size="small"
                  />
                </Grid>
              </Grid>

              <Divider className={classes.divider} />
            </>
          }
        >
          {notifications?.map((item, index) => (
            <NotificationListItem
              key={index}
              isFixMyPool={item.isFixMyPool}
              fromContext={item.fromContext}
              buttonText={item.buttonText}
              notificationType={item.type}
              notificationKey={item.key}
              fixClick={handleFixMyPool}
              readMoreClick={handleReadMore}
              onOptimizePoolNotificationDismiss={
                onOptimizePoolNotificationDismiss
              }
            />
          ))}
        </List>
      </Popover>

      {confirmDialog && (
        <UpgradeSteps
          open={confirmDialog}
          length={upgradingStep[gaugeStep].pools}
          step={upgradingStep[gaugeStep].current}
          totalSteps={upgradingStep[gaugeStep].total}
          handleClose={() => {
            setConfirmDialog(false);
          }}
        />
      )}
    </>
  );
};

export default memo(Notification);
