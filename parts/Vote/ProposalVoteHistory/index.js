import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Card, Typography } from '@material-ui/core'

import { useVoteContract } from 'contexts/vote-context'
import ContainedButton from 'components/UI/Buttons/ContainedButton'
import VoteForIcon from 'components/Icons/VoteForIcon'
import VoteAgainstIcon from 'components/Icons/VoteAgainstIcon'
import { formatNumber } from 'utils/helpers/format'

const useStyles = makeStyles((theme) => ({
  root: props => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: theme.spacing(1, 2.5),
    backgroundColor:  props.hasVoted ? props.isFor ? theme.custom.palette.transparent.green : theme.custom.palette.transparent.joe_red : theme.palette.background.primary,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  }),
  label: props => ({
    color: props.hasVoted ? props.isFor ? theme.custom.palette.green : theme.custom.palette.red_warning : theme.custom.palette.darkGrey,
    fontWeight: 600
  }),
  subHeaderButton: {
    backgroundColor: theme.custom.palette.transparent.snob_blue,
    fontSize: 16,
    fontWeight: 400,
    color: theme.custom.palette.blue,
    textTransform: 'none',
  }
}))

const VoteHistory = ({
  proposal,
  proposalReceipt
}) => {
  const isFor = proposalReceipt?.support || false
  const hasVoted = proposalReceipt?.hasVoted || false
  const classes = useStyles({ isFor, hasVoted })
  const { voteProposal } = useVoteContract();

  return (
    <Card className={classes.root}>
      <Typography variant='body1' className={classes.label}>
        {hasVoted ? 
        `You voted ${isFor ? 'For' : 'Against'} with ${formatNumber(proposalReceipt?.votes || 0, 4)} xSNOB`
        : proposal.state === 'Active' ? 
        "You haven't voted on this proposal yet" 
        : "You didn't vote on this proposal"
        }
        {hasVoted ? isFor ? <VoteForIcon /> : <VoteAgainstIcon /> : null}
      </Typography>
      {(proposal.state === 'Active' && hasVoted) && 
        <ContainedButton
          className={classes.subHeaderButton}
          size='small'
          disableElevation
          onClick={() => voteProposal(proposal, !isFor)}
        >
          Switch Vote
        </ContainedButton>
      }
    </Card>
  )
}

export default memo(VoteHistory)
