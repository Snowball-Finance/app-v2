
import { memo } from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
  root: {
    width: 52,
    height: 53
  }
}));

const AddIcon = ({
  className,
  viewBox,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <SvgIcon viewBox={viewBox || '0 0 52 53'} {...rest} className={clsx(classes.root, className)}>
      <g filter="url(#filter0_d)">
        <circle cx="25" cy="24.963" r="21" fill="white" />
      </g>
      <path d="M31.2572 26.903H26.5252V31.557H24.3412V26.903H19.6092V24.849H24.3412V20.169H26.5252V24.849H31.2572V26.903Z" fill="#5E5873" />
      <defs>
        <filter id="filter0_d" x="0" y="0.963013" width="52" height="52" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
          <feOffset dx="1" dy="2" />
          <feGaussianBlur stdDeviation="2.5" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.458333 0 0 0 0 0.450694 0 0 0 0 0.450694 0 0 0 0.2 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </SvgIcon>
  )
}

export default memo(AddIcon);
