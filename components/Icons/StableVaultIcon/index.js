import { memo } from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
  root: {
    width: 24,
    height: 24
  }
}));

const StableVaultIcon = ({
  className,
  viewBox,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <SvgIcon viewBox={viewBox || '3 0 24 24'} {...rest} className={clsx(classes.root, className)}>
      <path d="M8.7999 7.10006C9.8999 6.50006 10.8999 5.90006 11.8999 5.30006C11.9999 5.20006 12.0999 5.30006 12.0999 5.30006C14.3999 6.60006 16.6999 7.90006 18.9999 9.30006C19.3999 9.50006 19.4999 9.90006 19.4999 10.3001C19.4999 11.2001 19.4999 12.1001 19.4999 13.0001C19.4999 13.5001 19.1999 13.9001 18.6999 14.1001C17.9999 14.6001 16.9999 15.0001 16.2999 15.5001C14.8999 16.3001 13.5999 17.1001 12.1999 17.8001C11.9999 17.9001 11.8999 17.9001 11.6999 17.8001C9.4999 16.6001 7.3999 15.3001 5.1999 14.1001C4.5999 13.8001 4.3999 13.3001 4.3999 12.7001C4.3999 11.8001 4.3999 10.9001 4.3999 10.0001C4.6999 10.1001 4.8999 10.2001 5.0999 10.4001C7.1999 11.6001 9.3999 12.8001 11.4999 14.1001C11.7999 14.3001 12.0999 14.3001 12.3999 14.1001C13.4999 13.4001 14.6999 12.8001 15.7999 12.1001C15.8999 12.0001 15.9999 12.0001 16.0999 11.9001C16.2999 11.8001 16.2999 11.6001 16.0999 11.4001C15.9999 11.3001 15.7999 11.2001 15.5999 11.1001C13.4999 9.90006 11.3999 8.70006 9.2999 7.50006C9.1999 7.40006 8.9999 7.30006 8.7999 7.10006Z" fill="#6E6B7B"/>
      <path d="M19.5 8.8001C19.2 8.7001 18.9 8.5001 18.7 8.4001C16.7 7.2001 14.7 6.1001 12.7 4.9001C12.2 4.6001 11.7 4.6001 11.2 4.9001C10.2 5.4001 9.30005 6.0001 8.30005 6.5001C8.00005 6.7001 7.60005 6.8001 7.60005 7.1001C7.60005 7.4001 8.00005 7.5001 8.30005 7.7001C10.3 8.9001 12.3 10.0001 14.3 11.1001C14.6 11.2001 14.8 11.4001 15.1 11.6001C15.1 11.7001 15 11.7001 15 11.8001C14.1 12.3001 13.1 12.9001 12.2 13.4001C12.1 13.5001 12 13.5001 11.8 13.4001C9.30005 12.0001 6.90005 10.7001 4.50005 9.3001C4.40005 9.2001 4.30005 9.1001 4.30005 9.0001C4.30005 8.0001 4.30005 7.0001 4.30005 6.0001C4.30005 5.4001 4.50005 5.0001 5.10005 4.7001C6.60005 3.9001 8.00005 3.0001 9.50005 2.2001C10.1 1.9001 10.6 1.6001 11.2 1.2001C11.7 0.900098 12.2 0.900098 12.7 1.2001C14.7 2.4001 16.7 3.5001 18.7 4.7001C19.2 5.0001 19.5 5.4001 19.5 6.1001C19.4 6.9001 19.5 7.8001 19.5 8.8001Z" fill="#6E6B7B"/>
      <path d="M19.4999 14.2C19.4999 14.3 19.4999 14.4 19.4999 14.5C19.4999 15.5 19.4999 16.4 19.4999 17.4C19.4999 18 19.2999 18.3 18.7999 18.6C16.7999 19.8 14.7999 20.9 12.7999 22.1C12.2999 22.4 11.7999 22.4 11.1999 22.1C9.1999 20.9 7.1999 19.8 5.1999 18.6C4.6999 18.3 4.3999 17.9 4.3999 17.3C4.3999 16.4 4.3999 15.4 4.3999 14.5C4.6999 14.6 4.8999 14.7 5.0999 14.9C7.1999 16.1 9.2999 17.3 11.3999 18.6C11.6999 18.8 11.9999 18.8 12.3999 18.6C14.4999 17.4 16.5999 16.2 18.6999 15C19.0999 14.8 19.2999 14.5 19.4999 14.2Z" fill="#6E6B7B"/>
      <path d="M8.80005 7.10006C9.90005 6.50006 10.9 5.90006 11.9 5.30006C12 5.20006 12.1 5.30006 12.1 5.30006C14.4 6.60006 16.7 7.90006 19 9.30006C19.4 9.50006 19.5 9.90006 19.5 10.3001C19.5 11.2001 19.5 12.1001 19.5 13.0001C19.5 13.5001 19.2 13.9001 18.7 14.1001C17.9 14.6001 17 15.0001 16.2 15.5001C14.8 16.3001 13.5 17.1001 12.1 17.8001C11.9 17.9001 11.8 17.9001 11.6 17.8001C9.40005 16.6001 7.30005 15.3001 5.10005 14.1001C4.50005 13.8001 4.30005 13.3001 4.30005 12.7001C4.30005 11.8001 4.30005 10.9001 4.30005 10.0001C4.60005 10.1001 4.80005 10.2001 5.00005 10.4001C7.10005 11.6001 9.30005 12.8001 11.4 14.1001C11.7 14.3001 12 14.3001 12.3 14.1001C13.4 13.4001 14.6 12.8001 15.7 12.1001C15.8 12.0001 15.9 12.0001 16 11.9001C16.2 11.8001 16.2 11.6001 16 11.4001C15.9 11.3001 15.7 11.2001 15.5 11.1001C13.4 9.90006 11.3 8.70006 9.20005 7.50006C9.20005 7.40006 9.00005 7.30006 8.80005 7.10006Z" fill="#6E6B7B" stroke="white" strokeWidth="1.5" strokeMiterlimit="10"/>
      <path d="M19.5 8.8001C19.2 8.7001 18.9 8.5001 18.7 8.4001C16.7 7.2001 14.7 6.1001 12.7 4.9001C12.2 4.6001 11.7 4.6001 11.2 4.9001C10.2 5.4001 9.30005 6.0001 8.30005 6.5001C8.00005 6.7001 7.60005 6.8001 7.60005 7.1001C7.60005 7.4001 8.00005 7.5001 8.30005 7.7001C10.3 8.9001 12.3 10.0001 14.3 11.1001C14.6 11.2001 14.8 11.4001 15.1 11.6001C15.1 11.7001 15 11.7001 15 11.8001C14.1 12.3001 13.1 12.9001 12.2 13.4001C12.1 13.5001 12 13.5001 11.8 13.4001C9.30005 12.0001 6.90005 10.7001 4.50005 9.3001C4.40005 9.2001 4.30005 9.1001 4.30005 9.0001C4.30005 8.0001 4.30005 7.0001 4.30005 6.0001C4.30005 5.4001 4.50005 5.0001 5.10005 4.7001C6.60005 3.9001 8.00005 3.0001 9.50005 2.2001C10.1 1.9001 10.6 1.6001 11.2 1.2001C11.7 0.900098 12.2 0.900098 12.7 1.2001C14.7 2.4001 16.7 3.5001 18.7 4.7001C19.2 5.0001 19.5 5.4001 19.5 6.1001C19.4 6.9001 19.5 7.8001 19.5 8.8001Z" fill="#6E6B7B" stroke="white" strokeWidth="1.5" strokeMiterlimit="10"/>
      <path d="M19.4 14.2C19.4 14.3 19.4 14.4 19.4 14.5C19.4 15.5 19.4 16.4 19.4 17.4C19.4 18 19.2 18.3 18.7 18.6C16.7 19.8 14.7 20.9 12.7 22.1C12.2 22.4 11.7 22.4 11.1 22.1C9.10005 20.9 7.10005 19.8 5.10005 18.6C4.60005 18.3 4.30005 17.9 4.30005 17.3C4.30005 16.4 4.30005 15.4 4.30005 14.5C4.60005 14.6 4.80005 14.7 5.00005 14.9C7.10005 16.1 9.20005 17.3 11.3 18.6C11.6 18.8 11.9 18.8 12.3 18.6C14.4 17.4 16.5 16.2 18.6 15C19 14.8 19.2 14.5 19.4 14.2Z" fill="#6E6B7B" stroke="white" strokeWidth="1.5" strokeMiterlimit="10"/>
    </SvgIcon>
  )
}

export default memo(StableVaultIcon);
