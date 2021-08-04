import { memo } from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
  root: {
    width: 20,
    height: 20,
  },
}))

const NftMarketplaceIcon = ({ className, viewBox, ...rest }) => {
  const classes = useStyles()

  return (
    <SvgIcon
      viewBox={viewBox || '0 0 24 24'}
      {...rest}
      className={clsx(classes.root, className)}
    >
      <path
        d="M5.33333 1L2 5.4V20.8C2 21.3835 2.23413 21.9431 2.65087 22.3556C3.06762 22.7682 3.63285 23 4.22222 23H19.7778C20.3671 23 20.9324 22.7682 21.3491 22.3556C21.7659 21.9431 22 21.3835 22 20.8V5.4L18.6667 1H5.33333Z"
        stroke="#55535D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 5L21 5"
        stroke="#55535D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 7C16 8.32608 15.5786 9.59785 14.8284 10.5355C14.0783 11.4732 13.0609 12 12 12C10.9391 12 9.92172 11.4732 9.17157 10.5355C8.42143 9.59785 8 8.32608 8 7"
        stroke="#55535D"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.72461 20V14.9893H5.40479L8.03662 18.9233V14.9893H8.67236V20H7.99219L5.36035 16.0625V20H4.72461ZM10.8242 20V14.9893H14.2046V15.5806H11.4873V17.1323H13.8389V17.7236H11.4873V20H10.8242ZM17.3442 20V15.5806H15.6934V14.9893H19.665V15.5806H18.0073V20H17.3442Z"
        fill="#55535D"
      />
    </SvgIcon>
  )
}

export default memo(NftMarketplaceIcon)