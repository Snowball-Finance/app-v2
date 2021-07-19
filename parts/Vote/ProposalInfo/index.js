import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import StatusLabel from 'parts/Vote/StatusLabel'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%'
  },
}))

const ProposalInfo = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography variant='caption'>
        Proposal  #4
      </Typography>
      <Typography variant='body1'>
        Pursue Liquid Staking Joint Venture under Snowball brand
      </Typography>
      <StatusLabel status='active' label='Active' />
    </div>
  )
}

export default memo(ProposalInfo)
