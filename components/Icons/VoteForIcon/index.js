
import { memo } from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
  root: {
    width: 16,
    height: 16
  }
}));

const VoteForIcon = ({
  className,
  viewBox,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <SvgIcon viewBox={viewBox || '0 0 16 16'} {...rest} className={clsx(classes.root, className)}>
      <path fillRule="evenodd" clipRule="evenodd" d="M14.9117 6.13334C14.5742 5.73334 14.1016 5.4 13.5615 5.33334H13.224H10.1185V3.33334C10.1185 1.86667 8.90328 0.666672 7.41805 0.666672C7.148 0.666672 6.87796 0.800005 6.81045 1.06667L4.31256 6.66667H2.69231C1.54463 6.66667 0.666992 7.53334 0.666992 8.66667V13.3333C0.666992 14.4667 1.54463 15.3333 2.69231 15.3333H12.3463C13.359 15.3333 14.1691 14.6 14.3716 13.6667L15.3168 7.66667C15.3843 7.13334 15.2493 6.6 14.9117 6.13334ZM4.04254 14H2.69233C2.28727 14 2.01723 13.7333 2.01723 13.3333V8.66667C2.01723 8.26667 2.28727 8 2.69233 8H4.04254V14ZM12.3463 14C12.6838 14 12.9539 13.8 13.0214 13.4667L14.034 7.4C14.034 7.26667 14.034 7.06667 13.899 6.93334C13.764 6.8 13.629 6.66667 13.4264 6.66667H13.2914H9.44331C9.03825 6.66667 8.76821 6.4 8.76821 6V3.33334C8.76821 2.73334 8.36314 2.26667 7.82306 2.06667L5.39268 7.46667V14H12.3463Z" fill="#28C76F" />
    </SvgIcon>
  )
}

export default memo(VoteForIcon);
