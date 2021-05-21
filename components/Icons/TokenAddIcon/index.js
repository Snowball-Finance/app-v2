
import { memo } from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
  root: {
    width: 42,
    height: 42
  }
}));

const TokenAddIcon = ({
  className,
  viewBox,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <SvgIcon viewBox={viewBox || '0 0 42 42'} {...rest} className={clsx(classes.root, className)}>
      <rect width="42" height="42" rx="5" fill="#28C76F" fillOpacity="0.12" />
      <path d="M13.0339 23.5491L20.3278 30.6889C20.5358 30.8925 20.8117 31.0026 21.1103 30.9994C21.4032 30.9963 21.6764 30.8803 21.8801 30.6723L29.02 23.3784C29.4418 22.9474 29.4344 22.2533 29.0035 21.8317L28.3412 21.1831C28.1332 20.9796 27.8574 20.8694 27.5644 20.8725C27.2716 20.8756 26.9887 20.9918 26.7852 21.1997L22.6106 25.4553L22.4678 12.0786C22.4613 11.4757 21.9839 10.9889 21.381 10.9954L20.4542 11.0053C19.8513 11.0117 19.3366 11.5091 19.3431 12.112L19.4864 25.5361L15.1974 21.3234C14.9896 21.12 14.721 21.0097 14.4281 21.0128C14.1351 21.0159 13.8657 21.132 13.6619 21.3398L13.0156 22.0024C12.5937 22.4333 12.6027 23.1272 13.0339 23.5491Z" fill="#28C76F" />
    </SvgIcon>
  )
}

export default memo(TokenAddIcon);
