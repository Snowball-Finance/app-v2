
import { memo } from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
  root: {
    width: 12,
    height: 13
  }
}));

const CircleLeftIcon = ({
  className,
  viewBox,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <SvgIcon viewBox={viewBox || '0 0 12 13'} {...rest} className={clsx(classes.root, className)}>
      <circle cx="6" cy="6.5" r="6" transform="rotate(-90 6 6.5)" fill="#1A93F2" />
      <path d="M4.99375 3.56899L7.61875 6.19399C7.70625 6.28149 7.75 6.36899 7.75 6.50024C7.75 6.63149 7.70625 6.71899 7.61875 6.80649L4.99375 9.43149C4.81875 9.60649 4.55625 9.60649 4.38125 9.43149C4.20625 9.25649 4.20625 8.99399 4.38125 8.81899L6.7 6.50024L4.38125 4.18149C4.20625 4.00649 4.20625 3.74399 4.38125 3.56899C4.55625 3.39399 4.81875 3.39399 4.99375 3.56899Z" fill="white" />
      <mask id="mask0" maskUnits="userSpaceOnUse" x="4" y="3" width="4" height="7">
        <path d="M4.99375 3.56899L7.61875 6.19399C7.70625 6.28149 7.75 6.36899 7.75 6.50024C7.75 6.63149 7.70625 6.71899 7.61875 6.80649L4.99375 9.43149C4.81875 9.60649 4.55625 9.60649 4.38125 9.43149C4.20625 9.25649 4.20625 8.99399 4.38125 8.81899L6.7 6.50024L4.38125 4.18149C4.20625 4.00649 4.20625 3.74399 4.38125 3.56899C4.55625 3.39399 4.81875 3.39399 4.99375 3.56899Z" fill="white" />
      </mask>
      <g mask="url(#mask0)">
      </g>
    </SvgIcon>
  )
}

export default memo(CircleLeftIcon);
