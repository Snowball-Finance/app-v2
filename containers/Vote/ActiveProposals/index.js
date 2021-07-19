
import { memo } from 'react'
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import VoteHandHeader from 'parts/Vote/VoteHandHeader'
import XSnowballCard from 'parts/Vote/XSnowballCard'
import ProposalItem from 'parts/Vote/ProposalItem'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  tabs: {
    marginTop: theme.spacing(2)
  },
  container: {
    width: '100%',
    maxWidth: theme.custom.layout.maxDesktopWidth,
  }
}));

const ActiveProposals = () => {
  const classes = useStyles();

  return (
    <Grid container spacing={3} className={classes.container}>
      <Grid item xs={12} md={8}>
        <VoteHandHeader />
      </Grid>
      <Grid item xs={12} md={4}>
        <XSnowballCard />
      </Grid>
      <Grid item xs={12}>
        <ProposalItem />
      </Grid>
      <Grid item xs={12}>
        <ProposalItem />
      </Grid>
      <Grid item xs={12}>
        <ProposalItem />
      </Grid>
      <Grid item xs={12}>
        <ProposalItem />
      </Grid>
    </Grid>
  )
}

export default memo(ActiveProposals)