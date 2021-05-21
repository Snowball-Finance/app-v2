
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

const ChartUpIcon = ({
  className,
  viewBox,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <SvgIcon viewBox={viewBox || '0 0 16 10'} {...rest} className={clsx(classes.root, className)}>
      <path d="M16 1V5C16 5.4 15.7333 5.66667 15.3333 5.66667C14.9333 5.66667 14.6667 5.4 14.6667 5V2.6L9.46667 7.8C9.2 8.06667 8.8 8.06667 8.53333 7.8L5.66667 4.93334L1.13333 9.46667C1 9.6 0.866667 9.66667 0.666667 9.66667C0.466667 9.66667 0.333333 9.6 0.2 9.46667C-0.0666667 9.2 -0.0666667 8.8 0.2 8.53334L5.2 3.53334C5.46667 3.26667 5.86667 3.26667 6.13333 3.53334L9 6.4L13.7333 1.66667H11.3333C10.9333 1.66667 10.6667 1.4 10.6667 1C10.6667 0.600003 10.9333 0.333336 11.3333 0.333336H15.3333C15.4 0.333336 15.5333 0.333336 15.6 0.400003C15.7333 0.466669 15.8667 0.600003 15.9333 0.733336C16 0.800003 16 0.933336 16 1Z" fill="#28C76F" />
    </SvgIcon>
  )
}

export default memo(ChartUpIcon);
