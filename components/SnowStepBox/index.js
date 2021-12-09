import { memo, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  upper: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 0.8,
    borderStyle: 'solid',
    borderColor: theme.custom.palette.border,
    padding: theme.spacing(1),
  },
  lower: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(0, 1, 1, 1),
  },
  ellipse: {
    borderRadius: 16,
    width: theme.spacing(2),
    height: theme.spacing(2),
    left: theme.spacing(6),
    top: theme.spacing(4),
  }
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

const SnowStepBox = ({ isClaimChecked, transactionStatus, title, isStableVault, singleDeposit = false, singleApprove = false }) => {
  const [colors, setColors] = useState([
    '#DBEDFF',
    '#DBEDFF',
    '#DBEDFF',
    '#DBEDFF',
    '#DBEDFF',
    '#DBEDFF',
  ]);
  const classes = useStyles();

  const color = {
    enabled: '#28A2FF',
    disabled: '#DBEDFF',
  };

  useEffect(() => {
    var newStatus = [];
    newStatus.push(transactionStatus.approvalStep > 0 ? color.enabled : color.disabled);
    newStatus.push(transactionStatus.approvalStep > 1 ? color.enabled : color.disabled);
    newStatus.push(transactionStatus.depositStep > 0 ? color.enabled : color.disabled);
    newStatus.push(transactionStatus.depositStep > 1 ? color.enabled : color.disabled);
    newStatus.push(transactionStatus.withdrawStep > 0 ? color.enabled : color.disabled);
    newStatus.push(transactionStatus.withdrawStep > 1 ? color.enabled : color.disabled);
    newStatus.push(transactionStatus.withdrawStep > 2 ? color.enabled : color.disabled);

    setColors(newStatus);
  }, [transactionStatus, color.disabled, color.enabled]);

  const getStep = (useSingle, step) => {
    if(step > 0){
      return useSingle ? step - 1 : step;
    } else {
      return step;
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.upper}>
        <div className={classes.container}>
          {title != 'Withdraw' ? (
            <>
              <Typography className={classes.title}>Approval Steps</Typography>
              <Typography className={classes.title}>Deposit Steps</Typography>
            </>
          ) : (
            <>
              <Typography className={classes.title}>Withdraw Steps</Typography>
              {isClaimChecked && <Typography className={classes.title}>Claim</Typography>}
            </>
          )}
        </div>
        <div className={classes.lower}>
          <div className={classes.container}>
            {title != 'Withdraw' ? (
              <>
                <Box display='flex' justifyContent='center' minWidth={112}>
                  {!singleApprove && <Box
                    mr={3}
                    className={classes.ellipse}
                    style={{ background: colors[enumDeposit.approval1] }}
                    borderRadius='50%'
                  />}
                  <Box
                    ml={singleApprove ? 0 : 3}
                    className={classes.ellipse}
                    style={{ background: colors[enumDeposit.approval2] }}
                    borderRadius='50%'
                  />
                </Box>
                <Box display='flex' justifyContent='center' minWidth={112}>
                  {!singleDeposit && <Box
                    mr={3}
                    className={classes.ellipse}
                    style={{ background: colors[enumDeposit.deposit1] }}
                    borderRadius='50%'
                  />}
                  <Box
                    ml={singleDeposit ? 0 : 3}
                    className={classes.ellipse}
                    style={{ background: colors[enumDeposit.deposit2] }}
                    borderRadius='50%'
                  />
                </Box>
              </>
            ) : (
              <>
                <Box display='flex' justifyContent='center' minWidth={112}>
                  {isStableVault ? (
                    <Box
                      className={classes.ellipse}
                      style={{ background: colors[enumDeposit.withdraw1] }}
                      borderRadius='50%'
                    />
                  ) : (
                    <>
                      <Box
                        className={classes.ellipse}
                        mr={3}
                        style={{ background: colors[enumDeposit.withdraw1] }}
                        borderRadius='50%'
                      />
                      <Box
                        className={classes.ellipse}
                        style={{ background: colors[enumDeposit.withdraw2] }}
                        ml={3}
                        borderRadius='50%'
                      />
                    </>
                  )}
                </Box>
                {isClaimChecked && <Box display='flex' justifyContent='center' minWidth={112}>
                  <Box
                    className={classes.ellipse}
                    style={{ background: colors[enumDeposit.withdraw3] }}
                    borderRadius='50%'
                  />
                </Box>}
              </>
            )}
          </div>
        </div>
        <div className={classes.lower}>
          <div className={classes.container}>
            {title != 'Withdraw' ? (
              <>
                <Typography className={classes.subtitle}>
                  {getStep(singleApprove, transactionStatus.approvalStep)}/{singleApprove ? 1 : 2} Step
                </Typography>
                <Typography className={classes.subtitle}>
                  {getStep(singleDeposit, transactionStatus.depositStep)}/{singleDeposit ? 1 : 2} Step
                </Typography>
              </>
            ) : (
              <>
                <Typography className={classes.subtitle}>
                  {isStableVault
                    ? transactionStatus.withdrawStep / 2
                    : transactionStatus.withdrawStep <= 2
                    ? transactionStatus.withdrawStep
                    : 2}
                  /{isStableVault ? 1 : 2} Step
                </Typography>
                {isClaimChecked && <Typography className={classes.subtitle}>
                  {transactionStatus.withdrawStep <= 2 ? 0 : transactionStatus.withdrawStep - 2}/1
                  Step
                </Typography>}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(SnowStepBox);
