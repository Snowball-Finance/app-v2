import { memo, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import clsx from 'clsx';

import SnowDialog from 'components/SnowDialog';
import ContainedButton from 'components/UI/Buttons/ContainedButton';
import GradientButton from 'components/UI/Buttons/GradientButton';
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
  button: {
    padding: theme.spacing(2, 0),
    textTransform: 'none',
  },
  greyButton: {
    background: '#BDBDBD',
  },
}));

const CompoundDialogs = ({
  open,
  title,
  item,
  handleClose,
  hasApproveButton,
  onApprove,
  onSubmit,
}) => {
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
    if (data?.availableBalance >= event.target.value) {
      setAmount(event.target.value);
      setSlider(percentage);
      setError(null);
    } else {
      setError(`Can't exceed the max limit`);
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
          data={data}
          item={item}
          amount={amount}
          inputHandler={inputHandler}
          error={error}
        />

        <CompoundSlider value={slider} onChange={handleSliderChange} />

        <Grid container spacing={1} className={classes.buttonContainer}>
          {hasApproveButton && (
            <Grid item xs={6}>
              <ContainedButton
                className={clsx(classes.button, {
                  [classes.greyButton]: slider === 100,
                })}
                disableElevation
                fullWidth
                onClick={() => onApprove(item.name, amount)}
              >
                Approve
              </ContainedButton>
            </Grid>
          )}
          <Grid item xs={hasApproveButton ? 6 : 12}>
            <GradientButton
              className={clsx(classes.button, {
                [classes.greyButton]: slider !== 100,
              })}
              disableElevation
              fullWidth
              onClick={() => onSubmit(title, item.name, amount)}
            >
              {title}
            </GradientButton>
          </Grid>
        </Grid>
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
