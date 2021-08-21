
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

const ExternalLinkIcon = ({
  className,
  viewBox,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <SvgIcon viewBox={viewBox || '0 0 18 18'} {...rest} className={clsx(classes.root, className)}>
      <path fillRule="evenodd" clipRule="evenodd" d="M16.05 1.575C16.2 1.65 16.35 1.8 16.425 1.95C16.5 2.025 16.5 2.175 16.5 2.25V6.75C16.5 7.2 16.2 7.5 15.75 7.5C15.3 7.5 15 7.2 15 6.75V4.05L8.025 11.025C7.875 11.175 7.725 11.25 7.5 11.25C7.275 11.25 7.125 11.175 6.975 11.025C6.675 10.725 6.675 10.275 6.975 9.975L13.95 3H11.25C10.8 3 10.5 2.7 10.5 2.25C10.5 1.8 10.8 1.5 11.25 1.5H15.75C15.825 1.5 15.975 1.5 16.05 1.575ZM14.25 14.25V9.75C14.25 9.3 13.95 9 13.5 9C13.05 9 12.75 9.3 12.75 9.75V14.25C12.75 14.7 12.45 15 12 15H3.75C3.3 15 3 14.7 3 14.25V6C3 5.55 3.3 5.25 3.75 5.25H8.25C8.7 5.25 9 4.95 9 4.5C9 4.05 8.7 3.75 8.25 3.75H3.75C2.475 3.75 1.5 4.725 1.5 6V14.25C1.5 15.525 2.475 16.5 3.75 16.5H12C13.275 16.5 14.25 15.525 14.25 14.25Z" fill="#6E6B7B" />
    </SvgIcon>
  )
}

export default memo(ExternalLinkIcon);
