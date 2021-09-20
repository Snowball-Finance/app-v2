
import { memo } from 'react'
import Image from 'next/image'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import HeartIcon from 'components/Icons/HeartIcon'
import { FOOTER_POWER_BY_IMAGE_PATH } from 'utils/constants/image-paths'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    },
    [theme.breakpoints.down('xs')]: {
      marginBottom: theme.spacing(7)
    }
  },
  rowContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  powerImage: {
    display: 'flex',
    width: 100,
    padding: theme.spacing(0, 1)
  },
  heart: {
    margin: theme.spacing(0, 1)
  }
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <footer className={classes.root}>
      <div className={classes.rowContainer}>
        <Typography
          variant='body2'
          color='textPrimary'
        >
          Powered by
        </Typography>
        <div className={classes.powerImage}>
          <Image
            alt='power-by'
            src={FOOTER_POWER_BY_IMAGE_PATH}
            width={84}
            height={28}
            layout='fixed'
          />
        </div>
      </div>
      <div className={classes.rowContainer}>
        <Typography
          variant='caption'
          color='textPrimary'
        >
          With
        </Typography>
        <HeartIcon className={classes.heart} />
        <Typography
          variant='caption'
          color='textPrimary'
        >
          from The South Pole
        </Typography>
      </div>
    </footer>
  );
};

export default memo(Footer);
