
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'

import PageHeader from 'parts/PageHeader'
import XSnowballCard from 'parts/Vote/XSnowballCard'
import VoteDetailHeader from './VoteDetailHeader'
import VoteForAction from './VoteForAction'
import VoteAgainstAction from './VoteAgainstAction'
import VoteDetailInfo from './VoteDetailInfo'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  container: {
    width: '100%',
    maxWidth: theme.custom.layout.maxDesktopWidth,
    marginTop: theme.spacing(2)
  }
}));

const VoteDetail = () => {
  const classes = useStyles();

  return (
    <main className={classes.root}>
      <PageHeader
        title='Governance'
        subHeader='To vote you must stake your SNOB for xSNOB.'
      />
      <Grid container spacing={2} className={classes.container}>
        <Grid item xs={12}>
          <Typography variant='body1'>
            Proposal #4 details
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <VoteDetailHeader />
        </Grid>
        <Grid item xs={12} md={4}>
          <XSnowballCard />
        </Grid>
        <Grid item xs={12} md={6}>
          <VoteForAction />
        </Grid>
        <Grid item xs={12} md={6}>
          <VoteAgainstAction />
        </Grid>
        <Grid item xs={12} md={8}>
          <VoteDetailInfo />
        </Grid>
      </Grid>
    </main>
  )
}

export default memo(VoteDetail)