import { memo } from 'react';
import Image from 'next/image';
import { Grid, Typography, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import Tags from 'components/Tags';
import ContainedButton from 'components/UI/Buttons/ContainedButton';
import LINKS from 'utils/constants/links';

const useStyles = makeStyles((theme) => ({
  info: {
    padding: theme.spacing(2),
    width: 400,
    [theme.breakpoints.down('sm')]: {
      width: 350,
      padding: theme.spacing(1),
    },
  },
  icon: {
    position: 'absolute',
    right: 10,
    bottom: 0,
    objectFit: 'contain',
    height: 120,
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
    justifyContent: 'center',
  },
  link: {
    color: 'inherit',
  },
}));

const Info = ({ icon, buttonText, boost }) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.info}>
      <Grid item xs={12}>
        <Grid container alignItems="center" spacing={1}>
          <Grid item>
            <Typography variant="h6">xSNOB Boost?</Typography>
          </Grid>
          <Grid item>
            <Tags type="SNOB" className={classes.boost}>
              {boost}
            </Tags>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={1}>
          <Grid item xs={9}>
            <Typography variant="subtitle2">
              xSNOB Boost increases the amount of SNOB rewards tokens you
              receive by up to 2.5 times.{' '}
              <Link href={LINKS.STAKING.HREF} className={classes.link}>
                Stake SNOB tokens
              </Link>{' '}
              for xSNOB to increase your boost!
            </Typography>

            <ContainedButton
              className={classes.subHeaderButton}
              size="small"
              disableElevation
              endIcon={<HelpOutlineIcon />}
              href={LINKS.GITBOOK_DOCS.REWARD_BOOSTING.HREF}
            >
              {buttonText}
            </ContainedButton>
          </Grid>

          <Grid item xs={2}>
            <div className={classes.icon}>
              <Image
                alt="icon"
                src={icon}
                width={100}
                height={120}
                layout="fixed"
              />
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default memo(Info);
