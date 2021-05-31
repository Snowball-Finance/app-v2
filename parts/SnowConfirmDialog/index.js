
import { memo } from 'react'
import { Typography } from '@material-ui/core'

import SnowDialog from 'components/SnowDialog'

const SnowConfirmDialog = ({
  text = 'Are you sure to proceed this operation?',
  ...rest
}) => {
  return (
    <SnowDialog {...rest}>
      <Typography color='textPrimary' variant='h5' align='center'>
        {text}
      </Typography>
    </SnowDialog>
  );
}

export default memo(SnowConfirmDialog)