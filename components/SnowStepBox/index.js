import { memo, useEffect, useState, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  upper: {
    width: "100%",
    borderRadius: 10,
    borderWidth: 0.8,
    borderStyle: "solid",
    borderColor: theme.custom.palette.border,
    padding: theme.spacing(1),
  },
  lower: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  container: {
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
  },
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(0, 1, 1, 1),
  },
  title: {
    fontSize: "14px",
    justifyItems: "center",
  },
  subtitle: {
    fontSize: "12px",
    justifyItems: "center",
  },
  ellipse: {
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "#DBEDFF",
    padding: theme.spacing(1),
    width: "15px",
    height: "15px",
    left: "47px",
    top: "33px",
  },
}));

const enumDeposit = {
  approval1: 0,
  approval2: 1,
  deposit1: 2,
  deposit2: 3,
  withdraw1: 4,
  withdraw2: 5,
  withdraw3: 6,
};
const DISABLED_COLOR = "#DBEDFF";
const ENABLED_COLOR = "#DBEDFF";

const SnowStepBox = ({ transactionStatus, title }) => {
  const [colors, setColors] = useState(new Array(6).fill(DISABLED_COLOR));
  const classes = useStyles();

  const color = useMemo(
    () => ({
      enabled: ENABLED_COLOR,
      disabled: DISABLED_COLOR
    }),
    []
  );

  useEffect(() => {
    setColors([
      transactionStatus.approvalStep > 0 ? color.enabled : color.disabled,
      transactionStatus.approvalStep > 1 ? color.enabled : color.disabled,
      transactionStatus.depositStep > 0 ? color.enabled : color.disabled,
      transactionStatus.depositStep > 1 ? color.enabled : color.disabled,
      transactionStatus.withdrawStep > 0 ? color.enabled : color.disabled,
      transactionStatus.withdrawStep > 1 ? color.enabled : color.disabled,
      transactionStatus.withdrawStep > 2 ? color.enabled : color.disabled,
    ]);
  }, [transactionStatus, color.disabled, color.enabled]);

  return (
    <div className={classes.root}>
      <div className={classes.upper}>
        <div className={classes.container}>
          {title != "Withdraw" ? (
            <>
              <Typography className={classes.title}>Approval Steps</Typography>
              <Typography className={classes.title}>Deposit Steps</Typography>
            </>
          ) : (
            <Typography className={classes.title}>Withdraw Steps</Typography>
          )}
        </div>
        <div className={classes.lower}>
          <div className={classes.container}>
            {title != "Withdraw" ? (
              <>
                <Box
                  className={classes.ellipse}
                  style={{ background: colors[enumDeposit.approval1] }}
                  borderRadius="50%"
                />
                <Box
                  className={classes.ellipse}
                  style={{ background: colors[enumDeposit.approval2] }}
                  borderRadius="50%"
                />
                <Box
                  className={classes.ellipse}
                  style={{ background: colors[enumDeposit.deposit1] }}
                  borderRadius="50%"
                />
                <Box
                  className={classes.ellipse}
                  style={{ background: colors[enumDeposit.deposit2] }}
                  borderRadius="50%"
                />
              </>
            ) : (
              <>
                <Box
                  className={classes.ellipse}
                  style={{ background: colors[enumDeposit.withdraw1] }}
                  borderRadius="50%"
                />
                <Box
                  className={classes.ellipse}
                  style={{ background: colors[enumDeposit.withdraw2] }}
                  borderRadius="50%"
                />
                <Box
                  className={classes.ellipse}
                  style={{ background: colors[enumDeposit.withdraw3] }}
                  borderRadius="50%"
                />
              </>
            )}
          </div>
        </div>
        <div className={classes.lower}>
          <div className={classes.container}>
            {title != "Withdraw" ? (
              <>
                <Typography className={classes.subtitle}>
                  {transactionStatus.approvalStep}/2 Step
                </Typography>
                <Typography className={classes.subtitle}>
                  {transactionStatus.depositStep}/2 Step
                </Typography>
              </>
            ) : (
              <Typography className={classes.subtitle}>
                {transactionStatus.withdrawStep}/3 Step
              </Typography>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(SnowStepBox);
