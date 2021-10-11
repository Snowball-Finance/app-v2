import { memo, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import clsx from 'clsx'

import { useCompoundAndEarnContract } from 'contexts/compound-and-earn-context';
import Toast from 'components/Toast';
import SnowStepBox from 'components/SnowStepBox';
import SnowDialog from 'components/SnowDialog';
import ContainedButton from 'components/UI/Buttons/ContainedButton';
import CompoundSlider from './CompoundSlider';
import CompoundInfo from './CompoundInfo';
import Details from './Details';
import { roundDown } from 'utils/helpers/utility';

const useStyles = makeStyles((theme) => ({
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
    height: 48,
    paddingBottom: 0,
  },
  dialogTitleText: {
    color: 'currentColor',
    textTransform: 'none',
  },
  dialogCloseIcon: {
    color: 'currentColor',
    top: theme.spacing(0.5),
    right: theme.spacing(1.5),
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
    '&:disabled': {
      backgroundColor: `${theme.custom.palette.blueButton} !important`,
    }
  },
  button: {
    textTransform: 'none',
    width: '100%',
    padding: theme.spacing(2, 0),
  },
  greyButton: {
    background: '#BDBDBD',
  }
}));

const CompoundDialogs = ({
  open,
  title,
  pool,
  poolList,
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
    if(!isTransacting.deposit && !isTransacting.approve && !isTransacting.withdraw){
      toast.dismiss();
    }
  }),[isTransacting];

  useEffect(() =>{
    if(transactionStatus.depositStep === 2){
      handleClose();
    }
    if(transactionStatus.withdrawStep === 3){
      handleClose();
    }
  }),[transactionStatus];

  const calculatePercentage = (amount) => {
    return title != "Withdraw" ? amount / (item?.userLPBalance/10**item?.lpDecimals) * 100 : amount / (item?.userBalanceGauge/10**item?.lpDecimals) * 100
  };

  const calculatedBalance = (value) => {
    return title != "Withdraw" ? item?.userLPBalance.mul(value).div(100) : item?.userBalanceGauge.mul(value).div(100);
  };

  const enabledHandler = (isApproved = false) => {
    return (isApproved? approved : !approved) || (amount == 0) ||
      isTransacting.approve || isTransacting.deposit;
  }

  const inputHandler = (event) => {
    if(event.target.value > 0 && !Object.is(NaN,event.target.value)){
      const percentage = calculatePercentage(event.target.value);
      const balance = title != "Withdraw" ? item?.userLPBalance/10**item?.lpDecimals : item?.userBalanceGauge/10**item?.lpDecimals;
      if (balance >= event.target.value) {
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
    setError(null);
  };

  const approveHandler = async () => {
    try {
      toast(<Toast message={'Checking for approval...'} toastType={'processing'}/>)
      const result = await approve(item, amount)
      if (result) {
        setApproved(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const renderButton = () => {
    switch (title) {
      case 'Deposit': {
        return (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <ContainedButton
                className={classes.modalButton}
                disableElevation
                fullWidth
                disabled={enabledHandler(true)}
                loading={isTransacting.approve}
                onClick={approveHandler}
              >
                Approve
              </ContainedButton>
            </Grid>
            <Grid item xs={6}>
              <ContainedButton
                className={classes.modalButton}
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
              </ContainedButton>
            </Grid>
          </Grid>
        );
      }
      case 'Withdraw': {
        return (
          <Grid item xs={12}>
              <ContainedButton
                className={clsx(classes.button)}
                disableElevation
                disabled={amount==0}
                loading={isTransacting.withdraw}
                onClick={() => {
                  toast(<Toast message={'Withdrawing your Tokens...'} toastType={'processing'} />)
                  withdraw(item, amount)
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
      <Typography variant='subtitle2'>Select token to convert</Typography>
      <div className={classes.container}>
        <Details
          item={item}
          poolList={poolList}
          title={title}
          amount={inputAmount}
          inputHandler={inputHandler}
          error={error}
        />

        <CompoundSlider value={slider} onChange={handleSliderChange} />
        <CompoundInfo pool={pool} />
        <div className={classes.buttonContainer}>
          {renderButton()}
        </div>
      </div>
      <SnowStepBox transactionStatus={transactionStatus} title={title}/>
    </SnowDialog>
  );
};

export default memo(CompoundDialogs);