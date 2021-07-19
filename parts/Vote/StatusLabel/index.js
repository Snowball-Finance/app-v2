import { memo, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import clsx from 'clsx'

import getStatusColor from 'utils/helpers/getStatusColor'

const useStyles = makeStyles((theme) => ({
  status: (props) => ({
    fontSize: props.size,
    fontWeight: 600,
    width: 'fit-content',
    color: props.colors.color,
    padding: theme.spacing(0, 1),
    backgroundColor: props.colors.backgroundColor,
    borderRadius: theme.spacing(0.5)
  }),
}))

const StatusLabel = ({
  status,
  label,
  size = 14,
  className
}) => {
  const colors = useMemo(() => getStatusColor(status), [status]);
  const classes = useStyles({ colors, size })

  return (
    <Typography className={clsx(classes.status, className)}>
      {label}
    </Typography>
  )
}

export default memo(StatusLabel)
