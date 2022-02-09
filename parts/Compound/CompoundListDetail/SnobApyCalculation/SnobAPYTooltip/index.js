import { memo } from 'react';
import { Typography, Link, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ContainedButton from 'components/UI/Buttons/ContainedButton';
import CircleLeftIcon from 'components/Icons/CircleLeftIcon';
import LINKS from 'utils/constants/links';

const useStyles = makeStyles((theme) => ({
  info: {
    width: 400,
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      width: 350,
    },
  },
  subHeaderButton: {
    fontSize: 12,
    fontWeight: 600,
    color: theme.custom.palette.white,
    textTransform: 'none',
  },
  stakingPage: {
    color: 'inherit',
    textDecoration: 'underline',
  },
  title: {
    fontWeight: 600,
  },
}));

const SnobAPYTooltip = ({ boostedSnobAPR, unboostedSnobAPR }) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.info} spacing={1}>
      <Grid item>
        <Typography>
          SNOB APR comes in the form of snowball tokens. The rate of SNOB
          distribution to this pool is voted on by the community on our
        </Typography>
        <Link href={LINKS.STAKING.HREF} className={classes.stakingPage}>
          <Typography>Staking Page</Typography>
        </Link>
      </Grid>
      <Grid item xs={12}>
        <Grid container justify="space-between">
          <Grid item>
            <Typography variant="body2">Boosted SNOB APR</Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle2" className={classes.title}>
              {boostedSnobAPR?.toFixed(2) || 0}%
            </Typography>
          </Grid>
        </Grid>
        <Grid container justify="space-between">
          <Grid item>
            <Typography variant="body2">Unboosted SNOB APR</Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle2" className={classes.title}>
              {unboostedSnobAPR?.toFixed(2) || 0}%
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <ContainedButton
          className={classes.subHeaderButton}
          size="small"
          disableElevation
          href={LINKS.GITBOOK_DOCS.VOTE_ON_GAUGES.HREF}
          endIcon={<CircleLeftIcon />}
        >
          Read More
        </ContainedButton>
      </Grid>
    </Grid>
  );
};

export default memo(SnobAPYTooltip);
