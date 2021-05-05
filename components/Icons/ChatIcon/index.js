
import { memo } from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
  root: {
    width: 18,
    height: 18
  }
}));

const ChatIcon = ({
  className,
  viewBox,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <SvgIcon viewBox={viewBox || '0 0 18 14'} {...rest} className={clsx(classes.root, className)}>
      <path fillRule="evenodd" clipRule="evenodd" d="M15.75 0.25H2.25C0.975 0.25 0 1.225 0 2.5V11.5C0 12.775 0.975 13.75 2.25 13.75H15.75C17.025 13.75 18 12.775 18 11.5V2.5C18 1.225 17.025 0.25 15.75 0.25ZM2.25 1.75H15.75C16.2 1.75 16.5 2.05 16.5 2.5V4.75H1.5V2.5C1.5 2.05 1.8 1.75 2.25 1.75ZM2.25 12.25H15.75C16.2 12.25 16.5 11.95 16.5 11.5V6.25H1.5V11.5C1.5 11.95 1.8 12.25 2.25 12.25Z" fill="#6E6B7B" />
    </SvgIcon>
  )
}

export default memo(ChatIcon);
