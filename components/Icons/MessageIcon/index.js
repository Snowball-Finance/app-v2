
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

const MessageIcon = ({
  className,
  viewBox,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <SvgIcon viewBox={viewBox || '0 0 16 16'} {...rest} className={clsx(classes.root, className)}>
      <path fillRule="evenodd" clipRule="evenodd" d="M2.75 0.5H13.25C14.525 0.5 15.5 1.475 15.5 2.75V10.25C15.5 11.525 14.525 12.5 13.25 12.5H4.55L1.775 15.275C1.625 15.425 1.475 15.5 1.25 15.5C1.175 15.5 1.025 15.5 0.95 15.425C0.65 15.35 0.5 15.05 0.5 14.75V2.75C0.5 1.475 1.475 0.5 2.75 0.5ZM13.25 11C13.7 11 14 10.7 14 10.25V2.75C14 2.3 13.7 2 13.25 2H2.75C2.3 2 2 2.3 2 2.75V12.95L3.725 11.225C3.875 11.075 4.025 11 4.25 11H13.25Z" fill="#6E6B7B" />
    </SvgIcon>
  )
}

export default memo(MessageIcon);
