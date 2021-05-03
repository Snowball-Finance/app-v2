import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import TelegramIcon from 'components/Icons/TelegramIcon'
import TwitterIcon from 'components/Icons/TwitterIcon'
import MediumIcon from 'components/Icons/MediumIcon'
import GithubIcon from 'components/Icons/GithubIcon'

const useStyles = makeStyles((theme) => ({
  socialContainer: {
    margin: theme.spacing(2, 0)
  },
  socialIcon: {
    margin: theme.spacing(1.5)
  }
}));

const SocialGroup = () => {
  const classes = useStyles();

  return (
    <div className={classes.socialContainer}>
      <TelegramIcon className={classes.socialIcon} />
      <TwitterIcon className={classes.socialIcon} />
      <MediumIcon className={classes.socialIcon} />
      <GithubIcon className={classes.socialIcon} />
    </div>
  );
};

export default memo(SocialGroup);
