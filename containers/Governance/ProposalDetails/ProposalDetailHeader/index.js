import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Card, Typography } from '@material-ui/core'

import StateLabel from 'parts/Vote/StateLabel'
import ProposalTime from 'parts/Vote/ProposalTime'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: theme.spacing(4, 2.5),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  container: {
    margin: theme.spacing(1, 0)
  },
  title: {
    fontWeight: 600,
    marginBottom: theme.spacing(0.5)
  },
  subtitle: {
    fontWeight: 500
  }
}))

const ProposalDetailHeader = ({
  proposal
}) => {
  const classes = useStyles()

  return (
    <Card className={classes.root}>
      <div className={classes.container}>
        <Typography variant='body1' className={classes.subtitle}>
          Proposal #{proposal.index} details
        </Typography>
        <Typography variant='body1' className={classes.title}>
          {proposal.title}
        </Typography>
        <StateLabel
          state={proposal.state}
          label={proposal.state}
        />
      </div>
      <ProposalTime proposal={proposal} />
    </Card>
  )
}

export default memo(ProposalDetailHeader)
