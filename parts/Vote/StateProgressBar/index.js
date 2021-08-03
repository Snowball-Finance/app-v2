import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import SnowProgressBar from 'components/SnowProgressBar'

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1)
  },
}))

const StateProgressBar = ({
  header,
  state,
  value
}) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography variant='caption'>
        {header}
      </Typography>
      <SnowProgressBar
        value={value}
        state={state}
      />
    </div>
  )
}

export default memo(StateProgressBar)
