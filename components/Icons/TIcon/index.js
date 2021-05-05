
import { memo } from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
  root: {
    width: 18,
    height: 14
  }
}));

const TIcon = ({
  className,
  viewBox,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <SvgIcon viewBox={viewBox || '0 0 14 14'} {...rest} className={clsx(classes.root, className)}>
      <path d="M13.75 1V3.25C13.75 3.7 13.45 4 13 4C12.55 4 12.25 3.7 12.25 3.25V1.75H7.75V12.25H9.25C9.7 12.25 10 12.55 10 13C10 13.45 9.7 13.75 9.25 13.75H4.75C4.3 13.75 4 13.45 4 13C4 12.55 4.3 12.25 4.75 12.25H6.25V1.75H1.75V3.25C1.75 3.7 1.45 4 1 4C0.55 4 0.25 3.7 0.25 3.25V1C0.25 0.55 0.55 0.25 1 0.25H13C13.45 0.25 13.75 0.55 13.75 1Z" fill="#6E6B7B" />
    </SvgIcon>
  )
}

export default memo(TIcon);
