import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import StateProgressBar from 'parts/Vote/StateProgressBar'
import { formatNumber } from 'utils/helpers/format'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%'
  },
}))

const ProposalStatus = ({
  proposal
}) => {
  const classes = useStyles()

  const forValue = proposal.forVotes / (proposal.forVotes + proposal.againstVotes) * 100;
  const againstValue = proposal.againstVotes / (proposal.forVotes + proposal.againstVotes) * 100;

  return (
    <div className={classes.root}>
      <StateProgressBar
        state='Active'
        header={`For: ${formatNumber(proposal.forVotes, 2)}`}
        value={forValue}
      />
      <StateProgressBar
        state='Defeated'
        header={`Against: ${formatNumber(proposal.againstVotes, 2)}`}
        value={againstValue}
      />
    </div>
  )
}

export default memo(ProposalStatus)
