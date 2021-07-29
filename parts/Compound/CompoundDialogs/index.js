import { memo, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import clsx from 'clsx';

import SnowDialog from 'components/SnowDialog';
import ContainedButton from 'components/UI/Buttons/ContainedButton';
import SnowTextField from 'components/UI/TextFields/SnowTextField';
import CompoundSlider from './CompoundSlider';
import Details from './Details';

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
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
    textTransform: 'none',
  },
  greenButton: {
    color: theme.custom.palette.green,
    backgroundColor: theme.custom.palette.transparent.green,
    textTransform: 'none',
  },
  greyButton: {
    backgroundColor: '#BDBDBD',
  },
}));

const CompoundDialogs = ({ open, title, item, handleClose, onApprove, onSubmit }) => {
  const classes = useStyles();
  const [slider, setSlider] = useState(0);
  const [amount, setAmount] = useState(0);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setData(demoDataToDisplay[title.toLowerCase()]);
  }, [title]);

  const calculatePercentage = (amount) => {
    return (amount / data?.availableBalance) * 100;
  };

  const calculatedBalance = (value) => {
    return (data?.availableBalance * value) / 100;
  };

  const inputHandler = (event) => {
    const percentage = calculatePercentage(event.target.value);
    if(data?.availableBalance >= event.target.value) {
      setAmount(event.target.value);
      setSlider(percentage);
      setError(null);
    } else {
      setError(`Can't exceed the max limit`)
    }
  };

  const handleSliderChange = (value) => {
    const usedBalance = calculatedBalance(value);
    setSlider(value);
    setAmount(usedBalance);
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
        <Typography variant="subtitle2">Amount</Typography>
        <SnowTextField
          type="number"
          name="percent"
          endAdornment="PGL"
          value={amount}
          error={error}
          onChange={inputHandler}
        />
        <CompoundSlider value={slider} onChange={handleSliderChange} />
        <Details data={data} item={item} calculatedBalance={amount} />
        <div className={classes.buttonContainer}>
          <ContainedButton
            className={clsx(classes.button, {
              [classes.greenButton]: slider === 50,
            })}
            disableElevation
            onClick={() => onApprove(item.name, amount)}
          >
            Approve
          </ContainedButton>
          <ContainedButton
            className={clsx(classes.button, {
              [classes.greyButton]: slider !== 100,
            })}
            disableElevation
            onClick={() => onSubmit(title, item.name, amount)}
          >
            {title}
          </ContainedButton>
        </div>
      </div>
    </SnowDialog>
  );
};

export default memo(CompoundDialogs);

const demoDataToDisplay = {
  deposit: {
    name: 'Deposit',
    pairs: ['png', 'wavax'],
    pairsName: 'PNG-AVAX',
    availableBalance: 154001,
  },
  withdraw: {
    name: 'Withdraw',
    pairs: ['png', 'wavax'],
    pairsName: 'PNG-AVAX',
    availableBalance: 154001,
  },
  claim: {
    name: 'Claim',
    pairs: ['snowball'],
    pairsName: 'SNOB',
    availableBalance: 154001,
  },
};
