
import { memo } from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
  root: {
    width: 30,
    height: 30
  }
}));

const DollarIcon = ({
  className,
  viewBox,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <SvgIcon viewBox={viewBox || '0 0 25 23'} {...rest} className={clsx(classes.root, className)}>
      <g clipPath="url(#clip0)">
        <rect x="-2.01334" y="-4" width="31" height="31" rx="15.5" fill="#28C76F" fillOpacity="0.12" />
        <path fillRule="evenodd" clipRule="evenodd" d="M13.8838 10.683H13.1338V8.28714H15.1338C15.4338 8.28714 15.6338 8.09547 15.6338 7.80797C15.6338 7.52047 15.4338 7.32881 15.1338 7.32881H13.1338V5.89131C13.1338 5.60381 12.9338 5.41214 12.6338 5.41214C12.3338 5.41214 12.1338 5.60381 12.1338 5.89131V7.32881H11.3838C10.1338 7.32881 9.13376 8.28714 9.13376 9.48506C9.13376 10.683 10.1338 11.6413 11.3838 11.6413H12.1338V14.0371H9.63376C9.33376 14.0371 9.13376 14.2288 9.13376 14.5163C9.13376 14.8038 9.33376 14.9955 9.63376 14.9955H12.1338V16.433C12.1338 16.7205 12.3338 16.9121 12.6338 16.9121C12.9338 16.9121 13.1338 16.7205 13.1338 16.433V14.9955H13.8838C15.1338 14.9955 16.1338 14.0371 16.1338 12.8392C16.1338 11.6413 15.1338 10.683 13.8838 10.683ZM11.3838 10.683C10.6838 10.683 10.1338 10.1559 10.1338 9.48506C10.1338 8.81422 10.6838 8.28714 11.3838 8.28714H12.1338V10.683H11.3838ZM13.1338 14.0371H13.8838C14.5838 14.0371 15.1338 13.5101 15.1338 12.8392C15.1338 12.1684 14.5838 11.6413 13.8838 11.6413H13.1338V14.0371Z" fill="#28C76F" />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect x="0.986664" width="24" height="23" rx="11.5" fill="white" />
        </clipPath>
      </defs>
    </SvgIcon>
  )
}

export default memo(DollarIcon);
