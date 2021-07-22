import { memo } from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import Tags from 'components/Tags';
import ContainedButton from 'components/UI/Buttons/ContainedButton';

const useStyles = makeStyles((theme) => ({
  info: {
    display: 'flex',
    flexDirection: 'row',
    width: 400,
  },
  left: {
    padding: theme.spacing(2),
    width: '80%'
  },
  right: {
    width: '20%'
  },
  header: {
    display: 'flex',
  },
  icon: {
    position: 'absolute',
    right: 10,
    bottom: 0,
    objectFit: 'contain',
    height: 120
  },
  subHeaderButton: {
    marginTop: theme.spacing(2),
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    fontWeight: 600,
    color: theme.custom.palette.blue,
    textTransform: 'none',
  },
}));

const Info = ({ icon, buttonText }) => {
  const classes = useStyles();

  return (
    <div className={classes.info}>
      <div className={classes.left}>
        <div className={classes.header}>
          <Typography variant="h6">What’s Boost?</Typography>
          <Tags type="snowball">2.5x</Tags>
        </div>
        <Typography variant="subtitle2">
          The 2.5x showing in pools is the incentivations of xSNOB earned.
        </Typography>

        <ContainedButton
          className={classes.subHeaderButton}
          size="small"
          disableElevation
          endIcon={<HelpOutlineIcon />}
        >
          {buttonText}
        </ContainedButton>
      </div>
      <div className={classes.right}>
        <img alt="icon" src={icon} className={classes.icon} />
      </div>
    </div>
  );
};

export default memo(Info);
