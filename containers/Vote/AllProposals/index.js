
import { memo } from 'react'
import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { useVoteContract } from 'contexts/vote-context'
import VoteHandHeader from 'parts/Vote/VoteHandHeader'
import XSnowballCard from 'parts/Vote/XSnowballCard'
import ProposalItem from 'parts/Vote/ProposalItem'
import { isEmpty } from 'utils/helpers/utility'

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    maxWidth: theme.custom.layout.maxDesktopWidth,
  }
}));

const AllProposals = () => {
  const classes = useStyles();
  const { proposals } = useVoteContract();

  return (
    <Grid container spacing={2} className={classes.container}>
      <Grid item xs={12} md={8}>
        <VoteHandHeader />
      </Grid>
      <Grid item xs={12} md={4}>
        <XSnowballCard />
      </Grid>
      {isEmpty(proposals)
        ? (
          <Grid item xs={12}>
            <Typography variant='h6' align='center'>
              No Proposals
            </Typography>
          </Grid>
        )
        : proposals.map((proposal, index) => (
          <Grid key={index} item xs={12}>
            <ProposalItem proposal={proposal} />
          </Grid>
        ))
      }
    </Grid>
  )
}

export default memo(AllProposals)