import { memo, useCallback } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import clsx from 'clsx'

import SnowDialog from 'components/SnowDialog';
import ContainedButton from 'components/UI/Buttons/ContainedButton';
import WarningIcon from 'components/Icons/WarningIcon';

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
  title: {
    fontWeight: 600,
    fontSize: '18px',
    color: '#F5425C'
  },
  text: {
    fontSize: '16px',
    padding: theme.spacing(2, 0),
  },
  dialogCloseIcon: {
    color: 'currentColor',
  },
  container: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    margin: theme.spacing(1, 0),
  },
  modalButton: {
    padding: theme.spacing(2, 5),
    textTransform: 'none',
  }
}));

const WarningDialogs = ({
  open,
  handleClose,
  title,
  text,
  textButton,
  setConfirmed
}) => {
  const classes = useStyles();

  const onClick = useCallback(() => {
    setConfirmed(true);
    handleClose();
  }, [handleClose, setConfirmed]);

  return (
    <SnowDialog
      open={open}
      onClose={() => handleClose()}
      dialogClass={classes.dialog}
      dialogTitleClass={classes.dialogTitle}
      titleTextClass={classes.dialogTitleText}
      closeIconClass={classes.dialogCloseIcon}
    >
      <Grid container className={classes.container}>
        <WarningIcon size={150} />
        <Typography className={classes.title}>
          {title}
        </Typography>
        <Typography className={classes.text}>
          {text}
        </Typography>
        <Grid item xs={6}>
          <ContainedButton
            className={clsx(classes.modalButton)}
            disableElevation
            fullWidth
            //loading={ }
            onClick={onClick}
          >
            {textButton}
          </ContainedButton>
        </Grid>

      </Grid>

    </SnowDialog>
  );
};

export default memo(WarningDialogs);