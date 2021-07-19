import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import StatusProgressBar from 'parts/Vote/StatusProgressBar'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%'
  },
}))

const ProposalStatus = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <StatusProgressBar
        status='active'
        header='For: 124,161.2561'
        value={60}
      />
      <StatusProgressBar
        status='failed'
        header='Against: 124,161.2561'
        value={40}
      />
    </div>
  )
}

export default memo(ProposalStatus)
