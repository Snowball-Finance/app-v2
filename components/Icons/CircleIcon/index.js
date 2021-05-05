
import { memo } from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
  root: {
    width: 15,
    height: 15
  }
}));

const CircleIcon = ({
  className,
  viewBox,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <SvgIcon viewBox={viewBox || '0 0 10 10'} {...rest} className={clsx(classes.root, className)}>
      <path fillRule="evenodd" clipRule="evenodd" d="M0.416687 4.99999C0.416687 2.45832 2.45835 0.416656 5.00002 0.416656C7.54169 0.416656 9.58335 2.45832 9.58335 4.99999C9.58335 7.54166 7.54169 9.58332 5.00002 9.58332C2.45835 9.58332 0.416687 7.54166 0.416687 4.99999ZM1.25002 4.99999C1.25002 7.08332 2.91669 8.74999 5.00002 8.74999C7.08335 8.74999 8.75002 7.08332 8.75002 4.99999C8.75002 2.91666 7.08335 1.24999 5.00002 1.24999C2.91669 1.24999 1.25002 2.91666 1.25002 4.99999Z" fill="#6E6B7B" />
    </SvgIcon>
  )
}

export default memo(CircleIcon);
