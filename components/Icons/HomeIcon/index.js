
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

const HomeIcon = ({
  className,
  viewBox,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <SvgIcon viewBox={viewBox || '0 0 18 18'} {...rest} className={clsx(classes.root, className)}>
      <path fillRule="evenodd" clipRule="evenodd" d="M16.2 6.1626L9.45 0.918558C9.15 0.693814 8.775 0.693814 8.55 0.918558L1.8 6.1626C1.575 6.31243 1.5 6.53717 1.5 6.76192V15.0026C1.5 16.2761 2.475 17.25 3.75 17.25H14.25C15.525 17.25 16.5 16.2761 16.5 15.0026V6.76192C16.5 6.53717 16.425 6.31243 16.2 6.1626ZM10.5 9.75851V15.7517H7.5V9.75851H10.5ZM14.25 15.7517C14.7 15.7517 15 15.452 15 15.0026V7.13649L9 2.49177L3 7.13649V15.0026C3 15.452 3.3 15.7517 3.75 15.7517H6V9.00937C6 8.55988 6.3 8.26022 6.75 8.26022H11.25C11.7 8.26022 12 8.55988 12 9.00937V15.7517H14.25Z" fill="black" />
      <mask id="mask0" masktype="alpha" maskUnits="userSpaceOnUse" x="1" y="0" width="16" height="18">
        <path fillRule="evenodd" clipRule="evenodd" d="M16.2 6.1626L9.45 0.918558C9.15 0.693814 8.775 0.693814 8.55 0.918558L1.8 6.1626C1.575 6.31243 1.5 6.53717 1.5 6.76192V15.0026C1.5 16.2761 2.475 17.25 3.75 17.25H14.25C15.525 17.25 16.5 16.2761 16.5 15.0026V6.76192C16.5 6.53717 16.425 6.31243 16.2 6.1626ZM10.5 9.75851V15.7517H7.5V9.75851H10.5ZM14.25 15.7517C14.7 15.7517 15 15.452 15 15.0026V7.13649L9 2.49177L3 7.13649V15.0026C3 15.452 3.3 15.7517 3.75 15.7517H6V9.00937C6 8.55988 6.3 8.26022 6.75 8.26022H11.25C11.7 8.26022 12 8.55988 12 9.00937V15.7517H14.25Z" fill="white" />
      </mask>
      <g mask="url(#mask0)">
        <rect width="18" height="18" fill="#6E6B7B" />
      </g>
    </SvgIcon>
  )
}

export default memo(HomeIcon);
