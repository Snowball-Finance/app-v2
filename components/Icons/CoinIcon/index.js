
import { memo } from 'react'
import Image from 'next/image'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import { LOGO_IMAGE_PATH } from 'utils/constants/image-paths'

const useStyles = makeStyles(() => ({
  picture: {
    display: 'flex'
  },
  img: props => ({
    height: props.size,
    objectFit: 'contain'
  }),
}));

const CoinIcon = ({
  size = 18,
  className
}) => {
  const classes = useStyles({ size })

  return (
    <div className={clsx(classes.picture, className)}>
      <Image src={LOGO_IMAGE_PATH} layout='fixed' width={size} height={size} alt='logo' />
    </div>
  )
}

export default memo(CoinIcon)
