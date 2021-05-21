
import { memo } from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
  root: {
    width: 42,
    height: 42
  }
}));

const TokenRemoveIcon = ({
  className,
  viewBox,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <SvgIcon viewBox={viewBox || '0 0 42 42'} {...rest} className={clsx(classes.root, className)}>
      <rect width="42" height="42" rx="5" fill="#EA5455" fillOpacity="0.12" />
      <path d="M28.9928 18.5361L21.7756 11.3189C21.5698 11.113 21.2951 11 20.9964 11C20.7036 11 20.4291 11.113 20.2233 11.3189L13.0059 18.5361C12.5795 18.9626 12.5795 19.6567 13.0059 20.0829L13.6611 20.7385C13.867 20.9442 14.1416 21.0574 14.4346 21.0574C14.7275 21.0574 15.0115 20.9442 15.2172 20.7385L19.4371 16.5278V29.9052C19.4371 30.5081 19.9093 31 20.5122 31H21.439C22.0419 31 22.5619 30.5081 22.5619 29.9052V16.4803L26.8057 20.7385C27.0114 20.9442 27.2787 21.0574 27.5717 21.0574C27.8647 21.0574 28.1353 20.9442 28.3413 20.7385L28.9946 20.0829C29.4211 19.6566 29.4195 18.9626 28.9928 18.5361Z" fill="#EA5455" />
    </SvgIcon>
  )
}

export default memo(TokenRemoveIcon);
