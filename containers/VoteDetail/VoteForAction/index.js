import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Card, Typography } from '@material-ui/core'

import { useVoteContract } from 'contexts/vote-context'
import VoteForIcon from 'components/Icons/VoteForIcon'
import SnowProgressBar from 'components/SnowProgressBar'
import ContainedButton from 'components/UI/Buttons/ContainedButton'
import getStatusColor from 'utils/helpers/getStatusColor'

const colors = getStatusColor('Active')

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    padding: theme.spacing(1.5, 2.5),
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  header: {
    fontWeight: 600,
    marginBottom: theme.spacing(1)
  },
  buttonContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end'
  },
  voteButton: {
    backgroundColor: colors.backgroundColor,
    fontSize: 12,
    fontWeight: 600,
    color: colors.color,
    textTransform: 'none',
  }
}))

const VoteForAction = ({
  proposal
}) => {
  const classes = useStyles()
  const { voteProposal } = useVoteContract();
  const forValue = proposal.forVotes / (proposal.forVotes + proposal.againstVotes) * 100;

  return (
    <Card className={classes.root}>
      <div className={classes.headerContainer}>
        <Typography variant='body1' className={classes.header}>
          For
        </Typography>
        <Typography variant='body1' className={classes.header}>
          {proposal.forVotes.toLocaleString()}
        </Typography>
      </div>
      <SnowProgressBar
        state='Active'
        value={forValue}
      />
      <Typography variant='caption'>
        Addresses votes for
      </Typography>
      <div className={classes.buttonContainer}>
        <ContainedButton
          className={classes.voteButton}
          size='small'
          disableElevation
          endIcon={<VoteForIcon />}
          onClick={() => voteProposal(proposal, true)}
        >
          Vote for
        </ContainedButton>
      </div>
    </Card>
  )
}

export default memo(VoteForAction)
