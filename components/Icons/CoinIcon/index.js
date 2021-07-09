
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import { LOGO_IMAGE_PATH } from 'utils/constants/image-paths'

const useStyles = makeStyles(() => ({
  picture: {
    display: 'flex'
  },
  img: {
    height: 18,
    objectFit: 'contain'
  },
}));

const CoinIcon = ({
  className
}) => {
  const classes = useStyles()

  return (
    <picture className={clsx(classes.picture, className)}>
      <source srcSet={LOGO_IMAGE_PATH} />
      <img
        className={classes.img}
        src={LOGO_IMAGE_PATH}
        alt='logo'
      />
    </picture>
  )
}

export default memo(CoinIcon)
