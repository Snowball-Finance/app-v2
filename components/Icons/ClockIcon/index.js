
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

const ClockIcon = ({
  className,
  viewBox,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <SvgIcon viewBox={viewBox || '0 0 18 18'} {...rest} className={clsx(classes.root, className)}>
      <path fillRule="evenodd" clipRule="evenodd" d="M9 0.75C4.425 0.75 0.75 4.425 0.75 9C0.75 13.575 4.425 17.25 9 17.25C13.575 17.25 17.25 13.575 17.25 9C17.25 4.425 13.575 0.75 9 0.75ZM9 15.75C5.25 15.75 2.25 12.75 2.25 9C2.25 5.25 5.25 2.25 9 2.25C12.75 2.25 15.75 5.25 15.75 9C15.75 12.75 12.75 15.75 9 15.75ZM11.775 11.775C12.075 11.475 12.075 11.025 11.775 10.725L9.75 8.7V4.5C9.75 4.05 9.45 3.75 9 3.75C8.55 3.75 8.25 4.05 8.25 4.5V9C8.25 9.225 8.325 9.375 8.475 9.525L10.725 11.775C10.875 11.925 11.025 12 11.25 12C11.475 12 11.625 11.925 11.775 11.775Z" fill="black" />
    </SvgIcon>
  )
}

export default memo(ClockIcon);
