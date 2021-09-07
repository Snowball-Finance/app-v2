
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import DynamicIcon from './DynamicLottie'


const useStyles = makeStyles(() => ({
  root: {
    display: 'grid',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  }
}))

const SnowDynamicIcon = ({
  show,
  icon,
  height,
  size = 150
}) => {
  const classes = useStyles({ height });

  return (
    <div className={classes.root}>
      <DynamicIcon
        show={show}
        size={size}
        icon={icon} />
    </div>
  );
};

export default memo(SnowDynamicIcon);