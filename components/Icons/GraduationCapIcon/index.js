
import { memo } from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
  root: {
    width: 22,
    height: 19
  }
}));

const GraduationCapIcon = ({
  className,
  viewBox,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <SvgIcon viewBox={viewBox || '1 0 24 19'} {...rest} fill="none" className={clsx(classes.root, className)}>
      <path d="M5.81641 10.0629V14.0908M17.8565 10.0629V14.0908" stroke="#5E5873" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17.8565 14.0909C17.8565 17.1119 5.81641 16.6084 5.81641 14.0909" stroke="#5E5873" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M11.7604 10.0629L1 5.88004L11.7604 1L23.1538 5.88004L11.7604 10.0629Z" stroke="#5E5873" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M21 9.05597L21 10.556" stroke="#5E5873" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 15.2L21 17.1021" stroke="#5E5873" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21.8213 12.9C21.8213 13.3971 21.4359 13.8 20.9605 13.8C20.485 13.8 20.0996 13.3971 20.0996 12.9C20.0996 12.4029 20.485 12 20.9605 12C21.4359 12 21.8213 12.4029 21.8213 12.9Z" fill="#5E5873"/>
    </SvgIcon>
  )
}

export default memo(GraduationCapIcon);
