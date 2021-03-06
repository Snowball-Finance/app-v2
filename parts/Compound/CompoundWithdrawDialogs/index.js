import { memo, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import clsx from 'clsx';

import { useCompoundAndEarnContract } from 'contexts/compound-and-earn-context';
import Toast from 'components/Toast';
import SnowStepBox from 'components/SnowStepBox';
import SnowDialog from 'components/SnowDialog';
import ContainedButton from 'components/UI/Buttons/ContainedButton';
import CompoundSlider from './CompoundSlider';
import Details from './Details';
import { roundDown } from 'utils/helpers/utility';
import { SnowCheckbox } from 'components/UI/SnowCheckbox';

const useStyles = makeStyles(theme => ({
  dialog: {
    minWidth: 200,
    width: 420,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  dialogTitle: {
    background: 'none',
    justifyContent: 'left',
  },
  dialogTitleText: {
    color: 'currentColor',
    textTransform: 'none',
  },
  dialogCloseIcon: {
    color: 'currentColor',
  },
  container: {
    padding: theme.spacing(1),
  },
  buttonContainer: {
    margin: theme.spacing(1, 0, 0, 0),
  },
  modalButton: {
    padding: theme.spacing(2, 0),
    textTransform: 'none',
  },
  button: {
    textTransform: 'none',
    width: '100%',
    padding: theme.spacing(2, 0),
  },
  greyButton: {
    background: '#BDBDBD',
  },
}));

const CompoundWithdrawDialogs = ({ open, title, item, handleClose }) => {
  const classes = useStyles();
  const [slider, setSlider] = useState(0);
  const [amount, setAmount] = useState(0);
  const [inputAmount, setinputAmount] = useState(0);
  const [error, setError] = useState(null);
  const [isClaimChecked, setClaimChecked] = useState(true);

  const { isTransacting, transactionStatus, withdraw } = useCompoundAndEarnContract();

  useEffect(() => {
    if (!isTransacting.deposit && !isTransacting.approve && !isTransacting.withdraw) {
      toast.dismiss();
    }
  }),
    [isTransacting];

  useEffect(() => {
    if (transactionStatus.depositStep === 2) {
      handleClose();
    }
    if (!isClaimChecked && transactionStatus.withdrawStep === 2) {
      handleClose();
    }
    if (transactionStatus.withdrawStep === 3) {
      handleClose();
    }
  }),
    [transactionStatus, isClaimChecked];

  const calculatePercentage = amount => {
    return (amount / (item?.userBalanceGauge / 10 ** item?.lpDecimals)) * 100;
  };

  const calculatedBalance = value => {
    return item?.userBalanceGauge.mul(value).div(100);
  };

  const inputHandler = event => {
    if (event.target.value > 0 && !Object.is(NaN, event.target.value)) {
      const percentage = calculatePercentage(event.target.value);
      const balance =
        (item?.userBalanceGauge * (item.snowglobeRatio / 1e18)) / 10 ** item?.lpDecimals;
      if (balance >= event.target.value) {
        setinputAmount(event.target.value);
        setAmount(ethers.utils.parseUnits(roundDown(event.target.value).toString(), item?.lpDecimals));
        setSlider(percentage);
        setError(null);
      } else {
        setError(`Can't exceed the max limit`);
      }
    } else {
      setAmount(ethers.BigNumber.from(0));
      setinputAmount(0);
    }
  };

  const handleSliderChange = value => {
    const usedBalance = calculatedBalance(value);
    const inputAmount = (usedBalance * (item.snowglobeRatio / 1e18)) / 10 ** item?.lpDecimals;
    setSlider(value);
    setAmount(usedBalance);
    setinputAmount(
      inputAmount > 1e-6
        ? inputAmount
        : Number(inputAmount).toLocaleString('en-US', { maximumSignificantDigits: 18 }),
    );
    setError(null);
  };

  const withdrawHandler = () => {
    toast(<Toast message={'Withdrawing your Tokens...'} toastType={'processing'} />);
    if (item.deprecatedPool) {
      withdraw(item, null, isClaimChecked);
    } else {
      withdraw(item, amount ? amount : item.userBalanceSnowglobe, isClaimChecked);
    }
  };

  const claimCheckHandler = (value) => {
    console.log('[claimCheckHandler] ==>', value);
    setClaimChecked(value);
  }

  return (
    <SnowDialog
      open={open}
      title={title}
      onClose={handleClose}
      dialogClass={classes.dialog}
      dialogTitleClass={classes.dialogTitle}
      titleTextClass={classes.dialogTitleText}
      closeIconClass={classes.dialogCloseIcon}>
      <div className={classes.container}>
        <Details
          item={item}
          title={title}
          amount={inputAmount}
          inputHandler={inputHandler}
          error={error}
        />

        {item?.userBalanceGauge > 0 && <CompoundSlider value={slider} onChange={handleSliderChange} />}
        <Grid container spacing={1} className={classes.buttonContainer}>
          <Grid item xs={12}>
            <ContainedButton
              className={clsx(classes.button)}
              disableElevation
              disabled={(amount == 0 && item?.userBalanceGauge > 0) || (item?.userDepositedLP === 0 || item?.withdrew || !item)}
              loading={isTransacting.withdraw}
              onClick={withdrawHandler}>
              {transactionStatus.withdrawStep < 2 ? 'Withdraw' : 'Claim'}
            </ContainedButton>
          </Grid>
          <Grid item xs={12}>
            <SnowCheckbox
              label='Claim Rewards'
              isChecked={isClaimChecked}
              onChange={claimCheckHandler} />
          </Grid>
        </Grid>
      </div>
      <SnowStepBox
        isClaimChecked={isClaimChecked}
        transactionStatus={transactionStatus}
        title={title}
        isStableVault={item?.kind === 'Stablevault'} />
    </SnowDialog>
  );
};

export default memo(CompoundWithdrawDialogs);
