import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import SnowDialog from 'components/SnowDialog';

const useStyles = makeStyles((theme) => ({
  header: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1)
  }
}));

const UpgradeGaugeSteps = ({
  open,
  handleClose,
  gaugesLength,
  step
}) => {
  const classes = useStyles();

  return (
    <SnowDialog
      open={open}
      title={`Your Guages: ${gaugesLength}`}
      onClose={() => handleClose()}
    >
      <Typography variant='h5' align='center' className={classes.header}>
        Current Status
      </Typography>
      <Typography variant='h6' align='center'>
        {`${step} / ${gaugesLength * 4} steps`}
      </Typography>
    </SnowDialog>
  );
};

export default memo(UpgradeGaugeSteps);