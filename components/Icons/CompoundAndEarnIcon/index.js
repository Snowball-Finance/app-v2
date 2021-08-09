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

const CompoundAndEarnIcon = ({ className, viewBox, ...rest }) => {
  const classes = useStyles()

  return (
    <SvgIcon
      viewBox={viewBox || '0 0 24 24'}
      {...rest}
      className={clsx(classes.root, className)}
    >
      <g clipPath="url(#clip0)">
        <path
          d="M3 6.92758C4.93828 1.99702 10.5271 -0.421619 15.4829 1.52541C18.5107 2.71493 20.6017 5.25872 21.3285 8.18237"
          stroke="#55535d"
          strokeWidth="1.4"
          strokeLinecap="square"
          strokeLinejoin="round"
        ></path>
        <path
          d="M3 7H1L3 9L5 7H3Z"
          fill="#5E5873"
          stroke="#55535d"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M21.4563 15.6044C20.1466 20.7378 14.9022 23.8331 9.74261 22.5179C6.5904 21.7144 4.1991 19.4505 3.11418 16.64"
          stroke="#55535d"
          strokeWidth="1.4"
          strokeLinecap="square"
          strokeLinejoin="round"
        ></path>
        <path
          d="M21.4473 15.5325L23.4318 15.2837L21.1984 13.5481L19.4629 15.7814L21.4473 15.5325Z"
          fill="#5E5873"
          stroke="#55535d"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z"
          stroke="#55535d"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M12.2857 8.57143V15.5714"
          stroke="#55535d"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M13.9524 9.57143H11.4524C11.143 9.57143 10.8462 9.70312 10.6274 9.93754C10.4086 10.172 10.2857 10.4899 10.2857 10.8214C10.2857 11.1529 10.4086 11.4709 10.6274 11.7053C10.8462 11.9397 11.143 12.0714 11.4524 12.0714H13.119C13.4285 12.0714 13.7252 12.2031 13.944 12.4375C14.1628 12.672 14.2857 12.9899 14.2857 13.3214C14.2857 13.6529 14.1628 13.9709 13.944 14.2053C13.7252 14.4397 13.4285 14.5714 13.119 14.5714H10.2857"
          stroke="#55535d"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </g>
    </SvgIcon>
  )
}

export default memo(CompoundAndEarnIcon)