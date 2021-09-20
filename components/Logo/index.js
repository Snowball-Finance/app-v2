
import { memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { makeStyles } from '@material-ui/core/styles'

import LINKS from 'utils/constants/links'
import { LOGO_IMAGE_PATH, LOGO_LABEL_IMAGE_PATH } from 'utils/constants/image-paths'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
  picture: {
    display: 'flex',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'unset'
  },
  img: {
    height: 40,
    objectFit: 'contain',
  },
}));

const Logo = ({
  isLabel = false,
  className,
  ...rest
}) => {
  const classes = useStyles();

  const imagePath = isLabel ? LOGO_LABEL_IMAGE_PATH : LOGO_IMAGE_PATH

  return (
    <Link href={LINKS.HOME.HREF}>
      <a className={clsx(classes.container, className)}>
        <div className={classes.picture} {...rest}>
          <Image src={imagePath} width={160} height={40} layout='fixed' alt='logo' />
        </div>
      </a>
    </Link>
  )
}

export default memo(Logo);
