
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

const SwapIcon = ({
  className,
  viewBox,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <SvgIcon viewBox={viewBox || '0 0 52 53'} {...rest} className={clsx(classes.root, className)}>
      <g filter="url(#filter0_d)">
        <circle cx="25" cy="24.6296" r="21" fill="white" />
      </g>
      <path d="M33 15.7546L28 20.7547H31.75V29.5046C31.75 30.8859 30.6313 32.0046 29.25 32.0046C27.8687 32.0046 26.75 30.8859 26.75 29.5046V20.7547C26.75 17.9984 24.5062 15.7547 21.75 15.7547C18.9937 15.7547 16.75 17.9984 16.75 20.7547V29.5046H13L18 34.5046L23 29.5046H19.25V20.7547C19.25 19.3734 20.3687 18.2546 21.75 18.2546C23.1313 18.2546 24.25 19.3734 24.25 20.7547V29.5046C24.25 32.2609 26.4937 34.5046 29.25 34.5046C32.0062 34.5046 34.2499 32.2609 34.2499 29.5046V20.7547H37.9999L33 15.7546Z" fill="url(#paint0_linear)" />
      <defs>
        <filter id="filter0_d" x="0" y="0.629623" width="52" height="52" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
          <feOffset dx="1" dy="2" />
          <feGaussianBlur stdDeviation="2.5" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.458333 0 0 0 0 0.450694 0 0 0 0 0.450694 0 0 0 0.2 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
        <linearGradient id="paint0_linear" x1="13" y1="25.1296" x2="37.9999" y2="25.1296" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1A93F2" />
          <stop offset="1" stopColor="#1E2848" />
        </linearGradient>
      </defs>
    </SvgIcon>
  )
}

export default memo(SwapIcon);
