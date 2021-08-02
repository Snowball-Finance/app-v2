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

const StableVaultIcon = ({ className, viewBox, ...rest }) => {
  const classes = useStyles()

  return (
    <SvgIcon
      viewBox={viewBox || '0 0 24 24'}
      {...rest}
      className={clsx(classes.root, className)}
    >
      <path
        d="M7.95 6.98711C9.1875 6.31211 10.3125 5.63711 11.4375 4.96211C11.55 4.84961 11.6625 4.96211 11.6625 4.96211C14.25 6.42461 16.8375 7.88711 19.425 9.46211C19.875 9.68711 19.9875 10.1371 19.9875 10.5871C19.9875 11.5996 19.9875 12.6121 19.9875 13.6246C19.9875 14.1871 19.65 14.6371 19.0875 14.8621C18.3 15.4246 17.175 15.8746 16.3875 16.4371C14.8125 17.3371 13.35 18.2371 11.775 19.0246C11.55 19.1371 11.4375 19.1371 11.2125 19.0246C8.7375 17.6746 6.375 16.2121 3.9 14.8621C3.225 14.5246 3 13.9621 3 13.2871C3 12.2746 3 11.2621 3 10.2496C3.3375 10.3621 3.5625 10.4746 3.7875 10.6996C6.15 12.0496 8.625 13.3996 10.9875 14.8621C11.325 15.0871 11.6625 15.0871 12 14.8621C13.2375 14.0746 14.5875 13.3996 15.825 12.6121C15.9375 12.4996 16.05 12.4996 16.1625 12.3871C16.3875 12.2746 16.3875 12.0496 16.1625 11.8246C16.05 11.7121 15.825 11.5996 15.6 11.4871C13.2375 10.1371 10.875 8.78711 8.5125 7.43711C8.4 7.32461 8.175 7.21211 7.95 6.98711Z"
        fill="#55535d"
      />
      <path
        d="M20.1 8.89981C19.7625 8.78731 19.425 8.5623 19.2 8.4498C16.95 7.0998 14.7 5.8623 12.45 4.5123C11.8875 4.1748 11.325 4.1748 10.7625 4.5123C9.6375 5.0748 8.625 5.7498 7.5 6.3123C7.1625 6.5373 6.7125 6.6498 6.7125 6.9873C6.7125 7.3248 7.1625 7.4373 7.5 7.6623C9.75 9.0123 12 10.2498 14.25 11.4873C14.5875 11.5998 14.8125 11.8248 15.15 12.0498C15.15 12.1623 15.0375 12.1623 15.0375 12.2748C14.025 12.8373 12.9 13.5123 11.8875 14.0748C11.775 14.1873 11.6625 14.1873 11.4375 14.0748C8.625 12.4998 5.925 11.0373 3.225 9.4623C3.1125 9.3498 3 9.2373 3 9.1248C3 7.9998 3 6.8748 3 5.7498C3 5.0748 3.225 4.6248 3.9 4.2873C5.5875 3.3873 7.1625 2.3748 8.85 1.4748C9.525 1.1373 10.0875 0.799805 10.7625 0.349805C11.325 0.0123047 11.8875 0.0123047 12.45 0.349805C14.7 1.6998 16.95 2.9373 19.2 4.2873C19.7625 4.6248 20.1 5.0748 20.1 5.8623C19.9875 6.7623 20.1 7.77481 20.1 8.89981Z"
        fill="#55535d"
      />
      <path
        d="M19.9875 14.9746C19.9875 15.0871 19.9875 15.1996 19.9875 15.3121C19.9875 16.4371 19.9875 17.4496 19.9875 18.5746C19.9875 19.2496 19.7625 19.5871 19.2 19.9246C16.95 21.2746 14.7 22.5121 12.45 23.8621C11.8875 24.1996 11.325 24.1996 10.65 23.8621C8.4 22.5121 6.15 21.2746 3.9 19.9246C3.3375 19.5871 3 19.1371 3 18.4621C3 17.4496 3 16.3246 3 15.3121C3.3375 15.4246 3.5625 15.5371 3.7875 15.7621C6.15 17.1121 8.5125 18.4621 10.875 19.9246C11.2125 20.1496 11.55 20.1496 12 19.9246C14.3625 18.5746 16.725 17.2246 19.0875 15.8746C19.5375 15.6496 19.7625 15.3121 19.9875 14.9746Z"
        fill="#55535d"
      />
      <path
        d="M8.0625 6.98711C9.3 6.31211 10.425 5.63711 11.55 4.96211C11.6625 4.84961 11.775 4.96211 11.775 4.96211C14.3625 6.42461 16.95 7.88711 19.5375 9.46211C19.9875 9.68711 20.1 10.1371 20.1 10.5871C20.1 11.5996 20.1 12.6121 20.1 13.6246C20.1 14.1871 19.7625 14.6371 19.2 14.8621C18.3 15.4246 17.2875 15.8746 16.3875 16.4371C14.8125 17.3371 13.35 18.2371 11.775 19.0246C11.55 19.1371 11.4375 19.1371 11.2125 19.0246C8.7375 17.6746 6.375 16.2121 3.9 14.8621C3.225 14.5246 3 13.9621 3 13.2871C3 12.2746 3 11.2621 3 10.2496C3.3375 10.3621 3.5625 10.4746 3.7875 10.6996C6.15 12.0496 8.625 13.3996 10.9875 14.8621C11.325 15.0871 11.6625 15.0871 12 14.8621C13.2375 14.0746 14.5875 13.3996 15.825 12.6121C15.9375 12.4996 16.05 12.4996 16.1625 12.3871C16.3875 12.2746 16.3875 12.0496 16.1625 11.8246C16.05 11.7121 15.825 11.5996 15.6 11.4871C13.2375 10.1371 10.875 8.78711 8.5125 7.43711C8.5125 7.32461 8.2875 7.21211 8.0625 6.98711Z"
        fill="#55535d"
        stroke="white"
        stroke-width="1.5"
        stroke-miterlimit="10"
      />
      <path
        d="M20.1 8.89981C19.7625 8.78731 19.425 8.5623 19.2 8.4498C16.95 7.0998 14.7 5.8623 12.45 4.5123C11.8875 4.1748 11.325 4.1748 10.7625 4.5123C9.6375 5.0748 8.625 5.7498 7.5 6.3123C7.1625 6.5373 6.7125 6.6498 6.7125 6.9873C6.7125 7.3248 7.1625 7.4373 7.5 7.6623C9.75 9.0123 12 10.2498 14.25 11.4873C14.5875 11.5998 14.8125 11.8248 15.15 12.0498C15.15 12.1623 15.0375 12.1623 15.0375 12.2748C14.025 12.8373 12.9 13.5123 11.8875 14.0748C11.775 14.1873 11.6625 14.1873 11.4375 14.0748C8.625 12.4998 5.925 11.0373 3.225 9.4623C3.1125 9.3498 3 9.2373 3 9.1248C3 7.9998 3 6.8748 3 5.7498C3 5.0748 3.225 4.6248 3.9 4.2873C5.5875 3.3873 7.1625 2.3748 8.85 1.4748C9.525 1.1373 10.0875 0.799805 10.7625 0.349805C11.325 0.0123047 11.8875 0.0123047 12.45 0.349805C14.7 1.6998 16.95 2.9373 19.2 4.2873C19.7625 4.6248 20.1 5.0748 20.1 5.8623C19.9875 6.7623 20.1 7.77481 20.1 8.89981Z"
        fill="#55535d"
        stroke="white"
        stroke-width="1.5"
        stroke-miterlimit="10"
      />
      <path
        d="M19.9875 14.9746C19.9875 15.0871 19.9875 15.1996 19.9875 15.3121C19.9875 16.4371 19.9875 17.4496 19.9875 18.5746C19.9875 19.2496 19.7625 19.5871 19.2 19.9246C16.95 21.2746 14.7 22.5121 12.45 23.8621C11.8875 24.1996 11.325 24.1996 10.65 23.8621C8.4 22.5121 6.15 21.2746 3.9 19.9246C3.3375 19.5871 3 19.1371 3 18.4621C3 17.4496 3 16.3246 3 15.3121C3.3375 15.4246 3.5625 15.5371 3.7875 15.7621C6.15 17.1121 8.5125 18.4621 10.875 19.9246C11.2125 20.1496 11.55 20.1496 12 19.9246C14.3625 18.5746 16.725 17.2246 19.0875 15.8746C19.5375 15.6496 19.7625 15.3121 19.9875 14.9746Z"
        fill="#55535d"
        stroke="white"
        stroke-width="1.5"
        stroke-miterlimit="10"
      />
    </SvgIcon>
  )
}

export default memo(StableVaultIcon)
