import { memo, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { LinearProgress } from '@material-ui/core'

import getStatusColor from 'utils/helpers/getStatusColor'

const useStyles = makeStyles(() => ({
  progress: {
    height: 6,
    borderRadius: 6,
  },
  colorPrimary: (props) => ({
    backgroundColor: props.colors.backgroundColor
  }),
  bar: (props) => ({
    borderRadius: 6,
    backgroundColor: props.colors.color
  })
}))

const SnowProgressBar = ({
  status,
  value
}) => {
  const colors = useMemo(() => getStatusColor(status), [status]);
  const classes = useStyles({ colors })

  return (
    <LinearProgress
      variant="determinate"
      value={value}
      classes={{
        root: classes.progress,
        colorPrimary: classes.colorPrimary,
        bar: classes.bar
      }}
    />
  )
}

export default memo(SnowProgressBar)
