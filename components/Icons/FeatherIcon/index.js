
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

const FeatherIcon = ({
  className,
  viewBox,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <SvgIcon viewBox={viewBox || '0 0 18 18'} {...rest} className={clsx(classes.root, className)}>
      <path fillRule="evenodd" clipRule="evenodd" d="M15.675 2.26703C13.65 0.244325 10.275 0.244325 8.25 2.26703L3.225 7.36124C3.075 7.51107 3 7.6609 3 7.88564V13.9537L0.975 15.9764C0.675 16.2761 0.675 16.7256 0.975 17.0253C1.125 17.1751 1.275 17.25 1.5 17.25C1.725 17.25 1.875 17.1751 2.025 17.0253L4.05 15.0026H10.125C10.35 15.0026 10.5 14.9276 10.65 14.7778L15.675 9.6836C17.775 7.6609 17.775 4.36464 15.675 2.26703ZM9.82499 13.5043H5.54999L7.04999 12.006H11.325L9.82499 13.5043ZM12.825 10.5077L14.625 8.63479C16.125 7.21141 16.125 4.81413 14.7 3.31583C13.2 1.81754 10.875 1.81754 9.375 3.31583L4.5 8.1853V12.4554L6.225 10.7324L11.475 5.48836C11.775 5.1887 12.225 5.1887 12.525 5.48836C12.825 5.78802 12.825 6.23751 12.525 6.53717L8.55 10.5077H12.75H12.825Z" fill="#6E6B7B" />
    </SvgIcon>
  )
}

export default memo(FeatherIcon);
