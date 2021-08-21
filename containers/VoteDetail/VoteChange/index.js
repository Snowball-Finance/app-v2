import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Card, Typography } from '@material-ui/core'

import { useVoteContract } from 'contexts/vote-context'
import ContainedButton from 'components/UI/Buttons/ContainedButton'

const useStyles = makeStyles((theme) => ({
  root: props => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: theme.spacing(1, 2.5),
    backgroundColor: props.isFor ? theme.custom.palette.transparent.green : theme.custom.palette.transparent.joe_red,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  }),
  label: props => ({
    color: props.isFor ? theme.custom.palette.green : theme.custom.palette.joe_red
  }),
  subHeaderButton: {
    backgroundColor: theme.custom.palette.transparent.snob_blue,
    fontSize: 16,
    fontWeight: 400,
    color: theme.custom.palette.blue,
    textTransform: 'none',
  }
}))

const VoteChange = ({
  proposal,
  proposalReceipt
}) => {
  const isFor = proposalReceipt?.support || false
  const classes = useStyles({ isFor })
  const { voteProposal } = useVoteContract();

  return (
    <Card className={classes.root}>
      <Typography variant='body1' className={classes.label}>
        {`Your vote history: ${(proposalReceipt?.votes || 0).toFixed(3)} votes "${isFor ? 'For' : 'Against'}"`}
      </Typography>
      <ContainedButton
        className={classes.subHeaderButton}
        size='small'
        disableElevation
        onClick={() => voteProposal(proposal, !isFor)}
      >
        Change Vote
      </ContainedButton>
    </Card>
  )
}

export default memo(VoteChange)
