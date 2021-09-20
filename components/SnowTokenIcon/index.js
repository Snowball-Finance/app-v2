
import { memo } from 'react'
import Image from 'next/image'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import LP_ICONS from 'utils/constants/lp-icons'

const useStyles = makeStyles(() => ({
  tokenImage: props => ({
    display: 'flex',
    width: props.size,
    height: props.size,
    borderRadius: '50%',
    overflow: 'hidden',
    objectFit: 'container',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  })
}));

const SnowTokenIcon = ({
  token,
  size = 50,
  className,
}) => {
  const classes = useStyles({ size });

  return (
    <div className={clsx(classes.tokenImage, className)}>
      <Image
        alt='token-icon'
        src={LP_ICONS[token || "SNOB"]}
        width={size}
        height={size}
        layout='fixed'
      />
    </div>
  )
}

export default memo(SnowTokenIcon);