import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Card, Typography } from '@material-ui/core'

import { useVoteContract } from 'contexts/vote-context'
import VoteForIcon from 'components/Icons/VoteForIcon'
import VoteAgainstIcon from 'components/Icons/VoteAgainstIcon'
import SnowProgressBar from 'components/SnowProgressBar'
import ContainedButton from 'components/UI/Buttons/ContainedButton'
import getStatusColor from 'utils/helpers/getStatusColor'
import { formatNumber } from 'utils/helpers/format'

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
  voteButton: props => ({
    backgroundColor: props.colors.backgroundColor,
    fontSize: 12,
    fontWeight: 600,
    color: props.colors.color,
    textTransform: 'none',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  })
}))

const ProposalAction = ({
  action,
  proposal,
  setVoted
}) => {
  const isFor = action === "For";
  const colors = isFor ? getStatusColor('Active') : getStatusColor('Defeated');
  const classes = useStyles({colors});
  const { voteProposal } = useVoteContract();
  const votes = isFor ? proposal.forVotes : proposal.againstVotes;
  const votePercent = votes / (proposal.forVotes + proposal.againstVotes) * 100;

  return (
    <Card className={classes.root}>
      <div className={classes.headerContainer}>
        <Typography variant='body1' className={classes.header}>
          {action}
        </Typography>
        <Typography variant='body1' className={classes.header}>
          {formatNumber(votes, 2)}
        </Typography>
      </div>
      <SnowProgressBar
        state={isFor ? 'Active' : 'Failed'}
        value={votePercent}
      />
      {proposal.state === 'Active' &&
        <div className={classes.buttonContainer}>
          <ContainedButton
            className={classes.voteButton}
            size='small'
            disableElevation
            disabled={proposal.state !== 'Active'}
            endIcon={isFor ? <VoteForIcon /> : <VoteAgainstIcon />}
            onClick={() => voteProposal(proposal, isFor, setVoted)}
          >
            Vote {action}
          </ContainedButton>
        </div>
      }
    </Card>
  )
}

export default memo(ProposalAction)
