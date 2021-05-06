
import { memo } from 'react'
import { Grid } from '@material-ui/core'

const Home = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={6}>
        Compound & Earn
      </Grid>
      <Grid item xs={12} lg={6}>
        Total Value Locked
      </Grid>
      <Grid item xs={12} lg={8}>
        PAIRS
      </Grid>
      <Grid item xs={12} lg={4}>
        Last transactions
      </Grid>
    </Grid>
  )
}

export default memo(Home)