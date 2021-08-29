
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
  tokenImage: props => ({
    width: props.size,
    height: props.size,
    objectFit: 'container',
  })
}));

const WarningIcon = ({
  size = 50,
  className,
}) => {
  const classes = useStyles({ size });

  return (
    <img
      alt='warning-icon'
      src={'/assets/images/icons/warning.png'}
      className={clsx(classes.tokenImage, className)}
    />
  )
}

export default memo(WarningIcon);