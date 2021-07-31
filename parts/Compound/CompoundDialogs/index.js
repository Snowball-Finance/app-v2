import { memo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

import SnowDialog from 'components/SnowDialog';
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
    margin: theme.spacing(1, 0),
  },
}));

const CompoundDialogs = ({
  open,
  title,
  item,
  handleClose,
  footerButton,
}) => {
  const classes = useStyles();
  const [slider, setSlider] = useState(0);
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState(null);

  const calculatePercentage = (amount) => {
    return (amount / item.userLPBalance) * 100;
  };

  const calculatedBalance = (value) => {
    return (item.userLPBalance * value) / 100;
  };

  const inputHandler = (event) => {
    const percentage = calculatePercentage(event.target.value);
    if(item.userLPBalance >= event.target.value) {
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
        <Details
          item={item}
          amount={amount}
          inputHandler={inputHandler}
          error={error}
        />

        <CompoundSlider value={slider} onChange={handleSliderChange} />

        <Grid container spacing={1} className={classes.buttonContainer}>
          {footerButton()}
        </Grid>
      </div>
    </SnowDialog>
  );
};

export default memo(CompoundDialogs);
