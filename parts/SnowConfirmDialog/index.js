
import { memo } from 'react'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

import SnowDialog from 'components/SnowDialog'
import SnowDynamicLottie from 'components/SnowDynamicLottie'

const useStyles = makeStyles((theme) => ({
  root: {
    overflowWrap: 'break-word'
  },
}));

const SnowConfirmDialog = ({
  text = 'Are you sure to proceed this operation?',
  icon = '',
  ...rest
}) => {
  const classes = useStyles();
  return (
    <SnowDialog {...rest}>
      <SnowDynamicLottie
        show={true}
        size={150}
        icon={icon} />
      <Typography color='textPrimary' variant='h6' align='center' className={classes.root}>
        {text}
      </Typography>
    </SnowDialog>
  );
}

export default memo(SnowConfirmDialog)