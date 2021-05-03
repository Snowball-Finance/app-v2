
import { memo } from 'react'
import Link from 'next/link'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import LINKS from 'utils/constants/links'
import { LOGO_IMAGE_PATH } from 'utils/constants/image-paths'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  picture: {
    display: 'flex',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'unset'
  },
  img: {
    width: 50,
    height: 50,
    objectFit: 'contain',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginLeft: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      fontSize: 26,
    },
  },
}));

const Logo = ({
  isLabel = false,
  className,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Link href={LINKS.HOME.HREF}>
      <a className={clsx(classes.container, className)}>
        <picture className={classes.picture} {...rest}>
          <source srcSet={LOGO_IMAGE_PATH} />
          <img
            className={classes.img}
            src={LOGO_IMAGE_PATH}
            alt='logo'
          />
        </picture>
        {isLabel &&
          <Typography
            variant='h1'
            color='primary'
            className={classes.title}
          >
            Snowball
          </Typography>
        }
      </a>
    </Link>
  )
}

export default memo(Logo);
