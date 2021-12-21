import { memo } from 'react';
import Link from 'next/link';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ContainedButton from 'components/UI/Buttons/ContainedButton';
import CircleLeftIcon from 'components/Icons/CircleLeftIcon';
import LINKS from 'utils/constants/links';

const useStyles = makeStyles((theme) => ({
  info: {
    display: 'flex',
    flexDirection: 'column',
    width: 400,
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      width: 350
    }
  },
  subHeaderButton: {
    fontSize: 12,
    fontWeight: 600,
    color: theme.custom.palette.white,
    textTransform: 'none',
  },
  stakingPage: {
    color: theme.palette.text.primary,
    textDecoration: 'underline',
  },
}));

const SnobAPYTooltip = () => {
  const classes = useStyles();

  return (
    <div className={classes.info}>
      <Typography>SNOB APR comes in the form of snowball tokens. The rate of SNOB distribution to this pool is voted on by the community on our</Typography>
      <Link href={LINKS.STAKING.HREF}>
        <a><Typography className={classes.stakingPage}>Staking Page</Typography></a>
      </Link>
      <div>
        <ContainedButton
          className={classes.subHeaderButton}
          size="small"
          disableElevation
          href={LINKS.GITBOOK_DOCS.VOTE_ON_GAUGES.HREF}
          endIcon={<CircleLeftIcon />}
        >
          Read More
        </ContainedButton>
      </div>
    </div>
  );
};

export default memo(SnobAPYTooltip);
