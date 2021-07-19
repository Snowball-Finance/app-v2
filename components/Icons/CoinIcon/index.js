
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import { LOGO_IMAGE_PATH } from 'utils/constants/image-paths'

const useStyles = makeStyles(() => ({
  picture: {
    display: 'flex'
  },
  img: props => ({
    height: props.height,
    objectFit: 'contain'
  }),
}));

const CoinIcon = ({
  height = 18,
  className
}) => {
  const classes = useStyles({ height })

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
