import { memo, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import clsx from 'clsx'

import getStatusColor from 'utils/helpers/getStatusColor'

const useStyles = makeStyles((theme) => ({
  state: (props) => ({
    fontSize: props.size,
    fontWeight: 600,
    width: 'fit-content',
    color: props.colors.color,
    padding: theme.spacing(0, 1),
    backgroundColor: props.colors.backgroundColor,
    borderRadius: theme.spacing(0.5)
  }),
}))

const StateLabel = ({
  state,
  label,
  size = 14,
  className
}) => {
  const colors = useMemo(() => getStatusColor(state), [state]);
  const classes = useStyles({ colors, size })

  return (
    <Typography className={clsx(classes.state, className)}>
      {label}
    </Typography>
  )
}

export default memo(StateLabel)
