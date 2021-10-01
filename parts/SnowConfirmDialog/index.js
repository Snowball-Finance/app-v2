
import { memo } from 'react'
import { Typography } from '@material-ui/core'

import SnowDialog from 'components/SnowDialog'
import SnowDynamicLottie from 'components/SnowDynamicLottie'

const SnowConfirmDialog = ({
  text = 'Are you sure to proceed this operation?',
  icon = '',
  ...rest
}) => {
  return (
    <SnowDialog {...rest}>
      <SnowDynamicLottie
        show={true}
        size={150}
        icon={icon} />
      <Typography color='textPrimary' style={{ wordWrap: 'break-word' }} variant='h6' align='center'>
        {text}
      </Typography>
    </SnowDialog>
  );
}

export default memo(SnowConfirmDialog)