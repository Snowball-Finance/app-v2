import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import StateLabel from 'parts/Vote/StateLabel'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%'
  },
}))

const ProposalInfo = ({
  proposal
}) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography variant='caption'>
        Proposal #{proposal.index + proposal.offset - 1}
      </Typography>
      <Typography variant='body1'>
        {proposal.title}
      </Typography>
      <StateLabel
        state={proposal.state}
        label={proposal.state}
      />
    </div>
  )
}

export default memo(ProposalInfo)
