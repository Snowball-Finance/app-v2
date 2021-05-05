
import { memo } from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
  root: {
    width: 18,
    height: 18
  }
}));

const BubbleIcon = ({
  className,
  viewBox,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <SvgIcon viewBox={viewBox || '0 0 14 17'} {...rest} className={clsx(classes.root, className)}>
      <path fillRule="evenodd" clipRule="evenodd" d="M7.525 0.975L11.8 5.175C14.425 7.875 14.425 12.15 11.8 14.775C10.525 16.05 8.8 16.725 7 16.725C5.2 16.725 3.475 16.05 2.2 14.775C0.925 13.5 0.25 11.775 0.25 9.975C0.25 8.175 0.925 6.45 2.275 5.175L6.475 0.975C6.625 0.825 6.775 0.75 7 0.75C7.225 0.75 7.375 0.825 7.525 0.975ZM7 15.225C8.425 15.225 9.7 14.7 10.75 13.725C12.775 11.625 12.775 8.325 10.675 6.3L6.925 2.55L3.25 6.3C2.275 7.275 1.75 8.55 1.75 9.975C1.75 11.4 2.275 12.675 3.325 13.725C4.3 14.7 5.575 15.225 7 15.225Z" fill="#6E6B7B" />
    </SvgIcon>
  )
}

export default memo(BubbleIcon);
