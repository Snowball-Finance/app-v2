import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Card, Grid } from '@material-ui/core'

import ProposalInfo from '../ProposalInfo'
import ProposalTime from '../ProposalTime'
import ProposalStatus from '../ProposalStatus'
import ProposalDetail from '../ProposalDetail'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))

const ProposalItem = () => {
  const classes = useStyles()

  return (
    <Card className={classes.root}>
      <Grid container spacing={4} className={classes.container}>
        <Grid item xs={12} sm={8} md={4}>
          <ProposalInfo />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <ProposalTime />
        </Grid>
        <Grid item xs={12} sm={8} md={4}>
          <ProposalStatus />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <ProposalDetail />
        </Grid>
      </Grid>
    </Card>
  )
}

export default memo(ProposalItem)
