
import { memo } from 'react'
import Image from 'next/image'
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
    <div className={clsx(classes.tokenImage, className)}>
      <Image src={'/assets/images/icons/warning.png'} width={262} height={304} layout='responsive' alt='warning-icon'/>
    </div>
  )
}

export default memo(WarningIcon);