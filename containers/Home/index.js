
import { memo } from 'react'
import { Grid } from '@material-ui/core'
import { useQuery } from '@apollo/client';

import { GET_PAIRS_INFOS } from 'api/dashboard/queries'
import CompoundAndEarn from './CompoundAndEarn'
import TotalLockedValue from './TotalLockedValue'
import TokenPairs from './TokenPairs'
import LastTransactions from './LastTransactions'

const Home = () => {
  const { data } = useQuery(GET_PAIRS_INFOS, { variables: { order: -1, first: 10 } });

  console.log(data)
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