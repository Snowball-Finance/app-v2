import { memo, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, LinearProgress } from '@material-ui/core'

import getStatusColor from 'utils/helpers/getStatusColor'

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1)
  },
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

const StatusProgressBar = ({
  header,
  status,
  value
}) => {
  const colors = useMemo(() => getStatusColor(status), [status]);
  const classes = useStyles({ colors })

  return (
    <div className={classes.root}>
      <Typography variant='caption'>
        {header}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={value}
        classes={{
          root: classes.progress,
          colorPrimary: classes.colorPrimary,
          bar: classes.bar
        }}
      />
    </div>
  )
}

export default memo(StatusProgressBar)
