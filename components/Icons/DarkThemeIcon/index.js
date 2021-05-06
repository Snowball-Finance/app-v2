
import { memo } from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
  root: {
    width: 12,
    height: 12
  }
}));

const DarkThemeIcon = ({
  className,
  viewBox,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <SvgIcon viewBox={viewBox || '0 0 12 12'} {...rest} className={clsx(classes.root, className)}>
      <path d="M6.30372 11.8743C2.89452 11.8743 0.120117 9.09991 0.120117 5.68951C0.120117 3.32791 1.43532 1.20631 3.55092 0.152713C3.64572 0.105913 3.76092 0.123913 3.83532 0.198313C3.90972 0.272713 3.93012 0.387913 3.88332 0.482713C3.49692 1.26751 3.30132 2.11111 3.30132 2.98951C3.30132 6.12631 5.85372 8.67871 8.99052 8.67871C9.87852 8.67871 10.7305 8.47831 11.5225 8.08471C11.6173 8.03791 11.7325 8.05591 11.8069 8.13031C11.8825 8.20591 11.9017 8.31991 11.8537 8.41471C10.8061 10.5483 8.67972 11.8743 6.30372 11.8743Z" fill="#6E6B7B" />
    </SvgIcon>
  )
}

export default memo(DarkThemeIcon);