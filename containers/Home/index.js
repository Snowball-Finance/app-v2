
import { memo } from 'react'
import { Grid } from '@material-ui/core'

import CompoundAndEarn from './CompoundAndEarn'
import TotalLockedValue from './TotalLockedValue'
import TokenPairs from './TokenPairs'
import LastTransactions from './LastTransactions'

const Home = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={6}>
        <CompoundAndEarn />
      </Grid>
      <Grid item xs={12} lg={6}>
        <TotalLockedValue />
      </Grid>
      <Grid item xs={12} md={8}>
        <TokenPairs />
      </Grid>
      <Grid item xs={12} md={4}>
        <LastTransactions />
      </Grid>
    </Grid>
  )
}

export default memo(Home)