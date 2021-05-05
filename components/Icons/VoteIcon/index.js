
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

const VoteIcon = ({
  className,
  viewBox,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <SvgIcon viewBox={viewBox || '0 0 18 16'} {...rest} className={clsx(classes.root, className)}>
      <path fillRule="evenodd" clipRule="evenodd" d="M14.25 8C14.25 7.55 14.55 7.25 15 7.25C15.45 7.25 15.75 7.55 15.75 8V13.25C15.75 14.525 14.775 15.5 13.5 15.5H3C1.725 15.5 0.75 14.525 0.75 13.25V2.75C0.75 1.475 1.725 0.5 3 0.5H11.25C11.7 0.5 12 0.8 12 1.25C12 1.7 11.7 2 11.25 2H3C2.55 2 2.25 2.3 2.25 2.75V13.25C2.25 13.7 2.55 14 3 14H13.5C13.95 14 14.25 13.7 14.25 13.25V8ZM8.775 10.025L17.025 1.775C17.325 1.475 17.325 1.025 17.025 0.725C16.725 0.425 16.275 0.425 15.975 0.725L8.25 8.45L6.525 6.725C6.225 6.425 5.775 6.425 5.475 6.725C5.175 7.025 5.175 7.475 5.475 7.775L7.725 10.025C7.875 10.175 8.025 10.25 8.25 10.25C8.475 10.25 8.625 10.175 8.775 10.025Z" fill="#6E6B7B" />
    </SvgIcon>
  )
}

export default memo(VoteIcon);
