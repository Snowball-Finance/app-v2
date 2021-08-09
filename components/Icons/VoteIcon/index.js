
import { memo } from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
  root: {
    width: 20,
    height: 20
  }
}));

const VoteIcon = ({
  className,
  viewBox,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <SvgIcon viewBox={viewBox || '0 0 22 24'} {...rest} className={clsx(classes.root, className)}>
      <path d="M19.25 13V22.4H2.75V13" stroke="#5E5873" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21.0827 8.5H0.916016V12.7H21.0827V8.5Z" stroke="#5E5873" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.16602 16H12.8327" stroke="#5E5873" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.825 1H6.78333C6.05 1 5.5 1.6 5.5 2.4C5.5 2.4 5.5 7.9 5.5 8.3C5.5 8.9 15.5833 8.5 15.5833 8.5V5.1L11.825 1Z" stroke="#5E5873" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.8242 1V5.1H15.5826" stroke="#5E5873" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.0163 8.5H7.97461" stroke="#5E5873" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.25794 5.80008H8.61628H7.97461" stroke="#5E5873" strokeLinecap="round" strokeLinejoin="round" />
    </SvgIcon>
  )
}

export default memo(VoteIcon);
