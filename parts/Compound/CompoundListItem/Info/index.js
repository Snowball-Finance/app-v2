import { memo } from 'react';
import Image from 'next/image';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import Tags from 'components/Tags';
import ContainedButton from 'components/UI/Buttons/ContainedButton';

const useStyles = makeStyles((theme) => ({
  info: {
    display: 'flex',
    flexDirection: 'row',
    width: 400,
    [theme.breakpoints.down('sm')]: {
      width: 350
    }
  },
  left: {
    padding: theme.spacing(2),
    width: '80%'
  },
  right: {
    width: '20%'
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
  boost: {
    display: 'flex',
    justifyContent: 'center'
  }
}));

const Info = ({ icon, buttonText, boost }) => {
  const classes = useStyles();

  return (
    <div className={classes.info}>
      <div className={classes.left}>
        <Grid container alignItems="center">
          <Grid item xs={6} xl={6} md={6} lg={6}>
            <Typography variant="h6">What’s Boost?</Typography>
          </Grid>
          <Grid item xs={2} xl={2} md={2} lg={2}>
            <Tags type="SNOB" className={classes.boost}>{boost}</Tags>
          </Grid>
        </Grid>
        <Typography variant="subtitle2">
          The {boost} showing in pools is the incentivations of xSNOB earned.
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
        <div className={classes.icon}>
          <Image alt="icon" src={icon} width={136} height={120} layout='fixed' />
        </div>
      </div>
    </div>
  );
};

export default memo(Info);
