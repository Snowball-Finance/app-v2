
import { memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import HeartIcon from 'components/Icons/HeartIcon'
import { FOOTER_POWER_BY_IMAGE_PATH } from 'utils/constants/image-paths'
import LINKS from 'utils/constants/links'

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
        <div className={classes.powerImage}>
          <Link
            target={LINKS.AVALANCHE.BRIDGE.IS_EXT_LINK ? '_blank' : ''}
            rel={LINKS.AVALANCHE.BRIDGE.IS_EXT_LINK ? 'noreferrer' : ''}
            href={LINKS.AVALANCHE.BRIDGE.HREF}>
            <Image
              alt='power-by'
              src={FOOTER_POWER_BY_IMAGE_PATH}
              width={84}
              height={28}
              layout='fixed'
              />
          </Link>
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
