
import { memo } from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
  root: {
    width: 16,
    height: 10
  }
}));

const ChartDownIcon = ({
  className,
  viewBox,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <SvgIcon viewBox={viewBox || '0 0 16 10'} {...rest} className={clsx(classes.root, className)}>
      <path d="M16 9C16 9.06667 16 9.2 15.9333 9.26667C15.8667 9.4 15.7333 9.53333 15.6 9.6C15.5333 9.66667 15.4 9.66667 15.3333 9.66667H11.3333C10.9333 9.66667 10.6667 9.4 10.6667 9C10.6667 8.6 10.9333 8.33333 11.3333 8.33333H13.7333L9 3.6L6.13333 6.46667C5.86667 6.73333 5.46667 6.73333 5.2 6.46667L0.2 1.46667C-0.0666667 1.2 -0.0666667 0.799999 0.2 0.533332C0.466667 0.266665 0.866667 0.266665 1.13333 0.533332L5.66667 5.06667L8.53333 2.2C8.8 1.93333 9.2 1.93333 9.46667 2.2L14.6667 7.4V5C14.6667 4.6 14.9333 4.33333 15.3333 4.33333C15.7333 4.33333 16 4.6 16 5V9Z" fill="#EA5455" />
    </SvgIcon>
  )
}

export default memo(ChartDownIcon);
