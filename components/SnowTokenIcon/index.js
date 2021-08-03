
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import LP_ICONS from 'utils/constants/lp-icons'

const useStyles = makeStyles(() => ({
  tokenImage: props => ({
    width: props.size,
    height: props.size,
    borderRadius: '50%',
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
    <img
      alt='token-icon'
      src={LP_ICONS[token || "SNOB"]}
      className={clsx(classes.tokenImage, className)}
    />
  )
}

export default memo(SnowTokenIcon);