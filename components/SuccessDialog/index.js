import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import SnowDialog from 'components/SnowDialog';
import ContainedButton from 'components/UI/Buttons/ContainedButton';

const useStyles = makeStyles((theme) => ({
  dialog: {
    minWidth: 200,
  },
  dialogTitle: {
    background: 'none',
  },
  dialogCloseIcon: {
    color: 'currentColor',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: theme.spacing(4),
  },
}));

const SuccessDialog = ({ open, handleClose, subHeader }) => {
  const classes = useStyles();

  return (
    <SnowDialog
      open={open}
      onClose={() => handleClose()}
      dialogClass={classes.dialog}
      dialogTitleClass={classes.dialogTitle}
      closeIconClass={classes.dialogCloseIcon}
    >
      <div className={classes.container}>
        <Typography variant="h3">Success</Typography>
        <Typography variant="subtitle1">{subHeader}</Typography>
        <ContainedButton
          className={classes.button}
          onClick={() => handleClose()}
          disableElevation
          fullWidth
        >
          Close
        </ContainedButton>
      </div>
    </SnowDialog>
  );
};

export default memo(SuccessDialog);
