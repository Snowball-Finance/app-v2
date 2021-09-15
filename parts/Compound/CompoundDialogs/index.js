import { memo, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import clsx from 'clsx'

import { useCompoundAndEarnContract } from 'contexts/compound-and-earn-context';
import Toast from 'components/Toast';
import SnowStepBox from 'components/SnowStepBox';
import SnowDialog from 'components/SnowDialog';
import ContainedButton from 'components/UI/Buttons/ContainedButton';
import GradientButton from 'components/UI/Buttons/GradientButton';
import CompoundSlider from './CompoundSlider';
import Details from './Details';
import { roundDown } from 'utils/helpers/utility';

const useStyles = makeStyles((theme) => ({
  dialog: {
    minWidth: 200,
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
    margin: theme.spacing(1, 0),
  },
  modalButton: {
    padding: theme.spacing(2, 0),
    textTransform: 'none',
  },
  button: {
    fontSize: 24,
    textTransform: 'capitalize'
  },
  greyButton: {
    background: '#BDBDBD',
  }
}));

const CompoundDialogs = ({
  open,
  title,
  item,
  handleClose,
}) => {
  const classes = useStyles();
  const [slider, setSlider] = useState(0);
  const [amount, setAmount] = useState(0);
  const [inputAmount, setinputAmount] = useState(0);
  const [approved, setApproved] = useState(false);
  const [error, setError] = useState(null);
 
  const { approve, deposit, isTransacting, transactionStatus, withdraw } = useCompoundAndEarnContract();

  useEffect(() =>{
    if(!isTransacting.deposit && !isTransacting.approve){
      toast.dismiss();
    }
  }),[isTransacting];

  useEffect(() =>{
    if(transactionStatus.depositStep === 2){
      handleClose();
    }
  }),[transactionStatus];

  const calculatePercentage = (amount) => {
    return amount / (item?.userLPBalance/10**item?.lpDecimals) * 100;
  };

  const calculatedBalance = (value) => {
    return item?.userLPBalance.mul(value).div(100);
  };

  const enabledHandler = (isApproved = false) => {
    return (isApproved? approved : !approved) || (amount == 0) ||
      isTransacting.approve || isTransacting.deposit;
  }

  const inputHandler = (event) => {
    if(event.target.value > 0 && !Object.is(NaN,event.target.value)){
      const percentage = calculatePercentage(event.target.value);
      if (item?.userLPBalance/10**item?.lpDecimals >= event.target.value) {
        setinputAmount(event.target.value);
        setAmount(ethers.utils.parseUnits(roundDown(event.target.value).toString(), 18));
        setSlider(percentage);
        setError(null);
      } else {
        setError(`Can't exceed the max limit`);
      }
    }else{
      setAmount(ethers.BigNumber.from(0));
      setinputAmount(0);
    }
  };

  const handleSliderChange = (value) => {
    const usedBalance = calculatedBalance(value);
    const inputAmount = (usedBalance/10**item?.lpDecimals);
    setSlider(value);
    setAmount(usedBalance);
    setinputAmount(inputAmount > 1e-6? inputAmount : Number(inputAmount).toLocaleString('en-US',{maximumSignificantDigits:18}));
  };

  const renderButton = () => {
    switch (title) {
      case 'Deposit': {
        return (
          <>
            <Grid item xs={6}>
              <ContainedButton
                className={clsx(classes.modalButton)}
                disableElevation
                fullWidth
                disabled={enabledHandler(true)}
                loading={isTransacting.approve}
                onClick={() => {
                  toast(<Toast message={'Checking for approval...'} toastType={'processing'}/>)
                  setApproved(approve(item, amount))
                }}
              >
                Approve
              </ContainedButton>
            </Grid>
            <Grid item xs={6}>
              <GradientButton
                className={clsx(classes.modalButton)}
                disableElevation
                fullWidth
                disabled={enabledHandler(false)}
                loading={isTransacting.deposit}
                onClick={() => {
                    toast(<Toast message={'Depositing your Tokens...'} toastType={'processing'}/>)
                    deposit(item, amount)
                  }
                }
              >
                Deposit
              </GradientButton>
            </Grid>
          </>
        );
      }
      case 'Withdraw': {
        return (
          <Grid item xs={12}>
              <ContainedButton
                className={clsx(classes.button)}
                fullWidth
                onClick={() => {
                  toast(<Toast message={'Withdrawing your Tokens...'} toastType={'processing'} />)
                  withdraw(item, amount)
                  handleClose()
                }}
              >
                Withdraw
              </ContainedButton>
            </Grid>
        )
      }
      default:
        return null;
    }
  };

  return (
    <SnowDialog
      open={open}
      title={title}
      onClose={() => handleClose()}
      dialogClass={classes.dialog}
      dialogTitleClass={classes.dialogTitle}
      titleTextClass={classes.dialogTitleText}
      closeIconClass={classes.dialogCloseIcon}
    >
      <div className={classes.container}>
        <Details
          item={item}
          amount={inputAmount}
          inputHandler={inputHandler}
          error={error}
        />

        <CompoundSlider value={slider} onChange={handleSliderChange} />
        <Grid container spacing={1} className={classes.buttonContainer}>
          {renderButton()}
        </Grid>
      </div>
      {title==="Withdraw" ?  <></> : <SnowStepBox transactionStatus={transactionStatus}/>}
    </SnowDialog>
  );
};

export default memo(CompoundDialogs);